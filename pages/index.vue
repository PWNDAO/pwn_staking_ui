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
                        PWN Token Balance in Wallet
                    </div>

                    <div class="homepage__pwn-balance-value">
                      <BaseSkeletor v-if="isFetchingPwnTokenBalance" height="2" />
                      <span v-else>
                        {{ pwnTokenBalanceFormatted }} $PWN
                      </span>
                    </div>
                </div>
                <div class="homepage__summary-container">
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
            <h3 class="homepage__positions-heading">Positions ({{ stakesCount }})</h3>
            <TablePositions />
        </div>
        <div v-else-if="isFetchingUserStakes" class="homepage__table-positions-loader">
            <BaseSkeletor height="2" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccount, useChainId } from '@wagmi/vue';
import { formatUnits } from 'viem';
import { getChainIdToToggleTo, toggleActiveChain, useChainIdTypesafe, type SupportedChain } from '~/constants/chain';
import { SECONDS_IN_EPOCH } from '~/constants/contracts';
import { useUserStakesWithVotingPower } from '~/utils/hooks';
import { calculateUserVotingMultiplier } from '~/utils/parsing';

const { address } = useAccount()
const chainId = useChainIdTypesafe()

const { epoch, setEpoch } = useManuallySetEpoch(chainId)
const epochBigInt = computed(() => {
    if (epoch.value === undefined) {
        return undefined
    }

    return BigInt(epoch.value)
})

const pwnTokenBalanceQuery = useUserPwnBalance(address, chainId)
const pwnTokenBalance = computed(() => pwnTokenBalanceQuery?.data?.value)
const pwnTokenBalanceFormatted = computed(() => {
    if (pwnTokenBalance.value === undefined) {
        return '0'
    }

    return formatUnits(pwnTokenBalance.value, 18)
})
const isFetchingPwnTokenBalance = computed(() => pwnTokenBalanceQuery.isLoading.value)

const stakes = useUserStakes(address, chainId)
const stakesCount = computed(() => stakes.data.value?.length ?? 0)
const hasAnyStake = computed(() => stakesCount.value > 0)

// TODO check if this returns correct balances
const stakedTokens = computed(() => {
    if (!hasAnyStake.value) {
        return undefined
    }

    return stakes.data.value?.reduce((sum, stake) => sum + stake.amount, 0n)
})
const stakedTokensFormatted = computed(() => {
    if (stakedTokens.value === undefined || stakedTokens.value === 0n) {
        return 'None'
    }

    return formatUnits(stakedTokens.value, 18)
})
const isFetchingUserStakes = computed(() => stakes.isLoading.value)

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

    return formatUnits(votingPower.value, 18)
})
const isFetchingVotingPower = computed(() => votingPowerQuery.isLoading.value)

const userStakesWithVotingPowerQuery = useUserStakesWithVotingPower(address, epoch, chainId)
const userStakesWithVotingPower = computed(() => userStakesWithVotingPowerQuery.data.value)
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
    if (stakes.data.value === undefined || epoch.value === undefined || secondsTillNextEpoch.value === undefined) {
        return undefined
    }

    let lowestRemainingEpochsForUnlock: number | undefined = undefined
    for (const stake of stakes.data.value) {
        const epochWhereUnlocked = stake.initialEpoch + stake.lockUpEpochs
        if (epochWhereUnlocked > Number(epoch.value) && (lowestRemainingEpochsForUnlock === undefined || stake.remainingEpochs < lowestRemainingEpochsForUnlock)) {
            lowestRemainingEpochsForUnlock = stake.remainingEpochs
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

const showEpochSwitcher = import.meta.env.VITE_PUBLIC_SHOW_EPOCH_SWITCHER === 'true'
const showChainSwitcher = import.meta.env.VITE_PUBLIC_SHOW_ONLY_MAINNET === 'true'
const showTestingTopBar = showEpochSwitcher || showChainSwitcher

const chainIdToToggleTo = computed(() => getChainIdToToggleTo(chainId.value))
const switchChain = () => {
    toggleActiveChain(chainId.value)
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
}
</style>
