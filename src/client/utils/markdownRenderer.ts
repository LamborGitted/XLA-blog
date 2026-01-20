import MarkdownIt from 'markdown-it'
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
                    // 如果不支持该语言，回退到纯文本
                    return `<pre><code>${this.instance!.utils.escapeHtml(code)}</code></pre>`
                }
            }

            return this.instance
        } finally {
            this.initializing = false
        }
    }

    /**
     * 渲染 Markdown 为 HTML
     */
    static async render(markdown: string): Promise<string> {
        const md = await this.getInstance()
        return md.render(markdown)
    }
}

export default MarkdownRenderer
