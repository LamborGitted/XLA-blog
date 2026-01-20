<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useTheme } from '@/client/composables/useTheme'
import GlassButton from '@/client/component/GlassButton.vue'
import SunIcon from '@/client/component/icon/SunIcon.vue'
import MoonIcon from '@/client/component/icon/MoonIcon.vue'
import PaletteIcon from '@/client/component/icon/PaletteIcon.vue'
import {
  DEFAULT_CONTROL_PANEL,
  ControlItemType,
  getIcon,
  type ControlItem
} from '@/client/domain/controlPanel/controlPanel'

const { currentConfig, toggleMode, setHue } = useTheme()

// 从 domain 获取配置
const panelConfig = computed(() => DEFAULT_CONTROL_PANEL)

// 滑条显示状态
const showSlider = ref(false)

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

// 滑条背景：彩虹色渐变（水平方向）
const sliderBackground = computed(() => {
  return `linear-gradient(to right,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  )`
})

// 本地滑条值（用于实时预览）
const localHue = ref(currentConfig.value.hue)

// 同步当前配置到本地值
watch(() => currentConfig.value.hue, (newHue) => {
  localHue.value = newHue
})

// 滑块位置百分比
const sliderPercent = computed(() => {
  return (localHue.value / 255) * 100
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
  showSlider.value = true
}

// 鼠标离开时隐藏滑条
const handleMouseLeave = () => {
  clearCloseTimer()
  closeTimer = setTimeout(() => {
    showSlider.value = false
  }, 300)
}

// 处理滑条变化
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  localHue.value = parseInt(target.value)
}

// 处理滑条释放（更新主题）
const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  setHue(parseInt(target.value))
}

// 处理控制项点击
const handleItemClick = (item: ControlItem) => {
  if (item.disabled) return

  // 执行自定义回调
  if (item.action) {
    item.action()
    return
  }

  // 根据类型执行默认行为
  switch (item.type) {
    case ControlItemType.THEME_TOGGLE:
      handleToggle()
      break
    case ControlItemType.LINK:
      if (item.link) {
        window.open(item.link, '_blank')
      }
      break
    case ControlItemType.NAVIGATION:
      if (item.link) {
        if (item.link.startsWith('http')) {
          window.open(item.link, '_blank')
        } else {
          // TODO: 实现内部导航
          console.log('导航到:', item.link)
        }
      }
      break
  }
}

// 获取导航项的首字母
const getNavInitial = (text: string): string => {
  return text.charAt(0)
}
</script>

<template>
  <div class="control-panel">
    <!-- 遍历所有控制组 -->
    <div
      v-for="section in panelConfig.sections"
      :key="section.id"
      v-show="section.visible !== false"
      class="control-group"
    >
      <!-- 遍历控制组内的所有项 -->
      <template v-for="item in section.items" :key="item.id">
        <!-- 分隔线 -->
        <div v-if="item.type === ControlItemType.DIVIDER && item.visible !== false" class="divider"></div>

        <!-- 主题切换按钮 -->
        <div
          v-else-if="item.type === ControlItemType.THEME_TOGGLE && item.visible !== false"
          class="control-item"
        >
          <GlassButton variant="icon" :title="item.title || '切换亮暗模式'" @click="handleItemClick(item)">
            <component :is="currentIcon" />
          </GlassButton>
        </div>

        <!-- 主题色按钮 - 绑定悬浮事件 -->
        <div
          v-else-if="item.type === ControlItemType.THEME_COLOR && item.visible !== false"
          class="control-item theme-color"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <GlassButton variant="icon" :title="item.title || '选择主题色'">
            <div class="palette-icon-wrapper">
              <PaletteIcon />
              <div class="color-bg" :style="{ backgroundColor: currentColor }"></div>
            </div>
          </GlassButton>

          <!-- 色调滑条 - 相对于主题色按钮定位 -->
          <Transition name="slide">
            <div
              v-if="showSlider"
              class="hue-slider"
              @mouseenter="handleMouseEnter"
              @mouseleave="handleMouseLeave"
            >
              <div class="slider-container">
                <div class="slider-track" :style="{ background: sliderBackground }">
                  <div class="slider-thumb" :style="{ left: sliderPercent + '%' }">
                    <div class="thumb-inner" :style="{ backgroundColor: currentColor }" />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="255"
                  :value="localHue"
                  @input="handleInput"
                  @change="handleChange"
                  class="slider-input"
                >
              </div>
            </div>
          </Transition>
        </div>

        <!-- 外部链接 -->
        <div
          v-else-if="item.type === ControlItemType.LINK && item.visible !== false"
          class="control-item"
        >
          <GlassButton variant="icon" :title="item.title || item.label" @click="handleItemClick(item)">
            <span v-if="item.icon && getIcon(item.icon)" v-html="getIcon(item.icon)"></span>
            <span v-else>{{ item.label?.charAt(0) || '?' }}</span>
          </GlassButton>
        </div>

        <!-- 导航项 -->
        <div
          v-else-if="item.type === ControlItemType.NAVIGATION && item.visible !== false"
          class="control-item"
        >
          <GlassButton variant="icon" :title="item.title || item.label" @click="handleItemClick(item)">
            <span>{{ getNavInitial(item.label || '') }}</span>
          </GlassButton>
        </div>

        <!-- 普通按钮 -->
        <div
          v-else-if="item.type === ControlItemType.BUTTON && item.visible !== false"
          class="control-item"
        >
          <GlassButton variant="icon" :title="item.title || item.label" @click="handleItemClick(item)">
            <span v-if="item.icon && getIcon(item.icon)" v-html="getIcon(item.icon)"></span>
            <span v-else>{{ item.label?.charAt(0) || '?' }}</span>
          </GlassButton>
        </div>
      </template>
    </div>

    <!-- 预留扩展区域 -->
    <div class="expand-area">
      <!-- 后续可添加更多控件 -->
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  position: fixed;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  z-index: 150;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  //background: linear-gradient(
  //    135deg,
  //    var(--color-surface),
  //    var(--color-surfaceBlur)
  //);
  //backdrop-filter: blur(20px) saturate(160%);
  //-webkit-backdrop-filter: blur(20px) saturate(160%);
  border-radius: 36px;
  //border: 1px solid var(--color-border);
  //box-shadow: var(--color-shadow);
  padding: 16px;
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 4px 0;
}

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
}

.control-item :deep(span) {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
}

/* 调色盘图标容器 */
.palette-icon-wrapper {
  position: relative;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.palette-icon-wrapper :deep(svg) {
  width: 20px;
  height: 20px;
  stroke: var(--color-text);
  fill: none;
}

.palette-icon-wrapper :deep(svg circle[fill]) {
  fill: var(--color-primary);
}

.color-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  z-index: 1;
  transition: background-color 0.1s ease;
}

.theme-color:hover .palette-icon-wrapper :deep(svg) {
  transform: scale(1.1) rotate(5deg);
}

/* 色调滑条 */
.hue-slider {
  position: absolute;
  top: calc(50% + 3px);
  right: calc(100% + 26px);
  transform: translateY(-50%);
  width: 200px;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 8px 10px;
  border-radius: 26px;
  border: 1px solid var(--color-border);
  background: linear-gradient(
      135deg,
      var(--color-surface),
      var(--color-surfaceBlur)
  );
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  box-shadow: var(--color-shadow);
}

.slider-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slider-track {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 8px;
  border-radius: 5px;
  overflow: visible;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.slider-thumb:hover {
  transform: translate(-50%, -50%) scale(1.15);
}

.thumb-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid var(--color-bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  transition: background-color 0.1s ease;
}

.slider-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

/* 预留扩展区域 */
.expand-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 滑条弹出动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-50%) translateX(12px) scale(0.95);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(12px) scale(0.95);
}

/* 暗色模式优化 */
[data-theme-mode="dark"] .hue-slider {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
}

[data-theme-mode="dark"] .thumb-inner {
  border-color: var(--color-bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel {
    right: 16px;
    gap: 16px;
  }

  .control-group {
    padding: 12px;
  }

  .control-item :deep(.glass-icon) {
    width: 40px;
    height: 40px;
  }

  .theme-color .hue-slider {
    width: 180px;
    right: calc(100% + 8px);
  }
}
</style>
