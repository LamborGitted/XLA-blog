/**
 * FrontMatter 元数据
 * 支持 markdown 文件的 YAML front matter
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
}
