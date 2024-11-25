<template>
    <div class="homepage">
        <div class="homepage__epoch-input">
            <div>Real epoch in contract: {{ currentEpoch }}</div>
            <div>Manually set epoch: <input v-if="epoch !== undefined" type="number" :value="epoch" @input="event => setEpoch((event.target as HTMLInputElement).value)" /></div>
        </div>

        <div class="homepage__header-summary">
            <div class="homepage__pwn-balance">
                <div class="homepage__box-subtitle">
                    PWN Token Balance in Wallet
                </div>

                <BaseSkeletor v-if="isFetchingPwnTokenBalance" height="20" />
                <div class="homepage__pwn-balance-value" v-else>
                    {{ pwnTokenBalanceFormatted }} $PWN
                </div>
            </div>
            <div class="homepage__summary-container">
                <div class="homepage__summary-box">
                    <div class="homepage__box-subtitle">
                        Staked Tokens
                    </div>
                    <BaseSkeletor v-if="isFetchingUserStakes" height="14" />
                    <div v-else class="homepage__box-value">{{ stakedTokensFormatted }}</div>
                </div>

                <div class="homepage__summary-box">
                    <div class="homepage__box-subtitle">
                        Voting Power
                    </div>
                    <BaseSkeletor v-if="isFetchingVotingPower" height="14" />
                    <div v-else class="homepage__box-value">{{ votingPowerFormatted }}</div>
                </div>

                <div v-if="votingMultiplier !== undefined" class="homepage__summary-box">
                    <div class="homepage__box-subtitle">
                        Voting Multiplier
                    </div>
                    <BaseSkeletor v-if="isFetchingUserStakesWithVotingPower" height="14" />
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

        <GraphCumulativeVotingPower />

        <div v-if="hasAnyStake">
            <h3 class="homepage__positions-heading">Positions ({{ stakesCount }})</h3>
            <TablePositions />
        </div>
        <div v-else-if="isFetchingUserStakes" class="homepage__table-positions-loader">
            <BaseSkeletor height="100" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { formatUnits } from 'viem';
import { SECONDS_IN_EPOCH } from '~/constants/contracts';
import { useUserStakesWithVotingPower } from '~/utils/hooks';
import { calculateUserVotingMultiplier } from '~/utils/parsing';

const { address } = useAccount()

const { epoch, setEpoch } = useManuallySetEpoch()
const epochBigInt = computed(() => {
    if (epoch.value === undefined) {
        return undefined
    }

    return BigInt(epoch.value)
})

const pwnTokenBalanceQuery = useUserPwnBalance(address)
const pwnTokenBalance = computed(() => pwnTokenBalanceQuery?.data?.value)
const pwnTokenBalanceFormatted = computed(() => {
    if (pwnTokenBalance.value === undefined) {
        return undefined
    }

    return formatUnits(pwnTokenBalance.value, 18)
})
const isFetchingPwnTokenBalance = computed(() => pwnTokenBalanceQuery.isLoading.value)

const stakes = useUserStakes(address)
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
    if (stakedTokens.value === undefined) {
        return '0'
    }

    return formatUnits(stakedTokens.value, 18)
})
const isFetchingUserStakes = computed(() => stakes.isLoading.value)

const currentEpochQuery = useCurrentEpoch()
const currentEpoch = computed(() => {
    if (currentEpochQuery.data?.value === undefined) {
        return undefined
    }

    return BigInt(currentEpochQuery.data.value)
})

const initialEpochTimestampQuery = useInitialEpochTimestamp()
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

const votingPowerQuery = useUserVotingPower(address, epochBigInt)
const votingPower = computed(() => votingPowerQuery.data?.value)
const votingPowerFormatted = computed(() => {
    if (votingPower.value === undefined) {
        return undefined
    }

    return formatUnits(votingPower.value, 18)
})
const isFetchingVotingPower = computed(() => votingPowerQuery.isLoading.value)

const userStakesWithVotingPowerQuery = useUserStakesWithVotingPower(address, epoch)
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

    &__header-summary {
        display: flex;
        justify-content: space-between;
        margin-bottom: 2.5rem;
    }

    &__box-subtitle {
        font-size: 0.875rem;
        color: var(--subtitle-color);
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
        row-gap: 1rem;
        padding: 0.5rem 0.75rem;
        background-color: #1C1C1C;
    }

    &__box-value {
        font-size: 1.125rem;
    }

    &__positions-heading {
        margin-top: 2.5rem;
        margin-bottom: 2.5rem;
    }

    &__table-positions-loader {
        margin-top: 2.5rem;
    }
}
</style>
