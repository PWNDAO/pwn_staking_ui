import { useBytecode } from '@wagmi/vue'
import { computed } from 'vue'
import { useAccount } from '@wagmi/vue';
export const useConnectedAccountTypeStore = defineStore('connectedAccountType', () => {
    const { address: userAddress, chainId: connectedChainId, isConnected } = useAccount()

    const { data: bytecodeAtUserAddress } = useBytecode({
        address: userAddress,
        chainId: connectedChainId,
        // TODO scope key?
        query: {
            enabled: isConnected,
            staleTime: Infinity,
            // TODO select parameter?
        },
    })
    const isConnectedContractWallet = computed(() => !!bytecodeAtUserAddress.value)

    /*
    const { data: connectedPwnSafe } = useQuery({
        ...queries.safe.detail(userAddress, connectedChainId),
        enabled: isConnected,
        staleTime: Infinity,
        retry: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
    const isConnectedPwnSafe = computed(() => !!connectedPwnSafe.value)
    */

    return {
        isConnectedContractWallet,
    }
})
