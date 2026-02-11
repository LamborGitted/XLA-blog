import { defineStore } from 'pinia'
import { watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useArticleListStore } from './articleListStore'

/**
 * 文章 URL 同步 Store
 * 管理 URL 参数与文章选择的同步，支持浏览器前进/后退
 */
export const useArticleStore = defineStore('article', () => {
  const articleListStore = useArticleListStore()
  const route = useRoute()

  // 用于防止循环更新 URL 的标志
  let isUpdatingFromURL = false
  // 存储 setTimeout 定时器引用，用于清理
  let resetFlagTimer: ReturnType<typeof setTimeout> | null = null

  /**
   * 根据文章 path 查找在当前过滤列表中的索引
   */
  function findIndexByPath(path: string): number {
    return articleListStore.filteredArticles.findIndex(article => article.path === path)
  }

  /**
   * 更新 URL（不触发路由跳转）
   */
  function updateURL(path: string | null) {
    const url = path ? `?article=${encodeURIComponent(path)}` : '/'
    // 使用 replaceState 更新 URL，不触发路由跳转，不添加历史记录
    window.history.replaceState({}, '', url)
  }

  /**
   * 打开文章（更新 URL）
   */
  function openArticle(index: number) {
    const length = articleListStore.filteredArticles.length
    if (index < 0 || index >= length) return
    articleListStore.selectByIndex(index)

    const article = articleListStore.filteredArticles[index]
    if (article) {
      updateURL(article.path)
    }
  }

  /**
   * 关闭文章（清除 URL）
   */
  function closeArticle() {
    articleListStore.selectedIndex = -1
    updateURL(null)
  }

  /**
   * 页面加载时从 URL 恢复文章状态
   */
  function restoreFromURL() {
    const articlePath = route.query.article as string | undefined
    if (articlePath) {
      const index = findIndexByPath(articlePath)
      if (index !== -1) {
        isUpdatingFromURL = true
        articleListStore.selectByIndex(index)
        // 恢复完成后，延迟重置标志
        resetFlagTimer = setTimeout(() => {
          isUpdatingFromURL = false
          resetFlagTimer = null
        }, 0)
      }
    }
  }

  /**
   * 监听浏览器前进/后退
   */
  function handlePopState() {
    const params = new URLSearchParams(window.location.search)
    const articlePath = params.get('article')

    isUpdatingFromURL = true

    if (articlePath) {
      const index = findIndexByPath(articlePath)
      if (index !== -1) {
        articleListStore.selectByIndex(index)
      } else {
        // URL 中的文章不存在，清除 URL
        updateURL(null)
      }
    } else {
      // 没有 article 参数，关闭文章
      articleListStore.selectedIndex = -1
    }

    // 延迟重置标志
    if (resetFlagTimer) {
      clearTimeout(resetFlagTimer)
    }
    resetFlagTimer = setTimeout(() => {
      isUpdatingFromURL = false
      resetFlagTimer = null
    }, 0)
  }

  /**
   * 监听 selectedIndex 变化，同步 URL
   * 这确保了通过代码方式改变 selectedIndex 时也会更新 URL
   */
  watch(() => articleListStore.selectedIndex, (newIndex) => {
    // 如果是从 URL 恢复的，不需要再更新 URL
    if (isUpdatingFromURL) return

    if (newIndex === -1) {
      updateURL(null)
    } else {
      const article = articleListStore.filteredArticles[newIndex]
      if (article) {
        updateURL(article.path)
      }
    }
  })

  // 初始化
  function init() {
    restoreFromURL()
    window.addEventListener('popstate', handlePopState)
  }

  // 清理
  function destroy() {
    window.removeEventListener('popstate', handlePopState)
    // 清理定时器，防止组件卸载后执行
    if (resetFlagTimer) {
      clearTimeout(resetFlagTimer)
      resetFlagTimer = null
    }
  }

  return {
    openArticle,
    closeArticle,
    init,
    destroy
  }
})
