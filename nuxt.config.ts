import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ["@wagmi/vue/nuxt", "nuxt-svgo", "@pinia/nuxt", "@nuxt/eslint"],
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      link: [{ rel: "icon", href: "favicon.ico" }],
    },
  },
  css: [
    "~/assets/css/_variables.css",
    "~/assets/css/base.css",
    "~/assets/css/fonts.css",
    "~/assets/css/normalize.css",
    "tippy.js/animations/shift-away.css",
    "tippy.js/dist/svg-arrow.css",
    // TODO do we also need to import vue-skeletor
  ],
  compatibilityDate: "2024-10-02",
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  // show ts errors in dev server
  typescript: {
    typeCheck: true,
    strict: true,
  },
  postcss: {
    plugins: {
      "postcss-nested": {},
    },
  },
  eslint: {
    checker: true,
  },
});
