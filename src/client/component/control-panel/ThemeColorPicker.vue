<script setup lang="ts">
import { ref } from 'vue'
import { useThemeIcons } from '@/client/composables/useIcons'
import { useHueSlider } from '@/client/composables/useHueSlider'
import { useTheme } from '@/client/composables/useTheme'
import GlassButton from '@/client/component/GlassButton.vue'
import HueSlider from './HueSlider.vue'

const { palette } = useThemeIcons()
const { currentConfig, setHue } = useTheme()

// 延迟关闭定时器
let closeTimer: ReturnType<typeof setTimeout> | null = null

const {
  localHue,
  sliderPercent,
  handleInput,
  handleChange
} = useHueSlider(currentConfig.value.hue, (hue) => {
  setHue(hue)
})

const showSlider = ref(false)

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
  showSlider.value = true
}

// 鼠标离开时隐藏滑条
const handleMouseLeave = () => {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    showSlider.value = false
  }, 300)
}
</script>

<template>
  <div
    class="control-item theme-color"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <GlassButton variant="icon" title="选择主题色">
      <component :is="palette" />
    </GlassButton>

    <HueSlider
      v-if="showSlider"
      :local-hue="localHue"
      :slider-percent="sliderPercent"
      @input="handleInput"
      @change="handleChange"
    />
  </div>
</template>

<style scoped>
.control-item {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 主题色按钮特殊定位 */
.theme-color {
  position: relative;
}

/* 按钮样式 */
.control-item :deep(.glass-icon) {
  width: 44px;
  height: 44px;
}

.control-item :deep(svg) {
  width: 20px;
  height: 20px;
  fill: var(--color-text);
}

.theme-color:hover :deep(svg) {
  transform: scale(1.1) rotate(5deg);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-item :deep(.glass-icon) {
    width: 40px;
    height: 40px;
  }
}
</style>
