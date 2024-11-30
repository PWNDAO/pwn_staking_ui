import { VueQueryPlugin } from '@tanstack/vue-query'
import { cookieStorage, cookieToInitialState, serialize, WagmiPlugin } from '@wagmi/vue'
import { defineNuxtPlugin } from 'nuxt/app'

import { wagmiAdapter } from '../wagmi'

export default defineNuxtPlugin((nuxtApp) => {
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
            refetchOnWindowFocus: false,
            staleTime: 60 * 5 * 1000, // 5 minutes
            // TODO use throwOnError: true by default?
          }
        }
      }
    })
})
