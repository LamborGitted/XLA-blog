<script setup lang="ts">
import { ref, provide } from 'vue'
import BackgroundSwitcher from "@/client/component/BackgroundSwitcher.vue";
import ArticleList from "@/client/component/ArticleList.vue";
import ArticleRender from "@/client/component/ArticleRender.vue";
import SearchBox from "@/client/component/SearchBox.vue";
import NavBar from "@/client/Layout/NavBar.vue";
import { useArticleList } from '@/client/composables/useArticleList'

// 创建单例的 articleList 状态
const articleListState = useArticleList()

// 初始化文章列表
articleListState.setArticlesFromMarkdown()

// 默认不选中任何文章
articleListState.selectedIndex.value = -1

// 提供给子组件
provide('articleListState', articleListState)

const searchBoxRef = ref<InstanceType<typeof SearchBox> | null>(null)
function showSearch() {
  searchBoxRef.value?.show()
}


</script>

<template>

  <div class="main">
      <ArticleList class="articleList"/>
      <BackgroundSwitcher/>
      <ArticleRender />
<!--      <GlassButton class="button">默认</GlassButton>-->
<!--    <GlassButton @click="showSearch">搜索文章</GlassButton>-->
      <SearchBox ref="searchBoxRef" />
    <!-- <NavBar/> -->
  </div>


</template>

<style scoped>
.main {
  position: fixed;
  width: 100%;
  height: 100%;
}


</style>