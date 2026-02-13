import MarkdownIt from 'markdown-it'
import DOMPurify from 'dompurify'
import { createHighlighter } from 'shiki'

// 单例高亮器
let highlighterInstance: Awaited<ReturnType<typeof createHighlighter>> | null = null

/**
 * 获取或创建 Shiki 高亮器实例
 */
async function getHighlighter() {
    if (!highlighterInstance) {
        highlighterInstance = await createHighlighter({
            themes: ['github-dark'],
            langs: [
                'ts',
                'tsx',
                'js',
                'jsx',
                'vue',
                'bash',
                'sh',
                'json',
                'rust',
                'cpp',
                'c',
                'python',
                'java',
                'go',
                'nix',
                'yaml',
                'toml',
                'css',
                'html',
                'markdown',
                'text'
            ]
        })
    }
    return highlighterInstance
}

/**
 * Markdown 渲染器类
 * 单例模式，全局共享一个实例
 */
class MarkdownRenderer {
    private static instance: MarkdownIt | null = null
    private static initializing = false

    /**
     * 获取或创建 MarkdownIt 实例
     */
    static async getInstance(): Promise<MarkdownIt> {
        if (this.instance) {
            return this.instance
        }

        // 防止并发初始化
        if (this.initializing) {
            // 等待初始化完成
            await new Promise(resolve => setTimeout(resolve, 100))
            return this.getInstance()
        }

        this.initializing = true

        try {
            const highlighter = await getHighlighter()

            this.instance = MarkdownIt({
                html: true,        // 允许 HTML 标签
                linkify: true,     // 自动转换 URL 为链接
                typographer: true, // 启用印刷优化
                breaks: true,      // 转换换行符为 <br>
            })

            // 配置代码高亮
            this.instance.options.highlight = (code, lang) => {
                const language = lang || 'text'
                try {
                    return highlighter.codeToHtml(code, {
                        lang: language,
                        theme: 'github-dark'
                    })
                } catch (e) {
                    // 降级处理：返回未高亮的代码
                    return `<pre><code class="language-${language}">${code}</code></pre>`
                }
            }

            return this.instance
        } finally {
            this.initializing = false
        }
    }

    /**
     * 移除 YAML frontmatter
     */
    private static removeFrontmatter(markdown: string): string {
        // 匹配 --- 包裹的 YAML frontmatter
        const frontmatterRegex = /^---\r?\n[\s\S]*?\r?\n---\r?\n?/
        return markdown.replace(frontmatterRegex, '')
    }

    /**
     * 渲染 Markdown 为 HTML（带 XSS 防护）
     * @param markdown - Markdown 内容
     * @param articleId - 文章 ID（用于错误日志记录）
     */
    static async render(markdown: string, articleId?: string): Promise<string> {
        try {
            const md = await this.getInstance()

            // 移除 frontmatter
            const cleanMarkdown = this.removeFrontmatter(markdown)
            const rawHtml = md.render(cleanMarkdown)

            // 使用 DOMPurify 清理 HTML，防止 XSS 攻击
            const cleanHtml = DOMPurify.sanitize(rawHtml, {
                // 允许的标签白名单
                ALLOWED_TAGS: [
                    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                    'p', 'br', 'hr',
                    'ul', 'ol', 'li',
                    'strong', 'b', 'em', 'i', 'code', 'pre',
                    'a', 'img',
                    'blockquote',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td',
                    'div', 'span', 'del', 's', 'sub', 'sup'
                ],
                // 允许的属性白名单
                // 注意：style 属性允许用于代码高亮（通过 hook 进一步限制只允许特定标签）
                ALLOWED_ATTR: [
                    'href', 'src', 'alt', 'title', 'class',
                    'id', 'width', 'height', 'target', 'rel',
                    'style', // 用于 Shiki 语法高亮的内联样式
                    'tabindex' // Shiki 生成的 pre 标签可能包含此属性
                ],
                // 允许的 URI 协议（防止 javascript: 等危险协议）
                ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
                // 强制外部链接添加 rel="noopener noreferrer"
                ADD_ATTR: ['rel'],
                // 添加 hooks：允许代码块标签（<pre>、<code> 和 <span>）保留 style 属性
                // 注意：Shiki 使用 <span> 标签来实现语法高亮，需要保留其 style 属性
                // @ts-expect-error - DOMPurify 的类型定义不完整，但 hook 是有效的
                uponSanitizeAttribute: (node: Element, data: { attrName: string; attrValue: string }) => {
                    if (data.attrName === 'style') {
                        const tagName = node.tagName.toLowerCase()
                        // 只允许代码相关的标签保留 style 属性（用于语法高亮）
                        if (tagName !== 'pre' && tagName !== 'code' && tagName !== 'span') {
                            data.attrValue = ''
                        }
                    }
                }
            })

            return cleanHtml
        } catch (e) {
            // 增强错误处理：记录文章 ID
            const errorMessage = articleId
                ? `渲染失败 (${articleId}): ${e instanceof Error ? e.message : '未知错误'}`
                : `渲染失败: ${e instanceof Error ? e.message : '未知错误'}`
            console.error(`[MarkdownRenderer] ${errorMessage}`, e)
            throw new Error(errorMessage)
        }
    }
}

export default MarkdownRenderer
