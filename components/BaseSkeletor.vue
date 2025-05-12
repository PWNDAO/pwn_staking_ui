<template>
  <Skeletor :height="height" />
</template>

<script lang="ts" setup>
import { Skeletor } from "vue-skeletor";

interface Props {
  height?: string | number;
}

withDefaults(defineProps<Props>(), {
  height: "2",
});
</script>

<style scoped>
/*
  <Skeletor /> element has .vue-skeletor class + class for skeletor shape (e.g. .vue-skeletor--rect) applied.
  Because of this, we can apply our custom styling to the <Skeletor /> even with using scoped styles.
  */

.vue-skeletor {
  position: relative;
  overflow: hidden;
  max-width: 100%;
}

.vue-skeletor::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateX(-100%);
  animation: shimmer 1.5s infinite;
  content: "";
  /* stylelint-disable-next-line declaration-colon-newline-after */
  background: linear-gradient(
    90deg,
    rgb(var(--primary-color-base) / 30%) 0%,
    rgb(var(--primary-color-base) / 50%) 50%,
    rgb(var(--primary-color-base) / 30%) 100%
  );
}

.vue-skeletor--rect {
  display: block;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
