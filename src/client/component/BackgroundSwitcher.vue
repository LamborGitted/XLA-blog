<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useBackground } from '@/client/composables/useBackground'
import { useTheme } from '@/client/composables/useTheme'

const { currentBg, prevBg } = useBackground(8000)
const { currentConfig } = useTheme()

// 跟踪应该应用淡出动画的背景 key
const fadingBgKey = ref<string | null>(null)

// 监听 prevBg 变化，异步添加淡出效果
watch(prevBg, async (newVal) => {
  if (newVal) {
    // 等待 DOM 更新，确保元素已创建且以 opacity: 1 渲染
    await nextTick()
    // 然后标记需要淡出的背景，触发 transition
    fadingBgKey.value = newVal.src
  } else {
    // prevBg 被清空时，重置淡出标记
    fadingBgKey.value = null
  }
})

// 判断是否应该应用淡出效果
const shouldFade = (background: any, key: string) => {
  return background === prevBg.value && key === fadingBgKey.value
}
</script>

<template>
  <div class="background-wrapper">
    <!-- 所有背景层都渲染，通过 opacity 控制显示 -->
    <div
      v-for="background in [prevBg, currentBg].filter(Boolean)"
      :key="background!.src"
      class="background-layer"
      :class="{ 'prev-background': shouldFade(background, background!.src) }"
      :style="{ backgroundImage: `url('${background!.src}')` }"
    ></div>

    <!-- 暗色模式遮罩 -->
    <div
      v-if="currentConfig.mode === 'dark'"
      class="background-overlay"
    ></div>
  </div>
</template>

<style scoped>
.background-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.background-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  transition: opacity 1s ease-in-out;
  opacity: 1;
}

/* 当前背景（非淡出背景）保持可见 */
.background-layer:not(.prev-background) {
  opacity: 1;
}

/* 上一张背景淡出 */
.background-layer.prev-background {
  opacity: 0;
}
</style>
