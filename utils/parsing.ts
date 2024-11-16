import { readContract, readContracts } from "@wagmi/vue/actions"
import { formatUnits } from "viem"
import { VE_PWN_TOKEN_ABI } from "~/constants/abis"
import { VE_PWN_TOKEN } from "~/constants/addresses"
import { DAYS_IN_EPOCH, SECONDS_IN_EPOCH } from "~/constants/contracts"
import type { PowerInEpoch, StakeDetail } from "~/types/contractResults"
import { ACTIVE_CHAIN, wagmiAdapter } from "~/wagmi"

export const calculateUserVotingMultiplier = (epochToCalculateIn: number, stakesWithVotingPower: Readonly<StakeDetail[]>): number => {
    // calculating weight average
    let numerator = 0
    let denominator = 0

    for (const stakeDetail of stakesWithVotingPower) {
        const epochWhereUnlock = stakeDetail.initialEpoch + stakeDetail.lockUpEpochs
        const remainingEpochs = epochWhereUnlock - epochToCalculateIn
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

export const getStakesDetails = async (stakeIds: bigint[] | readonly bigint[]): Promise<Readonly<StakeDetail[]>> => {
    return await readContract(wagmiAdapter.wagmiConfig, {
        address: VE_PWN_TOKEN[ACTIVE_CHAIN]!,
        abi: VE_PWN_TOKEN_ABI,
        functionName: 'getStakes',
        args: [stakeIds]
    })
}

export const getSecondsTillNextEpoch = (initialEpochTimestamp: number): number => {
    const currentTimestamp = Math.floor(Date.now() / 1000)
    return SECONDS_IN_EPOCH - Math.abs(SECONDS_IN_EPOCH - (currentTimestamp % initialEpochTimestamp))
}

export const getTimeTillNextEpochStringified = (initialEpochTimestamp: number): string => {
    return formatSeconds(getSecondsTillNextEpoch(initialEpochTimestamp))
}

export const getStartDateOfEpoch = (initialEpochTimestamp: number, epochNumber: number): string => {
    epochNumber = epochNumber - 1 // epoch starts on 1
    const date = new Date((initialEpochTimestamp + (epochNumber * SECONDS_IN_EPOCH)) * 1000)
    const dateFormatter = new Intl.DateTimeFormat(navigator.language ?? 'en-US')
    return dateFormatter.format(date)
}
