import { describe, it, expect } from 'vitest'
import { parseMarkdownLinks, getFaviconUrl, getLinkListConfigSync } from '@/client/domain/linkList/linkList'

describe('linkList > parseMarkdownLinks', () => {
  it('应该解析标准格式的友链', () => {
    const markdown = `## 社交媒体
- [GitHub](https://github.com) - 代码托管平台
- [Twitter](https://twitter.com) - 社交平台`

    const result = parseMarkdownLinks(markdown)

    expect(result).toHaveLength(1)
    expect(result[0].title).toBe('社交媒体')
    expect(result[0].links).toHaveLength(2)
    expect(result[0].links[0]).toEqual({
      title: 'GitHub',
      url: 'https://github.com',
      description: '代码托管平台'
    })
    expect(result[0].links[1]).toEqual({
      title: 'Twitter',
      url: 'https://twitter.com',
      description: '社交平台'
    })
  })

  it('应该生成正确的分组 ID', () => {
    const markdown = `## 学习资源
- [MDN](https://mdn.io) - 文档`

    const result = parseMarkdownLinks(markdown)

    expect(result[0].id).toBe('学习资源')
  })

  it('应该跳过空行和注释', () => {
    const markdown = `## 分组1
> 这是注释行

- [链接1](https://example.com) - 描述1

## 分组2
- [链接2](https://example2.com) - 描述2`

    const result = parseMarkdownLinks(markdown)

    expect(result).toHaveLength(2)
    expect(result[0].title).toBe('分组1')
    expect(result[1].title).toBe('分组2')
  })

  it('空链接列表应该返回空数组', () => {
    const markdown = `## 分组1
## 分组2`

    const result = parseMarkdownLinks(markdown)

    expect(result).toHaveLength(2)
    expect(result[0].links).toHaveLength(0)
    expect(result[1].links).toHaveLength(0)
  })

  it('应该处理多个分组', () => {
    const markdown = `## 社交媒体
- [GitHub](https://github.com) - 代码托管

## 工具
- [Google](https://google.com) - 搜索引擎

## 学习
- [MDN](https://mdn.io) - 文档`

    const result = parseMarkdownLinks(markdown)

    expect(result).toHaveLength(3)
    expect(result[0].title).toBe('社交媒体')
    expect(result[1].title).toBe('工具')
    expect(result[2].title).toBe('学习')
  })

  it('应该处理链接描述中的特殊字符', () => {
    const markdown = `## 工具
- [工具名](https://example.com) - 这是一个工具！@#$%`

    const result = parseMarkdownLinks(markdown)

    expect(result[0].links[0].description).toBe('这是一个工具！@#$%')
  })

  it('应该处理标题和描述中的空格', () => {
    const markdown = `## 工具
- [  工具名  ]( https://example.com )  -  描述  `

    const result = parseMarkdownLinks(markdown)

    expect(result[0].links[0].title).toBe('工具名')
    expect(result[0].links[0].url).toBe('https://example.com')
    expect(result[0].links[0].description).toBe('描述')
  })

  it('应该处理只有标题没有链接的分组', () => {
    const markdown = `## 空分组
## 有链接的分组
- [链接](https://example.com) - 描述`

    const result = parseMarkdownLinks(markdown)

    expect(result).toHaveLength(2)
    expect(result[0].links).toHaveLength(0)
    expect(result[1].links).toHaveLength(1)
  })

  it('应该处理带中文的分组标题', () => {
    const markdown = `## 学习资源
- [MDN](https://mdn.io) - 文档`

    const result = parseMarkdownLinks(markdown)

    expect(result[0].id).toBe('学习资源')
    expect(result[0].title).toBe('学习资源')
  })

  it('应该忽略不符合格式的行', () => {
    const markdown = `## 工具
这是一段文字
- [GitHub](https://github.com) - 代码托管
另一段文字
- [Google](https://google.com) - 搜索引擎`

    const result = parseMarkdownLinks(markdown)

    expect(result[0].links).toHaveLength(2)
  })
})

describe('linkList > getFaviconUrl', () => {
  it('应该生成正确的 favicon URL', () => {
    const url = 'https://github.com'
    const result = getFaviconUrl(url)

    expect(result).toBe('https://www.google.com/s2/favicons?domain=github.com&sz=64')
  })

  it('应该处理带路径的 URL', () => {
    const url = 'https://example.com/path/to/page'
    const result = getFaviconUrl(url)

    expect(result).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=64')
  })

  it('应该处理带端口的 URL', () => {
    const url = 'https://localhost:3000'
    const result = getFaviconUrl(url)

    expect(result).toBe('https://www.google.com/s2/favicons?domain=localhost&sz=64')
  })

  it('应该处理 http 协议', () => {
    const url = 'http://example.com'
    const result = getFaviconUrl(url)

    expect(result).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=64')
  })

  it('无效 URL 应该返回空字符串', () => {
    const result = getFaviconUrl('not-a-url')
    expect(result).toBe('')
  })

  it('空字符串应该返回空字符串', () => {
    const result = getFaviconUrl('')
    expect(result).toBe('')
  })

  it('应该处理带查询参数的 URL', () => {
    const url = 'https://example.com?query=test'
    const result = getFaviconUrl(url)

    expect(result).toBe('https://www.google.com/s2/favicons?domain=example.com&sz=64')
  })
})

describe('linkList > getLinkListConfigSync', () => {
  it('应该返回默认配置', () => {
    const config = getLinkListConfigSync()

    expect(Array.isArray(config)).toBe(true)
    expect(config.length).toBeGreaterThan(0)
    expect(config[0]).toHaveProperty('id')
    expect(config[0]).toHaveProperty('title')
    expect(config[0]).toHaveProperty('links')
  })

  it('默认配置应该包含社交媒体分组', () => {
    const config = getLinkListConfigSync()
    const socialSection = config.find(s => s.id === 'social-site')

    expect(socialSection).toBeDefined()
    expect(socialSection?.title).toBe('社交媒体')
    expect(socialSection?.links.length).toBeGreaterThan(0)
  })

  it('默认配置中的链接应该包含必需字段', () => {
    const config = getLinkListConfigSync()

    config.forEach(section => {
      section.links.forEach(link => {
        expect(link).toHaveProperty('title')
        expect(link).toHaveProperty('description')
        expect(link).toHaveProperty('url')
      })
    })
  })

  it('默认配置应该包含工具分组', () => {
    const config = getLinkListConfigSync()
    const toolsSection = config.find(s => s.id === 'tools')

    expect(toolsSection).toBeDefined()
    expect(toolsSection?.title).toBe('常用工具')
  })
})
