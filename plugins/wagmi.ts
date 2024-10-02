import { VueQueryPlugin } from '@tanstack/vue-query'
import { cookieStorage, cookieToInitialState, WagmiPlugin } from '@wagmi/vue'
import { defineNuxtPlugin } from 'nuxt/app'

import { wagmiAdapter } from '../wagmi'

// TODO: Move to @wagmi/vue/nuxt nitro plugin
export default defineNuxtPlugin((nuxtApp) => {
  // TODO is this intialState needed? and does it even work correctly?
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiAdapter.wagmiConfig, reconnectOnMount: true, initialState: cookieToInitialState(wagmiAdapter.wagmiConfig, cookieStorage.getItem('cookie')) }).use(VueQueryPlugin, {})
})
