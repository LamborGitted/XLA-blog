/**
 * FrontMatter 元数据
 * 支持 Markdown 文件的 YAML front matter
 */
export interface ArticleFrontMatter {
  title?: string
  subtitle?: string
  date?: string
  tags?: string[]
  author?: string
  description?: string
  category?: string
  draft?: boolean
  [key: string]: string | string[] | boolean | undefined
}

import type { ErrorType } from '@/client/domain/error/articleError'

/**
 * 文章元数据
 */
export interface ArticleMeta {
  id: string

  title: string

  subtitle?: string

  date?: string

  tags?: string[]

  content: string

  path: string

  meta?: ArticleFrontMatter

  // 错误相关字段
  hasError?: boolean
  errorType?: ErrorType
  errorMessage?: string
}
