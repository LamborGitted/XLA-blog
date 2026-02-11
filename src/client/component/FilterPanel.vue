<script setup lang="ts">
import { inject, computed, ref } from 'vue'
import type { useArticleList } from '@/client/composables/useArticleList'
import { SORT_OPTIONS, type SortOption } from '@/client/composables/useArticleList'
import { useLinkFilter, LINK_SORT_OPTIONS, type LinkSortOption } from '@/client/composables/useLinkFilter'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'

const articleListState = inject<ReturnType<typeof useArticleList>>('articleListState')!
const { query: articleQuery, searchArticles, sortBy: articleSortBy, setSort: setArticleSort } = articleListState

const linkFilter = useLinkFilter()
const { query: linkQuery, searchLinks: searchLinkFilter, sortBy: linkSortBy, setSort: setLinkSort } = linkFilter

const { isLinkListMode } = useLayoutTransform()

// 当前模式下的排序选项
const currentSortOptions = computed(() =>
  isLinkListMode.value ? LINK_SORT_OPTIONS : SORT_OPTIONS
)

// 当前排序选项的元数据
const currentSortOption = computed(() =>
  isLinkListMode.value
    ? LINK_SORT_OPTIONS.find(opt => opt.value === linkSortBy.value)
    : SORT_OPTIONS.find(opt => opt.value === articleSortBy.value)
)

// 当前查询词
const currentQuery = computed({
  get: () => isLinkListMode.value ? linkQuery.value : articleQuery.value,
  set: (value: string) => {
    if (isLinkListMode.value) {
      searchLinkFilter(value)
    } else {
      searchArticles(value)
    }
  }
})

// 点击排序按钮切换到下一个排序选项
function cycleSort() {
  const options = currentSortOptions.value
  const currentValue = isLinkListMode.value ? linkSortBy.value : articleSortBy.value
  const currentIndex = options.findIndex(opt => opt.value === currentValue)
  const nextIndex = (currentIndex + 1) % options.length
  const nextOption = options[nextIndex]
  if (!nextOption) return

  if (isLinkListMode.value) {
    setLinkSort(nextOption.value as LinkSortOption)
  } else {
    setArticleSort(nextOption.value as SortOption)
  }
}

// 搜索输入占位符
const searchPlaceholder = computed(() =>
  isLinkListMode.value ? '搜索友链...' : '搜索文章或标签...'
)
</script>

<template>
    <div class="filter-panel">

      <!-- 排序按钮 -->
      <button class="sort-button" @click="cycleSort">
        <span class="sort-icon">{{ currentSortOption?.icon }}</span>
        <span class="sort-label">{{ currentSortOption?.label }}</span>
      </button>

        <!-- 搜索框 -->
        <div class="search-wrapper">
            <input
                v-model="currentQuery"
                class="search-input"
                type="text"
                :placeholder="searchPlaceholder"
            />
            <div class="search-icon"></div>
        </div>

        </div>
</template>

<style scoped>
.filter-panel {
    position: absolute;
    top: 24px;
    left: 50%;
    transform: translate(-50%);
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 30;
}

/* 搜索框样式 */
.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--color-surface);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border-radius: 25px;
    padding: 0 16px;
    height: 44px;
    border: 1px solid var(--color-border);
    transition: all 0.3s ease;
}

.search-wrapper:hover {
    background: var(--color-surface);
    opacity: 0.9;
}

.search-wrapper:focus-within {
    background: var(--color-surface);
    box-shadow: var(--color-shadow);
    border-color: var(--color-primary);
}

.search-input {
    width: 180px;
    padding: 0;
    border: none;
    outline: none;
    background: transparent;
    font-size: 14px;
    color: var(--color-text);
}

.search-input::placeholder {
    color: var(--color-textSecondary);
}

.search-icon {
    font-size: 18px;
}

/* 排序按钮样式 */
.sort-button {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--color-surface);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
    border: 1px solid var(--color-border);
    border-radius: 25px;
    padding: 0 16px;
    height: 44px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.sort-button:hover {
    background: var(--color-surface);
    opacity: 0.9;
    transform: scale(1.05);
}

.sort-button:active {
    transform: scale(0.95);
}

.sort-icon {
    font-size: 14px;
    font-weight: bold;
    color: var(--color-text);
}

.sort-label {
    font-size: 13px;
    font-weight: 500;
    color: var(--color-text);
}

/* 响应式设计 */
@media (max-width: 1200px) {
    .filter-panel {
        left: 50%;
        transform: translate(-50%);
    }
}

@media (max-width: 1024px) {
    .filter-panel {
        left: 24px;
        transform: none;
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .search-input {
        width: 150px;
    }
}

@media (max-width: 768px) {
    .filter-panel {
        top: 16px;
        left: 16px;
        right: 16px;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
    }

    .search-wrapper {
        flex: 1;
        min-width: 120px;
    }

    .search-input {
        width: 100%;
        font-size: 13px;
    }

    .sort-button {
        height: 40px;
        padding: 0 14px;
    }

    .sort-label {
        display: none;
    }
}

@media (max-width: 480px) {
    .filter-panel {
        top: 12px;
        gap: 8px;
    }

    .search-wrapper {
        height: 38px;
        padding: 0 12px;
    }

    .sort-button {
        height: 38px;
        padding: 0 12px;
    }
}
</style>
