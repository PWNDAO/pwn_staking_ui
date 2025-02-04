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

    return {
        isConnectedContractWallet,
    }
})
