import { http } from '@wagmi/vue'
import { createAppKit } from '@reown/appkit/vue'
import { sepolia, mainnet, type AppKitNetwork } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { type SupportedChain } from './constants/chain'

const metadata = {
  name: 'PWN',
  description: 'PWN is a hub for peer-to-peer (P2P) loans backed by digital assets. Use your tokens or NFTs as collateral.',
  url: 'https://staking.pwn.xyz', // TODO align on final url
  icons: ['https://pwn.xyz/pwn-logo.png'],
}

const CHAIN_SETTINGS = {
  1: {
    chain: mainnet,
    transports: 
      http('https://eth-mainnet.alchemyapi.io/v2/', {
        // TODO what batch wait time to set? by default is batch.wait 0 (zero delay)
        batch: false,
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_ETHEREUM_NODE_TOKEN}`, // TODO set key usage restrictions once we get this near prod release
          },
        },
      })
  },
  11155111: {
    chain: sepolia,
    transports: 
      http('https://eth-sepolia.g.alchemy.com/v2/', {
        // TODO what batch wait time to set? by default is batch.wait 0 (zero delay)
        batch: false,
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SEPOLIA_NODE_TOKEN}`, // TODO set key usage restrictions once we get this near prod release
          },
        },
      })
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

createAppKit({
  adapters: [wagmiAdapter],
  networks: viemChains,
  metadata,
  projectId: import.meta.env.VITE_PUBLIC_WC_PROJECT_ID!,
  defaultNetwork: CHAIN_SETTINGS[DEFAULT_ENABLED_CHAIN].chain,
})
