<script setup lang="ts">
import { ref, computed, reactive, watch, nextTick, toRef } from 'vue'
import { useArticleListStore } from '@/stores'
import { useArticleStore } from '@/stores'
import { useArticleCard } from '@/client/composables/useArticleDetail'
import { useArticleScroll } from '@/client/composables/article'
import ArticleLayout from './article/ArticleLayout.vue'
import ArticleHeader from './article/ArticleHeader.vue'
import ArticleContent from './article/ArticleContent.vue'
import ArticleNavigation from './article/ArticleNavigation.vue'

// 使用 Pinia stores
const articleListStore = useArticleListStore()
const articleStore = useArticleStore()

const currentArticle = toRef(articleListStore, 'currentArticle')
const selectedIndex = toRef(articleListStore, 'selectedIndex')
const prevArticle = toRef(articleListStore, 'prevArticle')
const nextArticle = toRef(articleListStore, 'nextArticle')
const goPrev = articleListStore.goPrev
const goNext = articleListStore.goNext

// 滚动管理
const { scrollToTop } = useArticleScroll()

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

// 显示/隐藏
function show() { visible.value = true }

function hide() {
  // 使用 articleStore 关闭文章（会更新 URL 并清空 selectedIndex）
  // watch 会自动处理 visible 的变化
  articleStore.closeArticle()
}

// 监听文章变化，更新 proxy 并显示/隐藏
watch(currentArticle, async (newArticle, oldArticle) => {
  if (newArticle) {
    // 更新 proxy 的属性
    Object.assign(articleProxy, newArticle)
    visible.value = true

    // 如果文章发生变化，滚动到顶部
    if (oldArticle?.id !== newArticle.id) {
      await scrollToTop()
    }
  } else {
    visible.value = false
  }
}, { immediate: true })

defineExpose({ show, hide })
</script>

<template>
  <ArticleLayout
    :visible="visible"
    :article="currentArticle"
    @close="hide"
  >
    <!-- 文章头部信息 -->
    <ArticleHeader :article="articleDetail" />

    <!-- Markdown 渲染内容 -->
    <ArticleContent
      :article="articleDetail"
      :is-rendering="isRendering"
    />

    <!-- 上一篇/下一篇导航 -->
    <ArticleNavigation
      :prev-article="prevArticle"
      :next-article="nextArticle"
      @navigate-prev="goPrev"
      @navigate-next="goNext"
    />
  </ArticleLayout>
</template>

<style scoped>
/* 薄包装层：样式由子组件处理 */
</style>
