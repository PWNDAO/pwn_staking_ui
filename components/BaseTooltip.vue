<template>
    <tippy
      ref="tooltipRef"
      v-bind="tippyProps">
      <template #default>
        <slot name="trigger"/>
      </template>
      <template #content>
        <div
          class="base-tooltip__content-wrapper"
          :style="`text-align: ${props.textAlign}`"
          @click.stop>
          <slot>
            {{ tooltipText }}
          </slot>
        </div>
      </template>
    </tippy>
  </template>
  
  <script lang="ts">
  // eslint-disable-next-line import/no-duplicates
  import type { Placement } from '@popperjs/core'
  const CUSTOM_PLACEMENTS = ['center-start'] as const
  export type CustomTooltipPlacement = typeof CUSTOM_PLACEMENTS[number]
  export type TooltipPlacement = Placement | CustomTooltipPlacement
  
  // todo 'arrow' prop?
  // todo try using "inertia: true" prop (and possibly adjust show duration)
  // todo any 'animation'?
  // todo 'moveTransition'?
  // todo is 'inlinePositioning' prop sometimes valuable for us?
  // todo allow setting 'offset' prop? previsouly we had set 1rem
  // todo 'trigger'/'triggerTarget' prop?
  
  // todo check if we need white-space: pre-wrap on new offer tooltip with long text when the offer has not been chosen
  // todo play around with duration vs delay
  
  export enum TooltipBorderColor {
    Teal = 'teal',
    TealLight = 'teal-light',
    Orange = 'orange',
    White = 'white',
    Red = 'red',
    Gray = 'gray',
  }
  
  export enum TooltipShadow {
    TealLight = 'teal-light'
  }
  </script>
  
  <script setup lang="ts">
  /* eslint-disable import/first */
  // eslint-disable-next-line import/no-duplicates
  import type { Options } from '@popperjs/core'
  import type { TippyComponent } from 'vue-tippy'
  import { Tippy } from 'vue-tippy'
  import { computed, ref } from 'vue'
  
  interface Props {
    placement?: TooltipPlacement
    borderColor?: TooltipBorderColor
    shadow?: TooltipShadow
    hasTooltip?: boolean
    isInteractive? : boolean
    tooltipText?: string
    removePadding?: boolean // for cases where there is need to override tooltip padding (e.g. int AssetTooltip.vue)
    appendToBody?: boolean // for z axis stacking issues, e.g. set this to true when tooltip is hidden behind some element
    offset?: [number, number]
    maxWidth?: number
    textAlign?: 'left' | 'center' | 'right'
  }
  const props = withDefaults(defineProps<Props>(), {
    placement: 'top',
    borderColor: TooltipBorderColor.Teal,
    hasTooltip: true,
    isInteractive: false,
    removePadding: false,
    appendToBody: false,
    textAlign: 'center',
  })
  defineSlots<{
    default(): any;
    trigger(): any;
  }>()
  
  const tooltipRef = ref(null)
  defineExpose({
    tooltipRef,
  })
  
  // used for styling
  const tooltipThemes = computed<string>(() => {
    const themes: string[] = ['pwn', `pwn--border-${props.borderColor}`]
    if (props.shadow) {
      themes.push(`pwn--shadow-${props.shadow}`)
    }
    if (props.removePadding) {
      themes.push('pwn--without-padding')
    }
    return themes.join(' ')
  })
  
  const isCustomTooltipPlacement = (placement: TooltipPlacement): placement is CustomTooltipPlacement => {
    return CUSTOM_PLACEMENTS.some(customPlacement => customPlacement === placement)
  }
  
  const placementComputed = computed<Placement>(() => {
    if (isCustomTooltipPlacement(props.placement)) {
      return 'top' // if the placement is set to our custom placement, we are handling the placement using offset instead
    } else {
      return props.placement
    }
  })
  
  // @ts-expect-error probably incorrect TS types in the @popperjs/core
  const extraPopperOptionsComputed = computed<Options>(() => {
    if (props.placement === 'center-start') {
      return {
        modifiers: [
          {
            name: 'offset',
            options: {
                // @ts-expect-error unknown types to import, but we should not need it
              offset: ({ reference, popper }) => [
                -reference.width / 2 + popper.width / 2,
                (-reference.height / 2) - (popper.height / 2),
              ],
            },
          },
        ],
      }
    } else {
      return {} // default
    }
  })
  
  const handleTooltipShow = (): false | void => {
    if (!props.hasTooltip) {
      // cancels displaying of tooltip when the tooltip is disabled
      return false
    }
  }
  
  const arrowIconSvg =
    '<svg width="15" height="11" viewBox="0 0 15 11" xmlns="http://www.w3.org/2000/svg">\n' +
    '<path d="M7.12036 0L0.120361 10.5779L14.1204 10.5779L7.12036 0Z" fill="#111111" />\n' +
    '<path d="M12.9013 10.575L7.12012 2.31616L1.33896 10.575L0.120117 10.575L7.12012 0L14.1201 10.575L12.9013 10.575Z"/>\n' +
    '</svg>'
  
  const tooltipArrow = computed(() => {
    if (props.placement.startsWith('center')) {
      return false
    } else {
      return arrowIconSvg
    }
  })
  
  const appendTo = computed(() => {
    // based on https://vue-tippy.netlify.app/props#appendto
    if (props.appendToBody || !props.isInteractive) {
      return () => document.body
    } else {
      return 'parent'
    }
  })
  
  const DEFAULT_VALUES = {
    ANIMATION_DURATION: [400, 400] as [number, number], // [show, hide] durations
    // todo is this maxWidth ok?
    MAX_WIDTH: 600, // in pixels
    OFFSET: [0, 10] as [number, number],
    // assigning CSS variable value of z-index to the variable, since we pass tooltip z-index to tippy in component props
    Z_INDEX: Number(window.getComputedStyle(document.documentElement).getPropertyValue('--z-index-tooltip')) || 300, // fallback in case of issues
  } as const
  
  const tippyProps = computed<TippyComponent['$props']>(() => {
    return {
      animation: 'shift-away',
      duration: props.placement.startsWith('center') ? undefined : DEFAULT_VALUES.ANIMATION_DURATION,
      appendTo: appendTo.value,
      offset: props.offset || DEFAULT_VALUES.OFFSET,
      arrow: tooltipArrow.value,
      theme: tooltipThemes.value,
      maxWidth: props.maxWidth || DEFAULT_VALUES.MAX_WIDTH,
      placement: placementComputed.value,
      popperOptions: extraPopperOptionsComputed.value,
      interactive: props.isInteractive,
      zIndex: DEFAULT_VALUES.Z_INDEX,
      onShow(instance) {
        return handleTooltipShow()
      },
    }
  })
  </script>
  
  <style scoped>
  .base-tooltip {
    &__content-wrapper {
      display: contents;
      overflow-wrap: break-word;
      white-space: pre-line;
    }
  }
  </style>
  
  <style>
  .tippy-box[data-theme~="pwn"] {
    padding: 0.75rem;
    line-height: 1.5rem; /* todo do we need these? */
  
    cursor: auto;
    user-select: text;
  
    background-color: var(--background-color);
    color: var(--text-color);
    border-width: 1px;
    border-style: solid;
  
    &:not(.tippy-box[data-theme~="pwn--without-padding"]) {
      padding: 0.75rem;
    }
  
    &.tippy-box[data-theme~="pwn--without-padding"] {
      padding: 0;
    }
  
    & > .tippy-svg-arrow {
      width: 18px;
      height: 18px;
    }
  }
  
  /* Border variants styling */
  .tippy-box[data-theme~="pwn--border-teal"] {
    border-color: var(--primary-color-darker);
  
    & > .tippy-svg-arrow:last-child {
      fill: var(--primary-color-darker);
    }
  }
  
  .tippy-box[data-theme~="pwn--border-teal-light"] {
    border-color: var(--primary-color);
  
    & > .tippy-svg-arrow:last-child {
      fill: var(--primary-color);
    }
  }
  
  .tippy-box[data-theme~="pwn--border-orange"] {
    border-color: var(--negative);
  
    & > .tippy-svg-arrow:last-child {
      fill: var(--negative);
    }
  }
  
  .tippy-box[data-theme~="pwn--border-white"] {
    border-color: var(--text-color);
  
    & > .tippy-svg-arrow:last-child {
      fill: var(--text-color);
    }
  }
  
  .tippy-box[data-theme~="pwn--border-gray"] {
    border-color: var(--border-color);
  
    & > .tippy-svg-arrow:last-child {
      fill: var(--border-color);
    }
  }
  
  .tippy-box[data-theme~="pwn--border-red"] {
    border-color: var(--danger);
  
    & > .tippy-svg-arrow:last-child {
      fill: var(--danger);
    }
  }
  
  /* Shadow variants styles */
  .tippy-box[data-theme~="pwn--shadow-teal-light"] {
    box-shadow: 0 4px 20px rgb(0 255 224 / 20%);
  }
  </style>
  