<script setup lang="ts">
import { ref, computed, reactive, watch, inject } from 'vue'
import type { useArticleList } from '@/client/composables/useArticleList'
import { useArticleCard } from '@/client/composables/useArticleDetail'

// 使用父组件提供的状态
const articleListState = inject<ReturnType<typeof useArticleList>>('articleListState')!
const { currentArticle, selectedIndex, prevArticle, nextArticle, goPrev, goNext } = articleListState

// 组件状态
const visible = ref(false)

// 创建响应式文章对象供 useArticleCard 使用
const articleProxy = reactive({
    title: '',
    path: '',
    content: '',
    date: ''
})

// 使用 useArticleCard 获取渲染逻辑
const { detail, isRendering } = useArticleCard(articleProxy)

// 当前文章详情
const articleDetail = computed(() => detail.value)

// 是否有文章内容
const hasContent = computed(() => !!currentArticle.value)

// 显示/隐藏
function show() { visible.value = true }
function hide() {
    visible.value = false
    selectedIndex.value = -1
}

// 监听文章变化，更新 proxy 并显示
watch(currentArticle, (newArticle) => {
    if (newArticle) {
        // 更新 proxy 的属性
        Object.assign(articleProxy, newArticle)
        show()
    }
}, { immediate: true })

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

/* 第二层：文章渲染器容器 - 从下往上弹出 */
.article-render-container {
    position: relative;
    width: 100%;
    max-width: 900px;
    height: 85vh;
    margin: 0 auto;
    background: linear-gradient(
        135deg,
        rgba(255, 255, 255, 0.92),
        rgba(255, 255, 255, 0.88)
    );
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-radius: 30px 30px 0 0;
    box-shadow:
        0 -10px 40px rgba(0, 0, 0, 0.15),
        0 0 0 1px rgba(255, 255, 255, 0.3) inset;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
    background: rgba(0, 0, 0, 0.08);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.close-button:hover {
    background: rgba(0, 0, 0, 0.15);
    transform: rotate(90deg) scale(1.1);
}

.close-button:active {
    transform: rotate(90deg) scale(0.95);
}

.close-icon {
    font-size: 32px;
    color: #333;
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
    background: rgba(0, 0, 0, 0.15);
    border-radius: 4px;
}

.content-scroll-layer::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
}

/* ==================== 文章头部样式 ==================== */
.article-header {
    margin-bottom: 40px;
    padding-bottom: 25px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.article-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 15px 0;
    line-height: 1.2;
    letter-spacing: -0.5px;
}

.article-subtitle {
    font-size: 1.2rem;
    color: #666;
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
    color: #999;
    font-weight: 500;
}

/* ==================== 加载状态 ==================== */
.article-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    font-size: 1.1rem;
    color: #666;
}

/* ==================== Markdown 内容样式 ==================== */
.article-content {
    color: #2c3e50;
    line-height: 1.8;
    font-size: 1.05rem;
}

/* Markdown 基础样式 */
.markdown-body :deep(h1) {
    font-size: 2rem;
    font-weight: 700;
    margin: 40px 0 20px 0;
    color: #1a1a1a;
    padding-bottom: 10px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
}

.markdown-body :deep(h2) {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 35px 0 15px 0;
    color: #2c3e50;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.markdown-body :deep(h3) {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 30px 0 12px 0;
    color: #34495e;
}

.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 25px 0 10px 0;
    color: #34495e;
}

.markdown-body :deep(p) {
    margin: 0 0 1.2em 0;
}

.markdown-body :deep(a) {
    color: #3498db;
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
}

.markdown-body :deep(a:hover) {
    border-bottom-color: #3498db;
}

.markdown-body :deep(code) {
    background: rgba(0, 0, 0, 0.06);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Consolas', 'Monaco', monospace;
    font-size: 0.9em;
    color: #e74c3c;
}

.markdown-body :deep(pre) {
    background: #282c34;
    border-radius: 8px;
    padding: 20px;
    overflow-x: auto;
    margin: 20px 0;
}

.markdown-body :deep(pre code) {
    background: transparent;
    padding: 0;
    color: #abb2bf;
}

.markdown-body :deep(blockquote) {
    border-left: 4px solid #3498db;
    padding-left: 20px;
    margin: 20px 0;
    color: #7f8c8d;
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
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
}

.markdown-body :deep(th) {
    background: rgba(0, 0, 0, 0.05);
    font-weight: 600;
}

.markdown-body :deep(tr:hover) {
    background: rgba(0, 0, 0, 0.02);
}

/* ==================== 文章导航样式 ==================== */
.article-navigation {
    display: flex;
    gap: 20px;
    margin-top: 50px;
    padding-top: 30px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.nav-button {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(0, 0, 0, 0.03);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: left;
}

.nav-button:hover {
    background: rgba(0, 0, 0, 0.06);
    border-color: rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
    color: #333;
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
    color: #999;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.nav-title {
    font-size: 14px;
    color: #333;
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
