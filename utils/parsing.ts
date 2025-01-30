import { readContract } from "@wagmi/vue/actions"
import { formatUnits } from "viem"
import { VE_PWN_TOKEN_ABI } from "~/constants/abis"
import { VE_PWN_TOKEN } from "~/constants/addresses"
import { getChainIdTypesafe } from "~/constants/chain"
import { SECONDS_IN_EPOCH } from "~/constants/contracts"
import type { StakeDetail } from "~/types/contractResults"
import { wagmiAdapter } from "~/wagmi"
import {formatDecimalPoint} from "~/utils/utils";

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

export const getFormattedVotingPower = (formattedAmount: string, multiplier: number): string => {
    return String(Math.floor(Number(formattedAmount) * multiplier))
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
        address: VE_PWN_TOKEN[getChainIdTypesafe()],
        abi: VE_PWN_TOKEN_ABI,
        functionName: 'getStakes',
        args: [stakeIds],
    })
}

export const getSecondsTillNextEpoch = (initialEpochTimestamp: number): number => {
    const currentTimestamp = Math.floor(Date.now() / 1000)
    // Calculate which epoch we're currently in
    const currentEpochNumber = Math.floor((currentTimestamp - initialEpochTimestamp) / SECONDS_IN_EPOCH) + 1;
    // Calculate the timestamp of the next epoch
    const nextEpochTimestamp = initialEpochTimestamp + (currentEpochNumber * SECONDS_IN_EPOCH);
    // Calculate time remaining until next epoch
    return nextEpochTimestamp - currentTimestamp;
  }


export const getTimeTillNextEpochStringified = (initialEpochTimestamp: number): string => {
    return formatSeconds(getSecondsTillNextEpoch(initialEpochTimestamp))
}

export const getStartDateOfEpoch = (initialEpochTimestamp: number, epochNumber: number): Date => {
    epochNumber = epochNumber - 1 // epoch starts on 1
    return new Date((initialEpochTimestamp + (epochNumber * SECONDS_IN_EPOCH)) * 1000)
}

export const getStartDateOfEpochFormatted = (initialEpochTimestamp: number, epochNumber: number): string => {
    const date = getStartDateOfEpoch(initialEpochTimestamp, epochNumber)
    const dateFormatter = new Intl.DateTimeFormat(navigator.language ?? 'en-US')
    return dateFormatter.format(date)
}
