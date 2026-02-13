<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import BackgroundSwitcher from "@/client/component/BackgroundSwitcher.vue"
import ArticleList from "@/client/component/ArticleList.vue"
import ArticleRender from "@/client/component/ArticleRender.vue"
import FilterPanel from "@/client/component/FilterPanel.vue"
import ControlPanel from "@/client/component/ControlPanel.vue"
import PageTitle from "@/client/component/PageTitle.vue"
import ProfileCard from "@/client/component/ProfileCard.vue"
import WidgetPanel from "@/client/component/widget/WidgetPanel.vue"
import LinkList from "@/client/component/LinkList.vue"
import ArticleError from '@/client/component/article/ArticleError.vue'
import { useArticleListStore } from '@/stores'
import { useArticleStore } from '@/stores'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'
import { useLayoutGesture } from '@/client/composables/useLayoutGesture'

// 使用 Pinia stores
const articleListStore = useArticleListStore()
const articleStore = useArticleStore()

// 初始化文章列表
onMounted(async () => {
  await articleListStore.initialize()
  articleStore.init()
})

// 清理
onUnmounted(() => {
  articleStore.destroy()
})

// 布局变换
const { isWidgetsMode, isLinkListMode } = useLayoutTransform()

// 获取错误状态
const loading = computed(() => articleListStore.isLoading)
const error = computed(() => articleListStore.error)
const hasError = computed(() => articleListStore.hasError)

// 全局重试
async function handleGlobalRetry() {
  await articleListStore.retryInitialize()
}

// 启用手势控制（仅在背景和 PageTitle 上生效）
useLayoutGesture({
  wheelThreshold: 100,
  swipeThreshold: 150,
  debounceTime: 300,
  targetSelector: '.page-title-container, .background-wrapper ,.link-list',
})
</script>

<template>
  <div class="main">
    <!-- 全局加载状态 -->
    <div v-if="loading" class="global-loading">
      <div class="loading-spinner"></div>
      <p>加载文章中...</p>
    </div>

    <!-- 全局错误 -->
    <div v-else-if="hasError && error" class="global-error">
      <ArticleError
        :error="error"
        @retry="handleGlobalRetry"
      />
    </div>

    <!-- 正常内容 -->
    <template v-else>
      <!-- PageTitle - 始终显示，通过 class 切换位置 -->
      <PageTitle :class="{ 'title-left': isWidgetsMode || isLinkListMode }" v-if="!isLinkListMode" />

    <!-- FilterPanel - 小组件模式下隐藏，向上移动动画 -->
    <Transition name="filter-panel-slide">
      <FilterPanel v-if="!isWidgetsMode" />
    </Transition>

    <!-- ArticleList - 小组件模式和链接列表模式下隐藏 -->
    <Transition name="article-list-slide">
      <ArticleList v-if="!isWidgetsMode && !isLinkListMode" class="articleList"/>
    </Transition>

    <!-- WidgetPanel - 仅在小组件模式下显示 -->
    <Transition name="widget-panel-slide">
      <WidgetPanel v-if="isWidgetsMode" />
    </Transition>

    <!-- LinkList - 仅在链接列表模式下显示 -->
    <Transition name="link-list-slide">
      <LinkList v-if="isLinkListMode" />
    </Transition>

    <!-- 其他组件保持不变 -->
    <BackgroundSwitcher/>
    <ArticleRender />
    <ControlPanel />
    <ProfileCard />
    </template>
  </div>
</template>

<style scoped>
.main {
  position: fixed;
  width: 100%;
  height: 100%;
}

/* 全局加载和错误样式 */
.global-loading,
.global-error {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.global-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.global-error {
  width: 90%;
  max-width: 500px;
}

/* PageTitle 位置变换 - 通过 class 平滑过渡 */
.page-title-container.title-left {
  left: calc(40% - 200px);
}

/* ArticleList 滑动动画 */
.article-list-slide-enter-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-list-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-list-slide-enter-from {
  opacity: 0;
  transform: translateX(-200%) skew(-19deg);
}

.article-list-slide-leave-to {
  opacity: 0;
  transform: translateX(-200%) skew(-19deg);
}

/* WidgetPanel 滑动动画 */
.widget-panel-slide-enter-active,
.widget-panel-slide-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-panel-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.widget-panel-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* LinkList 滑动动画 */
.link-list-slide-enter-active,
.link-list-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.link-list-slide-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.link-list-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* FilterPanel 向上移动动画 - 原路径归位 */
.filter-panel-slide-enter-active,
.filter-panel-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-panel-slide-enter-from {
  opacity: 0;
  transform: translate(-50%, -100%);
}

.filter-panel-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .page-title-container.title-left {
    left: 30%;
  }
}

@media (max-width: 768px) {
  .page-title-container.title-left {
    left: 50%;
    top: 30%;
  }
}
</style>
