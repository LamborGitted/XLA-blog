/**
 * GitHub API 返回类型定义
 */

/**
 * GitHub API 返回的仓库信息
 */
export interface GithubRepoResponse {
  /** 仓库 ID */
  id: number
  /** 仓库名称 */
  name: string
  /** 仓库描述 */
  description: string | null
  /** 主要编程语言 */
  language: string | null
  /** 星标数 */
  stargazers_count: number
  /** Fork 数 */
  forks_count: number
  /** 仓库 URL */
  html_url: string
  /** 最后更新时间 */
  updated_at: string
}
