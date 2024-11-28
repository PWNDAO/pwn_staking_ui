<template>
  <div
    class="expand-menu-container"
    :class="{'expand-menu-container-active': menuIsOpen}"
    @click="handleOpenMenu">
    <span/>
    <span/>
    <span/>
  </div>
</template>

<script lang="ts" setup>

type Props = {
  menuIsOpen: boolean
  handleOpenMenu: () => void
}

defineProps<Props>()
</script>

<style scoped>
.expand-menu-container {
  cursor: pointer;
  width: 30px;
  height: 2rem;
  border: 1px solid var(--border-color-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 20px;
    background: var(--text-color);
    border-radius: 9px;
    opacity: 1;
    left: 5px;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: calc(30% - 2px);
    }

    &:nth-child(2) {
      top: calc(55% - 2px);
    }

    &:nth-child(3) {
      top: calc(80% - 2px);
    }
  }
}

.expand-menu-container-active,
.expand-menu-container:hover {
  border: 1px solid var(--primary-color);
}

.expand-menu-container-active span:nth-child(1) {
  transform: rotate(60deg);
  top: 0.5rem;
  width: 10px;
  left: calc(47% - 2px);
}

.expand-menu-container-active span:nth-child(2) {
  transform: rotate(-60deg);
  top: 0.5rem;
  width: 10px;
  left: calc(33% - 2px);
}

.expand-menu-container-active span:nth-child(3) {
  transform: rotate(90deg);
  top: 0.9rem;
}
</style>
