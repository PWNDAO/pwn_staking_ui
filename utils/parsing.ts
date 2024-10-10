import { readContracts } from "@wagmi/vue/actions"
import { formatUnits } from "viem"
import { VE_PWN_TOKEN_ABI } from "~/constants/abis"
import { VE_PWN_TOKEN } from "~/constants/addresses"
import { SECONDS_IN_EPOCH } from "~/constants/contracts"
import type { PowerInEpoch } from "~/types/contractResults"
import { ACTIVE_CHAIN, wagmiAdapter } from "~/wagmi"

export const calculateUserVotingMultiplier = (currentEpoch: number, stakesWithVotingPower: StakeDetail[]): number => {
    // calculating weight average
    let numerator = 0
    let denominator = 0

    for (const stakeDetail of stakesWithVotingPower) {
        const epochWhereUnlock = stakeDetail.initialEpoch + stakeDetail.lockUpEpochs
        const remainingEpochs = epochWhereUnlock - currentEpoch
        const multiplier = getMultiplierForLockUpEpochs(remainingEpochs)
        const formattedAmount = Number(formatUnits(stakeDetail.amount, 18))
        if (multiplier > 0) {
            denominator += formattedAmount
            numerator += formattedAmount * multiplier
        }
    }
    return numerator / denominator
}

export const getMultiplierForLockUpEpochs = (lockUpEpochs: number) => {
    const EPOCHS_IN_YEAR = 13

    if (lockUpEpochs <= EPOCHS_IN_YEAR) return 1;
    else if (lockUpEpochs <= EPOCHS_IN_YEAR * 2) return 1.15;
    else if (lockUpEpochs <= EPOCHS_IN_YEAR * 3) return 1.3;
    else if (lockUpEpochs <= EPOCHS_IN_YEAR * 4) return 1.5;
    else if (lockUpEpochs <= EPOCHS_IN_YEAR * 5) return 1.75;
    else return 3.5;
}

export const formatCumulativeVotingPowerSummary = (stakesPowers: Array<PowerInEpoch[]>): Record<number, bigint> => {
    const result: Record<number, bigint> = {}
    
    for (const stakePowers of stakesPowers) {
        const lastItemIndex = stakePowers.length - 1

        for (const [index, stakePower] of stakePowers.entries()) {
            const startEpoch = Number(stakePower.epoch)
            const endEpoch = index === lastItemIndex ? startEpoch : Number(stakePowers[index + 1].epoch) 

            for (let epoch = startEpoch; epoch < endEpoch; epoch++) {
                if (epoch in result) {
                    result[epoch] += stakePower.power
                } else {
                    result[epoch] = stakePower.power
                }
            }
        }
    }

    const lastEpochWithPower = Math.max(...Object.keys(result).map(epoch => Number(epoch)))
    result[lastEpochWithPower + 1] = 0n
    result[lastEpochWithPower + 2] = 0n // filling for better graph displaying

    return result
}

export const getStakesDetails = async (stakeIds: bigint[] | readonly bigint[]): Promise<StakeDetail[]> => {
    const result = await readContracts(wagmiAdapter.wagmiConfig, {
        contracts: stakeIds.map(stakeId => ({
            address: VE_PWN_TOKEN[ACTIVE_CHAIN]!,
            abi: VE_PWN_TOKEN_ABI,
            functionName: 'stakes',
            args: [stakeId]
        }))
    })

    return result.map((stake, index) => ({
        id: stakeIds[index],
        // @ts-expect-error not sure why typings are off here, but the value is correct
        initialEpoch: stake.result[0],
        // @ts-expect-error not sure why typings are off here, but the value is correct
        lockUpEpochs: stake.result[1],
        // @ts-expect-error not sure why typings are off here, but the value is correct
        amount: stake.result[2],
    }))
}

export const getTimeTillNextEpoch = (initialEpochTimestamp: number): number => {
    return (Math.floor(Date.now() / 1000) - initialEpochTimestamp) % SECONDS_IN_EPOCH
}
