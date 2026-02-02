import { ref } from 'vue'
import type { ArticleMeta } from '@/client/domain/doc/articles.ts'

/**
 * 读取 @/contact/docs 下所有 markdown 文件
 */
const modules = import.meta.glob(
    '@/contact/docs/**/*.md',
    { as: 'raw', eager: true }
)

function extractTitle(content: string, fallback: string): string {
    const match = content.match(/^#\s+(.*)$/m)
    return match?.[1]?.trim() ?? fallback
}

function parseFrontMatter(content: string): { frontMatter: Record<string, any>, body: string } {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!frontMatterMatch) {
        return { frontMatter: {}, body: content }
    }

    const [, frontMatterStr, body] = frontMatterMatch
    if (!frontMatterStr || !body) {
        return { frontMatter: {}, body: content }
    }

    const frontMatter: Record<string, any> = {}

    frontMatterStr.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':')
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim()
            const value = line.substring(colonIndex + 1).trim()
            frontMatter[key] = value
        }
    })

    return { frontMatter, body: body || content }
}

export function useMarkdown(): ArticleMeta[] {
    return Object.entries(modules).map(([path, raw]) => {
        const fileName = path.split('/').pop()!.replace('.md', '')
        const content = raw as string
        const { frontMatter, body } = parseFrontMatter(content)

        return {
            id: fileName,
            title: frontMatter.title || extractTitle(body, fileName),
            subtitle: frontMatter.subtitle,
            date: frontMatter.date,
            content: content,
            path,
            meta: frontMatter
        }
    })
}
