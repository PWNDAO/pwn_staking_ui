import { useAccount, useReadContract } from "@wagmi/vue";
import { parseAbi } from "viem";
import { computed } from "vue";

export const useConnectedAccountTypeStore = defineStore(
  "connectedAccountType",
  () => {
    const {
      address: userAddress,
      chainId: connectedChainId,
      isConnected,
    } = useAccount();

    const { data: safeOwners, isError: isSafeReadError } = useReadContract({
      address: userAddress,
      chainId: connectedChainId,
      abi: parseAbi([
        "function getThreshold() external view returns (uint256)",
      ]),
      functionName: "getThreshold",
      query: {
        enabled: isConnected,
        staleTime: Infinity,
        retry: 1,
      },
    });

    const isConnectedContractWallet = computed(() => {
      return !isSafeReadError.value && safeOwners.value && safeOwners.value > 1;
    });

    return {
      isConnectedContractWallet,
    };
  },
);
