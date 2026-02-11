/**
 * SEO 结构化数据类型定义
 */

/**
 * 结构化数据联合类型
 */
export type StructuredData = WebSiteData | ArticleData | PersonData | BreadcrumbListData

/**
 * WebSite 结构化数据
 */
export interface WebSiteData {
  '@context': string
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  author?: PersonData
}

/**
 * Article 结构化数据
 */
export interface ArticleData {
  '@context': string
  '@type': 'Article' | 'BlogPosting'
  headline: string
  datePublished: string
  dateModified?: string
  author: PersonData | string
  description?: string
  url: string
  publisher?: OrganizationData
}

/**
 * Person 结构化数据
 */
export interface PersonData {
  '@type': 'Person'
  name: string
  url?: string
}

/**
 * Organization 结构化数据
 */
export interface OrganizationData {
  '@type': 'Organization'
  name: string
  logo?: string
}

/**
 * BreadcrumbList 结构化数据
 */
export interface BreadcrumbListData {
  '@context': string
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbItemData[]
}

/**
 * BreadcrumbItem 结构化数据
 */
export interface BreadcrumbItemData {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}
