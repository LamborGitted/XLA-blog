<script setup lang="ts">
import { computed } from 'vue'
import { useArticleListStore } from '@/stores'
import { SORT_OPTIONS, type SortOption } from '@/client/composables/useArticleList'
import { useLinkFilter, LINK_SORT_OPTIONS, type LinkSortOption } from '@/client/composables/useLinkFilter'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'

// 使用 Pinia store
const articleListStore = useArticleListStore()
// 链接过滤状态
const linkFilter = useLinkFilter()
// 布局状态（只调用一次）
const layout = useLayoutTransform()

// 当前是否为链接列表模式
const isLinkListMode = computed(() => layout.isLinkListMode.value)

// 当前模式下的排序选项
const currentSortOptions = computed(() =>
  isLinkListMode.value ? LINK_SORT_OPTIONS : SORT_OPTIONS
)

// 当前排序选项的元数据
const currentSortOption = computed(() => {
  const mode = isLinkListMode.value
  // linkFilter 返回的是 ref，需要 .value；articleListStore 会自动解包
  const currentSortValue = mode ? linkFilter.sortBy.value : articleListStore.sortBy
  const options = mode ? LINK_SORT_OPTIONS : SORT_OPTIONS
  return options.find(opt => opt.value === currentSortValue)
})

// 当前查询词
const currentQuery = computed({
  get: () => {
    const mode = isLinkListMode.value
    // linkFilter.query 是 ref，需要 .value；articleListStore.query 会自动解包
    return mode ? linkFilter.query.value : articleListStore.query
  },
  set: (value: string) => {
    const mode = isLinkListMode.value
    if (mode) {
      linkFilter.searchLinks(value)
    } else {
      articleListStore.searchArticles(value)
    }
  }
})

// 点击排序按钮切换到下一个排序选项
function cycleSort() {
  const mode = isLinkListMode.value
  const options = currentSortOptions.value

  // 获取当前排序值
  let currentValue: string
  if (mode) {
    currentValue = linkFilter.sortBy.value
  } else {
    currentValue = articleListStore.sortBy
  }

  const currentIndex = options.findIndex(opt => opt.value === currentValue)
  const nextIndex = (currentIndex + 1) % options.length
  const nextOption = options[nextIndex]
  if (!nextOption) return

  if (mode) {
    linkFilter.setSort(nextOption.value as LinkSortOption)
  } else {
    articleListStore.setSort(nextOption.value as SortOption)
  }
}

// 搜索输入占位符
const searchPlaceholder = computed(() =>
  layout.isLinkListMode.value ? '搜索友链...' : '搜索文章或标签...')
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
    backdrop-filter: var(--glass-blur-medium);
    -webkit-backdrop-filter: var(--glass-blur-medium);
    border-radius: 25px;
    padding: 0 16px;
    height: 44px;
    border: 1px solid var(--color-border);
    transition: all var(--duration-normal) ease;
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
    backdrop-filter: var(--glass-blur-medium);
    -webkit-backdrop-filter: var(--glass-blur-medium);
    border: 1px solid var(--color-border);
    border-radius: 25px;
    padding: 0 16px;
    height: 44px;
    cursor: pointer;
    transition: all var(--duration-normal) ease;
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

    .sort-button {
        height: 40px;
        padding: 0 14px;
    }
}

@media (max-width: 768px) {
    .filter-panel {
        top: 16px;
        left: 16px;
        right: 16px;
    }

    .sort-button {
        height: 40px;
        padding: 0 12px;
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
        flex: 1;
        min-width: 120px;
    }

    .sort-button {
        padding: 0 12px;
    }
}
</style>
