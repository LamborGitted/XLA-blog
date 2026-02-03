import { watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import type { useArticleList } from './useArticleList'

/**
 * 文章状态管理 Composable
 * 管理 URL 参数与文章选择的同步，支持浏览器前进/后退
 */
export function useArticleState(articleListState: ReturnType<typeof useArticleList>) {
  const route = useRoute()
  const { filteredArticles, selectedIndex, selectByIndex } = articleListState

  // 用于防止循环更新 URL 的标志
  let isUpdatingFromURL = false

  /**
   * 根据文章 path 查找在当前过滤列表中的索引
   */
  function findIndexByPath(path: string): number {
    return filteredArticles.value.findIndex(article => article.path === path)
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
    if (index < 0 || index >= filteredArticles.value.length) return
    selectByIndex(index)

    const article = filteredArticles.value[index]
    if (article) {
      updateURL(article.path)
    }
  }

  /**
   * 关闭文章（清除 URL）
   */
  function closeArticle() {
    selectedIndex.value = -1
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
        selectByIndex(index)
        // 恢复完成后，延迟重置标志
        setTimeout(() => {
          isUpdatingFromURL = false
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
        selectByIndex(index)
      } else {
        // URL 中的文章不存在，清除 URL
        updateURL(null)
      }
    } else {
      // 没有 article 参数，关闭文章
      selectedIndex.value = -1
    }

    // 延迟重置标志
    setTimeout(() => {
      isUpdatingFromURL = false
    }, 0)
  }

  /**
   * 监听 selectedIndex 变化，同步 URL
   * 这确保了通过代码方式改变 selectedIndex 时也会更新 URL
   */
  watch(selectedIndex, (newIndex) => {
    // 如果是从 URL 恢复的，不需要再更新 URL
    if (isUpdatingFromURL) return

    if (newIndex === -1) {
      updateURL(null)
    } else {
      const article = filteredArticles.value[newIndex]
      if (article) {
        updateURL(article.path)
      }
    }
  })

  // 初始化
  onMounted(() => {
    restoreFromURL()
    window.addEventListener('popstate', handlePopState)
  })

  onUnmounted(() => {
    window.removeEventListener('popstate', handlePopState)
  })

  return {
    openArticle,
    closeArticle
  }
}
