<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleError } from '@/client/domain/error/articleError'
import { ErrorLevel } from '@/client/domain/error/articleError'

interface Props {
  error: ArticleError
  articleId?: string
}

const props = defineProps<Props>()

interface Emits {
  (e: 'retry'): void
}

const emit = defineEmits<Emits>()

// 根据错误级别计算样式配置
const errorConfig = computed(() => {
  switch (props.error.level) {
    case ErrorLevel.WARN:
      return {
        icon: '⚠️',
        title: '元数据解析失败',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        borderColor: '#f59e0b'
      }
    case ErrorLevel.ERROR:
      return {
        icon: '❌',
        title: '文章加载失败',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444'
      }
    case ErrorLevel.FATAL:
      return {
        icon: '💥',
        title: '严重错误',
        bgColor: 'rgba(139, 92, 246, 0.1)',
        borderColor: '#8b5cf6'
      }
    default:
      return {
        icon: '❓',
        title: '未知错误',
        bgColor: 'var(--color-muted)',
        borderColor: 'var(--color-border)'
      }
  }
})

// 格式化时间戳
const formattedTime = computed(() => {
  return new Date(props.error.timestamp).toLocaleTimeString('zh-CN')
})
</script>

<template>
  <div
    class="article-error"
    :style="{
      backgroundColor: errorConfig.bgColor,
      borderColor: errorConfig.borderColor
    }"
  >
    <div class="error-icon">{{ errorConfig.icon }}</div>
    <div class="error-content">
      <h3 class="error-title">{{ errorConfig.title }}</h3>
      <p class="error-message">{{ error.message }}</p>
      <div v-if="articleId" class="error-meta">
        <span class="error-id">文章 ID: {{ articleId }}</span>
        <span class="error-time">{{ formattedTime }}</span>
      </div>
      <button
        class="retry-button"
        @click="emit('retry')"
        type="button"
      >
        <span class="retry-icon">🔄</span>
        <span>重试</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.article-error {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  border: 2px solid;
  margin: 20px 0;
}

.error-icon {
  font-size: 48px;
  line-height: 1;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.error-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.error-message {
  font-size: 0.95rem;
  color: var(--color-textSecondary);
  margin: 0;
  line-height: 1.5;
}

.error-meta {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: var(--color-muted);
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-in-out-cubic);
  align-self: flex-start;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.retry-button:active {
  transform: translateY(0);
}

.retry-icon:hover {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式 */
@media (max-width: 768px) {
  .article-error {
    flex-direction: column;
    padding: 16px;
  }

  .error-icon {
    font-size: 36px;
  }

  .error-title {
    font-size: 1rem;
  }
}
</style>
