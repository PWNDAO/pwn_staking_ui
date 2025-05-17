import { getChainId, switchChain } from "@wagmi/vue/actions";
import { useChainId } from "@wagmi/vue";
import { wagmiAdapter } from "~/wagmi";

export const SUPPORTED_CHAINS: [1, 11155111] = [1, 11155111];
export type SupportedChain = (typeof SUPPORTED_CHAINS)[number];

export const getChainIdTypesafe = () => {
  return getChainId(wagmiAdapter.wagmiConfig) as SupportedChain;
};

export const useChainIdTypesafe = () => {
  return useChainId() as Ref<SupportedChain>;
};

export const getChainIdToToggleTo = (currentActiveChain: SupportedChain) => {
  switch (currentActiveChain) {
    case 1:
      return 11155111;
    case 11155111:
      return 1;
    default:
      throw new Error(
        `Unknown currentActiveChain value == ${currentActiveChain} in chainIdToToggleTo fn.`,
      );
  }
};

export const toggleActiveChain = (currentActiveChain: SupportedChain) => {
  switchChain(wagmiAdapter.wagmiConfig, {
    chainId: getChainIdToToggleTo(currentActiveChain),
  });
};
