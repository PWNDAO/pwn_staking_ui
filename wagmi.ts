import { fallback, http } from '@wagmi/vue'
import { createAppKit } from '@reown/appkit/vue'
import { sepolia, mainnet, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type SupportedChain } from './constants/chain'

const metadata = {
  name: 'PWN DAO Staking',
  description: 'Easily check and manage your PWN DAO staking and voting positions.',
  url: 'https://staking.pwn.xyz',
  icons: ['https://pwn.xyz/pwn-logo.png'],
}

const CHAIN_SETTINGS = {
  1: {
    chain: mainnet,
    transports: fallback([
      // note: commenting this out now, because dRPC has a limit of 10000 block range when 
      //  using the eth_getLogs method, which would mean we would need a lot of these requests
      // ...(import.meta.env.VITE_DRPC_ETHEREUM_NODE_TOKEN ? [
      //   http(`https://lb.drpc.org/ogrpc?network=${mainnet.name.toLocaleLowerCase()}&dkey=${import.meta.env.VITE_DRPC_ETHEREUM_NODE_TOKEN}`, {
      //     batch: true,
      //   })
      // ] : []),
      http('https://eth-mainnet.g.alchemy.com/v2/', {
        // note: i've disabled the batch: true, as it was breaking the eth_getLogs calls
        // batch: true,
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_ETHEREUM_NODE_TOKEN}`,
          },
        },
      })
    ])
  },
  11155111: {
    chain: sepolia,
    transports: fallback([
      // note: commenting this out now, because dRPC has a limit of 10000 block range when 
      //  using the eth_getLogs method, which would mean we would need a lot of these requests
      // ...(import.meta.env.VITE_DRPC_SEPOLIA_NODE_TOKEN ? [
      //   http(`https://lb.drpc.org/ogrpc?network=${sepolia.name.toLocaleLowerCase()}&dkey=${import.meta.env.VITE_DRPC_SEPOLIA_NODE_TOKEN}`, {
      //     batch: true,
      //   })
      // ] : []),
      http('https://eth-sepolia.g.alchemy.com/v2/', {
        // note: i've disabled the batch: true, as it was breaking the eth_getLogs calls
        // batch: true,
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SEPOLIA_NODE_TOKEN}`,
          },
        },
      })
    ])
  }
} as const satisfies Record<SupportedChain, unknown>

const DEFAULT_ENABLED_CHAIN = Number(import.meta.env.VITE_PUBLIC_ENABLED_CHAIN_ID) as SupportedChain

const viemChains = (import.meta.env.VITE_PUBLIC_SHOW_ONLY_MAINNET === 'true' 
                    ? [CHAIN_SETTINGS[1].chain] 
                    : Object.values(CHAIN_SETTINGS).map(chainSetting => chainSetting.chain)
                  ) as unknown as [AppKitNetwork, ...AppKitNetwork[]]

export const wagmiAdapter = new WagmiAdapter({
  projectId: import.meta.env.VITE_PUBLIC_WC_PROJECT_ID!,
  networks: viemChains,
  transports: {
    1: CHAIN_SETTINGS[1].transports,
    11155111: CHAIN_SETTINGS[11155111].transports,
  } satisfies Record<SupportedChain, unknown>,
})

export type PwnWagmiConfig = typeof wagmiAdapter.wagmiConfig

createAppKit({
  adapters: [wagmiAdapter],
  networks: viemChains,
  metadata,
  projectId: import.meta.env.VITE_PUBLIC_WC_PROJECT_ID!,
  defaultNetwork: CHAIN_SETTINGS[DEFAULT_ENABLED_CHAIN].chain,
})
