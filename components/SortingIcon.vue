<template>
    <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="sorting-icon">
        <path d="M2.79803 0L5.3961 4.5H0.199951L2.79803 0Z" :fill="topArrowFill"/>
        <path d="M2.79803 12L0.199952 7.5L5.3961 7.5L2.79803 12Z" :fill="bottomArrowFill"/>
    </svg>
</template>

<script setup lang="ts">
interface Props {
    direction: 'asc' | 'desc' | 'none'
}
const props = defineProps<Props>()

const topArrowFill = computed(() => {
    switch (props.direction) {
        case 'asc': return 'var(--primary-color)'
        case 'desc': 
        case 'none': return 'var(--subtitle-color)'
    }
})

const bottomArrowFill = computed(() => {
    switch (props.direction) {
        case 'asc':
        case 'none': return 'var(--subtitle-color)'
        case 'desc': return 'var(--primary-color)'
    }
})
</script>

<style>
.sorting-icon {
    &:hover {
        cursor: pointer;
    }
}
</style>
