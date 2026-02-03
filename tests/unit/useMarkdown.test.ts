import { describe, it, expect } from 'vitest'
import { extractTitle, parseFrontMatter } from '@/client/composables/useMarkdown'

describe('useMarkdown > extractTitle', () => {
  it('应该提取第一个 # 标题', () => {
    const content = '# 你好世界\n\n正文内容'
    const result = extractTitle(content, '默认标题')
    expect(result).toBe('你好世界')
  })

  it('标题前后有空格时应该 trim', () => {
    const content = '#   标题   \n正文内容'
    const result = extractTitle(content, '默认标题')
    expect(result).toBe('标题')
  })

  it('没有标题时返回默认值', () => {
    const content = '直接是正文内容，没有标题'
    const result = extractTitle(content, '默认标题')
    expect(result).toBe('默认标题')
  })

  it('多个标题时只取第一个', () => {
    const content = '# 标题1\n\n# 标题2\n\n# 标题3'
    const result = extractTitle(content, '默认标题')
    expect(result).toBe('标题1')
  })

  it('标题在中间位置也能提取', () => {
    const content = '前面内容\n# 标题\n后面内容'
    const result = extractTitle(content, '默认标题')
    expect(result).toBe('标题')
  })

  it('空内容应该返回默认值', () => {
    const result = extractTitle('', '默认标题')
    expect(result).toBe('默认标题')
  })
})

describe('useMarkdown > parseFrontMatter', () => {
  it('应该解析标准的 FrontMatter', () => {
    const content = `---
title: 测试文章
date: 2024-01-01
tags: Vue, TypeScript
---
# 正文内容`

    const result = parseFrontMatter(content)

    expect(result.frontMatter.title).toBe('测试文章')
    expect(result.frontMatter.date).toBe('2024-01-01')
    expect(result.frontMatter.tags).toBe('Vue, TypeScript')
    expect(result.body).toBe('# 正文内容')
  })

  it('没有 FrontMatter 时返回空对象和原内容', () => {
    const content = '# 直接是正文内容'
    const result = parseFrontMatter(content)

    expect(result.frontMatter).toEqual({})
    expect(result.body).toBe(content)
  })

  it('FrontMatter 格式错误时返回空对象', () => {
    const content = `---
title: 测试文章
缺少结束标记
# 正文内容`

    const result = parseFrontMatter(content)

    expect(result.frontMatter).toEqual({})
    expect(result.body).toBe(content)
  })

  it('应该处理空的 FrontMatter', () => {
    const content = `---
---
# 正文内容`

    const result = parseFrontMatter(content)

    expect(result.frontMatter).toEqual({})
    expect(result.body).toBe('# 正文内容')
  })

  it('应该处理带空格的值', () => {
    const content = `---
title:  这是标题
date: 2024-01-01
---
正文内容`

    const result = parseFrontMatter(content)

    expect(result.frontMatter.title).toBe('这是标题')
    expect(result.frontMatter.date).toBe('2024-01-01')
  })

  it('应该处理多行的 FrontMatter', () => {
    const content = `---
title: 测试
subtitle: 副标题
description: 这是一篇测试文章
author: 作者名
date: 2024-01-01
---
正文`

    const result = parseFrontMatter(content)

    expect(result.frontMatter.title).toBe('测试')
    expect(result.frontMatter.subtitle).toBe('副标题')
    expect(result.frontMatter.description).toBe('这是一篇测试文章')
    expect(result.frontMatter.author).toBe('作者名')
    expect(result.frontMatter.date).toBe('2024-01-01')
  })

  it('应该处理 FrontMatter 后有换行的情况', () => {
    const content = `---
title: 测试
---

# 正文`

    const result = parseFrontMatter(content)

    expect(result.frontMatter.title).toBe('测试')
    expect(result.body).toBe('# 正文')
  })

  it('应该保留正文内容的格式', () => {
    const content = `---
title: 测试
---
# 标题1

## 标题2

段落内容`

    const result = parseFrontMatter(content)

    expect(result.body).toBe(`# 标题1\n\n## 标题2\n\n段落内容`)
  })

  it('应该处理只有 key 没有 value 的情况', () => {
    const content = `---
title:
date: 2024-01-01
---
正文`

    const result = parseFrontMatter(content)

    expect(result.frontMatter.title).toBe('')
    expect(result.frontMatter.date).toBe('2024-01-01')
  })

  it('应该处理值包含冒号的情况', () => {
    const content = `---
title: 测试: 带冒号的标题
time: 10:30
---
正文`

    const result = parseFrontMatter(content)

    expect(result.frontMatter.title).toBe('测试: 带冒号的标题')
    expect(result.frontMatter.time).toBe('10:30')
  })
})
