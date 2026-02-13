import { ref, computed, watch, onUnmounted } from 'vue'
import type { ArticleDetail } from '@/client/domain/doc/articleDetail'
import type { ArticleMeta } from '@/client/domain/doc/articles'
import MarkdownRenderer from '@/client/utils/markdownRenderer'

/**
 * 文章卡片 Composable
 * 用于首页文章卡片弹出的内容渲染
 */
export function useArticleCard(article: ArticleMeta) {
    // 状态
    const htmlContent = ref('')
    const isRendering = ref(false)

    // 错误状态
    const renderError = ref<Error | null>(null)

    // 防抖定时器
    let renderTimer: ReturnType<typeof setTimeout> | null = null

    /**
     * 渲染 Markdown 内容
     */
    async function render() {
        if (!article.content) return

        isRendering.value = true
        renderError.value = null

        try {
            htmlContent.value = await MarkdownRenderer.render(article.content, article.id)
        } catch (e) {
            // 渲染失败
            renderError.value = e instanceof Error ? e : new Error('渲染失败')
            console.error(`[useArticleCard] 渲染失败 (${article.id}):`, e)
        } finally {
            isRendering.value = false
        }
    }

    /**
     * 防抖渲染（300ms 延迟）
     */
    function debouncedRender() {
        // 清除上次的定时器
        if (renderTimer) {
            clearTimeout(renderTimer)
        }

        // 设置新的定时器
        renderTimer = setTimeout(() => {
            render()
            renderTimer = null
        }, 300)
    }

    // 重试渲染
    async function retryRender() {
        renderError.value = null

        // 取消防抖，立即渲染
        if (renderTimer) {
            clearTimeout(renderTimer)
            renderTimer = null
        }

        await render()
    }

    // 监听 article 变化，自动重新渲染（使用 watch 替代 watchEffect 实现防抖）
    watch(() => article, () => {
        debouncedRender()
    }, { deep: true })

    // 组件卸载时清理定时器
    onUnmounted(() => {
        if (renderTimer) {
            clearTimeout(renderTimer)
            renderTimer = null
        }
    })

    /**
     * 阅读时间（分钟）
     */
    const readingTime = computed(() => calculateReadingTime(article.content))

    /**
     * 文章摘要
     */
    const excerpt = computed(() => extractExcerpt(article.content))

    /**
     * 文章详情（包含所有增强信息）
     */
    const detail = computed<ArticleDetail>(() => ({
        ...article,
        htmlContent: htmlContent.value,
        readingTime: readingTime.value,
        excerpt: excerpt.value,
        toc: [] // TODO: 实现 TOC 提取
    }))

    return {
        detail,
        htmlContent,
        readingTime,
        excerpt,
        isRendering,
        renderError,
        retryRender
    }
}

/**
 * 计算阅读时间（基于平均阅读速度 300 字/分钟）
 */
function calculateReadingTime(content: string): number {
    // 移除 frontmatter 和代码块
    const cleanContent = content
        .replace(/^---\n[\s\S]*?\n---\n/, '') // frontmatter
        .replace(/```[\s\S]*?```/g, '') // 代码块
        .replace(/\s+/g, ' ') // 合并空白

    const wordCount = cleanContent.trim().length
    const wordsPerMinute = 300 // 中文阅读速度

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

/**
 * 提取文章摘要（前 150 字）
 */
function extractExcerpt(content: string): string {
    // 移除 frontmatter
    const body = content.replace(/^---\n[\s\S]*?\n---\n/, '')

    // 移除标题
    const withoutTitle = body.replace(/^#\s+.*$/m, '').trim()

    // 移除代码块
    const withoutCode = withoutTitle.replace(/```[\s\S]*?```/g, '').trim()

    // 取前 150 字
    const text = withoutCode.slice(0, 150)

    return text + (withoutCode.length > 150 ? '...' : '')
}
