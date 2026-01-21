<script setup lang="ts">
import { computed } from 'vue'
import {
  getPageTitleConfig,
  applyFontPreset,
  type PageTitleConfig
} from '@/client/domain/view/PageTitle'

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

// 标题和副标题始终显示完整文本
const titleText = computed(() => titleConfig.value.title.text)
const subtitleText = computed(() => titleConfig.value.subtitle?.text || '')

// 光标始终显示
const showTitleCursor = computed(() => titleConfig.value.title.typewriter?.showCursor !== false)
const showSubtitleCursor = computed(() => titleConfig.value.subtitle?.typewriter?.showCursor !== false)
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
      {{ titleText }}
      <span
        v-if="showTitleCursor"
        class="cursor"
        :style="{ animationDuration: titleConfig.title.typewriter?.blinkSpeed + 'ms' }"
      >{{ titleConfig.title.typewriter?.cursorChar || '|' }}</span>
    </h1>

    <!-- 副标题 -->
    <h2
      v-if="titleConfig.subtitle?.visible && subtitleText"
      class="page-subtitle"
      :style="{
        fontFamily: titleConfig.subtitle.font?.family,
        fontWeight: titleConfig.subtitle.font?.weight,
        fontSize: titleConfig.subtitle.font?.size,
        lineHeight: titleConfig.subtitle.font?.lineHeight
      }"
    >
      {{ subtitleText }}
      <span
        v-if="showSubtitleCursor"
        class="cursor"
        :style="{ animationDuration: titleConfig.subtitle.typewriter?.blinkSpeed + 'ms' }"
      >{{ titleConfig.subtitle.typewriter?.cursorChar || '|' }}</span>
    </h2>
  </div>
</template>

<style scoped>
.page-title-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
  text-align: center;
  pointer-events: none;
  user-select: none;
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
  animation: blink 1s step-end infinite;
  margin-left: 2px;
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
