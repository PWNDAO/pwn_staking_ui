<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <VueQueryDevtools
      button-position="bottom-right"
      position="right"/>
</template>

<script lang="ts" setup>
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
useSeoMeta({
  title: 'PWN DAO Staking',
  ogTitle: 'PWN DAO Staking',
  twitterTitle: 'PWN DAO Staking',
  twitterImage: 'https://pwn.xyz/pwn-og.jpg',
  ogImage: 'https://pwn.xyz/pwn-og.jpg',
  twitterCard: 'summary_large_image',
  twitterCreator: '@pwndao',
  twitterSite: '@pwndao',
  description: 'Easily check and manage your PWN DAO staking and voting positions.',
  ogDescription: 'Easily check and manage your PWN DAO staking and voting positions.',
  twitterDescription: 'Easily check and manage your PWN DAO staking and voting positions.',
  // TODO what different meta tags to define?
  colorScheme: 'dark',
  author: 'PWN DAO',
  // TODO any other tags to define?
})

// TODO also define useSchemaOrg?
</script>

<style>

</style>
