<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from '@/client/composables/useTheme'
import GlassButton from '@/client/component/GlassButton.vue'
import SunIcon from '@/client/component/icon/SunIcon.vue'
import MoonIcon from '@/client/component/icon/MoonIcon.vue'
import PaletteIcon from '@/client/component/icon/PaletteIcon.vue'
import HueSlider from './HueSlider.vue'

const { currentConfig, toggleMode } = useTheme()

// HueSlider 组件引用
const hueSliderRef = ref<InstanceType<typeof HueSlider> | null>(null)

// 延迟关闭定时器
let closeTimer: ReturnType<typeof setTimeout> | null = null

// 根据当前模式选择图标
const currentIcon = computed(() => {
  return currentConfig.value.mode === 'light' ? SunIcon : MoonIcon
})

// 当前主题色
const currentColor = computed(() => {
  const degrees = Math.round((currentConfig.value.hue / 255) * 360)
  return `hsl(${degrees}, 100%, 50%)`
})

// 切换亮暗模式
const handleToggle = () => {
  toggleMode()
}

// 清除关闭定时器
const clearCloseTimer = () => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
}

// 悬浮显示滑条
const handleMouseEnter = () => {
  clearCloseTimer()
  hueSliderRef.value?.open()
}

// 鼠标离开时隐藏滑条（延迟）
const handleMouseLeave = () => {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    hueSliderRef.value?.close()
  }, 300)
}
</script>

<template>
  <div
    class="theme-controls"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 亮暗模式切换按钮 -->
    <div class="theme-toggle">
      <GlassButton variant="icon" @click="handleToggle">
        <component :is="currentIcon" />
      </GlassButton>
    </div>

    <!-- 主题色按钮 -->
    <div class="theme-color">
      <GlassButton variant="icon">
        <div class="palette-icon-wrapper">
          <!-- 调色盘图标，使用当前主题色 -->
          <PaletteIcon />
          <!-- 背景色圆点 -->
          <div class="color-bg" :style="{ backgroundColor: currentColor }"></div>
        </div>
      </GlassButton>
    </div>

    <!-- 滑条组件 -->
    <HueSlider
      ref="hueSliderRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    />
  </div>
</template>

<style scoped>
.theme-controls {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 150;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.theme-toggle,
.theme-color {
  position: relative;
}

/* 确保图标大小合适 */
.theme-controls :deep(.glass-icon) {
  width: 44px;
  height: 44px;
}

.theme-controls :deep(svg) {
  width: 22px;
  height: 22px;
}

/* 调色盘图标容器 */
.palette-icon-wrapper {
  position: relative;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 调色盘图标 */
.palette-icon-wrapper :deep(svg) {
  width: 24px;
  height: 24px;
  stroke: var(--color-text);
  fill: none;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
  transition: transform 0.2s ease;
}

/* 小圆点的填充颜色 */
.palette-icon-wrapper :deep(svg circle[fill]) {
  fill: var(--color-primary);
}

/* 背景色圆点 */
.color-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  z-index: 1;
  transition: background-color 0.1s ease;
}

/* 悬浮动画 */
.theme-color:hover .palette-icon-wrapper :deep(svg) {
  transform: scale(1.1) rotate(5deg);
}

/* 暗色模式优化 */
[data-theme-mode="dark"] .palette-icon-wrapper :deep(svg) {
  stroke: var(--color-text);
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
}
</style>
