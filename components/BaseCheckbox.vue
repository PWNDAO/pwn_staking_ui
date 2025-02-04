<template>
  <div
      class="checkbox"
      @click="handleClick">
    <!-- <input> is invisible, left for accessibility purposes -->
    <input
        :id="inputName"
        :value="modelValue"
        class="checkbox__hidden-input"
        type="hidden">
    <svg
        :class="svgClasses"
        width="12"
        height="9"
        viewBox="0 0 19 16"
        fill="none">
      <path
          d="M18.2572 1.31421L5.91434 13.6571L0.771484 8.51421"
          :stroke="primaryColor"
          stroke-width="2"/>
    </svg>
    <label
        :for="inputName"
        :class="labelClasses">
      {{ label }}
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import useUuid from '@/utils/useUuid'
import { useCssVar } from '@vueuse/core'

enum CheckboxVariant {
  Default = 'default',
  SmallGray = 'small-gray',
  White = 'white'
}

interface Props {
  modelValue: boolean
  inputName?: string
  label?: string
  isCheckboxAfterLabel?: boolean
  variant?: CheckboxVariant
  isDisabled?: boolean
  wrapLabelText?: boolean
  handleClick?: (e: MouseEvent) => void
}
const props = withDefaults(defineProps<Props>(), {
  inputName: useUuid().getUuid().toString(),
  label: '',
  variant: CheckboxVariant.Default,
  isDisabled: false,
  wrapLabelText: true,
})

const { label, isCheckboxAfterLabel, modelValue, variant, isDisabled } = toRefs(props)

const emit = defineEmits<{(e: 'update:modelValue', value: boolean): void}>()

const handleClick = (event: MouseEvent) => {
  if (isDisabled.value) return
  if (props.handleClick) {
    props.handleClick(event)
  } else {
    emit('update:modelValue', !modelValue.value)
  }
}

const svgClasses = computed(() => [
  'checkbox__checkmark',
  { 'checkbox__checkmark--right': isCheckboxAfterLabel.value },
  { 'checkbox__checkmark--left': !isCheckboxAfterLabel.value },
  { 'checkbox__checkmark--checked': modelValue.value },
  `checkbox__checkmark--${variant.value}`,
])
const labelClasses = computed(() => [
  'checkbox__label',
  {
    'checkbox__label--after': isCheckboxAfterLabel.value,
    'checkbox__label--before': !isCheckboxAfterLabel.value,
    'checkbox__label--nowrap': !props.wrapLabelText,
  },
  `checkbox__label--before-${variant.value}`,
])

const primaryColor = useCssVar('--primary-color')
</script>

<style scoped>
.checkbox {
  --checkbox-height: 1.125rem;
  position: relative;

  &:hover {
    cursor: pointer;
  }

  &__label {
    display: flex;
    line-height: var(--checkbox-height);
    user-select: none;
    pointer-events: auto;

    font-family: var(--font-family-supreme);
    font-size: 0.875rem;
    font-weight: 400;

    &:hover {
      cursor: pointer;
    }

    &--after::after,
    &--before::before {
      display: inline-block;
      content: "";
      width: var(--checkbox-height);
      height: var(--checkbox-height);
      background-color: var(--background-color);
      vertical-align: sub;
      transition: background-color var(--primary-transition-time);
    }

    &--after::after {
      margin-left: 0.5rem;
    }

    &--before::before {
      margin-right: 0.5rem;
    }

    &--before-default::before {
      width: 1.125rem;
      height: 1.125rem;
      border: 1px solid var(--primary-color-2);
    }

    &--before-white::before {
      width: 1.25rem;
      height: 1.25rem;
      border: 1px solid var(--white);
    }

    &--before-small-gray::before {
      width: 0.625rem;
      height: 0.625rem;
      margin: auto;
      border: 1px solid var(--grey);
    }

    &--nowrap {
      white-space: nowrap;
    }
  }

  &__checkmark {
    pointer-events: none;
    display: none;
    position: absolute;
    top: 0.25rem;

    &--checked {
      display: block;
    }

    &--left {
      left: 3px;
    }

    &--right {
      right: 3px;
    }

    &--white {
      top: 5px;
      left: 4px;
    }

    &--small-gray {
      left: 0;
    }
  }

  &__hidden-input {
    display: none;
  }

  &__loader {
    position: absolute;
    top: 3px;
    left: 3px;

    ::v-deep(.circle-loader-icon__loader--pending) {
      border-color: var(--primary-color);
      border-top-color: transparent;
    }
  }
}
</style>
