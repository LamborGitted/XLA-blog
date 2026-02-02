import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

interface MetaConfig {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  structuredData?: Record<string, any>
}

export function useSeo() {
  const route = useRoute()
  const siteName = 'Lantxx Blog'
  const defaultDescription = 'Lantxx的个人技术博客，分享编程技术、开发经验和学习笔记'
  const baseUrl = 'https://blog.lantxx.com.cn'

  /**
   * 更新页面SEO元数据
   */
  const updateMeta = (config: MetaConfig) => {
    // 更新title
    document.title = config.title
      ? `${config.title} - ${siteName}`
      : siteName

    // 更新meta标签的辅助函数
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    // 更新基础meta
    if (config.description) {
      updateMetaTag('description', config.description)
    }
    if (config.keywords) {
      updateMetaTag('keywords', config.keywords)
    }

    // 更新Open Graph
    if (config.ogImage) {
      updateProperty('og:image', config.ogImage)
    }
    if (config.ogType) {
      updateProperty('og:type', config.ogType)
    }
    updateProperty('og:url', `${baseUrl}${route.path}`)
    updateProperty('og:title', document.title)

    // 更新Twitter Card
    const updateTwitter = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="twitter:${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = `twitter:${name}`
        document.head.appendChild(meta)
      }
      meta.content = content
    }

    updateTwitter('card', config.ogType === 'article' ? 'summary_large_image' : 'summary')
    updateTwitter('url', `${baseUrl}${route.path}`)
    updateTwitter('title', document.title)
    if (config.description) {
      updateTwitter('description', config.description)
    }
    if (config.ogImage) {
      updateTwitter('image', config.ogImage)
    }

    // 更新结构化数据
    if (config.structuredData) {
      const script = (document.getElementById('structured-data') || document.createElement('script')) as HTMLScriptElement
      script.id = 'structured-data'
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(config.structuredData, null, 2)
      if (!document.getElementById('structured-data')) {
        document.head.appendChild(script)
      }
    }

    // 更新canonical链接
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = `${baseUrl}${route.path}`
  }

  /**
   * 重置为首页SEO
   */
  const resetSeo = () => {
    updateMeta({
      title: '首页',
      description: defaultDescription,
      keywords: '技术博客,编程,Rust,TypeScript,Vue.js,前端开发,后端开发',
      ogType: 'website',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteName,
        url: baseUrl,
        description: defaultDescription,
        author: {
          '@type': 'Person',
          name: 'Lantxx'
        }
      }
    })
  }

  return {
    updateMeta,
    resetSeo
  }
}
