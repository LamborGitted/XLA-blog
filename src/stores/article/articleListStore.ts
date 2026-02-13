import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ArticleMeta } from '@/client/domain/doc/articles'
import { useMarkdown, extractTitle } from '@/client/composables/useMarkdown'
import type { ArticleError } from '@/client/domain/error/articleError'
import { ErrorType, ErrorLevel } from '@/client/domain/error/articleError'
import type { ArticleLoadResult } from '@/client/domain/error/articleError'

export type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'

export interface SortOptionMeta {
  value: SortOption
  label: string
  icon: string
}

export const SORT_OPTIONS: SortOptionMeta[] = [
  { value: 'date-desc', label: '最新', icon: '↓' },
  { value: 'date-asc', label: '最早', icon: '↑' },
  { value: 'title-asc', label: 'A-Z', icon: 'A' },
  { value: 'title-desc', label: 'Z-A', icon: 'Z' }
]

function extractSubtitle(content: string): string {
  const match = content.match(/^#\s+.*\n\n?(.+)$/m)
  return match?.[1]?.trim() ?? ''
}

export const useArticleListStore = defineStore('articleList', () => {
  // State
  const originalArticles = ref<ArticleMeta[]>([])
  const filteredArticles = ref<ArticleMeta[]>([])
  const selectedIndex = ref(-1)
  const query = ref('')
  const sortBy = ref<SortOption>('date-desc')

  // 错误状态管理
  const loading = ref(false)
  const error = ref<ArticleError | null>(null)
  const failedArticles = ref<Map<string, ArticleError>>(new Map())

  // Computed
  const currentArticle = computed(() => {
    if (selectedIndex.value === -1) return null
    return filteredArticles.value[selectedIndex.value] ?? null
  })

  const prevArticle = computed(() => {
    if (selectedIndex.value <= 0) return null
    return filteredArticles.value[selectedIndex.value - 1] ?? null
  })

  const nextArticle = computed(() => {
    if (selectedIndex.value === -1 || selectedIndex.value >= filteredArticles.value.length - 1) return null
    return filteredArticles.value[selectedIndex.value + 1] ?? null
  })

  // 错误状态计算属性
  const hasError = computed(() => error.value !== null)
  const isLoading = computed(() => loading.value)

  // Actions
  function sortArticles(articles: ArticleMeta[], sortOption: SortOption): ArticleMeta[] {
    const sorted = [...articles]

    switch (sortOption) {
      case 'date-desc':
        return sorted.sort((a, b) => {
          const aTime = a.date ? new Date(a.date).getTime() : 0
          const bTime = b.date ? new Date(b.date).getTime() : 0
          return bTime - aTime
        })
      case 'date-asc':
        return sorted.sort((a, b) => {
          const aTime = a.date ? new Date(a.date).getTime() : 0
          const bTime = b.date ? new Date(b.date).getTime() : 0
          return aTime - bTime
        })
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'))
      default:
        return sorted
    }
  }

  function applyFilterAndSort() {
    let result = [...originalArticles.value]

    // 搜索过滤（标题 + 标签）
    if (query.value) {
      const lower = query.value.toLowerCase()
      result = result.filter(article => {
        // 标题匹配
        const titleMatch = article.title.toLowerCase().includes(lower)

        // 标签匹配（部分匹配）
        const tagMatch = article.tags?.some(tag =>
          tag.toLowerCase().includes(lower)
        )

        // 标题 OR 标签匹配即可
        return titleMatch || tagMatch
      })
    }

    // 排序
    result = sortArticles(result, sortBy.value)

    filteredArticles.value = result
    selectedIndex.value = -1
  }

  async function initialize() {
    loading.value = true
    error.value = null
    failedArticles.value.clear()

    try {
      // 调用 useMarkdown 加载文章
      const loadResults = await useMarkdown()

      // 分离成功和失败的文章
      const successful: ArticleMeta[] = []
      const failed: ArticleError[] = []

      for (const result of loadResults) {
        if (result.success && result.article) {
          successful.push(result.article)
        } else if (result.error) {
          failed.push(result.error)
          if (result.error.articleId) {
            failedArticles.value.set(result.error.articleId, result.error)
          }
        }
      }

      // 记录加载成功的文章
      originalArticles.value = successful.map(doc => ({
        ...doc,
        subtitle: doc.content ? extractSubtitle(doc.content) : ''
      }))

      // 如果有失败的文章，记录警告
      if (failed.length > 0) {
        console.warn(`[ArticleListStore] ${failed.length} 篇文章加载失败:`, failed)
      }

      // 如果全部失败，设置全局错误
      if (successful.length === 0) {
        error.value = {
          type: ErrorType.INIT,
          level: ErrorLevel.FATAL,
          message: '所有文章加载失败，请刷新页面重试',
          timestamp: Date.now()
        }
      }

      applyFilterAndSort()
    } catch (e) {
      // 捕获未预期的错误
      error.value = {
        type: ErrorType.INIT,
        level: ErrorLevel.FATAL,
        message: e instanceof Error ? e.message : '初始化失败',
        timestamp: Date.now(),
        details: e
      }
    } finally {
      loading.value = false
    }
  }

  // 重试初始化
  async function retryInitialize() {
    await initialize()
  }

  function selectByIndex(index: number) {
    if (index < 0 || index >= filteredArticles.value.length) return
    selectedIndex.value = index
  }

  function searchArticles(keyword: string) {
    query.value = keyword
    applyFilterAndSort()
  }

  function setSort(option: SortOption) {
    sortBy.value = option
    applyFilterAndSort()
  }

  function cycleSort() {
    const currentIndex = SORT_OPTIONS.findIndex(opt => opt.value === sortBy.value)
    const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length
    const nextOption = SORT_OPTIONS[nextIndex]
    if (nextOption) {
      setSort(nextOption.value)
    }
  }

  function goPrev() {
    if (prevArticle.value) {
      selectedIndex.value = selectedIndex.value - 1
    }
  }

  function goNext() {
    if (nextArticle.value) {
      selectedIndex.value = selectedIndex.value + 1
    }
  }

  return {
    // State
    originalArticles,
    filteredArticles,
    selectedIndex,
    query,
    sortBy,
    loading,
    error,
    hasError,
    failedArticles,

    // Computed
    currentArticle,
    prevArticle,
    nextArticle,
    isLoading,

    // Actions
    initialize,
    retryInitialize,
    selectByIndex,
    searchArticles,
    setSort,
    cycleSort,
    goPrev,
    goNext
  }
})
