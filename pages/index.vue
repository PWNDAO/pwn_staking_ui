<template>
    <div class="homepage">
        <div class="homepage__header-summary">
            <div class="homepage__pwn-balance">
                <div class="homepage__box-subtitle">
                    PWN Token Balance in Wallet 
                </div>

                <div class="homepage__pwn-balance-value">
                    {{ pwnTokenBalanceFormatted }} $PWN
                </div>
            </div>
            <div class="homepage__summary-container">
                <div class="homepage__summary-box">
                    <div class="homepage__box-subtitle">
                        Staked Tokens
                    </div>
                    <div class="homepage__box-value">{{ stakedTokensFormatted }}</div>
                </div>

                <div class="homepage__summary-box">
                    <div class="homepage__box-subtitle">
                        Voting Power
                    </div>
                    <div class="homepage__box-value">{{ votingPowerFormatted }}</div>
                </div>

                <template v-if="hasAnyStake">
                    <div class="homepage__summary-box">
                        <div class="homepage__box-subtitle">
                            Voting Multiplier
                        </div>
                        <div class="homepage__box-value">{{ votingMultiplier }}</div>
                    </div>

                    <div class="homepage__summary-box">
                        <div class="homepage__box-subtitle">
                            Time till next unlock
                        </div>
                        <div class="homepage__box-value">{{ nextUnlockFormatted }}</div>
                    </div>
                </template>
            </div>
        </div>

        <div v-if="hasAnyStake">
            <h3 class="homepage__positions-heading">Positions ({{ stakesCount }})</h3>
            <TablePositions />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { formatUnits } from 'viem';
import { SECONDS_IN_EPOCH } from '~/constants/contracts';

const { address } = useAccount()

const pwnTokenBalanceData = useUserPwnBalance(address)
const pwnTokenBalance = computed(() => pwnTokenBalanceData?.data?.value)
const pwnTokenBalanceFormatted = computed(() => {
    if (pwnTokenBalance.value === undefined) { 
        return undefined
    }

    console.log(`pwnTokenBalance for user ${address.value}`)
    console.log(pwnTokenBalance.value)

    return formatUnits(pwnTokenBalance.value, 18)
})

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
        return undefined
    }

    console.log(`stakedTokens for user ${address.value}`)
    console.log(stakedTokens.value)

    return formatUnits(stakedTokens.value, 18)
})

const currentEpochData = useCurrentEpoch()
const currentEpoch = computed(() => {
    if (currentEpochData.data?.value === undefined) {
        return undefined
    }

    console.log('currentEpoch')
    console.log(currentEpochData.data.value)

    // TODO remove this 1n, only for testing
    return BigInt(currentEpochData.data.value) + 1n
})

const initialEpochTimestampData = useInitialEpochTimestamp()
const initialEpochTimestamp = computed(() => {
    if (initialEpochTimestampData.data.value === undefined) {
        return undefined
    }

    return Number(initialEpochTimestampData.data.value)
})

const secondsTillNextEpoch = computed(() => {
    if (initialEpochTimestamp.value === undefined) {
        return undefined
    }

    const currentTimestamp = Math.floor(Date.now() / 1000)
    return (initialEpochTimestamp.value - currentTimestamp) % SECONDS_IN_EPOCH
})

// TODO check if this returns correct data
const votingPowerData = useUserVotingPower(address, currentEpoch)
const votingPower = computed(() => {
    console.log('votingPower')
    console.log(votingPowerData.data?.value)
    return votingPowerData.data?.value 
})
const votingPowerFormatted = computed(() => {
    if (votingPower.value === undefined) {
        return undefined
    }
    
    return formatUnits(votingPower.value, 18)
})

const votingMultiplierData = useUserVotingMultiplier(address, currentEpoch)
const votingMultiplier = computed(() => {
    if (votingMultiplierData.data.value === undefined) {
        return undefined
    }

    // floor to 3 decimal places
    return Math.floor(votingMultiplierData.data.value * 1000) / 1000
})

// TODO rename?
// TODO check if the returned value is correct
const nextUnlockAt = computed(() => {
    // TODO check here also currentEpoch or not?
    // TODO check here also secondsTillNextEpoch or not?
    if (stakes.data.value === undefined || currentEpoch.value === undefined || secondsTillNextEpoch.value === undefined) {
        return undefined
    }

    let lowestRemainingEpochsForUnlock: number | undefined = undefined
    for (const stake of stakes.data.value) {
        const epochWhereUnlocked = stake.initialEpoch + stake.lockUpEpochs
        const remainingEpochs = epochWhereUnlocked - Number(currentEpoch.value)
        if (epochWhereUnlocked > Number(currentEpoch.value) && (lowestRemainingEpochsForUnlock === undefined || remainingEpochs < lowestRemainingEpochsForUnlock)) {
            lowestRemainingEpochsForUnlock = remainingEpochs
        }
    }

    console.log('lowestRemainingEpochsForUnlock')
    console.log(lowestRemainingEpochsForUnlock)

    if (lowestRemainingEpochsForUnlock === undefined) {
        return undefined
    }

    return secondsTillNextEpoch.value + (lowestRemainingEpochsForUnlock * SECONDS_IN_EPOCH)
})

const nextUnlockFormatted = computed(() => {
    if (nextUnlockAt.value === undefined) {
        return undefined
    }

    console.log('nextUnlockAt')
    console.log(nextUnlockAt.value)

    return formatSeconds(nextUnlockAt.value)
})
</script>

<style scoped>
.homepage {
    padding: 2.5rem 1rem;

    &__header-summary {
        display: flex;
        justify-content: space-between;
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
}
</style>
