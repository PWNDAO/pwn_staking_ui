import { useQuery } from "@tanstack/vue-query";
import {erc20Abi, parseAbiItem, type Address, parseEventLogs} from "viem";
import { getLogs } from "viem/actions";
import { getClient, readContract } from "@wagmi/vue/actions";
import { EPOCH_CLOCK_ABI, VE_PWN_TOKEN_ABI } from "~/constants/abis";
import { EPOCH_CLOCK, PWN_TOKEN, PWN_VESTING_MANAGER, STAKED_PWN_NFT, VE_PWN_TOKEN } from "~/constants/addresses";
import { getChainIdTypesafe, type SupportedChain } from "~/constants/chain";
import type { PowerInEpoch, StakeDetail, VestingDetail } from "~/types/contractResults";
import { wagmiAdapter } from "~/wagmi";

export const useUserPwnBalance = (walletAddress: Ref<Address | undefined>, chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['useUserPwnBalance', walletAddress, chainId],
        enabled: computed(() => !!walletAddress.value),
        queryFn: async () => {
            return await readContract(wagmiAdapter.wagmiConfig, {
                abi: erc20Abi,
                address: PWN_TOKEN[chainId.value],
                functionName: 'balanceOf',
                args: [walletAddress.value!],
            })
        }
    })
}

export function useAllBeneficiaries(stakeIds: bigint[], chainId: Ref<SupportedChain>) {
    return useQuery({
        queryKey: ['allBeneficiaries', stakeIds],
        queryFn: async () => {
            const client = getClient(wagmiAdapter.wagmiConfig)
            const logs = await getLogs(client!, {
                address: VE_PWN_TOKEN[chainId.value],
                event: parseAbiItem('event StakePowerDelegated(uint256 indexed stakeId, address indexed originalBeneficiary, address indexed newBeneficiary)'),
                fromBlock: 0n,
            })

            // Create a map of stakeId to latest beneficiary
            const beneficiaryMap = new Map<bigint, string>()

            for (const log of logs) {
                if (stakeIds.includes(log.args.stakeId!)) {
                    beneficiaryMap.set(log.args.stakeId!, log.args.newBeneficiary || '')
                }
            }

            return beneficiaryMap
        },
        enabled: stakeIds.length > 0
    })
}

export const useUserStakes = (walletAddress: Ref<Address | undefined>, chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['stakedPwnBalance', walletAddress, chainId],
        queryFn: async (): Promise<Readonly<StakeDetail[]>> => {
            const client = getClient(wagmiAdapter.wagmiConfig)
            const receivedStPwnNfts = await getLogs(client!, {
                address: STAKED_PWN_NFT[chainId.value],
                event: parseAbiItem('event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)'),
                args: {
                    to: walletAddress.value!
                },
                fromBlock: 0n,
            })

            const sentStPwnNfts = await getLogs(client!, {
                address: STAKED_PWN_NFT[chainId.value],
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

export const useCurrentEpoch = (chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['getCurrentEpoch', chainId],
        queryFn: async () => {
            return await readContract(wagmiAdapter.wagmiConfig, {
                address: EPOCH_CLOCK[chainId.value],
                abi: EPOCH_CLOCK_ABI,
                functionName: 'currentEpoch'
            })
        }
    })
}

const _manuallySetEpoch = ref<number | undefined>(0)
export const useManuallySetEpoch = (chainId: Ref<SupportedChain>) => {
    const currentEpoch = useCurrentEpoch(chainId)

    watch(() => currentEpoch.data.value, (newCurrentEpoch, oldCurrentEpoch) => {
        if (newCurrentEpoch !== undefined) {
            _manuallySetEpoch.value = Number(newCurrentEpoch)
        }
    }, { immediate: true })

    return {
        epoch: _manuallySetEpoch,
        setEpoch(newEpoch: number | string) {
            _manuallySetEpoch.value = Number(newEpoch)
        }
    }
}

// TODO make this persist/cache forever as this won't change - here we should make sure it's persisted for each chain separately (sepolia/ethereum?
export const useInitialEpochTimestamp = (chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['useInitialEpochTimestamp', chainId],
        queryFn: async () => {
            return await readContract(wagmiAdapter.wagmiConfig, {
                address: EPOCH_CLOCK[chainId.value],
                abi: EPOCH_CLOCK_ABI,
                functionName: 'INITIAL_EPOCH_TIMESTAMP',
            })
        }
    })
}

export const useUserVotingPower = (walletAddress: Ref<Address | undefined>, currentEpoch: Ref<bigint | undefined>, chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['useUserVotingPower', walletAddress, currentEpoch, chainId],
        enabled: computed(() => walletAddress.value !== undefined && currentEpoch.value !== undefined),
        queryFn: async () => {
            return await readContract(wagmiAdapter.wagmiConfig, {
                address: VE_PWN_TOKEN[chainId.value],
                abi: VE_PWN_TOKEN_ABI,
                functionName: 'stakerPowerAt',
                args: [walletAddress.value!, currentEpoch.value!],
            })
        }
    })
}

export const useUserStakesWithVotingPower = (walletAddress: Ref<Address | undefined>, currentEpoch: Ref<number | undefined>, chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['userStakesWithVotingPower', walletAddress, currentEpoch, chainId],
        enabled: computed(() => walletAddress.value !== undefined && currentEpoch.value !== undefined),
        queryFn: async (): Promise<Readonly<StakeDetail[]>> => {
            const stakeIdsWhereBeneficiary = await readContract(wagmiAdapter.wagmiConfig, {
                abi: VE_PWN_TOKEN_ABI,
                address: VE_PWN_TOKEN[chainId.value],
                functionName: 'beneficiaryOfStakesAt',
                args: [walletAddress.value!, Number(currentEpoch.value)!]
            })

            return await getStakesDetails(stakeIdsWhereBeneficiary)
        }
    })
}

export const useUserCumulativeVotingPowerSummary = (walletAddress: Ref<Address | undefined>, epochs: Ref<bigint[] | undefined>, chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['cumulativeVotingPower', walletAddress, epochs, chainId],
        enabled: computed(() => !!walletAddress.value && !!epochs.value?.length),
        queryFn: async (): Promise<PowerInEpoch[]> => {
            const stakerPowers = await readContract(wagmiAdapter.wagmiConfig, {
                address: VE_PWN_TOKEN[chainId.value],
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

export const useUserVestedTokens = (walletAddress: Ref<Address | undefined>, chainId: Ref<SupportedChain>) => {
    return useQuery({
        queryKey: ['useUserVestedTokens', walletAddress, chainId],
        enabled: computed(() => !!walletAddress.value && PWN_VESTING_MANAGER?.[chainId.value as 1] !== undefined),
        queryFn: async (): Promise<VestingDetail[]> => {
            const client = getClient(wagmiAdapter.wagmiConfig)
            const createdVestings = await getLogs(client!, {
                address: PWN_VESTING_MANAGER[chainId.value as 1],
                event: parseAbiItem('event VestingCreated(address indexed owner, uint256 indexed amount, uint256 indexed unlockEpoch, uint256 initialEpoch)'),
                args: {
                    owner: walletAddress.value!
                },
                fromBlock: 0n,
            })

            const deletedVestings = await getLogs(client!, {
                address: PWN_VESTING_MANAGER[chainId.value as 1],
                event: parseAbiItem('event VestingDeleted(address indexed owner, uint256 indexed amount, uint256 indexed unlockEpoch)'),
                args: {
                    owner: walletAddress.value!
                },
                fromBlock: 0n,
            })

            const noLongerActiveVestings = deletedVestings.map(deletedVesting => {
                return { amount: deletedVesting.args.amount!, unlockEpoch: deletedVesting.args.unlockEpoch! }
            })

            const activeVestings: VestingDetail[] = []
            for (const createdVesting of createdVestings) {
                if (noLongerActiveVestings.every(inactiveVesting => inactiveVesting.unlockEpoch !== createdVesting.args.unlockEpoch)) {
                    activeVestings.push({
                        owner: createdVesting.args.owner!,
                        amount: createdVesting.args.amount!,
                        unlockEpoch: Number(createdVesting.args.unlockEpoch),
                        initialEpoch: Number(createdVesting.args.initialEpoch)
                    })
                }
            }
            return activeVestings
        }
    })
}
