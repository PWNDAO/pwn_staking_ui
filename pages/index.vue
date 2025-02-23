<template>
    <div class="homepage">
        <div class="homepage__epoch-input" v-if="showTestingTopBar">
            <template v-if="showEpochSwitcher">
                <div>Real epoch in contract: {{ currentEpoch }}</div>
                <div>Manually set epoch: <input v-if="epoch !== undefined" type="number" :value="epoch" @input="event => setEpoch((event.target as HTMLInputElement).value)" /></div>
            </template>
            <button v-if="showChainSwitcher" @click="switchChain">
                Switch from chainId={{ chainId }} to chainId={{ chainIdToToggleTo }}
            </button>
        </div>

        <h1 class="homepage__overview-title">
          Overview
        </h1>
        <div class="homepage__header-summary">
            <div class="homepage__header-summary-wrapper">
                <div class="homepage__pwn-balance">
                    <div class="homepage__box-subtitle">
                        Total PWN Tokens
                    </div>

                    <div class="homepage__pwn-balance-value">
                      <BaseSkeletor v-if="isFetchingPwnTokenBalance || isFetchingVestings || isFetchingUserStakes " height="2" />
                      <span v-else>
                        <div class="homepage__pwn-balance-value-wrapper">
                        <span> {{ totalPwnTokensFormatted }} PWN</span>
                        <button class="homepage__stake-button" @click="openStakeTokensModal">Stake Tokens</button>
                        </div>
                      </span>
                    </div>
                </div>
                <div class="homepage__summary-container">
                    <div class="homepage__summary-box">
                        <div class="homepage__box-subtitle">
                            Idle Tokens
                        </div>
                        <BaseSkeletor v-if="isFetchingPwnTokenBalance" height="2" />
                        <div v-else class="homepage__box-value">{{ pwnTokenBalanceFormatted }}</div>
                    </div>

                    <div class="homepage__summary-box" v-if="vestedTokensAmount">
                        <div class="homepage__box-subtitle">
                            Vested Tokens
                        </div>
                        <BaseSkeletor v-if="isFetchingVestings" height="2" />
                        <div v-else class="homepage__box-value">{{ vestedTokensAmountFormatted }}</div>
                    </div>

                    <div class="homepage__summary-box">
                        <div class="homepage__box-subtitle">
                            Staked Tokens
                        </div>
                        <BaseSkeletor v-if="isFetchingUserStakes" height="2" />
                        <div v-else class="homepage__box-value">{{ stakedTokensFormatted }}</div>
                    </div>

                    <div class="homepage__summary-box">
                        <div class="homepage__box-subtitle">
                            Current Voting Power
                        </div>
                        <BaseSkeletor v-if="isFetchingVotingPower" height="2" />
                        <div v-else class="homepage__box-value">{{ votingPowerFormatted }}</div>
                    </div>

                    <div v-if="votingMultiplier !== undefined" class="homepage__summary-box">
                        <div class="homepage__box-subtitle">
                            Voting Multiplier
                        </div>
                        <BaseSkeletor v-if="isFetchingUserStakesWithVotingPower" height="2" />
                        <div v-else class="homepage__box-value">{{ votingMultiplierFormatted }}</div>
                    </div>

                    <div v-if="hasAnyStake" class="homepage__summary-box">
                        <div class="homepage__box-subtitle">
                            Time till next unlock
                        </div>
                        <div class="homepage__box-value">{{ nextUnlockFormatted }}</div>
                    </div>
                </div>
            </div>
        </div>

        <GraphCumulativeVotingPower />

        <div v-if="hasAnyStake" class="homepage__positions">
            <h3 class="homepage__positions-heading">Owned Positions ({{ stakesCount }})</h3>
            <TableOwnedPositions />
        </div>
        <div v-if="isFetchingUserStakes || isFetchingVestings" class="homepage__table-positions-loader">
            <BaseSkeletor height="2" />
        </div>
      <div v-if="hasAnyVotingDelegation || hasAnyVotingDelegationNextEpoch" class="homepage__positions">
        <h3 class="homepage__positions-heading">Voting Power Only Positions ({{votingDelegationCount}})</h3>
        <TableVotingPositions/>
      </div>

    </div>
    <IncreaseStakeModal/>
    <CreateStakeModal ref="createStakeModal"/>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { formatUnits } from 'viem';
import { getChainIdToToggleTo, toggleActiveChain, useChainIdTypesafe } from '~/constants/chain';
import { SECONDS_IN_EPOCH } from '~/constants/contracts';
import { useUserStakesWithVotingPower } from '~/utils/hooks';
import { calculateUserVotingMultiplier } from '~/utils/parsing';
import {formatDecimalPoint} from "~/utils/utils";
import CreateStakeModal from '~/components/CreateStakeModal.vue';
import { ref } from 'vue';

const { address } = useAccount()
const chainId = useChainIdTypesafe()

const { epoch, setEpoch } = useManuallySetEpoch(chainId)
const epochBigInt = computed(() => {
    if (epoch.value === undefined) {
        return undefined
    }

    return BigInt(epoch.value)
})
const nextEpoch = computed(() => epoch?.value ? epoch?.value + 1 : undefined)

const pwnTokenBalanceQuery = useUserPwnBalance(address, chainId)
const pwnTokenBalance = computed(() => pwnTokenBalanceQuery?.data?.value)
const pwnTokenBalanceFormatted = computed(() => {
    if (pwnTokenBalance.value === undefined || pwnTokenBalance.value === 0n) {
        return 'None'
    }

    return formatDecimalPoint(formatUnits(pwnTokenBalance.value, 18))
})
const isFetchingPwnTokenBalance = computed(() => pwnTokenBalanceQuery.isLoading.value)

const stakesQuery = useUserStakes(address, chainId)
const isFetchingUserStakes = computed(() => stakesQuery.isLoading.value)
const vestingsQuery = useUserVestedTokens(address, chainId)
const isFetchingVestings = computed(() => vestingsQuery.isLoading.value)

const stakesCount = computed(() => (stakesQuery.data.value?.length ?? 0) + (vestingsQuery.data.value?.length ?? 0))
const hasAnyStake = computed(() => stakesCount.value > 0)

const stakedTokens = computed(() => {
    if (!hasAnyStake.value) {
        return undefined
    }

    return stakesQuery.data.value?.reduce((sum, stake) => sum + stake.amount, 0n)
})
const stakedTokensFormatted = computed(() => {
    if (stakedTokens.value === undefined || stakedTokens.value === 0n) {
        return 'None'
    }

    return formatDecimalPoint(formatUnits(stakedTokens.value, 18))
})
const currentEpochQuery = useCurrentEpoch(chainId)
const currentEpoch = computed(() => {
    if (currentEpochQuery.data?.value === undefined) {
        return undefined
    }

    return BigInt(currentEpochQuery.data.value)
})

const initialEpochTimestampQuery = useInitialEpochTimestamp(chainId)
const initialEpochTimestamp = computed(() => {
    if (initialEpochTimestampQuery.data.value === undefined) {
        return undefined
    }

    return Number(initialEpochTimestampQuery.data.value)
})

const secondsTillNextEpoch = computed(() => {
    if (initialEpochTimestamp.value === undefined) {
        return undefined
    }

    const currentTimestamp = Math.floor(Date.now() / 1000)
    return (initialEpochTimestamp.value - currentTimestamp) % SECONDS_IN_EPOCH
})

const votingPowerQuery = useUserVotingPower(address, epochBigInt, chainId)
const votingPower = computed(() => votingPowerQuery.data?.value)
const votingPowerFormatted = computed(() => {
    if (votingPower.value === 0n || votingPower.value === undefined) {
        return 'No voting power'
    }

    return formatDecimalPoint(formatUnits(votingPower.value, 18))
})
const isFetchingVotingPower = computed(() => votingPowerQuery.isLoading.value)

const userStakesWithVotingPowerQuery = useUserStakesWithVotingPower(address, epoch, chainId)
const userStakesWithVotingPower = computed(() => userStakesWithVotingPowerQuery.data.value)

const userStakesWithVotingPowerFiltered = computed(() => userStakesWithVotingPower.value?.filter( stake => {
  return address.value !== stake.owner
}))
const userStakesWithVotingPowerNextEpochQuery = useUserStakesWithVotingPower(address, nextEpoch, chainId)
const userStakesWithVotingPowerNextEpoch = computed(() => userStakesWithVotingPowerNextEpochQuery.data.value)

//todo: do we need to filter out the current epoch ones here?
const userStakesWithVotingPowerNextEpochFiltered = computed(() => userStakesWithVotingPowerNextEpoch.value?.filter( stake => {
  return address.value !== stake.owner
}))

const votingDelegationCount = computed(() => userStakesWithVotingPowerFiltered.value?.length ?? 0)
const votingDelegationCountNextEpoch = computed(() => userStakesWithVotingPowerNextEpochFiltered.value?.length ?? 0)
const hasAnyVotingDelegation = computed(() => votingDelegationCount.value > 0)
const hasAnyVotingDelegationNextEpoch = computed(() => votingDelegationCountNextEpoch.value > 0)


const isFetchingUserStakesWithVotingPower = computed(() => userStakesWithVotingPowerQuery.isLoading.value)

const votingMultiplier = computed(() => {
    if (epoch.value === undefined || !userStakesWithVotingPower.value?.length) {
        return undefined
    }

    return calculateUserVotingMultiplier(epoch.value, userStakesWithVotingPower.value)
})
const votingMultiplierFormatted = computed(() => {
    if (votingMultiplier.value === undefined) {
        return undefined
    }

    // floor to 3 decimal places
    return Math.floor(votingMultiplier.value * 1000) / 1000
})

const nextUnlockAt = computed(() => {
    if (epoch.value === undefined || secondsTillNextEpoch.value === undefined) {
        return undefined
    }

    let lowestRemainingEpochsForUnlock: number | undefined = undefined
    for (const stake of stakesQuery.data.value ?? []) {
        const epochWhereUnlocked = stake.initialEpoch + stake.lockUpEpochs
        if (epochWhereUnlocked > Number(epoch.value) && (lowestRemainingEpochsForUnlock === undefined || stake.remainingEpochs < lowestRemainingEpochsForUnlock)) {
            lowestRemainingEpochsForUnlock = stake.remainingEpochs
        }
    }

    for (const vesting of vestingsQuery.data.value ?? []) {
        let remainingEpochs = vesting.unlockEpoch - Number(epoch.value)
        if (vesting.unlockEpoch > Number(epoch.value) && (lowestRemainingEpochsForUnlock === undefined || remainingEpochs < lowestRemainingEpochsForUnlock)) {
            lowestRemainingEpochsForUnlock = remainingEpochs
        }
    }

    if (lowestRemainingEpochsForUnlock === undefined) {
        return undefined
    }

    return secondsTillNextEpoch.value + (lowestRemainingEpochsForUnlock * SECONDS_IN_EPOCH)
})

const nextUnlockFormatted = computed(() => {
    if (nextUnlockAt.value === undefined) {
        return undefined
    }

    return formatSeconds(nextUnlockAt.value)
})

const vestedTokensAmount = computed(() => {
    if (!vestingsQuery.data?.value?.length) {
        return undefined
    }

    let totalAmount = 0n
    for (const vestedToken of vestingsQuery.data.value) {
        totalAmount += vestedToken.amount
    }
    return totalAmount
})
const vestedTokensAmountFormatted = computed(() => {
    if (vestedTokensAmount.value === undefined) {
        return undefined
    }

    return formatDecimalPoint(formatUnits(vestedTokensAmount.value, 18))
})

const totalPwnTokens = computed(() => {
    return (vestedTokensAmount.value ?? 0n) + (stakedTokens.value ?? 0n) + (pwnTokenBalance.value ?? 0n)
})
const totalPwnTokensFormatted = computed(() => {
    return formatDecimalPoint(formatUnits(totalPwnTokens.value ?? 0n, 18))
})

const showEpochSwitcher = import.meta.env.VITE_PUBLIC_SHOW_EPOCH_SWITCHER === 'true'
const showChainSwitcher = import.meta.env.VITE_PUBLIC_SHOW_ONLY_MAINNET === 'false'
const showTestingTopBar = showEpochSwitcher || showChainSwitcher

const chainIdToToggleTo = computed(() => getChainIdToToggleTo(chainId.value))
const switchChain = () => {
    toggleActiveChain(chainId.value)
}

const createStakeModal = ref()

const openStakeTokensModal = () => {
  createStakeModal.value?.openModal()
}
</script>

<style scoped>
.homepage {
    padding: 2.5rem 1.5rem;

    &__epoch-input {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        align-items: center;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--border-color);
    }

    &__positions {
      border: 1px solid var(--border-border-primary, #434343);
      padding: 0.5rem;
      margin-top: 2rem;
      overflow: auto;
    }

    &__overview-title {
        font-size: 1.5rem;
        margin: 1.5rem 0 2rem;
        font-family: var(--font-family-screener);
    }

    &__header-summary {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2rem;
        border: 1px solid var(--border-color);
        padding: 1rem;
        height: 118px;
        box-sizing: border-box;
        overflow: auto;
    }

    &__box-subtitle {
        font-size: 0.875rem;
        color: var(--subtitle-color);
    }

    &__pwn-balance {
      display: flex;
      flex-direction: column;
      padding: 0.75rem 0;
    }

    &__pwn-balance-value {
        font-size: 1.5rem;
        margin-top: 1.5rem;
    }

    &__pwn-balance-value-wrapper {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    &__summary-container {
        display: flex;
        column-gap: 1.5rem;
    }

    &__summary-box {
        display: flex;
        flex-direction: column;
        row-gap: 1.5rem;
        padding: 0.75rem;
    }

    &__box-value {
        font-size: 1.125rem;
    }

    &__positions-heading {
        background: #222;
        padding: 0.5rem 1rem;
        font-size: 1.125rem;
        font-family: var(--font-family-screener);
        margin: 0;
        font-weight: 400;
        margin-bottom: 1rem;

        @media (max-width: 930px) {
            width: 820px;
        }
    }

    &__table-positions-loader {
        margin-top: 2.5rem;
    }

    &__header-summary-wrapper {
        display: flex;
        justify-content: space-between;
        width: 100%;

        @media (max-width: 830px) {
            min-width: 680px;
        }
    }

    &__stake-button {
        display: flex;
        padding: 0.75rem 1rem;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        color: var(--Primary, #00FFE0);
        text-align: center;
        background: var(--teal-teal-10, #0F2926);
        border: none;

        /* Screener/H10 */
        font-family: Screener;
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        cursor: pointer;
    }
}
</style>
