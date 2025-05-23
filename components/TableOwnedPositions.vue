<template>
  <table class="table-positions">
    <thead class="table-positions__head">
      <tr>
        <th
          v-for="column in COLUMNS_DEFINITION"
          :key="column.id"
          class="table-positions__th"
          scope="col"
          :style="{ width: column.width }"
        >
          {{ column.text }}
          <SortingIcon
            v-if="column.id !== 'actions'"
            :direction="sortingProp === column.id ? sortingDirection : 'none'"
            @click="(event) => handleSortingIconClick(column.id)"
          />
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="stake in sortedTableRowsData"
        :key="stake.idText"
        class="table-positions__tr"
      >
        <td class="table-positions__td">
          {{ stake.idText }}
        </td>
        <td class="table-positions__td">
          {{ formatDecimalPoint(stake.amount) }}
        </td>
        <td class="table-positions__td">
          <div
            v-if="stake.votePowerStartsInNextEpoch"
            class="table-positions__not-yet-voting-power-wrapper"
          >
            <span class="table-positions__td-text--greyed">
              {{ formatDecimalPoint(stake.votingPower) }}
            </span>
            <BaseTooltip
              :tooltip-text="`You will gain your voting power in next epoch, which will be in ${timeTillNextEpoch}.`"
              :border-color="TooltipBorderColor.White"
            >
              <template #trigger>
                <img
                  src="/icons/alert-icon-red.svg"
                  alt="alert"
                  class="table-positions__alert-icon"
                />
              </template>
            </BaseTooltip>
          </div>
          <div v-else>
            <span
              :class="{ 'table-positions__td-text--greyed': stake.isVesting }"
            >
              {{ formatDecimalPoint(stake.votingPower) }}
            </span>
          </div>
        </td>
        <td class="table-positions__td">
          <template v-if="stake.votePowerStartsInNextEpoch">
            <span class="table-positions__td-text--greyed">
              {{ stake.multiplier }}
            </span>
          </template>
          <span
            v-else
            :class="{ 'table-positions__td-text--greyed': stake.isVesting }"
          >
            {{ stake.multiplier }}
          </span>
        </td>
        <td class="table-positions__td">
          <BaseTooltip
            v-if="stake.votingDelegate"
            is-interactive
            :tooltip-text="stake.votingDelegate"
          >
            <template #trigger>
              <span>
                {{ shortenAddress(stake.votingDelegate) }}
              </span>
            </template>
          </BaseTooltip>
          <span v-else> --- </span>
        </td>
        <td class="table-positions__td">
          <div
            v-if="stake.unlocksIn === 0"
            class="table-positions__unlocked-text"
          >
            Unlocked!
          </div>
          <template v-else>
            <span>
              {{ formatSeconds(stake.unlocksIn) }}
            </span>
            <span class="table-positions__greyed">
              ({{ stake.epochsRemaining }} epochs)
            </span>
          </template>
        </td>
        <td class="table-positions__td">
          <div class="table-positions__actions-wrapper">
            <BaseTooltip
              v-if="stake.isVesting && stake.unlocksIn > 0"
              :tooltip-text="upgradeToStakeTooltipText"
            >
              <template #trigger>
                <button
                  :disabled="isUpgradingToStake"
                  class="table-positions__upgrade-btn"
                  @click="
                    upgradeToStake(
                      stake.unlockEpoch,
                      DEFAULT_VESTING_UPGRADE_EPOCH_LOCKUP,
                    )
                  "
                >
                  {{ isUpgradingToStake ? "Upgrading..." : "Upgrade to stake" }}
                </button>
              </template>
            </BaseTooltip>
            <span
              v-if="!stake.isVesting"
              class="link link--no-underline link--primary"
              @click="openModal(stake.id, stake.epochsRemaining, stake.amount)"
            >
              Increase Duration
            </span>
            <button
              v-if="stake.unlocksIn === 0"
              class="table-positions__upgrade-btn"
              :disabled="isClaiming"
              @click="claim(stake)"
            >
              Claim
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core";
import { useAccount } from "@wagmi/vue";
import { formatUnits, parseUnits } from "viem";
import type { Address } from "abitype";
import { shortenAddress } from "../utils/web3";
import { TooltipBorderColor } from "./BaseTooltip.vue";
import {
  SECONDS_IN_EPOCH,
  MIN_STAKE_DURATION_IN_EPOCH,
  PWN_TOKEN_DECIMALS,
} from "~/constants/contracts";
import { formatSeconds } from "@/utils/date";
import { useChainIdTypesafe } from "~/constants/chain";
import { useUserVestedTokens, useAllBeneficiaries } from "~/utils/hooks";
import { PWN_VESTING_MANAGER, VE_PWN_TOKEN } from "~/constants/addresses";
import { PWN_VESTING_MANAGER_ABI, VE_PWN_TOKEN_ABI } from "~/constants/abis";
import { getFormattedVotingPower } from "~/utils/parsing";
import { formatDecimalPoint } from "~/utils/utils";

const { address } = useAccount();
const chainId = useChainIdTypesafe();

const stakes = useUserStakes(address, chainId);

const vestedTokensQuery = useUserVestedTokens(address, chainId);
const vestedTokens = computed(() => vestedTokensQuery.data?.value);

const { epoch: currentEpoch } = useManuallySetEpoch(chainId);

const initialEpochTimestampQuery = useInitialEpochTimestamp(chainId);
const initialEpochTimestamp = computed(
  () => initialEpochTimestampQuery.data.value,
);

const timeTillNextEpoch = computed(() => {
  if (initialEpochTimestamp.value === undefined) {
    return undefined;
  }

  return getTimeTillNextEpochStringified(Number(initialEpochTimestamp.value));
});

const secondsTillNextEpoch = computed(() => {
  if (initialEpochTimestamp.value === undefined) {
    return undefined;
  }

  return getSecondsTillNextEpoch(Number(initialEpochTimestamp.value));
});

interface TableRowData {
  id: bigint;
  idText: string;
  amount: string; // formatted by decimals already
  votingPower: string; // formatted by decimals already
  multiplier: number; // e.g. x1.3
  lockUpEpochs: number; // e.g. 39
  duration: number; // e.g. 3y
  epochsRemaining: number; // e.g. 15.4
  unlocksIn: number; // e.g. 1y 79d 12h
  votePowerStartsInNextEpoch: boolean;
  isVesting: boolean;
  unlockEpoch: number;
  votingDelegate?: Address;
}

const stakeIds = computed(
  () => stakes.data.value?.map((stake) => stake.stakeId) ?? [],
);
const { openModal } = useIncreaseStakeModal();
const logs = useAllBeneficiaries(address, stakeIds.value, chainId);

const tableRowsData = computed<TableRowData[]>(() => {
  if (
    stakes.data.value === undefined ||
    secondsTillNextEpoch.value === undefined
  ) {
    return [];
  }
  const userStakes: TableRowData[] = stakes.data.value.map((stake) => {
    const formattedStakedAmount = formatUnits(stake.amount, PWN_TOKEN_DECIMALS);

    const multiplier = getMultiplierForLockUpEpochs(
      Math.min(stake.remainingEpochs, stake.lockUpEpochs),
    );

    let unlocksIn: number;
    let epochsRemaining: number;
    if (stake.remainingEpochs === 0) {
      unlocksIn = 0;
      epochsRemaining = 0;
    } else if (stake.remainingEpochs > stake.lockUpEpochs) {
      // happens in the epoch when user staked (voting power is granted only in the next epoch)
      epochsRemaining = stake.lockUpEpochs;
      unlocksIn =
        secondsTillNextEpoch.value! + epochsRemaining * SECONDS_IN_EPOCH;
      // add fractional part to the epochsRemaining
      epochsRemaining += secondsTillNextEpoch.value! / SECONDS_IN_EPOCH;
      epochsRemaining = Number(epochsRemaining.toFixed(1));
    } else {
      epochsRemaining = stake.remainingEpochs - 1;
      unlocksIn =
        secondsTillNextEpoch.value! + epochsRemaining * SECONDS_IN_EPOCH;
      // add fractional part to the epochsRemaining
      epochsRemaining += secondsTillNextEpoch.value! / SECONDS_IN_EPOCH;
      epochsRemaining = Number(epochsRemaining.toFixed(1));
    }

    return {
      id: stake.stakeId,
      idText: String(stake.stakeId),
      amount: formattedStakedAmount,
      votingPower: getFormattedVotingPower(formattedStakedAmount, multiplier),
      multiplier,
      lockUpEpochs: stake.lockUpEpochs,
      duration: stake.lockUpEpochs * SECONDS_IN_EPOCH,
      unlocksIn,
      epochsRemaining,
      votePowerStartsInNextEpoch: stake.remainingEpochs > stake.lockUpEpochs,
      isVesting: false,
      unlockEpoch: stake.initialEpoch + stake.lockUpEpochs,
      votingDelegate:
        (logs?.data?.value?.get(stake.stakeId) as Address) ?? address.value!,
    };
  });

  if (vestedTokens.value?.length) {
    for (const [index, vestedToken] of vestedTokens.value.entries()) {
      const lockUpEpochs =
        vestedToken.unlockEpoch - vestedToken.initialEpoch - 1; // starting epoch is initialEpoch + 1
      const _currentEpoch = currentEpoch.value ?? 0;
      const epochsDelta =
        _currentEpoch > vestedToken.unlockEpoch
          ? 0
          : vestedToken.unlockEpoch - _currentEpoch;
      let epochsRemaining: number;
      let unlocksIn: number;
      if (epochsDelta === 1) {
        // add fractional part to the epochsRemaining
        epochsRemaining = Number(
          (secondsTillNextEpoch.value! / SECONDS_IN_EPOCH).toFixed(1),
        );
        unlocksIn = secondsTillNextEpoch.value!;
      } else if (epochsDelta <= 0) {
        epochsRemaining = 0;
        unlocksIn = 0;
      } else {
        // add fractional part to the epochsRemaining
        epochsRemaining =
          epochsDelta -
          1 +
          Number((secondsTillNextEpoch.value! / SECONDS_IN_EPOCH).toFixed(1));
        unlocksIn =
          secondsTillNextEpoch.value! + (epochsDelta - 1) * SECONDS_IN_EPOCH;
      }
      userStakes.push({
        id: BigInt(index + 1), // arbitrary number as vestings does not have stake id
        idText: `Vesting ${index + 1}`,
        amount: formatUnits(vestedToken.amount, PWN_TOKEN_DECIMALS),
        votingPower: "0",
        multiplier: 0,
        lockUpEpochs,
        duration: lockUpEpochs * SECONDS_IN_EPOCH,
        unlocksIn,
        epochsRemaining,
        votePowerStartsInNextEpoch: false,
        isVesting: true,
        unlockEpoch: vestedToken.unlockEpoch,
        votingDelegate: undefined,
      });
    }
  }

  return userStakes;
});

const COLUMNS_DEFINITION = [
  {
    id: "id",
    text: "ID#",
    width: "9%",
  },
  {
    id: "amount",
    text: "Amount",
    width: "15%",
  },
  {
    id: "votingPower",
    text: "Voting Power",
    width: "15%",
  },
  {
    id: "multiplier",
    text: "Multiplier",
    width: "11%",
  },
  {
    id: "delegate",
    text: "Voting Power Delegate",
    width: "20%",
  },
  {
    id: "unlocksIn",
    text: "Unlocks in",
    width: "20%",
  },
  {
    id: "actions",
    text: "Actions",
    width: "10%",
  },
] as const;

type SortingProp = (typeof COLUMNS_DEFINITION)[number]["id"];

const sortingProp = useLocalStorage<SortingProp>(
  "tablePositionsSortingProp",
  "unlocksIn",
);
const sortingDirection = useLocalStorage<"asc" | "desc">(
  "tablePositionsSortingDirection",
  "asc",
);

const sortedTableRowsData = computed(() => {
  return tableRowsData.value.toSorted((a, b) => {
    switch (sortingProp.value) {
      case "id": {
        if (sortingDirection.value === "desc") {
          return a.id > b.id ? -1 : 1;
        } else {
          return a.id > b.id ? 1 : -1;
        }
      }
      case "amount": {
        const aAmount = parseUnits(a.amount, PWN_TOKEN_DECIMALS);
        const bAmount = parseUnits(b.amount, PWN_TOKEN_DECIMALS);

        if (sortingDirection.value === "desc") {
          return aAmount > bAmount ? -1 : 1;
        } else {
          return aAmount > bAmount ? 1 : -1;
        }
      }
      case "votingPower": {
        const aVotingPower = parseUnits(a.votingPower, PWN_TOKEN_DECIMALS);
        const bVotingPower = parseUnits(b.votingPower, PWN_TOKEN_DECIMALS);

        if (sortingDirection.value === "desc") {
          return aVotingPower > bVotingPower ? -1 : 1;
        } else {
          return aVotingPower > bVotingPower ? 1 : -1;
        }
      }
      case "multiplier": {
        if (sortingDirection.value === "desc") {
          return a.multiplier > b.multiplier ? -1 : 1;
        } else {
          return a.multiplier > b.multiplier ? 1 : -1;
        }
      }
      case "delegate": {
        if (!a.votingDelegate || !b.votingDelegate) {
          return a.votingDelegate ? -1 : 1;
        }
        if (sortingDirection.value === "desc") {
          return a.votingDelegate > b.votingDelegate ? -1 : 1;
        } else {
          return a.votingDelegate > b.votingDelegate ? 1 : -1;
        }
      }
      case "unlocksIn": {
        if (sortingDirection.value === "desc") {
          return a.unlocksIn > b.unlocksIn ? -1 : 1;
        } else {
          return a.unlocksIn > b.unlocksIn ? 1 : -1;
        }
      }
      default: {
        return 0;
      }
    }
  });
});

const handleSortingIconClick = (newSortingProp: SortingProp) => {
  if (newSortingProp === sortingProp.value) {
    sortingDirection.value = sortingDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortingProp.value = newSortingProp;
  }
};

const DEFAULT_VESTING_UPGRADE_EPOCH_LOCKUP = MIN_STAKE_DURATION_IN_EPOCH;

const isUpgradingToStake = ref(false);
const upgradeToStake = async (
  unlockEpoch: number | bigint,
  stakeLockUpEpochs: number | bigint,
) => {
  isUpgradingToStake.value = true;
  try {
    return await sendTransaction({
      abi: PWN_VESTING_MANAGER_ABI,
      address: PWN_VESTING_MANAGER[1],
      functionName: "upgradeToStake",
      chainId: 1,
      args: [BigInt(unlockEpoch), BigInt(stakeLockUpEpochs)],
    });
  } finally {
    isUpgradingToStake.value = false;
  }
};

const upgradeToStakeTooltipText = computed(() => {
  if (!currentEpoch.value || !initialEpochTimestamp.value) {
    return "";
  }

  const epochWhereStakeWillBeActive = currentEpoch.value + 1; // active from next epoch
  const stakeActiveDate = getStartDateOfEpochFormatted(
    Number(initialEpochTimestamp.value),
    epochWhereStakeWillBeActive,
  );

  const epochWhereStakeUnlocks =
    epochWhereStakeWillBeActive + DEFAULT_VESTING_UPGRADE_EPOCH_LOCKUP;
  const stakeUnlockDate = getStartDateOfEpochFormatted(
    Number(initialEpochTimestamp.value),
    epochWhereStakeUnlocks,
  );

  return `Upgrades your vesting position to a stake position that grants voting rights and fee shares (if the DAO enables fees).

    The new stake will be active starting ${stakeActiveDate}, and will unlock on ${stakeUnlockDate}, after a ${DEFAULT_VESTING_UPGRADE_EPOCH_LOCKUP}-epoch lock-up period.

    For a longer stake lock-up period, please contact us on Discord for assistance.
    `;
});

const isClaiming = ref(false);
const claim = async (stake: TableRowData) => {
  try {
    isClaiming.value = true;
    if (stake.isVesting) {
      return await sendTransaction({
        abi: PWN_VESTING_MANAGER_ABI,
        address: PWN_VESTING_MANAGER[1],
        functionName: "claimVesting",
        chainId: 1,
        args: [BigInt(stake.unlockEpoch)],
      });
    } else {
      return await sendTransaction({
        abi: VE_PWN_TOKEN_ABI,
        address: VE_PWN_TOKEN[chainId.value],
        functionName: "withdrawStake",
        chainId: chainId.value,
        args: [BigInt(stake.id), stake.votingDelegate || address.value!],
      });
    }
  } finally {
    isClaiming.value = false;
  }
};
</script>

<style scoped>
.table-positions {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0 0.5rem;

  @media (max-width: 930px) {
    width: 850px;
  }

  &__head {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      height: 1px;
      width: 100%;
      background-image: var(--border-gray-dashed);
      background-size: auto 2px;
      /* small hack how to hide buggy double border (top + bottom), when height is 1px */
    }
  }

  &__th {
    font-size: 0.875rem;
    color: var(--subtitle-color);
    text-align: left;
    font-family: var(--font-family-screener);
    font-weight: 400;
    padding: 0.5rem 0;

    &:first-child {
      padding: 0 0.5rem;
    }
  }

  &__tr {
    height: 3rem;

    &:not(:first-child) {
      border-top: 1px solid var(--border-color);
    }
    &--disabled {
      opacity: 0.5;
    }
  }

  &__td {
    &:first-child {
      padding: 0 0.5rem;
    }

    &-text--greyed {
      color: var(--border-color);
    }
  }

  &__not-yet-voting-power-wrapper {
    display: flex;
    align-items: center;
    column-gap: 0.5rem;
  }

  &__unlocked-text {
    color: var(--primary-color);
  }

  &__alert-icon {
    padding-top: 0.1875rem;
  }

  &__greyed {
    padding-left: 0.25rem;
    font-size: 0.75rem;
    color: var(--grey);
  }

  &__upgrade-btn {
    display: inline-flex;
    align-items: center;
    height: 2rem;
    padding: 0 0.5rem;
    margin: 0.5rem 0;

    transition: all 0.3s;
    color: var(--primary-color);
    background: transparent;
    border-color: var(--primary-color-1);
    border-width: 1px;
    border-style: solid;
    font-family: var(--font-family-screener);

    &:hover {
      background: var(--primary-color-2);
    }

    &:disabled {
      opacity: 0.5;
    }

    &:hover {
      cursor: pointer;

      &:disabled {
        cursor: not-allowed;
      }
    }
  }

  &__actions-wrapper {
    display: flex;
    align-items: center;
    column-gap: 1rem;
  }
}
</style>
