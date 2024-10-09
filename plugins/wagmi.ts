import { VueQueryPlugin } from '@tanstack/vue-query'
import { cookieStorage, cookieToInitialState, serialize, WagmiPlugin } from '@wagmi/vue'
import { defineNuxtPlugin } from 'nuxt/app'

import { wagmiAdapter } from '../wagmi'

// TODO: Move to @wagmi/vue/nuxt nitro plugin
export default defineNuxtPlugin((nuxtApp) => {
  // TODO this does not work correctly as in dev mode it still throws warnings about hydration mismatch
  nuxtApp.vueApp
    .use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig, reconnectOnMount: true, initialState: cookieToInitialState(wagmiAdapter.wagmiConfig, cookieStorage.getItem('cookie')) })
    .use(VueQueryPlugin, {
      queryClientConfig: {
        defaultOptions: {
          queries: {
            queryKeyHashFn(queryKey) {
              // override the default JSON.stringify fn to allow also BigInt in the queryKey
              return serialize(queryKey)
            },
          }
        }
      }
    })
})
