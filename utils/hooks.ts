import { useQuery } from "@tanstack/vue-query";
import { useReadContract } from "@wagmi/vue";
import { erc20Abi, formatUnits, parseAbiItem, type Address } from "viem";
import { getLogs } from "viem/actions";
import { getClient, readContract, readContracts } from "wagmi/actions";
import { EPOCH_CLOCK_ABI, VE_PWN_TOKEN_ABI } from "~/constants/abis";
import { EPOCH_CLOCK, PWN_TOKEN, STAKED_PWN_NFT, VE_PWN_TOKEN } from "~/constants/addresses";
import { ACTIVE_CHAIN, wagmiAdapter } from "~/wagmi";

export const useUserPwnBalance = (walletAddress: Ref<Address | undefined>) => {
    return useReadContract({
        abi: erc20Abi,
        address: PWN_TOKEN[ACTIVE_CHAIN],
        functionName: 'balanceOf',
        args: [walletAddress as Ref<Address>],
        query: {
            enabled: computed(() => walletAddress.value !== undefined)
        }
    })
}

// https://github.com/PWNDAO/pwn_dao/blob/main/src/token/vePWN/VoteEscrowedPWNStorage.sol#L36
export interface StakeDetail {
    id: bigint
    initialEpoch: number
    lockUpEpochs: number
    amount: bigint
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

export const useUserStakes = (walletAddress: Ref<Address | undefined>) => {
    return useQuery({
        // TODO remove throwOnError: true or keep it?
        throwOnError: true,
        queryKey: ['stakedPwnBalance', walletAddress],
        queryFn: async (): Promise<StakeDetail[]> => {
            const client = getClient(wagmiAdapter.wagmiConfig)
            console.log(walletAddress.value)
            const receivedStPwnNfts = await getLogs(client!, {
                address: STAKED_PWN_NFT[ACTIVE_CHAIN],
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                args: {
                    to: walletAddress.value!
                },
                fromBlock: 0n,
            })

            console.log('receivedStPwnNfts')
            console.log(receivedStPwnNfts)

            // TODO fetch also these events, or rather just call `owner` on each of the NFT received in `receivedStPwnNfts`
            const sentStPwnNfts = await getLogs(client!, {
                address: STAKED_PWN_NFT[ACTIVE_CHAIN],
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                args: {
                    from: walletAddress.value!
                },
                fromBlock: 0n,
            })
            const sentStPwnNftsIds = sentStPwnNfts.map(sentStPwnNft => sentStPwnNft.args.tokenId)

            const ownedStPwnNfts = []
            for (const receivedStPwnNft of receivedStPwnNfts) {
                if (!sentStPwnNftsIds.includes(receivedStPwnNft.args.tokenId)) {
                    ownedStPwnNfts.push(receivedStPwnNft)
                }
            }

            return await getStakesDetails(ownedStPwnNfts.map(ownedStPwnNft => ownedStPwnNft.args.tokenId!))
        },
    })
}

export const useCurrentEpoch = () => {
    return useReadContract({
        address: EPOCH_CLOCK[ACTIVE_CHAIN]!,
        abi: EPOCH_CLOCK_ABI,
        functionName: 'currentEpoch'
    })
}

// TODO make this persist/cache forever as this won't change - here we should make sure it's persisted for each chain separately (sepolia/ethereum?
export const useInitialEpochTimestamp = () => {
    return useReadContract({
        address: EPOCH_CLOCK[ACTIVE_CHAIN]!,
        abi: EPOCH_CLOCK_ABI,
        functionName: 'INITIAL_EPOCH_TIMESTAMP'
    })
}

export const useUserVotingPower = (walletAddress: Ref<Address | undefined>, currentEpoch: Ref<bigint | undefined>) => {
    return useReadContract({
        address: VE_PWN_TOKEN[ACTIVE_CHAIN]!,
        abi: VE_PWN_TOKEN_ABI,
        functionName: 'stakerPowerAt',
        args: [walletAddress as Ref<Address>, currentEpoch as Ref<bigint>],
        query: {
            enabled: computed(() => walletAddress.value !== undefined && currentEpoch.value !== undefined)
        },
    })
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

export const useUserVotingMultiplier = (walletAddress: Ref<Address | undefined>, currentEpoch: Ref<bigint | undefined>) => {
    return useQuery({
        enabled: computed(() => walletAddress.value !== undefined && currentEpoch.value !== undefined),
        queryKey: ['votingMultiplier', walletAddress], // TODO add currentEpoch to queryKey?
        queryFn: async () => {
            const stakeIdsWhereBeneficiary = await readContract(wagmiAdapter.wagmiConfig, {
                abi: VE_PWN_TOKEN_ABI,
                address: VE_PWN_TOKEN[ACTIVE_CHAIN]!,
                functionName: 'beneficiaryOfStakesAt',
                args: [walletAddress.value!, Number(currentEpoch.value)!]
            })

            console.log(walletAddress.value)
            console.log(currentEpoch.value)
            console.log('stakeIdsWhereBeneficiary')
            console.log(stakeIdsWhereBeneficiary)

            const stakesDetails = await getStakesDetails(stakeIdsWhereBeneficiary)

            console.log('stakesDetails')
            console.log(stakesDetails)

            // calculating weight average
            let numerator = 0
            let denominator = 0

            for (const stakeDetail of stakesDetails) {
                const epochWhereUnlock = stakeDetail.initialEpoch + stakeDetail.lockUpEpochs
                const remainingEpochs = epochWhereUnlock - Number(currentEpoch.value)
                console.log(remainingEpochs)
                const multiplier = getMultiplierForLockUpEpochs(remainingEpochs)
                const formattedAmount = Number(formatUnits(stakeDetail.amount, 18))
                if (multiplier > 0) {
                    denominator += formattedAmount
                    numerator += formattedAmount * multiplier
                }
            }

            console.log(numerator)
            console.log(denominator)

            return numerator / denominator
        }
    })
}

export const useUserCumulativeVotingPowerSummary = (walletAddress: Ref<Address | undefined>) => {
    return useQuery({
        queryKey: ['cumulativeVotingPower', walletAddress],
        enabled: computed(() => walletAddress.value !== undefined),
        queryFn: async () => {
            // TODO
        }
    })
}
