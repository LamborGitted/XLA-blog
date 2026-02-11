<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface ArticleMeta {
  id: string
  title: string
}

interface Props {
  prevArticle: ArticleMeta | null
  nextArticle: ArticleMeta | null
}

interface Emits {
  (e: 'navigate-prev'): void
  (e: 'navigate-next'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

/**
 * 键盘事件处理
 */
function handleKeydown(event: KeyboardEvent) {
  // 左箭头：上一篇
  if (event.key === 'ArrowLeft') {
    const prevBtn = document.querySelector('.nav-button-prev') as HTMLButtonElement
    if (prevBtn) {
      prevBtn.click()
    }
    return
  }

  // 右箭头：下一篇
  if (event.key === 'ArrowRight') {
    const nextBtn = document.querySelector('.nav-button-next') as HTMLButtonElement
    if (nextBtn) {
      nextBtn.click()
    }
    return
  }

  // 上箭头：向上滚动
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    const scrollLayer = document.querySelector('.content-scroll-layer')
    if (scrollLayer) {
      scrollLayer.scrollBy({ top: -200, behavior: 'smooth' })
    }
    return
  }

  // 下箭头：向下滚动
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    const scrollLayer = document.querySelector('.content-scroll-layer')
    if (scrollLayer) {
      scrollLayer.scrollBy({ top: 200, behavior: 'smooth' })
    }
    return
  }

  // Home：跳转到文章顶部
  if (event.key === 'Home') {
    event.preventDefault()
    const scrollLayer = document.querySelector('.content-scroll-layer')
    if (scrollLayer) {
      scrollLayer.scrollTo({ top: 0, behavior: 'smooth' })
    }
    return
  }

  // End：跳转到文章底部
  if (event.key === 'End') {
    event.preventDefault()
    const scrollLayer = document.querySelector('.content-scroll-layer')
    if (scrollLayer) {
      scrollLayer.scrollTo({ top: scrollLayer.scrollHeight, behavior: 'smooth' })
    }
  }
}

// 组件挂载时添加键盘事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

// 组件卸载时移除键盘事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div class="article-navigation">
    <button
      v-if="prevArticle"
      class="nav-button nav-button-prev"
      @click="emit('navigate-prev')"
    >
      <span class="nav-arrow">←</span>
      <div class="nav-content">
        <span class="nav-label">上一篇</span>
        <span class="nav-title">{{ prevArticle.title }}</span>
      </div>
    </button>

    <button
      v-if="nextArticle"
      class="nav-button nav-button-next"
      @click="emit('navigate-next')"
    >
      <div class="nav-content">
        <span class="nav-label">下一篇</span>
        <span class="nav-title">{{ nextArticle.title }}</span>
      </div>
      <span class="nav-arrow">→</span>
    </button>
  </div>
</template>

<style scoped>
/* ==================== 文章导航样式 ==================== */
.article-navigation {
  display: flex;
  gap: 20px;
  margin-top: 50px;
  padding-top: 30px;
  border-top: 1px solid var(--color-border);
}

.nav-button {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: var(--color-bg);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--color-border);
  border-radius: 16px;
  cursor: pointer;
  transition: all var(--duration-normal) ease;
  text-align: left;
}

.nav-button:hover {
  background: var(--color-surface);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--color-shadow);
}

.nav-button:active {
  transform: translateY(0);
}

.nav-button-prev {
  flex-direction: row;
}

.nav-button-next {
  flex-direction: row-reverse;
}

.nav-arrow {
  font-size: 24px;
  color: var(--color-text);
  flex-shrink: 0;
}

.nav-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.nav-label {
  font-size: 12px;
  color: var(--color-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nav-title {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav-button-next .nav-content {
  align-items: flex-end;
  text-align: right;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-navigation {
    flex-direction: column;
    gap: 10px;
  }

  .nav-button {
    padding: 15px;
  }

  .nav-arrow {
    font-size: 20px;
  }

  .nav-title {
    font-size: 13px;
  }
}
</style>
