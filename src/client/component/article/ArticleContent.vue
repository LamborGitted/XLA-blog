<script setup lang="ts">
import { watch, nextTick, onMounted } from 'vue'
import { useCodeCopy } from '@/client/composables/useCodeCopy'

interface ArticleDetail {
  htmlContent?: string
  title?: string
}

interface Props {
  article: ArticleDetail | null
  isRendering: boolean
}

const props = defineProps<Props>()

// ==================== 代码复制功能 ====================
const { initCodeCopy, destroyCodeCopy } = useCodeCopy({
  containerSelector: '.markdown-body',
  showTooltip: true,
  tooltipDuration: 2000
})

// 监听文章内容变化，重新初始化复制按钮
watch(() => props.article?.htmlContent, async () => {
  await nextTick()
  initCodeCopy()
})

// 组件挂载时初始化
onMounted(() => {
  initCodeCopy()
})

// 组件卸载时清理（由父组件处理）
defineExpose({ destroyCodeCopy })
</script>

<template>
  <!-- 加载状态 -->
  <div v-if="isRendering" class="article-loading">
    加载中...
  </div>

  <!-- Markdown 渲染内容 -->
  <div
    v-else-if="article?.htmlContent"
    class="article-content markdown-body"
    v-html="article.htmlContent"
  />
</template>

<style scoped>
/* ==================== 加载状态 ==================== */
.article-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  font-size: 1.1rem;
  color: var(--color-textSecondary);
}

/* ==================== Markdown 内容样式 ==================== */
.article-content {
  color: var(--color-text);
  line-height: 1.8;
  font-size: 1.05rem;
}

/* Markdown 基础样式 */
.markdown-body :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  margin: 40px 0 20px 0;
  color: var(--color-text);
  padding-bottom: 10px;
  border-bottom: 2px solid var(--color-border);
}

.markdown-body :deep(h2) {
  font-size: 1.6rem;
  font-weight: 600;
  margin: 35px 0 15px 0;
  color: var(--color-text);
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border);
}

.markdown-body :deep(h3) {
  font-size: 1.3rem;
  font-weight: 600;
  margin: 30px 0 12px 0;
  color: var(--color-text);
}

.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 25px 0 10px 0;
  color: var(--color-text);
}

.markdown-body :deep(p) {
  margin: 0 0 1.2em 0;
}

.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.markdown-body :deep(a:hover) {
  border-bottom-color: var(--color-primary);
}

.markdown-body :deep(code) {
  background: var(--color-muted);
  opacity: 0.5;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  color: var(--color-text);
  font-weight: 500;
}

.markdown-body :deep(pre) {
  background: var(--color-muted);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  overflow-x: auto;
  margin: 20px 0;
}

/* 亮色模式代码块优化 */
[data-theme-mode="light"] .markdown-body :deep(pre) {
  background: #f6f8fa;
  border-color: #d0d7de;
}

[data-theme-mode="light"] .markdown-body :deep(pre code) {
  color: #24292f;
}

[data-theme-mode="light"] .markdown-body :deep(code) {
  color: var(--color-primary);
  opacity: 1;
}

/* 暗色模式代码块优化 */
[data-theme-mode="dark"] .markdown-body :deep(pre) {
  background: #161b22;
  border-color: #30363d;
}

[data-theme-mode="dark"] .markdown-body :deep(pre code) {
  color: #c9d1d9;
}

[data-theme-mode="dark"] .markdown-body :deep(code) {
  color: var(--color-primary);
  opacity: 1;
}

.markdown-body :deep(pre code) {
  background: transparent;
  padding: 0;
  font-weight: 400;
}

/* 代码块滚动条样式 */
.markdown-body :deep(pre)::-webkit-scrollbar {
  height: 10px;
}

.markdown-body :deep(pre)::-webkit-scrollbar-track {
  background: transparent;
}

.markdown-body :deep(pre)::-webkit-scrollbar-thumb {
  background: var(--color-textSecondary);
  border-radius: 5px;
  opacity: 0.3;
}

.markdown-body :deep(pre)::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
  opacity: 0.6;
}

/* ==================== 代码复制按钮样式 ==================== */

/* 按钮容器 */
.markdown-body :deep(pre) {
  position: relative;
}

/* 复制按钮基础样式 */
.markdown-body :deep(.code-copy-button) {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: var(--color-muted);
  opacity: 0.3;
  backdrop-filter: blur(var(--blur-sm));
  -webkit-backdrop-filter: blur(var(--blur-sm));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-normal) var(--ease-in-out-cubic);
  transform: translateY(-4px);
  z-index: 10;
  pointer-events: none;
}

/* 亮色模式按钮样式 */
[data-theme-mode="light"] .markdown-body :deep(.code-copy-button) {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 暗色模式按钮样式 */
[data-theme-mode="dark"] .markdown-body :deep(.code-copy-button) {
  background: rgba(22, 27, 34, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 悬停代码块时显示按钮 */
.markdown-body :deep(pre:hover .code-copy-button) {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* 按钮悬停效果 */
.markdown-body :deep(.code-copy-button:hover) {
  opacity: 1;
  transform: translateY(0) scale(1.05);
  background: var(--color-primary);
  box-shadow: var(--shadow-lg);
}

[data-theme-mode="light"] .markdown-body :deep(.code-copy-button:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

[data-theme-mode="dark"] .markdown-body :deep(.code-copy-button:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 按钮点击效果 */
.markdown-body :deep(.code-copy-button:active) {
  transform: translateY(0) scale(0.95);
}

/* SVG 图标样式 */
.markdown-body :deep(.code-copy-button svg) {
  width: 16px;
  height: 16px;
  color: var(--color-text);
  transition: all 0.2s ease;
}

[data-theme-mode="light"] .markdown-body :deep(.code-copy-button svg) {
  color: #24292f;
}

[data-theme-mode="dark"] .markdown-body :deep(.code-copy-button svg) {
  color: #c9d1d9;
}

/* 按钮悬停时图标颜色 */
.markdown-body :deep(.code-copy-button:hover svg) {
  color: #ffffff;
}

/* 复制图标动画 */
.markdown-body :deep(.copy-icon-default),
.markdown-body :deep(.copy-icon-arrow) {
  transition: all 0.2s ease;
  opacity: 1;
}

.markdown-body :deep(.copy-icon-check) {
  opacity: 0;
  transform: scale(0);
  transition: all 0.2s ease;
}

/* 复制成功后的图标状态 */
.markdown-body :deep(.code-copy-button.copied .copy-icon-default),
.markdown-body :deep(.code-copy-button.copied .copy-icon-arrow) {
  opacity: 0;
  transform: scale(0);
}

.markdown-body :deep(.code-copy-button.copied .copy-icon-check) {
  opacity: 1;
  transform: scale(1);
}

/* 工具提示样式 */
.markdown-body :deep(.code-copy-tooltip) {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  padding: 6px 12px;
  background: var(--color-surface);
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  opacity: 0;
  transform: translateY(-4px);
  transition: all var(--duration-fast) ease;
  pointer-events: none;
  z-index: 20;
  box-shadow: var(--shadow-md);
}

[data-theme-mode="light"] .markdown-body :deep(.code-copy-tooltip) {
  background: rgba(255, 255, 255, 0.95);
  color: #24292f;
}

[data-theme-mode="dark"] .markdown-body :deep(.code-copy-tooltip) {
  background: rgba(22, 27, 34, 0.95);
  color: #c9d1d9;
}

/* 工具提示显示状态 */
.markdown-body :deep(.code-copy-tooltip.show) {
  opacity: 1;
  transform: translateY(0);
}

/* 工具提示箭头 */
.markdown-body :deep(.code-copy-tooltip::before) {
  content: '';
  position: absolute;
  top: -4px;
  right: 12px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid var(--color-border);
}

[data-theme-mode="light"] .markdown-body :deep(.code-copy-tooltip::before) {
  border-bottom-color: rgba(0, 0, 0, 0.08);
}

[data-theme-mode="dark"] .markdown-body :deep(.code-copy-tooltip::before) {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

/* 移动端：默认显示复制按钮 */
@media (max-width: 768px) {
  .markdown-body :deep(.code-copy-button) {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.markdown-body :deep(blockquote) {
  border-left: 4px solid var(--color-primary);
  padding-left: 20px;
  margin: 20px 0;
  color: var(--color-textSecondary);
  font-style: italic;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 25px;
  margin: 15px 0;
}

.markdown-body :deep(li) {
  margin: 8px 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid var(--color-border);
  padding: 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: var(--color-muted);
  opacity: 0.3;
  font-weight: 600;
}

.markdown-body :deep(tr:hover) {
  background: var(--color-muted);
  opacity: 0.2;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .markdown-body :deep(h1) {
    font-size: 1.6rem;
  }

  .markdown-body :deep(h2) {
    font-size: 1.3rem;
  }
}
</style>
