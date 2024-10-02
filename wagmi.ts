import { http, createStorage, cookieStorage } from '@wagmi/vue'
import { createAppKit } from '@reown/appkit/vue'
import { sepolia, mainnet } from '@reown/appkit/networks'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

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
        batch: true,
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
        batch: true,
        fetchOptions: {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_PUBLIC_SEPOLIA_NODE_TOKEN}`, // TODO set key usage restrictions once we get this near prod release
          },
        },
      })
  }
} as const

const activatedChainSettings = CHAIN_SETTINGS[Number(import.meta.env.VITE_PUBLIC_ENABLED_CHAIN_ID) as 1 | 11155111]

export const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  projectId: import.meta.env.VITE_PUBLIC_WC_PROJECT_ID!,
  networks: [activatedChainSettings.chain],
  transports: {
    [activatedChainSettings.chain.id]: activatedChainSettings.transports,
  },
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [activatedChainSettings.chain],
  metadata,
  projectId: import.meta.env.VITE_PUBLIC_WC_PROJECT_ID!,
})

/*
export const config = createConfig({
  chains: [activatedChainSettings.chain],
  connectors: [
    // note: there is also `mock` connector that we might want to use for some tests in the future
    //    https://wagmi.sh/core/api/connectors/mock
    coinbaseWallet({
      appName: metadata.name,
      darkMode: true,
      chainId: activatedChainSettings.chain.id,
    }),
    // TODO what about the `unstable_shimAsyncInject` injected parameter?
    // TODO is it needed to do anything else to add EIP6963 support? previously there was EIP6963Connector from web3modal
    injected(),
    metaMask(),
    safe({
      // debug: globalConstants.environment === 'development',
      // allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /cronos-safe.org$/, /multisig.bnbchain.org/],
      // TODO what about shimDisconnect parameter that is by default off?
    }),
    walletConnect({
      showQrModal: false,
      projectId: process.env.VITE_PUBLIC_WC_PROJECT_ID!,
      // TODO what is disableProviderPing?
      metadata,
      qrModalOptions: {
        themeMode: 'dark',
      },
    }),
  ],
  multiInjectedProviderDiscovery: true, // EIP6963
  ssr: true, // TODO is this correct?
  storage: createStorage({
    storage: cookieStorage
  }),
  // @ts-expect-error TS probably wants to have both 1 & 11155111 keys here, but it's not necessary AFAIK
  transports: {
    [activatedChainSettings.chain.id]: activatedChainSettings.transports,
  },
})

declare module '@wagmi/vue' {
  interface Register {
    config: typeof config
  }
}
*/
