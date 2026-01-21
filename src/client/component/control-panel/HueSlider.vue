<script setup lang="ts">
import { computed, type Ref } from 'vue'
import { useColorUtils } from '@/client/composables/useColorUtils'
import { useTheme } from '@/client/composables/useTheme'

const props = defineProps<{
  localHue: Ref<number>
  sliderPercent: Ref<number>
}>()

const emit = defineEmits<{
  input: [event: Event]
  change: [event: Event]
}>()

const { currentConfig } = useTheme()
const { sliderBackground } = useColorUtils(currentConfig)

const thumbColor = computed(() => {
  const degrees = Math.round((props.localHue.value / 255) * 360)
  return `hsl(${degrees}, 100%, 50%)`
})
</script>

<template>
  <Transition name="slide">
    <div class="hue-slider">
      <div class="slider-container">
        <div class="slider-track" :style="{ background: sliderBackground }">
          <div class="slider-thumb" :style="{ left: sliderPercent + '%' }">
            <div class="thumb-inner" :style="{ backgroundColor: thumbColor }" />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="255"
          :value="localHue"
          @input="emit('input', $event)"
          @change="emit('change', $event)"
          class="slider-input"
        >
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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
  .hue-slider {
    width: 180px;
    right: calc(100% + 8px);
  }
}
</style>
