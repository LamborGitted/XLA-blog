<script setup lang="ts">
import { computed } from 'vue'
import type { ControlItem } from '@/client/domain/controlPanel/controlPanel'
import { ControlItemType } from '@/client/domain/controlPanel/controlPanel'
import { useGetIcon } from '@/client/composables/useIcons'
import GlassButton from '@/client/component/GlassButton.vue'
import ThemeToggle from './ThemeToggle.vue'
import ThemeColorPicker from './ThemeColorPicker.vue'

const props = defineProps<{
  item: ControlItem
}>()

// 获取导航项的首字母
const getNavInitial = (text: string): string => {
  return text.charAt(0)
}

// 获取图标
const iconComponent = computed(() => {
  if (!props.item.icon) return null
  return useGetIcon(props.item.icon as 'sun' | 'moon' | 'palette' | 'github' | 'person')
})

// 处理控制项点击
const handleClick = () => {
  if (props.item.disabled) return

  // 执行自定义回调
  if (props.item.action) {
    props.item.action()
    return
  }

  // 根据类型执行默认行为
  switch (props.item.type) {
    case ControlItemType.LINK:
      if (props.item.link) {
        window.open(props.item.link, '_blank')
      }
      break
    case ControlItemType.NAVIGATION:
      if (props.item.link) {
        if (props.item.link.startsWith('http')) {
          window.open(props.item.link, '_blank')
        } else {
          // TODO: 实现内部导航
          console.log('导航到:', props.item.link)
        }
      }
      break
  }
}
</script>

<template>
  <!-- 分隔线 -->
  <div v-if="item.type === ControlItemType.DIVIDER && item.visible !== false" class="divider"></div>

  <!-- 主题切换按钮 -->
  <div
    v-else-if="item.type === ControlItemType.THEME_TOGGLE && item.visible !== false"
    class="control-item"
  >
    <ThemeToggle />
  </div>

  <!-- 主题色选择器 -->
  <div
    v-else-if="item.type === ControlItemType.THEME_COLOR && item.visible !== false"
    class="control-item"
  >
    <ThemeColorPicker />
  </div>

  <!-- 外部链接 -->
  <div
    v-else-if="item.type === ControlItemType.LINK && item.visible !== false"
    class="control-item"
  >
    <GlassButton variant="icon" :title="item.title || item.label" @click="handleClick">
      <component :is="iconComponent" v-if="iconComponent" />
      <span v-else>{{ item.label?.charAt(0) || '?' }}</span>
    </GlassButton>
  </div>

  <!-- 导航项 -->
  <div
    v-else-if="item.type === ControlItemType.NAVIGATION && item.visible !== false"
    class="control-item"
  >
    <GlassButton variant="icon" :title="item.title || item.label" @click="handleClick">
      <span>{{ getNavInitial(item.label || '') }}</span>
    </GlassButton>
  </div>

  <!-- 普通按钮 -->
  <div
    v-else-if="item.type === ControlItemType.BUTTON && item.visible !== false"
    class="control-item"
  >
    <GlassButton variant="icon" :title="item.title || item.label" @click="handleClick">
      <component :is="iconComponent" v-if="iconComponent" />
      <span v-else>{{ item.label?.charAt(0) || '?' }}</span>
    </GlassButton>
  </div>
</template>

<style scoped>
.control-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.control-item :deep(.glass-icon) {
  width: 44px;
  height: 44px;
}

.control-item :deep(svg) {
  width: 20px;
  height: 20px;
}

.control-item :deep(span) {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 4px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-item :deep(.glass-icon) {
    width: 40px;
    height: 40px;
  }
}
</style>
