import { VE_PWN_TOKEN_ABI } from "~/constants/abis"
import type { ExtractAbiFunction, AbiParametersToPrimitiveTypes } from 'abitype'

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
export type StakeDetail = AbiParametersToPrimitiveTypes<ExtractAbiFunction<typeof VE_PWN_TOKEN_ABI, 'getStake'>['outputs']>[number]

export interface PowerInEpoch {
    epoch: bigint
    power: bigint
}
