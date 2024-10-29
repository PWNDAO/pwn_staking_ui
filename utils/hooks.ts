import { useQuery } from "@tanstack/vue-query";
import { useReadContract } from "@wagmi/vue";
import { erc20Abi, parseAbiItem, type Address } from "viem";
import { getLogs } from "viem/actions";
import { getClient, readContract, readContracts } from "wagmi/actions";
import { EPOCH_CLOCK_ABI, VE_PWN_TOKEN_ABI } from "~/constants/abis";
import { EPOCH_CLOCK, PWN_TOKEN, STAKED_PWN_NFT, VE_PWN_TOKEN } from "~/constants/addresses";
import type { PowerInEpoch, StakeDetail } from "~/types/contractResults";
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

export const useUserStakes = (walletAddress: Ref<Address | undefined>) => {
    return useQuery({
        // TODO remove throwOnError: true or keep it?
        throwOnError: true,
        queryKey: ['stakedPwnBalance', walletAddress],
        queryFn: async (): Promise<Readonly<StakeDetail[]>> => {
            const client = getClient(wagmiAdapter.wagmiConfig)
            const receivedStPwnNfts = await getLogs(client!, {
                address: STAKED_PWN_NFT[ACTIVE_CHAIN],
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                args: {
                    to: walletAddress.value!
                },
                fromBlock: 0n,
            })

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

const _manuallySetEpoch = ref<number | undefined>(0)
export const useManuallySetEpoch = () => {
    const currentEpoch = useCurrentEpoch()

    if (_manuallySetEpoch.value === 0) {
        const unwatch = watch(() => currentEpoch.data.value, (newCurrentEpoch, oldCurrentEpoch) => {
            if (newCurrentEpoch !== undefined) {
                _manuallySetEpoch.value = Number(newCurrentEpoch)
                unwatch()
            }
        }, { immediate: true })
    }

    return {
        epoch: _manuallySetEpoch,
        setEpoch(newEpoch: number | string) {
            _manuallySetEpoch.value = Number(newEpoch)
        }
    }
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

export const useUserStakesWithVotingPower = (walletAddress: Ref<Address | undefined>, currentEpoch: Ref<number | undefined>) => {
    return useQuery({
        queryKey: ['userStakesWithVotingPower', walletAddress, currentEpoch],
        enabled: computed(() => walletAddress.value !== undefined && currentEpoch.value !== undefined),
        queryFn: async (): Promise<Readonly<StakeDetail[]>> => {
            const stakeIdsWhereBeneficiary = await readContract(wagmiAdapter.wagmiConfig, {
                abi: VE_PWN_TOKEN_ABI,
                address: VE_PWN_TOKEN[ACTIVE_CHAIN]!,
                functionName: 'beneficiaryOfStakesAt',
                args: [walletAddress.value!, Number(currentEpoch.value)!]
            })

            return await getStakesDetails(stakeIdsWhereBeneficiary)
        }
    })
}

export const useUserCumulativeVotingPowerSummary = (walletAddress: Ref<Address | undefined>, epochs: Ref<bigint[] | undefined>) => {
    return useQuery({
        queryKey: ['cumulativeVotingPower', walletAddress, epochs],
        enabled: computed(() => !!walletAddress.value && !!epochs.value?.length),
        queryFn: async (): Promise<PowerInEpoch[]> => {
            const stakerPowers = await readContract(wagmiAdapter.wagmiConfig, {
                address: VE_PWN_TOKEN[ACTIVE_CHAIN]!,
                abi: VE_PWN_TOKEN_ABI,
                functionName: 'stakerPowers',
                args: [unref(walletAddress)!, unref(epochs)!]
            })
            const parsedStakerPowers = stakerPowers.map((power, index) => ({
                epoch: epochs.value![index],
                power,
            }))

            const strippedParsedStakerPowers = parsedStakerPowers.filter((stakerPower, index) => {
                // Keep the number if it's not zero
                if (stakerPower.power !== 0n) return true;
                
                // If it's zero, check if there's a non-zero number ahead
                return parsedStakerPowers.slice(index + 1).some(_stakerPower => _stakerPower.power !== 0n);
            });

            const lastEpochWithPower = strippedParsedStakerPowers[strippedParsedStakerPowers.length - 1]
            // add 2 epochs with 0 power at the end results
            strippedParsedStakerPowers.push({ epoch: lastEpochWithPower.epoch + 1n, power: 0n })
            strippedParsedStakerPowers.push({ epoch: lastEpochWithPower.epoch + 2n, power: 0n })
            return strippedParsedStakerPowers
        }
    })
}
