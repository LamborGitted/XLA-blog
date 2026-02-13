<script setup lang="ts">
import { computed } from 'vue'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'
import { LayoutMode } from '@/client/domain/view/layoutTransform'

const { mode, setMode } = useLayoutTransform()

// 布局模式配置
const layouts = computed(() => [
  { mode: LayoutMode.Default, label: '文章列表' },
  { mode: LayoutMode.Widgets, label: '小组件' },
  { mode: LayoutMode.LinkList, label: '链接列表' }
])

// 切换到指定模式
function switchToLayout(targetMode: LayoutMode) {
  setMode(targetMode)
}
</script>

<template>
  <div class="layout-dots">
    <button
      v-for="layout in layouts"
      :key="layout.mode"
      class="dot"
      :class="{ active: mode === layout.mode }"
      :title="layout.label"
      :aria-label="layout.label"
      :aria-current="mode === layout.mode ? 'true' : undefined"
      @click="switchToLayout(layout.mode)"
      type="button"
    ></button>
  </div>
</template>

<style scoped>
.layout-dots {
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  gap: 12px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-muted);
  opacity: 0.4;
  cursor: pointer;
  border: none;
  padding: 0;
  transition: all var(--duration-normal) var(--ease-bounce-cubic);
}

.dot:hover {
  opacity: 0.7;
  transform: scale(1.2);
}

.dot.active {
  background: var(--color-primary);
  opacity: 1;
  transform: scale(1.4);
}

/* 响应式 */
@media (max-width: 768px) {
  .layout-dots {
    bottom: 24px;
    gap: 10px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}
</style>
