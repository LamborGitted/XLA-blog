<script setup lang="ts">
import { ref, computed, reactive, watch, inject, onMounted, onUnmounted, nextTick } from 'vue'
import type { useArticleList } from '@/client/composables/useArticleList'
import type { useArticleState } from '@/client/composables/useArticleState'
import { useArticleCard } from '@/client/composables/useArticleDetail'
import { useCodeCopy } from '@/client/composables/useCodeCopy'

// 使用父组件提供的状态
const articleListState = inject<ReturnType<typeof useArticleList>>('articleListState')!
const articleState = inject<ReturnType<typeof useArticleState>>('articleState')!

const { currentArticle, selectedIndex, prevArticle, nextArticle, goPrev, goNext } = articleListState

// 组件状态
const visible = ref(false)

// 创建响应式文章对象供 useArticleCard 使用
const articleProxy = reactive({
    id: '',
    title: '',
    path: '',
    content: '',
    date: ''
})

// 使用 useArticleCard 获取渲染逻辑
const { detail, isRendering } = useArticleCard(articleProxy)

// 当前文章详情
const articleDetail = computed(() => detail.value)

// ==================== 代码复制功能 ====================
const { initCodeCopy, destroyCodeCopy } = useCodeCopy({
    containerSelector: '.markdown-body',
    showTooltip: true,
    tooltipDuration: 2000
})

// 监听文章内容变化，重新初始化复制按钮
watch(() => articleDetail.value?.htmlContent, async () => {
    await nextTick()
    initCodeCopy()
})

// 是否有文章内容
const hasContent = computed(() => !!currentArticle.value)

// 显示/隐藏
function show() { visible.value = true }

function hide() {
    // 使用 articleState 关闭文章（会更新 URL 并清空 selectedIndex）
    // watch 会自动处理 visible 的变化
    articleState?.closeArticle()
}

// 监听文章变化，更新 proxy 并显示/隐藏
watch(currentArticle, (newArticle, oldArticle) => {
    if (newArticle) {
        // 更新 proxy 的属性
        Object.assign(articleProxy, newArticle)
        visible.value = true

        // 如果文章发生变化，滚动到顶部
        if (oldArticle?.id !== newArticle.id) {
            // 使用 nextTick 确保 DOM 更新后再滚动
            setTimeout(() => {
                const scrollLayer = document.querySelector('.content-scroll-layer')
                if (scrollLayer) {
                    scrollLayer.scrollTo({ top: 0, behavior: 'smooth' })
                }
            }, 100)
        }
    } else {
        visible.value = false
    }
}, { immediate: true })

// 键盘事件处理
function handleKeydown(event: KeyboardEvent) {
    if (!visible.value) return

    // ESC：关闭文章
    if (event.key === 'Escape') {
        hide()
        return
    }

    // 左箭头：上一篇
    if (event.key === 'ArrowLeft' && prevArticle.value) {
        goPrev()
        return
    }

    // 右箭头：下一篇
    if (event.key === 'ArrowRight' && nextArticle.value) {
        goNext()
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
    // 初始化代码复制功能
    initCodeCopy()
})

// 组件卸载时移除键盘事件监听
onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    // 清理代码复制功能
    destroyCodeCopy()
})

defineExpose({ show, hide })
</script>

<template>
    <Transition name="article-render">
        <div v-if="visible && hasContent" class="article-render-overlay" @click="hide">
            <!-- 文章渲染器容器 -->
            <div class="article-render-container" @click.stop>
                <!-- 关闭按钮层 -->
                <div class="close-button-layer">
                    <button class="close-button" @click="hide">
                        <span class="close-icon">×</span>
                    </button>
                </div>

                <!-- 内容滚动区域 -->
                <div class="content-scroll-layer">
                    <!-- 文章头部信息 -->
                    <div class="article-header">
                        <h1 class="article-title">{{ articleDetail?.title }}</h1>
                        <p v-if="articleDetail?.subtitle" class="article-subtitle">
                            {{ articleDetail.subtitle }}
                        </p>
                        <div v-if="articleDetail?.date" class="article-meta">
                            <span class="article-date">{{ articleDetail.date }}</span>
                        </div>
                    </div>

                    <!-- Markdown 渲染内容 -->
                    <div
                        v-if="isRendering"
                        class="article-loading"
                    >
                        加载中...
                    </div>
                    <div
                        v-else
                        class="article-content markdown-body"
                        v-html="articleDetail?.htmlContent"
                    />

                    <!-- 上一篇/下一篇导航 -->
                    <div class="article-navigation">
                        <button
                            v-if="prevArticle"
                            class="nav-button nav-button-prev"
                            @click="goPrev"
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
                            @click="goNext"
                        >
                            <div class="nav-content">
                                <span class="nav-label">下一篇</span>
                                <span class="nav-title">{{ nextArticle.title }}</span>
                            </div>
                            <span class="nav-arrow">→</span>
                        </button>
                    </div>
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
    backdrop-filter: blur(8px) saturate(120%);
    -webkit-backdrop-filter: blur(8px) saturate(120%);
    z-index: 100;
    display: flex;
    align-items: flex-end; /* 从底部对齐 */
    justify-content: center;
    padding: 0;
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
        135deg,
        var(--color-surface),
        var(--color-surfaceBlur)
    );
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-radius: 30px 30px 0 0;
    box-shadow: var(--color-shadow);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--color-border);
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
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

/* ==================== 文章头部样式 ==================== */
.article-header {
    margin-bottom: 40px;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--color-border);
}

.article-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--color-text);
    margin: 0 0 15px 0;
    line-height: 1.2;
    letter-spacing: -0.5px;
}

.article-subtitle {
    font-size: 1.2rem;
    color: var(--color-textSecondary);
    margin: 0 0 15px 0;
    line-height: 1.5;
    font-weight: 400;
}

.article-meta {
    display: flex;
    gap: 15px;
    align-items: center;
}

.article-date {
    font-size: 0.9rem;
    color: var(--color-muted);
    font-weight: 500;
}

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
    /* 确保代码块有定位上下文 */
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
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    color: var(--color-text);
    white-space: nowrap;
    opacity: 0;
    transform: translateY(-4px);
    transition: all 0.2s ease;
    pointer-events: none;
    z-index: 20;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid var(--color-border);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
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

/* ==================== 动画效果 ==================== */

/* 从下往上弹出 + 淡入淡出组合动画 */
.article-render-enter-active {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.article-render-leave-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

    .article-title {
        font-size: 1.8rem;
    }

    .article-subtitle {
        font-size: 1rem;
    }

    .close-button {
        width: 38px;
        height: 38px;
    }

    .close-icon {
        font-size: 28px;
    }

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

@media (max-width: 480px) {
    .article-header {
        margin-bottom: 25px;
        padding-bottom: 15px;
    }

    .article-title {
        font-size: 1.5rem;
    }

    .markdown-body :deep(h1) {
        font-size: 1.6rem;
    }

    .markdown-body :deep(h2) {
        font-size: 1.3rem;
    }
}
</style>
