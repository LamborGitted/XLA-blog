// src/client/composables/useLinkFilter.ts

import { ref, computed } from 'vue'
import type { LinkSection, LinkItem } from '@/client/domain/linkList/linkList'

/**
 * 排序选项类型
 */
export type LinkSortOption = 'default' | 'name-asc' | 'name-desc'

/**
 * 排序选项配置
 */
export interface SortOptionConfig {
  value: LinkSortOption
  label: string
  icon: string
}

/**
 * 排序选项
 */
export const LINK_SORT_OPTIONS: SortOptionConfig[] = [
  { value: 'default', label: '默认', icon: '⊙' },
  { value: 'name-asc', label: '名称 A-Z', icon: '↑' },
  { value: 'name-desc', label: '名称 Z-A', icon: '↓' },
]

/**
 * 链接过滤状态（单例）
 */
class LinkFilterState {
  private _allLinks: LinkSection[] = []
  private _query = ref('')
  private _sortBy = ref<LinkSortOption>('default')

  /**
   * 设置所有链接数据
   */
  setAllLinks(sections: LinkSection[]) {
    this._allLinks = sections
  }

  /**
   * 获取查询词
   */
  get query() {
    return this._query
  }

  /**
   * 设置查询词
   */
  setQuery(value: string) {
    this._query.value = value
  }

  /**
   * 获取排序方式
   */
  get sortBy() {
    return this._sortBy
  }

  /**
   * 设置排序方式
   */
  setSort(value: LinkSortOption) {
    this._sortBy.value = value
  }

  /**
   * 过滤和排序后的链接
   */
  get filteredLinks(): LinkSection[] {
    let sections = [...this._allLinks]

    // 1. 搜索过滤
    if (this._query.value.trim()) {
      const query = this._query.value.toLowerCase().trim()

      sections = sections
        .map(section => ({
          ...section,
          links: section.links.filter(link =>
            link.title.toLowerCase().includes(query) ||
            link.description.toLowerCase().includes(query) ||
            link.url.toLowerCase().includes(query)
          ),
        }))
        .filter(section => section.links.length > 0)
    }

    // 2. 排序
    if (this._sortBy.value !== 'default') {
      sections = sections.map(section => ({
        ...section,
        links: [...section.links].sort((a, b) => {
          const comparison = a.title.localeCompare(b.title, 'zh-CN')
          return this._sortBy.value === 'name-asc' ? comparison : -comparison
        }),
      }))
    }

    return sections
  }

  /**
   * 搜索链接
   */
  searchLinks(query: string) {
    this._query.value = query
  }
}

// 导出单例
const linkFilterState = new LinkFilterState()

/**
 * 链接过滤 Composable
 */
export function useLinkFilter() {
  return {
    // 状态
    query: linkFilterState.query,
    sortBy: linkFilterState.sortBy,
    filteredLinks: computed(() => linkFilterState.filteredLinks),

    // 方法
    setAllLinks: (sections: LinkSection[]) => linkFilterState.setAllLinks(sections),
    searchLinks: (query: string) => linkFilterState.searchLinks(query),
    setSort: (option: LinkSortOption) => linkFilterState.setSort(option),
  }
}
