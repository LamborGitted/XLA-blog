<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTheme } from '@/client/composables/useTheme'

// 定义 emits
const emit = defineEmits<{
  mouseenter: []
  mouseleave: []
}>()

const { currentConfig, setHue } = useTheme()

// 控制滑条显示/隐藏
const isVisible = ref(false)

// 本地滑条值（用于实时预览）
const localHue = ref(currentConfig.value.hue)

// 同步当前配置到本地值
watch(() => currentConfig.value.hue, (newHue) => {
  localHue.value = newHue
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

// 当前选择的颜色预览
const currentColor = computed(() => {
  const degrees = Math.round((localHue.value / 255) * 360)
  return `hsl(${degrees}, 100%, 50%)`
})

// 滑条位置百分比
const sliderPercent = computed(() => {
  return (localHue.value / 255) * 100 // 从左到右
})

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

// 切换显示状态
const toggle = () => {
  isVisible.value = !isVisible.value
}

// 打开滑条
const open = () => {
  isVisible.value = true
}

// 关闭滑条
const close = () => {
  isVisible.value = false
}

// 暴露方法供父组件调用
defineExpose({
  toggle,
  open,
  close
})
</script>

<template>
  <Transition name="slide">
    <div
      v-if="isVisible"
      class="hue-slider"
      @mouseenter="emit('mouseenter')"
      @mouseleave="emit('mouseleave')"
    >
      <div class="slider-container">
        <!-- 彩虹色背景 -->
        <div class="slider-track" :style="{ background: sliderBackground }">
          <!-- 当前颜色指示器 -->
          <div
            class="slider-thumb"
            :style="{ left: sliderPercent + '%' }"
          >
            <div class="thumb-inner" :style="{ backgroundColor: currentColor }" />
          </div>
        </div>

        <!-- 滑条输入 -->
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
</template>

<style scoped>
.hue-slider {
  position: fixed;
  top: 100px;
  right: 76px;
  width: 220px;
  height: 30px;
  z-index: 150;

  display: flex;
  align-items: center;

  padding: 10px 14px;
  border-radius: 22px;
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
  height: 10px;
  border-radius: 5px;
  overflow: visible;
}

.slider-thumb {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
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
  border: 2.5px solid var(--color-bg);
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

/* 从右边弹出动画 */
. slide-enter-active,
.slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(16px) scale(0.95);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(16px) scale(0.95);
}

/* 暗色模式优化 */
[data-theme-mode="dark"] .hue-slider {
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
}

[data-theme-mode="dark"] .thumb-inner {
  border-color: var(--color-bg);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
}
</style>
