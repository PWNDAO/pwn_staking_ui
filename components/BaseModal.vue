<template>
  <slot name="trigger"/>
  <teleport to="body">
    <Transition
        type="transition"
        name="modal-show">
      <aside
          v-if="isOpenLocal"
          :class="['modal', {'modal--blur-backdrop': hasBlurBackdrop}]"
          :style="wrapperDynamicStyles"
          @mousedown="close">
        <div
            :class="['modal__content', `modal__content--size-large`, `${props.className}`]"
            :style="contentCustomStyles">
          <slot name="customHeader">
            <header>
              <div class="modal__heading-container">
                <h2
                    :class="['modal__heading', `modal__heading--align-${props.headingAlign}`]"
                    :style="props.customHeadingStyles">
                  <div>
                    <component
                        :is="props.headingIcon"
                        v-if="props.headingIcon"
                        :class="['modal__heading-icon']"
                        alt="modal heading icon"/>
                  </div>
                  {{ props.heading }}
                </h2>
                <svg
                    v-if="props.isClosable"
                    :class="['modal__close']"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    @click.stop="close">
                  <line
                      x1="2.06066"
                      y1="1.93934"
                      x2="23.2739"
                      y2="23.1525"
                      stroke="currentColor"
                      stroke-width="3"
                      @click.stop="close"/>
                  <line
                      x1="1.93934"
                      y1="23.1542"
                      x2="23.1525"
                      y2="1.94098"
                      stroke="currentColor"
                      stroke-width="3"
                      @click.stop="close"/>
                </svg>
              </div>
              <div class="modal__subheading-container">
                <slot name="subheading"/>
              </div>
            </header>
          </slot>
          <section class="modal__body">
            <slot name="body"/>
          </section>
        </div>
      </aside>
    </Transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Component, StyleValue } from 'vue'
import { useMagicKeys } from '@vueuse/core'

interface Props {
  isOpen: boolean;
  heading?: string;
  isClosable?: boolean;
  headingIcon?: Component
  headingAlign?: 'center' | 'left'
  customZIndex?: number;
  customMaxWidth?: string;
  customPadding?: string;
  customHeadingStyles?: StyleValue
  hasBlurBackdrop?: boolean;
  className?: string
}
const props = withDefaults(defineProps<Props>(), {
  isClosable: true,
  headingAlign: 'center',
  customHeadingStyles: () => ({}),
})

const emit = defineEmits<{(e: 'update:isOpen', isOpen: boolean), (e: 'is-closed', isOpen: boolean) }>()

defineSlots<{
  // slots return "any" atm as described in official docs
  trigger(): unknown;
  customHeader(): unknown;
  subheading(): unknown;
  body(): unknown;
}>()

const wrapperDynamicStyles = computed(() => {
  return {
    ...(props.customZIndex && { zIndex: props.customZIndex }),
  }
})

const contentCustomStyles = computed(() => {
  return {
    ...(props.customMaxWidth && { maxWidth: props.customMaxWidth }),
    ...(props.customPadding && { padding: props.customPadding }),
  }
})

const isOpenLocal = computed({
  get: (): boolean => props.isOpen,
  set: (value: boolean): void => emit('update:isOpen', value),
})

const isClickedOutside = (event): boolean => event.target !== event.currentTarget

const close = (event: MouseEvent): void => {
  if (!props.isClosable) return
  if (isClickedOutside(event)) return
  isOpenLocal.value = false
  emit('is-closed', true)
}
const { escape } = useMagicKeys()

watch(escape, (v) => {
  if (v) {
    isOpenLocal.value = false
  }
})

watch(isOpenLocal, () => {
  if (isOpenLocal.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
})
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;

  isolation: isolate;
  z-index: var(--z-index-modal);

  display: grid;
  place-items: center;

  background: var(--background-color-half-transparent);

  &:hover {
    cursor: pointer;
  }

  &--blur-backdrop {
    backdrop-filter: blur(2px);
  }

  &__body {
    display: flex;
    flex-flow: column nowrap;
    gap: 1.5rem;
    align-items: flex-start;
  }

  &__content {
    max-height: 100%;
    overflow: auto;
    position: relative;

    background: var(--background-color);
    border: 1px solid #434343;

    display: flex;
    flex-flow: column nowrap;
    gap: 1.5rem;

    padding: 1.5rem;

    @media only screen and (--mobile-viewport) {
      padding: 1.5rem 0.5rem;
    }

    &:hover {
      cursor: default;
    }

    &--variant {
      &-error {
        border: 1px solid #434343;
      }
    }
  }

  &__heading-container {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
  }

  &__heading {
    font-family: var(--font-family-screener);
    display: flex;

    font-size: 1.5rem;
    font-weight: 400;

    &--align {
      &-center {
        grid-column-start: 2;
      }

      &-left {
        /* allow the heading text to take full width */
        grid-column: 1 / 4;
        justify-self: start;
      }
    }

    &--variant {
      &-error {
        color: var(--negative-1);
      }
    }
  }

  &__heading-icon {
    width: 2rem;

    &--large {
      width: 6rem;
    }

    &--medium {
      width: 1.125rem;
      height: 1.125rem;
    }
  }

  &__close {
    grid-column: 4;
    justify-self: end;
    margin-left: 0.75rem;
    color: var(--text-color);

    &:hover {
      cursor: pointer;
    }

    &--variant {
      &-error {
        color: var(--negative-1);
      }
    }
  }

  @media only screen and (--small-viewport) {
    &__content {
      &--size {
        &-medium {
          width: calc(100% * var(--modal-size-medium-mobile));
          max-width: calc(var(--app-max-width) * var(--modal-size-medium-mobile));
        }

        &-small {
          width: 100%;
          max-width: fit-content;
        }

        &-large {
          width: calc(100% * var(--modal-size-small-mobile));
          max-width: calc(var(--app-max-width) * var(--modal-size-large-mobile));
        }
      }
    }

    &__heading {
      line-height: 1rem;
    }

    &__close {
      width: 1rem;
      height: 1rem;
    }
  }
}

.modal-show {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
  }
}

</style>

<style>
.nouns-subdomain .modal__content {
  background-blend-mode: exclusion;
}
</style>
