<template>
    <ClientOnly>
        <div class="default-layout">
            <Header />
            <div class="default-layout__page-content">
                    <div v-if="!isConnected" class="default-layout__connect-wallet-wrapper">
                        <h2 class="default-layout__connect-wallet-text">Connect your wallet to manage your PWN Stake</h2>
                        <div class="default-layout__connect-wallet-btn" @click="openAppKitModal">Connect Wallet</div>
                    </div>
                    <slot v-else />
            </div>
        </div>
    </ClientOnly>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { openAppKitModal } from '@/utils/web3'

const { isConnected } = useAccount()
</script>

<style scoped>
.default-layout {
    &__page-content {
        margin: 0.5rem 0.5rem 0 0.5rem;
    }

    &__connect-wallet-wrapper {
        padding: 2.5rem 1rem;
        display: grid;
        row-gap: 2.5rem;
        justify-content: center;
    }

    &__connect-wallet-text {
        font-weight: 400;
        font-family: var(--font-family-supreme);
        font-size: 1.5rem;
    }

    &__connect-wallet-btn {
        padding: 0.625rem 1rem;
        background-color: var(--primary-color-darker);
        color: var(--primary-color);
        width: 346px;
        text-align: center;
        font-family: var(--font-family-screener);
        justify-self: center;
        height: 3rem;
        align-content: center;
        transition: all 0.2s;

        &:hover {
            cursor: pointer;
            background-color: var(--primary-color-2);
        }
    }
}

h2 {
    margin: 0;
}
</style>
