import type {
  ExtractAbiFunction,
  AbiParametersToPrimitiveTypes,
  Address,
} from "abitype";
import type { VE_PWN_TOKEN_ABI } from "~/constants/abis";

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
export type StakeDetail = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<typeof VE_PWN_TOKEN_ABI, "getStakes">["outputs"]
>[number][number];

export type VestingDetail = {
  owner: Address;
  amount: bigint;
  unlockEpoch: number;
  initialEpoch: number;
};

export interface PowerInEpoch {
  epoch: bigint;
  power: bigint;
}
