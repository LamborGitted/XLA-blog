<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/client/composables/useTheme'
import { useThemeIcons } from '@/client/composables/useIcons'
import GlassButton from '@/client/component/GlassButton.vue'

const { currentConfig, toggleMode } = useTheme()
const { sun, moon } = useThemeIcons()

// 根据当前模式选择图标
const currentIcon = computed(() => {
  return currentConfig.value.mode === 'light' ? sun : moon
})

const handleToggle = () => {
  toggleMode()
}
</script>

<template>
  <GlassButton variant="icon" title="切换亮暗模式" @click="handleToggle">
    <component :is="currentIcon" />
  </GlassButton>
</template>
