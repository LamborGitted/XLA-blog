import type { ArticleMeta } from './articles'

/**
 * 文章详情领域模型
 * 用于文章详情页的数据结构
 */
export interface ArticleDetail extends ArticleMeta {
    /**
     * 解析后的 HTML 内容
     * 由 markdown 渲染器生成
     */
    htmlContent?: string

    /**
     * 阅读时间（分钟）
     * 根据内容长度估算
     */
    readingTime?: number

    /**
     * 文章摘要
     * 从内容中提取
     */
    excerpt?: string

    /**
     * 目录结构
     * 用于生成文章目录导航
     */
    toc?: TableOfContent[]
}

/**
 * 目录项
 */
export interface TableOfContent {
    /**
     * 标题文本
     */
    text: string

    /**
     * 标题级别 (h1-h6)
     */
    level: number

    /**
     * 锚点 ID
     */
    id: string

    /**
     * 子目录项
     */
    children?: TableOfContent[]
}

/**
 * 文章加载状态
 */
export interface ArticleDetailState {
    /**
     * 文章详情数据
     */
    detail: ArticleDetail | null

    /**
     * 加载状态
     */
    loading: boolean

    /**
     * 错误信息
     */
    error: string | null
}
