import { PWN_VESTING_MANAGER_ABI, VE_PWN_TOKEN_ABI } from "~/constants/abis"
import type { ExtractAbiFunction, AbiParametersToPrimitiveTypes, ExtractAbiEvent, Address } from 'abitype'

/*
{
    stakeId: bigint;
    owner: `0x${string}`;
    initialEpoch: number;
    lockUpEpochs: number;
    remainingEpochs: number;
    currentMultiplier: number;
    amount: bigint;
}
 */
export type StakeDetail = AbiParametersToPrimitiveTypes<ExtractAbiFunction<typeof VE_PWN_TOKEN_ABI, 'getStakes'>['outputs']>[number][number]

export type VestingDetail = {
    owner: Address
    amount: bigint
    unlockEpoch: number
    initialEpoch: number
}

export interface PowerInEpoch {
    epoch: bigint
    power: bigint
}
