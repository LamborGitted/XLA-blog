<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  article?: { id: string; title: string } | null
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()

/**
 * 键盘事件处理
 */
function handleKeydown(event: KeyboardEvent) {
  // ESC：关闭文章
  if (event.key === 'Escape') {
    emit('close')
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

function handleOverlayClick() {
  emit('close')
}
</script>

<template>
  <Transition name="article-render">
    <div v-if="visible && article" class="article-render-overlay" @click="handleOverlayClick">
      <!-- 文章渲染器容器 -->
      <div class="article-render-container" @click.stop>
        <!-- 关闭按钮层 -->
        <div class="close-button-layer">
          <button class="close-button" @click="$emit('close')">
            <span class="close-icon">×</span>
          </button>
        </div>

        <!-- 插槽：放置文章内容 -->
        <div class="content-scroll-layer">
          <slot />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ==================== 分层式 Layout 设计 ==================== */

/* 第一层：背景遮罩层 */
.article-render-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: var(--glass-blur-light);
  -webkit-backdrop-filter: var(--glass-blur-light);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

/* 离开动画期间禁用鼠标事件，允许立即滚动下层内容 */
.article-render-leave-active {
  pointer-events: none;
}

/* 暗色模式下的遮罩 */
[data-theme-mode="dark"] .article-render-overlay {
  background: rgba(0, 0, 0, 0.6);
}

/* 第二层：文章渲染器容器 - 从下往上弹出 */
.article-render-container {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: 85vh;
  margin: 0 auto;
  background: linear-gradient(
  270→
    135deg,
    var(--color-surface),
    var(--color-surfaceBlur)
  );
  backdrop-filter: var(--glass-blur-xheavy);
  -webkit-backdrop-filter: var(--glass-blur-xheavy);
  border-radius: 30px 30px 0 0;
  box-shadow: var(--color-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

/* 亮色模式下使用更高不透明度的背景 */
[data-theme-mode="light"] .article-render-container {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8),
    rgba(255, 255, 255, 0.78)
  );
}

/* 第三层：关闭按钮层 - 绝对定位在右上角 */
.close-button-layer {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
}

.close-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: var(--color-muted);
  opacity: 0.3;
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal) var(--ease-in-out-cubic);
}

.close-button:hover {
  background: var(--color-textSecondary);
  opacity: 0.5;
  transform: rotate(90deg) scale(1.1);
}

.close-button:active {
  transform: rotate(90deg) scale(0.95);
}

.close-icon {
  font-size: 32px;
  color: var(--color-text);
  line-height: 1;
  font-weight: 300;
}

/* 第四层：内容滚动区域 */
.content-scroll-layer {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 60px 50px 50px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* 隐藏滚动条但保持滚动功能 */
.content-scroll-layer::-webkit-scrollbar {
  width: 8px;
}

.content-scroll-layer::-webkit-scrollbar-track {
  background: transparent;
}

.content-scroll-layer::-webkit-scrollbar-thumb {
  background: var(--color-muted);
  border-radius: 4px;
  opacity: 0.5;
}

.content-scroll-layer::-webkit-scrollbar-thumb:hover {
  background: var(--color-textSecondary);
  opacity: 0.7;
}

/* ==================== 动画效果 ==================== */

/* 从下往上弹出 + 淡入淡出组合动画 */
.article-render-enter-active {
  transition: all 0.5s var(--ease-out-cubic);
}

.article-render-leave-active {
  transition: all 0.4s var(--ease-in-out-cubic);
}

.article-render-enter-from {
  opacity: 0;
}

.article-render-enter-from .article-render-container {
  transform: translateY(100%);
}

.article-render-leave-to {
  opacity: 0;
}

.article-render-leave-to .article-render-container {
  transform: translateY(100%);
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 1200px) {
  .article-render-container {
    max-width: 800px;
  }
}

@media (max-width: 768px) {
  .article-render-container {
    height: 90vh;
    border-radius: 20px 20px 0 0;
  }

  .content-scroll-layer {
    padding: 50px 25px 25px;
  }

  .close-button {
    width: 38px;
    height: 38px;
  }

  .close-icon {
    font-size: 28px;
  }
}
</style>
