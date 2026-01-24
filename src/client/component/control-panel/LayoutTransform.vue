<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'
import GlassButton from '@/client/component/GlassButton.vue'

const { toggleMode, isWidgetsMode } = useLayoutTransform()

// 根据当前模式选择图标
const currentIcon = computed(() => {
  return isWidgetsMode.value ? '☰' : '◐'
})

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
    <span class="transform-icon">{{ currentIcon }}</span>
  </GlassButton>
</template>

<style scoped>
.glass-button.is-active {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.glass-button.is-active .transform-icon {
  color: var(--color-bg);
}

.transform-icon {
  font-size: 18px;
}
</style>
