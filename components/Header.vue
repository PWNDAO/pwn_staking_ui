<template>
  <header class="header">
    <div class="header__logo-and-menu-items">
      <div class="header__logo">
        <img src="/images/pwn-dao.svg" alt="PWN DAO" width="72" height="40" />
      </div>

      <!-- Desktop menu -->
      <nav class="header__menu-items-desktop-wrapper">
        <template v-for="(item, index) in menuItems" :key="index">
          <div
            v-if="!item.isExternal"
            :class="['header__menu-item', {'header__menu-item--active': item.isActive}]"
          >
            {{ item.label }}
          </div>

          <a
            v-else
            :href="item.link"
            target="_blank"
            class="header__menu-item"
          >
            {{ item.label }}
            <svg
              width="10"
              class="header__external-link-icon"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 7.125V15H1V1H8.875" strokeLinejoin="bevel" />
              <path d="M5 11L15 1M15 1V4.33333M15 1H11.6667" strokeLinejoin="bevel" />
            </svg>
          </a>
        </template>
      </nav>

      <!-- Mobile menu -->
      <nav
        ref="menuContainer"
        :class="[
          'header__mobile-nav-menu-content',
          { 'header__mobile-nav-menu-content--active': menuIsOpen }
        ]"
      >
        <template v-for="(item, index) in menuItems" :key="index">
          <div
            v-if="!item.isExternal"
            :class="['header__menu-item', {'header__menu-item--active': item.isActive}]"
          >
            {{ item.label }}
          </div>

          <a
            v-else
            :href="item.link"
            target="_blank"
            class="header__menu-item"
          >
            {{ item.label }}
            <svg
              width="10"
              class="header__external-link-icon"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 7.125V15H1V1H8.875" strokeLinejoin="bevel" />
              <path d="M5 11L15 1M15 1V4.33333M15 1H11.6667" strokeLinejoin="bevel" />
            </svg>
          </a>
        </template>
      </nav>
    </div>

    <div class="header__connect-wallet-and-mobile-nav">
      <div
        class="header__connect-wallet"
        @click="handleWalletClick"
        @mouseenter="isHoveredOverWallet = true"
        @mouseleave="isHoveredOverWallet = false"
      >
        <SvgoWalletIcon alt="Wallet" width="20" height="20" class="header__wallet-icon" />
        <span class="header__connect-wallet-text">{{ walletText }}</span>
      </div>

      <ExpandMenuButton
        ref="expandMenuButton"
        class="header__mobile-nav-menu"
        :menu-is-open="menuIsOpen"
        :handle-open-menu="handleOpenMenu"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue'
import { disconnect } from 'wagmi/actions'
import { wagmiAdapter } from '~/wagmi'
import { onClickOutside } from '@vueuse/core'

const { isConnected, address } = useAccount()

const isHoveredOverWallet = ref(false)
const menuIsOpen = ref(false)
const menuContainer = ref()
const expandMenuButton = ref()

const handleOpenMenu = () => {
  menuIsOpen.value = !menuIsOpen.value
}

const closeMenu = () => {
  menuIsOpen.value = false
}

onClickOutside(menuContainer, (event) => {
  if (expandMenuButton.value?.$el?.contains(event.target)) {
    return
  }
  closeMenu()
})

const menuItems = [
  {
    label: 'Staking',
    link: undefined,
    isActive: true,
    isExternal: false
  },
  {
    label: 'Governance',
    link: 'https://governance.pwn.xyz',
    isActive: false,
    isExternal: true
  },
  {
    label: 'App',
    link: 'https://app.pwn.xyz',
    isActive: false,
    isExternal: true
  }
]

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
  padding: 1rem 2.125rem;
  justify-content: space-between;
  font-family: var(--font-family-screener);
  align-items: center;

  &__logo-and-menu-items {
    display: flex;
    align-items: center;
  }

  &__logo {
    padding-top: 0.5rem;
    padding-right: 2.125rem;
  }

  &__menu-items-desktop-wrapper {
    display: flex;
    column-gap: 2rem;

    @media (max-width: 670px) {
      display: none;
    }
  }

  &__menu-item {
    padding: 0.625rem 0;
    text-decoration: none;
    color: var(--text-color);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    &--active {
      color: var(--primary-color);
    }

    &:hover {
      cursor: pointer;
      color: var(--primary-color);
    }
  }

  &__menu-item:hover &__external-link-icon {
    stroke: var(--primary-color);
  }

  &__connect-wallet-and-mobile-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__connect-wallet {
    border: 1px solid var(--border-color-gray);
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
    padding: 0 0.5rem 0 0;
    width: 80px;
    text-align: center;
  }

  &__wallet-icon {
    width: 20px;
  }

  &__external-link-icon {
    stroke: var(--text-color);

    &:hover {
      stroke: var(--primary-color);
    }
  }

  &__mobile-nav-menu {
    display: flex;

    @media (min-width: 670px) {
      display: none;
    }
  }

  &__mobile-nav-menu-content {
    position: absolute;
    width: 100%;
    left: 0;
    top: 60px;
    opacity: 0;
    background-color: var(--background-color);
    text-align: center;
    list-style: none;
    padding: 0 0 2rem;
    margin: 0;
    display: flex;
    flex-flow: column nowrap;
    transform: translateY(-130%);
    transition: opacity 0.3s ease-in-out, transform 0.4s ease-out;

    &--active {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style>
