<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'
import { useGetIcon } from '@/client/composables/useIcons'
import GlassButton from '@/client/component/GlassButton.vue'

const { toggleMode, isWidgetsMode } = useLayoutTransform()
const arrowIcon = useGetIcon('arrow-right')

const handleToggle = () => {
  toggleMode()
}
</script>

<template>
  <GlassButton
    variant="icon"
    title="切换布局"
    :class="{ 'is-active': isWidgetsMode }"
    @click="handleToggle"
  >
    <component :is="arrowIcon" class="transform-icon" />
  </GlassButton>
</template>

<style scoped>
.glass-button.is-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.glass-button.is-active .transform-icon {
  color: var(--color-bg);
  transform: rotate(90deg);
}

.transform-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}
</style>
