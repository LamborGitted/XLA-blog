<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'
import { LayoutMode } from '@/client/domain/view/layoutTransform'
import { useGetIcon } from '@/client/composables/useIcons'
import GlassButton from '@/client/component/GlassButton.vue'

const { mode, isDefaultMode, isWidgetsMode, isLinkListMode, toDefaultMode, toWidgetsMode, toLinkListMode } = useLayoutTransform()
const arrowIcon = useGetIcon('arrow-right')

const handleToggle = () => {
  // 循环切换：默认 -> 小组件 -> 链接列表 -> 默认
  if (isDefaultMode.value) {
    toWidgetsMode()
  } else if (isWidgetsMode.value) {
    toLinkListMode()
  } else {
    toDefaultMode()
  }
}

// 计算图标旋转角度
const rotation = computed(() => {
  if (isWidgetsMode.value) return 90
  if (isLinkListMode.value) return 180
  return 0
})

// 按钮状态提示
const buttonTitle = computed(() => {
  if (isDefaultMode.value) return '切换到小组件模式'
  if (isWidgetsMode.value) return '切换到链接列表模式'
  return '切换到默认模式'
})
</script>

<template>
  <GlassButton
    variant="icon"
    :title="buttonTitle"
    :class="{ 'is-widgets': isWidgetsMode, 'is-linklist': isLinkListMode }"
    @click="handleToggle"
  >
    <component :is="arrowIcon" class="transform-icon" :style="{ transform: `rotate(${rotation}deg)` }" />
  </GlassButton>
</template>

<style scoped>
.glass-button.is-widgets {
  background: var(--color-primary);
  border-color: var(--color-primary);
}

.glass-button.is-widgets .transform-icon {
  color: var(--color-bg);
}

.glass-button.is-linklist {
  background: var(--color-success);
  border-color: var(--color-success);
}

.glass-button.is-linklist .transform-icon {
  color: var(--color-bg);
}

.transform-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}
</style>
