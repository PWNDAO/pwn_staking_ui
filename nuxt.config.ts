import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  devtools: { enabled: true },
  modules: ['@wagmi/vue/nuxt', 'nuxt-svgo'],
  compatibilityDate: '2024-10-02',
  css: [
    '~/assets/css/_variables.css', 
    '~/assets/css/base.css', 
    '~/assets/css/fonts.css', 
    '~/assets/css/normalize.css',
    'tippy.js/animations/shift-away.css',
    'tippy.js/dist/svg-arrow.css',
    // TODO do we also need to import vue-skeletor
  ],
  postcss: {
    plugins: {
      'postcss-nested': {},
    }
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
  // show ts errors in dev server
  typescript: {
    typeCheck: true,
    strict: true,
  },
  app: {
    head: {
      link: [
        {rel: 'icon', href: 'favicon.ico'}
      ]
    }
  }
})