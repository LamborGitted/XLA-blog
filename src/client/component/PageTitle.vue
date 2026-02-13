<script setup lang="ts">
import { computed } from 'vue'
import {
  getPageTitleConfig,
  applyFontPreset,
  type PageTitleConfig
} from '@/client/domain/view/PageTitle'
import { useTypewriter } from '@/client/composables/useTypewriter'

// Props
interface Props {
  config?: PageTitleConfig
  fontPreset?: keyof typeof import('@/client/domain/view/PageTitle').FONT_PRESETS
}

const props = withDefaults(defineProps<Props>(), {
  config: undefined,
  fontPreset: undefined
})

// 获取配置
const titleConfig = computed(() => {
  let config = props.config || getPageTitleConfig()

  // 应用字体预设
  if (props.fontPreset) {
    config = applyFontPreset(config, props.fontPreset)
  }

  return config
})

// 打字机效果 - 必须在顶层调用
const titleResult = useTypewriter(
  () => titleConfig.value.title.text,
  () => titleConfig.value.title.typewriter || {
    speed: 100,
    delay: 500,
    blinkSpeed: 700,
    showCursor: true,
    cursorChar: '|',
  }
)

const subtitleResult = useTypewriter(
  () => titleConfig.value.subtitle?.text || '',
  () => titleConfig.value.subtitle?.typewriter || {
    speed: 100,
    delay: 1500,
    blinkSpeed: 700,
    showCursor: true,
    cursorChar: '|',
  }
)

// 光标显示控制
const showTitleCursor = computed(() => titleConfig.value.title.typewriter?.showCursor !== false)
const showSubtitleCursor = computed(() => titleConfig.value.subtitle?.typewriter?.showCursor !== false)

// 光标闪烁控制：只在打字完成后才闪烁
const titleCursorClass = computed(() => {
  const isComplete = titleResult.isComplete.value
  return isComplete ? 'cursor cursor-blink' : 'cursor'
})

const subtitleCursorClass = computed(() => {
  const isComplete = subtitleResult.isComplete.value
  return isComplete ? 'cursor cursor-blink' : 'cursor'
})
</script>

<template>
  <div class="page-title-container">
    <!-- 标题 -->
    <h1
      v-if="titleConfig.title.visible"
      class="page-title"
      :style="{
        fontFamily: titleConfig.title.font?.family,
        fontWeight: titleConfig.title.font?.weight,
        fontSize: titleConfig.title.font?.size,
        lineHeight: titleConfig.title.font?.lineHeight
      }"
    >
      {{ titleResult.text }}
      <span
        v-if="showTitleCursor"
        :class="titleCursorClass"
        :style="{ animationDuration: titleConfig.title.typewriter?.blinkSpeed + 'ms' }"
      >{{ titleConfig.title.typewriter?.cursorChar || '|' }}</span>
    </h1>

    <!-- 副标题 -->
    <h2
      v-if="titleConfig.subtitle?.visible && subtitleResult.text"
      class="page-subtitle"
      :style="{
        fontFamily: titleConfig.subtitle.font?.family,
        fontWeight: titleConfig.subtitle.font?.weight,
        fontSize: titleConfig.subtitle.font?.size,
        lineHeight: titleConfig.subtitle.font?.lineHeight
      }"
    >
      {{ subtitleResult.text }}
      <span
        v-if="showSubtitleCursor"
        :class="subtitleCursorClass"
        :style="{ animationDuration: titleConfig.subtitle.typewriter?.blinkSpeed + 'ms' }"
      >{{ titleConfig.subtitle.typewriter?.cursorChar || '|' }}</span>
    </h2>
  </div>
</template>

<style scoped>
.page-title-container {
  position: fixed;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
  z-index: 5;
  text-align: center;
  pointer-events: none;
  user-select: none;
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 左侧位置 */
.page-title-container.title-left {
  left: 15%;
  text-align: left;
}

.page-title {
  margin: 0;
  letter-spacing: -0.02em;
  color: var(--color-text);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: color 0.3s ease;
}

.page-subtitle {
  margin: 16px 0 0 0;
  letter-spacing: 0.02em;
  color: var(--color-textSecondary);
  font-weight: 400;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.05);
  transition: color 0.3s ease;
}

/* 光标闪烁动画 */
.cursor {
  display: inline-block;
  margin-left: 2px;
}

/* 只在打字完成后才闪烁 */
.cursor-blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* 暗色模式优化 */
[data-theme-mode="dark"] .page-title {
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

[data-theme-mode="dark"] .page-subtitle {
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-title {
    font-size: 4rem !important;
  }

  .page-subtitle {
    font-size: 1.6rem !important;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem !important;
  }

  .page-subtitle {
    font-size: 1.2rem !important;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.8rem !important;
  }

  .page-subtitle {
    font-size: 1rem !important;
    margin-top: 8px;
  }
}
</style>
