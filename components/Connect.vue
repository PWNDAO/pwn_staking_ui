<script setup lang="ts">
import { openAppKitModal } from '~/utils/web3';
</script>

<template>
  <h2>Connect</h2>

  <button type="button" @click="openAppKitModal">
    Connect
  </button>
  <!--
  <button v-for="connector in connectors" :key="connector.id" type="button" @click="connect({ connector, chainId })">
    {{ connector.name }}
  </button>

  <div>
    {{ status }}
    {{ error?.message }}
  </div>
  -->
</template>
