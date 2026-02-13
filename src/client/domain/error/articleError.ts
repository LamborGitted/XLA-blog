/**
 * 文章错误类型定义
 */

/**
 * 错误严重级别
 */
export enum ErrorLevel {
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

/**
 * 错误类型分类
 */
export enum ErrorType {
  FRONTMATTER_PARSE = 'frontmatter_parse',
  FILE_LOAD = 'file_load',
  RENDER = 'render',
  INIT = 'init'
}

/**
 * 文章错误信息
 */
export interface ArticleError {
  type: ErrorType
  level: ErrorLevel
  message: string
  articleId?: string
  path?: string
  timestamp: number
  details?: unknown
}

/**
 * 文章加载结果
 */
export interface ArticleLoadResult {
  success: boolean
  article?: import('@/client/domain/doc/articles').ArticleMeta
  error?: ArticleError
}
