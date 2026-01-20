export interface ArticleMeta {

    id: string

    title: string

    subtitle?: string

    date?: string

    tags?: string[]

    content: string

    path: string

    meta?: Record<string, any>
}
