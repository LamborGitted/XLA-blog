import { ref, computed } from 'vue'
import type { ArticleMeta } from '@/client/domain/doc/articles'
import {useMarkdown} from "@/client/composables/useMarkdown.ts"

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

function extractTitle(content: string, fallback: string) {
    const match = content.match(/^#\s+(.*)$/m)
    return match?.[1]?.trim() ?? fallback
}

function extractSubtitle(content: string): string {
    const match = content.match(/^#\s+.*\n\n?(.+)$/m)
    return match?.[1]?.trim() ?? ''
}

export function useArticleList() {
    // --- 原始数据 & 当前过滤后的数据
    const originalArticles = ref<ArticleMeta[]>([])
    const filteredArticles = ref<ArticleMeta[]>([])

    // 选中索引
    const selectedIndex = ref(-1)
    // 搜索关键字
    const query = ref('')
    // 排序选项
    const sortBy = ref<SortOption>('date-desc')

    // --- 当前选中的文章
    const currentArticle = computed(() => {
        if (selectedIndex.value === -1) return null
        return filteredArticles.value[selectedIndex.value] ?? null
    })

    // --- 排序函数
    function sortArticles(articles: ArticleMeta[], sortOption: SortOption): ArticleMeta[] {
        const sorted = [...articles]

        switch (sortOption) {
            case 'date-desc':
                return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            case 'date-asc':
                return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            case 'title-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'))
            case 'title-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'))
            default:
                return sorted
        }
    }

    // --- 应用搜索和排序
    function applyFilterAndSort() {
        let result = [...originalArticles.value]

        // 搜索过滤
        if (query.value) {
            const lower = query.value.toLowerCase()
            result = result.filter(a =>
                a.title.toLowerCase().includes(lower)
            )
        }

        // 排序
        result = sortArticles(result, sortBy.value)

        filteredArticles.value = result
        selectedIndex.value = -1
    }

    // --- 初始化文章列表（读取 markdown）
    function setArticlesFromMarkdown() {
        const docs = useMarkdown()

        originalArticles.value = docs.map(doc => ({
            ...doc,
            subtitle: doc.content ? extractSubtitle(doc.content) : ''
        }))

        applyFilterAndSort()
    }

    // --- 选中指定索引
    function selectByIndex(index: number) {
        if (index < 0 || index >= filteredArticles.value.length) return
        selectedIndex.value = index
    }

    // --- 搜索文章（实时搜索）
    function searchArticles(keyword: string) {
        query.value = keyword
        applyFilterAndSort()
    }

    // --- 设置排序方式
    function setSort(option: SortOption) {
        sortBy.value = option
        applyFilterAndSort()
    }

    // --- 切换排序方式（循环）
    function cycleSort() {
        const currentIndex = SORT_OPTIONS.findIndex(opt => opt.value === sortBy.value)
        const nextIndex = (currentIndex + 1) % SORT_OPTIONS.length
        setSort(SORT_OPTIONS[nextIndex].value)
    }

    // --- 上一篇/下一篇文章
    const prevArticle = computed(() => {
        if (selectedIndex.value <= 0) return null
        return filteredArticles.value[selectedIndex.value - 1] ?? null
    })

    const nextArticle = computed(() => {
        if (selectedIndex.value === -1 || selectedIndex.value >= filteredArticles.value.length - 1) return null
        return filteredArticles.value[selectedIndex.value + 1] ?? null
    })

    // --- 导航到上一篇/下一篇
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
        originalArticles,
        filteredArticles,
        selectedIndex,
        currentArticle,
        prevArticle,
        nextArticle,
        query,
        sortBy,
        setArticlesFromMarkdown,
        selectByIndex,
        searchArticles,
        setSort,
        cycleSort,
        goPrev,
        goNext
    }
}
