import { ref, computed } from 'vue'
import type { ArticleMeta } from '@/client/domain/doc/articles'
import {useMarkdown} from "@/client/composables/useMarkdown.ts";

function extractTitle(content: string, fallback: string) {
    const match = content.match(/^#\s+(.*)$/m)
    return match?.[1]?.trim() ?? fallback
}

function extractSubtitle(content: string): string {
    // 匹配 # 标题后面紧跟的第一行非空文本
    const match = content.match(/^#\s+.*\n\n?(.+)$/m)
    return match?.[1]?.trim() ?? ''
}

export function useArticleList() {
    // --- 原始数据 & 当前过滤后的数据
    const originalArticles = ref<ArticleMeta[]>([])
    const filteredArticles = ref<ArticleMeta[]>([])

    // 选中索引
    const selectedIndex = ref(0)
    // 搜索关键字
    const query = ref('')

    // --- 当前选中的文章
    const currentArticle = computed(() => filteredArticles.value[selectedIndex.value] ?? null)

    // --- 初始化文章列表（读取 markdown）
    function setArticlesFromMarkdown() {
        const docs = useMarkdown()

        // 为每个文档添加副标题
        originalArticles.value = docs.map(doc => ({
            ...doc,
            subtitle: doc.content ? extractSubtitle(doc.content) : ''
        }))

        filteredArticles.value = [...originalArticles.value]
        selectedIndex.value = -1
        query.value = ''
    }

    // --- 选中指定索引
    function selectByIndex(index: number) {
        if (index < 0 || index >= filteredArticles.value.length) return
        selectedIndex.value = index
    }

    // --- 搜索文章（实时搜索）
    function searchArticles(keyword: string) {
        query.value = keyword
        if (!keyword) {
            filteredArticles.value = [...originalArticles.value]
            selectedIndex.value = -1
            return
        }

        const lower = keyword.toLowerCase()
        filteredArticles.value = originalArticles.value.filter(a =>
            a.title.toLowerCase().includes(lower)
        )
        selectedIndex.value = -1
    }

    return {
        originalArticles,
        filteredArticles,
        selectedIndex,
        currentArticle,
        query,
        setArticlesFromMarkdown,
        selectByIndex,
        searchArticles
    }
}
