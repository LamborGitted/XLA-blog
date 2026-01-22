<script setup lang="ts">
import { ref, provide } from 'vue'
import BackgroundSwitcher from "@/client/component/BackgroundSwitcher.vue";
import ArticleList from "@/client/component/ArticleList.vue";
import ArticleRender from "@/client/component/ArticleRender.vue";
import FilterPanel from "@/client/component/FilterPanel.vue";
import ControlPanel from "@/client/component/ControlPanel.vue";
import PageTitle from "@/client/component/PageTitle.vue";
import ProfileCard from "@/client/component/ProfileCard.vue";
import { useArticleList } from '@/client/composables/useArticleList'

// 创建单例的 articleList 状态
const articleListState = useArticleList()

// 初始化文章列表
articleListState.setArticlesFromMarkdown()

// 提供给子组件
provide('articleListState', articleListState)
</script>

<template>
  <div class="main">
      <PageTitle />
      <FilterPanel />
      <ArticleList class="articleList"/>
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


</style>