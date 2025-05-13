<template>
  <BaseModal
    v-model:is-open="isOpen"
    heading="Stake Tokens"
    :heading-align="'left'"
  >
    <template #body>
      <div class="create-stake-modal__body">
        <div class="create-stake-modal__inputs-container">
          <div>
            <div class="create-stake-modal__label-container">
              <span class="create-stake-modal__label">
                Choose Stake Amount
              </span>
              <div class="create-stake-modal__balance">
                ({{ pwnTokenBalanceFormatted }} PWN)
              </div>
            </div>
            <div class="create-stake-modal__amount-input">
              <input
                v-model="stakeAmount"
                type="number"
                placeholder="Enter PWN amount"
                class="create-stake-modal__input"
              />
              <button
                class="create-stake-modal__max-button"
                @click="setMaxAmount"
              >
                Max
              </button>
            </div>
          </div>
          <div class="create-stake-modal__lock-duration-container">
            <div class="create-stake-modal__label-container--slider">
              <span class="create-stake-modal__label"> Lock Duration </span>
            </div>
            <VueSlider
              ref="sliderRef"
              v-model="lockUpEpochs"
              class="create-stake-modal__slider"
              :adsorb="true"
              :min="13"
              :max="130"
              :tooltip="'always'"
              :process-style="{
                backgroundColor: 'var(--primary-color)',
              }"
              :marks="marks"
              :lazy="true"
              @click.stop
            >
              <template #tooltip="{ value }">
                <div :class="['create-stake-modal__tooltip-text']">
                  {{ value * DAYS_IN_EPOCH }} days ({{
                    displayShortDate(
                      new Date(
                        Date.now() +
                          (value * SECONDS_IN_EPOCH + secondsTillNextEpoch!) *
                            1000,
                      ),
                    )
                  }})
                </div>
              </template>
              <template #dot>
                <div class="create-stake-modal__dot" />
              </template>
            </VueSlider>
          </div>
        </div>

        <!-- Add potential voting power info -->
        <div class="create-stake-modal__potential-power">
          <GraphCumulativeVotingPower :potential-stake="potentialStake" />
        </div>

        <span class="create-stake-modal__disclaimer"
          >Note: The voting power will only be active at the start of the next
          epoch ({{ timeTillNextEpoch }}).</span
        >

        <BaseCheckbox
          v-if="isLastValue(lockUpEpochs)"
          v-model="isCheckboxTicked"
          :label="checkboxLabel"
        />
        <div class="create-stake-modal__submit">
          <BaseTooltip
            style="width: 100%"
            :has-tooltip="isButtonDisabled && !isPending"
            :tooltip-text="tooltipText"
          >
            <template #trigger>
              <button
                class="create-stake-modal__submit-button"
                :disabled="isButtonDisabled"
                @click="createStakeAction"
              >
                {{ buttonText }}
              </button>
            </template>
          </BaseTooltip>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { useAccount } from "@wagmi/vue";
import VueSlider from "vue-3-slider-component";
import { useQueryClient } from "@tanstack/vue-query";
import { ref, computed, useTemplateRef, watch } from "vue";
import { parseUnits, formatUnits } from "viem";
import { VE_PWN_TOKEN, PWN_TOKEN } from "~/constants/addresses";
import { getChainIdTypesafe, useChainIdTypesafe } from "~/constants/chain";
import { formatSeconds, displayShortDate } from "~/utils/date";
import { SECONDS_IN_EPOCH, DAYS_IN_EPOCH } from "~/constants/contracts";
import BaseCheckbox from "~/components/BaseCheckbox.vue";
import {
  useUserPwnBalance,
  useApproveToken,
  useCreateStake,
  useInitialEpochTimestamp,
  useManuallySetEpoch,
} from "~/utils/hooks";
import { formatDecimalPoint, getAllowance } from "~/utils/utils";
import GraphCumulativeVotingPower from "~/components/GraphCumulativeVotingPower.vue";

const LOWER_STAKE_LOCK_UP_EPOCHS = 13; // 1 year
const MAX_STAKE_LOCK_UP_EPOCHS = 130; // 10 years

const isOpen = ref(false);
const stakeAmount = ref("");
const lockUpEpochs = ref(LOWER_STAKE_LOCK_UP_EPOCHS);

const sliderRef = useTemplateRef<VueSlider>("sliderRef");

watch(
  lockUpEpochs,
  (newValue) => {
    if (newValue >= 65 && newValue <= 97) {
      lockUpEpochs.value = 65;
      sliderRef.value.setValue(65);
    } else if (newValue >= 98 && newValue <= 130) {
      lockUpEpochs.value = 130;
      sliderRef.value.setValue(130);
    }
  },
  { immediate: true },
);

const { address } = useAccount();
const chainId = useChainIdTypesafe();
const queryClient = useQueryClient();
const isCheckboxTicked = ref(false);

const pwnTokenBalanceQuery = useUserPwnBalance(address, chainId);
const pwnTokenBalance = computed(() => pwnTokenBalanceQuery?.data?.value);
const pwnTokenBalanceFormatted = computed(() => {
  if (pwnTokenBalance.value === undefined || pwnTokenBalance.value === 0n) {
    return "0";
  }
  return formatDecimalPoint(formatUnits(pwnTokenBalance.value, 18));
});

const setMaxAmount = () => {
  if (pwnTokenBalance.value) {
    stakeAmount.value = formatUnits(pwnTokenBalance.value, 18);
  }
};

const openModal = () => {
  isOpen.value = true;
  stakeAmount.value = "";
  lockUpEpochs.value = LOWER_STAKE_LOCK_UP_EPOCHS;
  isCheckboxTicked.value = false;
};

const initialEpochTimestampQuery = useInitialEpochTimestamp(chainId);
const initialEpochTimestamp = computed(
  () => initialEpochTimestampQuery.data.value,
);

const secondsTillNextEpoch = computed(() => {
  if (initialEpochTimestamp.value === undefined) {
    return undefined;
  }

  return getSecondsTillNextEpoch(Number(initialEpochTimestamp.value));
});

const timeTillNextEpoch = computed(() => {
  if (secondsTillNextEpoch.value === undefined) {
    return undefined;
  }

  return formatSeconds(secondsTillNextEpoch.value);
});

const marks = {
  "13": "1 year",
  "26": "2 years",
  "39": "3 years",
  "52": "4 years",
  "65": "5 years",
  "130": "10 years",
};

const checkboxLabel = computed(
  () =>
    `I understand that this action will lock my tokens for ${MAX_STAKE_LOCK_UP_EPOCHS * DAYS_IN_EPOCH} days (${Math.round((MAX_STAKE_LOCK_UP_EPOCHS * DAYS_IN_EPOCH) / 365)} years)`,
);

const isButtonDisabled = computed(() => {
  if (isPending.value || !stakeAmount.value || !lockUpEpochs.value) return true;

  // Check if stake amount exceeds balance
  if (
    pwnTokenBalance.value &&
    parseUnits(stakeAmount.value.toString(), 18) > pwnTokenBalance.value
  ) {
    return true;
  }

  // Check if max duration selected but checkbox not ticked
  if (isLastValue(lockUpEpochs.value) && !isCheckboxTicked.value) return true;

  return false;
});

const tooltipText = computed(() => {
  if (!stakeAmount.value) return "Please enter stake amount";
  if (!lockUpEpochs.value) return "Please select duration";
  if (
    pwnTokenBalance.value &&
    parseUnits(stakeAmount.value.toString(), 18) > pwnTokenBalance.value
  ) {
    return "Insufficient PWN balance";
  }
  if (isLastValue(lockUpEpochs.value) && !isCheckboxTicked.value)
    return "Please confirm the long lock duration";
  return "";
});

const invalidateUserStakesQuery = () => {
  queryClient.invalidateQueries({ queryKey: ["userStakesWithVotingPower"] });
  queryClient.invalidateQueries({ queryKey: ["stakedPwnBalance"] });
  queryClient.invalidateQueries({ queryKey: ["useUserPwnBalance"] });
};

const { mutateAsync: approveToken, isPending: isApproving } =
  useApproveToken(chainId);
const { mutateAsync: createStake, isPending: isStaking } = useCreateStake(
  chainId,
  () => {
    isOpen.value = false;
    invalidateUserStakesQuery();
  },
);

const createStakeAction = async () => {
  try {
    const allowance = await getAllowance(
      address.value,
      PWN_TOKEN[getChainIdTypesafe()],
      VE_PWN_TOKEN[getChainIdTypesafe()],
    );

    const rawAmount = parseUnits(stakeAmount.value.toString(), 18);
    // Adjust amount to be divisible by 100 (contract requirement)
    const adjustedAmount = (rawAmount / 100n) * 100n;

    if (allowance < adjustedAmount) {
      await approveToken({
        amount: formatUnits(adjustedAmount, 18),
        spender: VE_PWN_TOKEN[getChainIdTypesafe()],
      });
    }

    await createStake({
      amount: formatUnits(adjustedAmount, 18),
      lockUpEpochs: lockUpEpochs.value,
    });
  } catch (error) {
    console.error("Error in createStakeAction:", error);
  }
};

const isPending = computed(() => isApproving.value || isStaking.value);

const buttonText = computed(() => {
  if (isApproving.value) return "Approving...";
  if (isStaking.value) return "Creating...";
  return "Create Stake";
});

const isLastValue = (value: number) => {
  return value === MAX_STAKE_LOCK_UP_EPOCHS;
};

// Add computed properties for potential voting power
// const potentialMultiplier = computed(() => {
//   if (!lockUpEpochs.value) return 0
//   return getMultiplierForLockUpEpochs(lockUpEpochs.value)
// })

// const potentialVotingPower = computed(() => {
//   if (!stakeAmount.value || !lockUpEpochs.value) return '0'
//   return getFormattedVotingPower(stakeAmount.value, potentialMultiplier.value)
// })

const potentialStake = computed(() => {
  if (!stakeAmount.value || !lockUpEpochs.value) return undefined;
  return {
    amount: parseUnits(stakeAmount.value.toString() || "0", 18),
    lockUpEpochs: lockUpEpochs.value,
    initialEpoch: epoch.value ? Number(epoch.value) + 1 : undefined, // Stake starts next epoch
  };
});

const { epoch } = useManuallySetEpoch(chainId);

defineExpose({
  openModal,
});
</script>

<style scoped>
.create-stake-modal {
  &__body {
    padding-bottom: 1rem;
    width: 100%;
  }

  &__amount-input {
    margin-top: 1.25rem;
    display: flex;
    align-items: center;
    background: var(--black-input);
    border: 1px solid var(--grey);
    padding: 0.5rem 0.75rem;
    max-width: 20rem;
  }

  &__input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-color);
    font-family: var(--font-family-supreme);
    font-size: 1rem;
    outline: none;

    &::placeholder {
      color: var(--grey);
    }

    /* Hide spinner arrows for all browsers */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    &[type="number"] {
      -moz-appearance: textfield;
    }
  }

  &__currency {
    color: var(--text-color);
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
  }

  &__disclaimer {
    font-family: var(--font-family-supreme);
    font-size: 0.75rem;
    color: var(--text-color);
    display: block;
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  &__tooltip-text {
    font-family: var(--font-family-screener);
    font-size: 0.75rem;
    text-transform: uppercase;
    color: var(--text-color);
    white-space: nowrap;
    padding-left: 1.25rem;
    text-align: center;
  }

  &__dot {
    width: 2rem;
    height: 1.5rem;
    position: absolute;
    top: -0.5rem;
    border: 1px solid var(--grey);
    background: var(--black-input);
  }

  &__label-container {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  &__label-container--slider {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-left: -0.25rem;
  }

  &__label {
    color: #aaa9b2;
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
  }

  &__submit {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 1rem;
  }

  &__submit-button {
    width: 100%;
    display: flex;
    padding: 1rem;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    text-align: center;
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
    border: none;
    background: var(--primary-color-3);

    &:hover {
      background: var(--primary-color-2);
      cursor: pointer;
      &:disabled {
        cursor: not-allowed;
      }
    }

    &:disabled {
      opacity: 0.5;
    }
  }

  &__balance {
    color: #aaa9b2;
    font-family: Supreme;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1rem;
  }

  &__max-button {
    padding: 0.25rem 0.5rem;
    background: var(--primary-color-3);
    border: none;
    color: var(--primary-color);
    font-family: var(--font-family-screener);
    font-size: 0.75rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: var(--primary-color-2);
    }
  }

  &__potential-power {
    margin-top: 3rem;
    padding: 1rem;
    background: var(--black-input);
    border: 1px solid var(--grey);
    width: 60vw;
  }

  &__potential-power-stats {
    display: flex;
    gap: 2rem;
    margin-bottom: 1rem;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__label-stats {
    color: var(--subtitle-color);
    font-family: var(--font-family-screener);
    font-size: 0.875rem;
  }

  &__value {
    color: var(--text-color);
    font-family: var(--font-family-supreme);
    font-size: 1rem;
  }

  &__inputs-container {
    display: flex;
    column-gap: 5rem;
    width: 100%;
  }

  &__lock-duration-container {
    flex-grow: 2;
    flex-shrink: 0;
    border-left: 1px solid var(--grey);
    padding-left: 5rem;
  }

  &__slider {
    cursor: pointer;
    width: 60% !important;
    min-width: 30rem;
  }

  @media only screen and (max-width: 1258px) {
    &__inputs-container {
      flex-direction: column;
      gap: 2rem;
      align-items: stretch;
      padding-left: 2rem;
      padding-right: 2rem;
    }

    &__lock-duration-container {
      padding-left: 0;
      border-left: none;
    }

    &__potential-power {
      width: 100%;
    }

    &__slider {
      width: 90% !important;
    }
  }
}
</style>
