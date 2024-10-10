<template>
    <div class="header">
        <div class="header__logo">
            <img src="/images/pwn-dao.svg" alt="PWN DAO" width="72" height="40"/>
        </div>

        <div class="header__menu-items-wrapper">
            <div class="header__menu-item header__menu-item--active">Staking</div>
            <a class="header__menu-item" href="https://voting.pwn.xyz" target="_blank">Voting</a>
            <a class="header__menu-item" href="https://app.pwn.xyz" target="_blank">App</a>
        </div>

        <div class="header__connect-wallet" @click="handleWalletClick" @mouseenter="isHoveredOverWallet = true" @mouseleave="isHoveredOverWallet = false">
            <SvgoWalletIcon alt="Wallet" width="16" height="16" />
            <span class="header__connect-wallet-text">{{ walletText }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { disconnect } from 'wagmi/actions';
import { wagmiAdapter } from '~/wagmi';

const { isConnected, address } = useAccount()

const isHoveredOverWallet = ref(false)

const walletText = computed(() => {
    if (isConnected.value && address.value) {
        return isHoveredOverWallet.value ? 'Disconnect' : shortenAddress(address.value)
    }
    
    return 'Connect'
})

const handleWalletClick = async () => {
    if (isConnected.value) {
        await disconnect(wagmiAdapter.wagmiConfig)
    } else {
        await openAppKitModal()
    }
}
</script>

<style scoped>
.header {
    display: flex;
    padding: 1rem 2rem;
    justify-content: space-between;
    font-family: var(--font-family-screener);
    border-bottom: 1px solid var(--border-color);
    align-items: center;

    &__logo {
        padding-top: 0.5rem;
    }

    &__menu-items-wrapper {
        display: flex;
        column-gap: 2rem;
    }

    &__menu-item {
        padding: 0.625rem 1rem;
        text-decoration: none;
        color: var(--text-color);

        &--active {
            background-color: var(--primary-color-darker);
            color: var(--primary-color);
        }

        &:hover {
            cursor: pointer;
        }
    }

    &__connect-wallet {
        border: 1px solid var(--border-color);
        padding: 0.5rem;
        display: flex;
        column-gap: 0.625rem;
        align-items: center;
        font-size: 0.875rem;

        &:hover {
            cursor: pointer;

            color: var(--primary-color);
            border-color: var(--primary-color);
        }
    }

    &__connect-wallet-text {
        padding: 0 1rem;
    }
}
</style>
