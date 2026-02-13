import { ref } from 'vue'
import type { ArticleMeta } from '@/client/domain/doc/articles.ts'
import type { ArticleFrontMatter } from '@/client/domain/doc/articles.ts'
import type { ArticleLoadResult } from '@/client/domain/error/articleError'
import { ErrorType, ErrorLevel } from '@/client/domain/error/articleError'

/**
 * 读取 @/contact/docs 下所有 markdown 文件
 */
const modules = import.meta.glob(
    '@/contact/docs/**/*.md',
    { query: '?raw', import: 'default', eager: true }
)

export function extractTitle(content: string, fallback: string): string {
    const match = content.match(/^#\s+(.*)$/m)
    return match?.[1]?.trim() ?? fallback
}

/**
 * Parse YAML value that could be a string, array, or scalar value
 */
function parseYamlValue(key: string, lines: string[], startIndex: number): { value: string | string[], nextIndex: number } {
    const firstLine = lines[startIndex]!
    const colonIndex = firstLine.indexOf(':')
    const rawValue = firstLine.substring(colonIndex + 1).trim()

    // Check if this is a multi-line list (YAML array format)
    // Format:
    // tags:
    //   - tag1
    //   - tag2
    if (rawValue === '' && startIndex + 1 < lines.length) {
        const arrayValues: string[] = []
        let i = startIndex + 1

        // Collect all following lines that start with '- '
        while (i < lines.length) {
            const line = lines[i]!
            const trimmed = line.trim()

            // Stop if we encounter another key:value pair (has colon)
            if (trimmed !== '' && trimmed.includes(':') && !trimmed.startsWith('-')) {
                break
            }

            // Stop at empty line followed by a non-list item
            if (trimmed === '') {
                const nextLine = i + 1 < lines.length ? (lines[i + 1] ?? '').trim() : ''
                if (nextLine !== '' && !nextLine.startsWith('-')) {
                    break
                }
            }

            if (trimmed.startsWith('- ')) {
                arrayValues.push(trimmed.substring(2).trim())
                i++
            } else if (trimmed === '') {
                i++
            } else {
                // Encountered a new key (non-empty, doesn't start with -)
                break
            }
        }

        if (arrayValues.length > 0) {
            return { value: arrayValues, nextIndex: i - 1 }
        }
    }

    // Check for bracket array syntax: tags: [tag1, tag2]
    const arrayMatch = rawValue.match(/^\[(.*)\]$/)
    if (arrayMatch) {
        const arrayContent = arrayMatch[1] ?? ''
        if (arrayContent.trim() === '') {
            return { value: [], nextIndex: startIndex }
        }
        const arrayValues = arrayContent.split(',').map(s => s.trim()).filter(s => s !== '')
        return { value: arrayValues, nextIndex: startIndex }
    }

    // For tags field, check if it's a comma-separated string
    if (key === 'tags' && rawValue.includes(',')) {
        const arrayValues = rawValue.split(',').map(s => s.trim()).filter(s => s !== '')
        if (arrayValues.length > 1 || (arrayValues.length === 1 && rawValue.includes(','))) {
            return { value: arrayValues, nextIndex: startIndex }
        }
    }

    // Default: return as string
    return { value: rawValue, nextIndex: startIndex }
}

export function parseFrontMatter(content: string, fileName: string): {
    frontMatter: ArticleFrontMatter
    body: string
    hasError?: boolean
    errorType?: ErrorType
    errorMessage?: string
} {
    const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)

    if (!frontMatterMatch) {
        return { frontMatter: {}, body: content }
    }

    const [, frontMatterStr, body] = frontMatterMatch

    try {
        const frontMatter: ArticleFrontMatter = {}
        const lines = (frontMatterStr ?? '').split(/\r?\n/)

        let i = 0
        while (i < lines.length) {
            const line = lines[i]!
            const colonIndex = line.indexOf(':')

            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim()
                const result = parseYamlValue(key, lines, i)
                frontMatter[key] = result.value
                i = result.nextIndex + 1
            } else {
                i++
            }
        }

        return { frontMatter, body: body ?? content, hasError: false }
    } catch (e) {
        // frontmatter 解析失败，降级处理
        console.warn(`[useMarkdown] frontmatter 解析失败 (${fileName}):`, e)

        return {
            frontMatter: {},  // 返回空对象，降级为普通 Markdown
            body: content,
            hasError: true,
            errorType: ErrorType.FRONTMATTER_PARSE,
            errorMessage: '元数据解析失败，文章将以基础模式显示'
        }
    }
}

export async function useMarkdown(): Promise<ArticleLoadResult[]> {
    const results: ArticleLoadResult[] = []
    const entries = Object.entries(modules)

    for (const [path, raw] of entries) {
        try {
            const fileName = path.split('/').pop()!.replace('.md', '')
            const content = raw as string

            // 调用增强的 parseFrontMatter
            const { frontMatter, body, hasError, errorType, errorMessage } =
                parseFrontMatter(content, fileName)

            const article: ArticleMeta = {
                id: fileName,
                title: frontMatter.title || extractTitle(body, fileName),
                subtitle: frontMatter.subtitle,
                date: frontMatter.date,
                tags: frontMatter.tags as string[] | undefined,
                content: content,
                path,
                meta: frontMatter,
                hasError,
                errorType,
                errorMessage
            }

            results.push({
                success: true,
                article
            })
        } catch (e) {
            // 记录加载失败
            results.push({
                success: false,
                error: {
                    type: ErrorType.FILE_LOAD,
                    level: ErrorLevel.ERROR,
                    message: e instanceof Error ? e.message : '文件加载失败',
                    articleId: path.split('/').pop()!.replace('.md', ''),
                    path,
                    timestamp: Date.now(),
                    details: e
                }
            })
        }
    }

    return results
}
