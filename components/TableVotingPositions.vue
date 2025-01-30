<template>
    <table class="table-positions">
        <thead class="table-positions__head">
            <tr>
                <th class="table-positions__th" scope="col" :style="{'width': column.width}" v-for="column in COLUMNS_DEFINITION">
                    {{ column.text }}
                    <SortingIcon @click="event => handleSortingIconClick(column.id)" :direction="sortingProp === column.id ? sortingDirection : 'none'" />
                </th>
            </tr>
        </thead>

        <tbody>
            <tr v-for="stake in sortedTableRowsData"
                :class="['table-positions__tr', {'table-positions__tr--disabled' : stake.isNextEpoch}]">
                <td class="table-positions__td">
                    {{ stake.idText }}
                </td>
                <td class="table-positions__td">{{ stake.amount }}</td>
                <td class="table-positions__td">
                    <div v-if="stake.votePowerStartsInNextEpoch" class="table-positions__not-yet-voting-power-wrapper">
                        <span class="table-positions__td-text--greyed">
                            {{ stake.votingPower }}
                        </span>
                        <BaseTooltip
                            :tooltip-text="`You will gain your voting power in next epoch, which will be in ${timeTillNextEpoch}.`"
                            :border-color="TooltipBorderColor.White">
                            <template #trigger>
                                <img src="/icons/alert-icon-red.svg" alt="alert" class="table-positions__alert-icon" />
                            </template>
                        </BaseTooltip>
                    </div>
                    <span v-else :class="{'table-positions__td-text--greyed': stake.isVesting}">
                        {{ stake.votingPower }}
                    </span>
                </td>
                <td class="table-positions__td">
                    <template v-if="stake.votePowerStartsInNextEpoch">
                        <span class="table-positions__td-text--greyed">
                            {{ stake.multiplier }}
                        </span>
                    </template>
                    <span v-else :class="{'table-positions__td-text--greyed': stake.isVesting}">
                        {{ stake.multiplier }}
                    </span>
                </td>
                <td class="table-positions__td">
                <BaseTooltip
                    is-interactive
                    :tooltip-text="stake.owner">
                  <template #trigger>
                      <span>
                       {{ shortenAddress(stake.owner) }}
                    </span>
                  </template>
                </BaseTooltip>
              </td>
                <td class="table-positions__td">
                <template class="table-positions__unlocked-text" v-if="stake.unlocksIn === 0">
                  Unlocked!
                </template>
                <template v-else>
                        <span>
                            {{ formatSeconds(stake.unlocksIn) }}
                        </span>
                  <span class="table-positions__greyed">
                            ({{ stake.epochsRemaining }} epochs)
                        </span>
                </template>
              </td>
            </tr>
        </tbody>
    </table>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { useAccount, useWriteContract } from '@wagmi/vue';
import { formatUnits, parseUnits } from 'viem';
import { SECONDS_IN_EPOCH, MIN_STAKE_DURATION_IN_EPOCH } from '~/constants/contracts';
import { formatSeconds } from '@/utils/date';
import { TooltipBorderColor } from './BaseTooltip.vue';
import { useChainIdTypesafe } from '~/constants/chain';
import { useCurrentEpoch, useUserStakesWithVotingPower} from '~/utils/hooks';
import { wagmiAdapter } from '~/wagmi';
import { PWN_VESTING_MANAGER } from '~/constants/addresses';
import { PWN_VESTING_MANAGER_ABI } from '~/constants/abis';
import type {Address} from "abitype";
import {shortenAddress} from "../utils/web3";

const { address } = useAccount()
const chainId = useChainIdTypesafe()

const stakes = useUserStakes(address, chainId)

const currentEpochQuery = useCurrentEpoch(chainId)
const currentEpoch = computed(() => currentEpochQuery.data?.value)
const nextEpoch = computed(() => currentEpoch?.value ? currentEpoch?.value + 1 : undefined)

const userStakesWithVotingPowerQuery = useUserStakesWithVotingPower(address, currentEpoch, chainId)
const userStakesWithVotingPowerQueryNextEpoch = useUserStakesWithVotingPower(address, nextEpoch, chainId)
const userStakesWithVotingPower = computed(() => userStakesWithVotingPowerQuery.data.value)
const userStakesWithVotingPowerNextEpoch = computed(() => userStakesWithVotingPowerQueryNextEpoch.data.value)
const userStakesWithVotingPowerFiltered = computed(() => userStakesWithVotingPower.value?.filter( stake => {
  return address.value !== stake.owner
}))
const userStakesWithVotingPowerNextEpochFiltered = computed(() => userStakesWithVotingPowerNextEpoch.value?.filter( stake => {
  return address.value !== stake.owner
}))

const initialEpochTimestampQuery = useInitialEpochTimestamp(chainId)
const initialEpochTimestamp = computed(() => initialEpochTimestampQuery.data.value)

const timeTillNextEpoch = computed(() => {
    if (initialEpochTimestamp.value === undefined) {
        return undefined
    }

    return getTimeTillNextEpochStringified(Number(initialEpochTimestamp.value))
})

const secondsTillNextEpoch = computed(() => {
    if (initialEpochTimestamp.value === undefined) {
        return undefined
    }

    return getSecondsTillNextEpoch(Number(initialEpochTimestamp.value))
})

interface TableRowData {
    id: bigint
    idText: string
    amount: string // formatted by decimals already
    votingPower: string // formatted by decimals already
    multiplier: number // e.g. x1.3
    lockUpEpochs: number // e.g. 39
    epochsRemaining: number // e.g. 15.4
    unlocksIn: number // e.g. 1y 79d 12h
    votePowerStartsInNextEpoch: boolean
    isVesting: boolean
    unlockEpoch: number
    owner: Address
    isNextEpoch?: boolean
}

const tableRowsData = computed<TableRowData[]>(() => {
    if (stakes.data.value === undefined || secondsTillNextEpoch.value === undefined) {
        return []
    }
    const userStakes: TableRowData[] = userStakesWithVotingPowerFiltered?.value?.map(stake => {
        const formattedStakedAmount = formatUnits(stake.amount, 18)

        const multiplier = getMultiplierForLockUpEpochs(Math.min(stake.remainingEpochs, stake.lockUpEpochs))

        let unlocksIn: number
        let epochsRemaining: number
        if (stake.remainingEpochs === 0) {
            unlocksIn = 0
            epochsRemaining = 0
        } else if (stake.remainingEpochs > stake.lockUpEpochs) {
            // happens in the epoch when user staked (voting power is granted only in the next epoch)
            epochsRemaining = stake.lockUpEpochs
            unlocksIn = secondsTillNextEpoch.value! + (epochsRemaining * SECONDS_IN_EPOCH)
            // add fractional part to the epochsRemaining
            epochsRemaining += (secondsTillNextEpoch.value! / SECONDS_IN_EPOCH)
            epochsRemaining = Number(epochsRemaining.toFixed(1))
        } else {
            epochsRemaining = stake.remainingEpochs - 1
            unlocksIn = secondsTillNextEpoch.value! + (epochsRemaining * SECONDS_IN_EPOCH)
            // add fractional part to the epochsRemaining
            epochsRemaining += (secondsTillNextEpoch.value! / SECONDS_IN_EPOCH)
            epochsRemaining = Number(epochsRemaining.toFixed(1))
        }

        return {
            id: stake.stakeId,
            idText: String(stake.stakeId),
            amount: formattedStakedAmount,
            votingPower: String(Math.floor(Number(formattedStakedAmount) * multiplier)),
            multiplier,
            lockUpEpochs: stake.lockUpEpochs,
            unlocksIn,
            epochsRemaining,
            votePowerStartsInNextEpoch: stake.remainingEpochs > stake.lockUpEpochs,
            isVesting: false,
            unlockEpoch: stake.initialEpoch + stake.lockUpEpochs,
            owner: stake.owner,
        }
    }) || []


    const userNextEpochStakes : TableRowData[] = userStakesWithVotingPowerNextEpochFiltered?.value?.map(stake => {
    const formattedStakedAmount = formatUnits(stake.amount, 18)

    const multiplier = getMultiplierForLockUpEpochs(Math.min(stake.remainingEpochs, stake.lockUpEpochs))

    let unlocksIn: number
    let epochsRemaining: number
    if (stake.remainingEpochs === 0) {
      unlocksIn = 0
      epochsRemaining = 0
    } else if (stake.remainingEpochs > stake.lockUpEpochs) {
      // happens in the epoch when user staked (voting power is granted only in the next epoch)
      epochsRemaining = stake.lockUpEpochs
      unlocksIn = secondsTillNextEpoch.value! + (epochsRemaining * SECONDS_IN_EPOCH)
      // add fractional part to the epochsRemaining
      epochsRemaining += (secondsTillNextEpoch.value! / SECONDS_IN_EPOCH)
      epochsRemaining = Number(epochsRemaining.toFixed(1))
    } else {
      epochsRemaining = stake.remainingEpochs - 1
      unlocksIn = secondsTillNextEpoch.value! + (epochsRemaining * SECONDS_IN_EPOCH)
      // add fractional part to the epochsRemaining
      epochsRemaining += (secondsTillNextEpoch.value! / SECONDS_IN_EPOCH)
      epochsRemaining = Number(epochsRemaining.toFixed(1))
    }

    return {
      id: stake.stakeId,
      idText: String(stake.stakeId),
      amount: formattedStakedAmount,
      votingPower: String(Math.floor(Number(formattedStakedAmount) * multiplier)),
      multiplier,
      lockUpEpochs: stake.lockUpEpochs,
      unlocksIn,
      epochsRemaining,
      votePowerStartsInNextEpoch: stake.remainingEpochs > stake.lockUpEpochs,
      isVesting: false,
      unlockEpoch: stake.initialEpoch + stake.lockUpEpochs,
      owner: stake.owner,
      isNextEpoch: true,
    }
  }) || []

  return [...userStakes]
})

const COLUMNS_DEFINITION = [
    {
        id: 'id',
        text: 'ID#',
        width: '9%',
    },
    {
        id: 'amount',
        text: 'Amount',
        width: '20%',
    },
    {
        id: 'votingPower',
        text: 'Voting Power',
        width: '20%',
    },
    {
        id: 'multiplier',
        text: 'Multiplier',
        width: '11%',
    },
    {
      id: 'stakeOwner',
      text: 'Owner of Stake',
      width: '20%',
    },
    {
        id: 'unlocksIn',
        text: 'Unlocks in',
        width: '20%',
    },
] as const

type SortingProp = typeof COLUMNS_DEFINITION[number]['id']

const sortingProp = useLocalStorage<SortingProp>('tablePositionsSortingProp', 'unlocksIn')
const sortingDirection = useLocalStorage<'asc' | 'desc'>('tablePositionsSortingDirection', 'asc')

const sortedTableRowsData = computed(() => {
    return tableRowsData.value.toSorted((a, b) => {
        switch (sortingProp.value) {
            case 'id': {
                if (sortingDirection.value === 'desc') {
                    return a.id > b.id ? -1 : 1
                } else {
                    return a.id > b.id ? 1 : -1
                }
            }
            case 'amount': {
                const aAmount = parseUnits(a.amount, 18)
                const bAmount = parseUnits(b.amount, 18)

                if (sortingDirection.value === 'desc') {
                    return aAmount > bAmount ? -1 : 1
                } else {
                    return aAmount > bAmount ? 1 : -1
                }
            }
            case 'votingPower': {
                const aVotingPower = parseUnits(a.votingPower, 18)
                const bVotingPower = parseUnits(b.votingPower, 18)

                if (sortingDirection.value === 'desc') {
                    return aVotingPower > bVotingPower ? -1 : 1
                } else {
                    return aVotingPower > bVotingPower ? 1 : -1
                }
            }
            case 'multiplier': {
                if (sortingDirection.value === 'desc') {
                    return a.multiplier > b.multiplier ? -1 : 1
                } else {
                    return a.multiplier > b.multiplier ? 1 : -1
                }
            }
            case 'stakeOwner': {
                if (sortingDirection.value === 'desc') {
                    return a.owner > b.owner ? -1 : 1
                } else {
                    return a.owner > b.owner ? 1 : -1
                }
            }
            case 'unlocksIn': {
                if (sortingDirection.value === 'desc') {
                    return a.unlocksIn > b.unlocksIn ? -1 : 1
                } else {
                    return a.unlocksIn > b.unlocksIn ? 1 : -1
                }
            }
        }
    })
})

const handleSortingIconClick = (newSortingProp: SortingProp) => {
    if (newSortingProp === sortingProp.value) {
        sortingDirection.value = sortingDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortingProp.value = newSortingProp
    }
}
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
        padding: 0 1rem;

        transition: all 0.3s;
        color: var(--primary-color);
        background: transparent;
        border-color: var(--primary-color-1);
        border-width: 1px;
        border-style: solid;
        font-family: var(--font-family-screener);

        margin-left: 1rem;

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
}
</style>
