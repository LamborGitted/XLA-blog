<script setup lang="ts">
import { ref, provide } from 'vue'
import BackgroundSwitcher from "@/client/component/BackgroundSwitcher.vue";
import ArticleList from "@/client/component/ArticleList.vue";
import ArticleRender from "@/client/component/ArticleRender.vue";
import FilterPanel from "@/client/component/FilterPanel.vue";
import ControlPanel from "@/client/component/ControlPanel.vue";
import PageTitle from "@/client/component/PageTitle.vue";
import ProfileCard from "@/client/component/ProfileCard.vue";
import WidgetPanel from "@/client/component/widget/WidgetPanel.vue";
import { useArticleList } from '@/client/composables/useArticleList'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'

// 创建单例的 articleList 状态
const articleListState = useArticleList()

// 初始化文章列表
articleListState.setArticlesFromMarkdown()

// 提供给子组件
provide('articleListState', articleListState)

// 布局变换
const { isWidgetsMode } = useLayoutTransform()
</script>

<template>
  <div class="main">
      <!-- PageTitle - 始终显示，通过 class 切换位置 -->
      <PageTitle :class="{ 'title-left': isWidgetsMode }" />

      <!-- FilterPanel - 始终显示 -->
      <FilterPanel />

      <!-- ArticleList - 小组件模式下隐藏 -->
      <Transition name="article-list-slide">
        <ArticleList v-if="!isWidgetsMode" class="articleList"/>
      </Transition>

      <!-- WidgetPanel - 仅在小组件模式下显示 -->
      <Transition name="widget-panel-slide">
        <WidgetPanel v-if="isWidgetsMode" />
      </Transition>

      <!-- 其他组件保持不变 -->
      <BackgroundSwitcher/>
      <ArticleRender />
      <ControlPanel />
      <ProfileCard />
  </div>
</template>

<style scoped>
.main {
  position: fixed;
  width: 100%;
  height: 100%;
}

/* PageTitle 位置变换 - 通过 class 平滑过渡 */
.page-title-container.title-left {
  left: calc(50%- 100px);
}

/* ArticleList 滑动动画 */
.article-list-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-list-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-list-slide-enter-from {
  opacity: 0;
  transform: translateX(-100%);
}

.article-list-slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* WidgetPanel 滑动动画 */
.widget-panel-slide-enter-active,
.widget-panel-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-panel-slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.widget-panel-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .page-title-container.title-left {
    left: 10%;
  }
}

@media (max-width: 768px) {
  .page-title-container.title-left {
    left: 50%;
    top: 30%;
  }
}
</style>