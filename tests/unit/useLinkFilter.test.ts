import { describe, it, expect, beforeEach } from 'vitest'
import { useLinkFilter, LINK_SORT_OPTIONS, type LinkSortOption } from '@/client/composables/useLinkFilter'
import type { LinkSection } from '@/client/domain/linkList/linkList'

// 测试数据
const mockLinks: LinkSection[] = [
  {
    id: 'tech-blogs',
    title: '技术博客',
    links: [
      {
        title: 'Vue.js 官方博客',
        url: 'https://blog.vuejs.org',
        description: 'Vue.js 最新动态和教程',
        icon: ''
      },
      {
        title: 'Rust 官方博客',
        url: 'https://blog.rust-lang.org',
        description: 'Rust 编程语言官方博客',
        icon: ''
      },
      {
        title: 'TypeScript 深度解析',
        url: 'https://ts-deep-dive.com',
        description: 'TypeScript 进阶教程',
        icon: ''
      }
    ]
  },
  {
    id: 'tools',
    title: '开发工具',
    links: [
      {
        title: 'Vite',
        url: 'https://vitejs.dev',
        description: '下一代前端构建工具',
        icon: ''
      },
      {
        title: 'ESLint',
        url: 'https://eslint.org',
        description: 'JavaScript 代码检查工具',
        icon: ''
      }
    ]
  }
]

describe('useLinkFilter > 搜索功能', () => {
  let linkFilter: ReturnType<typeof useLinkFilter>

  beforeEach(() => {
    linkFilter = useLinkFilter()
    linkFilter.setAllLinks(mockLinks)
  })

  it('应该能通过标题搜索', () => {
    linkFilter.searchLinks('Vue')
    const results = linkFilter.filteredLinks.value

    expect(results.length).toBeGreaterThan(0)
    results.forEach(section => {
      section.links.forEach(link => {
        expect(link.title.toLowerCase()).toContain('vue')
      })
    })
  })

  it('应该能通过描述搜索', () => {
    linkFilter.searchLinks('教程')
    const results = linkFilter.filteredLinks.value

    expect(results.length).toBeGreaterThan(0)
    results.forEach(section => {
      section.links.forEach(link => {
        expect(link.description.toLowerCase()).toContain('教程')
      })
    })
  })

  it('应该能通过 URL 搜索', () => {
    linkFilter.searchLinks('vitejs')
    const results = linkFilter.filteredLinks.value

    expect(results.length).toBeGreaterThan(0)
    results.forEach(section => {
      section.links.forEach(link => {
        expect(link.url.toLowerCase()).toContain('vitejs')
      })
    })
  })

  it('空搜索应该返回所有链接', () => {
    linkFilter.searchLinks('')
    const results = linkFilter.filteredLinks.value

    expect(results).toHaveLength(2)
    expect(results[0].links.length + results[1].links.length).toBe(5)
  })

  it('搜索不存在的关键词应该返回空数组', () => {
    linkFilter.searchLinks('不存在的内容xyz123')
    const results = linkFilter.filteredLinks.value

    expect(results).toHaveLength(0)
  })

  it('搜索应该不区分大小写', () => {
    linkFilter.searchLinks('VUE')
    const upperResults = linkFilter.filteredLinks.value

    linkFilter.searchLinks('vue')
    const lowerResults = linkFilter.filteredLinks.value

    expect(upperResults.length).toBe(lowerResults.length)
  })

  it('应该过滤掉没有匹配链接的分组', () => {
    linkFilter.searchLinks('ESLint')
    const results = linkFilter.filteredLinks.value

    // 只有一个分组包含 ESLint
    expect(results.length).toBe(1)
    expect(results[0].title).toBe('开发工具')
  })

  it('应该支持中文搜索', () => {
    linkFilter.searchLinks('官方')
    const results = linkFilter.filteredLinks.value

    expect(results.length).toBeGreaterThan(0)
  })
})

describe('useLinkFilter > 排序功能', () => {
  let linkFilter: ReturnType<typeof useLinkFilter>

  beforeEach(() => {
    linkFilter = useLinkFilter()
    linkFilter.setAllLinks(mockLinks)
  })

  it('默认排序应该保持原始顺序', () => {
    linkFilter.setSort('default')
    const results = linkFilter.filteredLinks.value

    expect(results[0].links[0].title).toBe('Vue.js 官方博客')
  })

  it('应该按名称升序排序（A-Z）', () => {
    linkFilter.setSort('name-asc')
    const results = linkFilter.filteredLinks.value

    const firstGroup = results[0].links
    expect(firstGroup[0].title).toBe('ESLint')
    expect(firstGroup[1].title).toBe('Rust 官方博客')
    expect(firstGroup[2].title).toBe('TypeScript 深度解析')
  })

  it('应该按名称降序排序（Z-A）', () => {
    linkFilter.setSort('name-desc')
    const results = linkFilter.filteredLinks.value

    const firstGroup = results[0].links
    expect(firstGroup[0].title).toBe('Vite')
    expect(firstGroup[1].title).toBe('Vue.js 官方博客')
    expect(firstGroup[2].title).toBe('TypeScript 深度解析')
  })

  it('排序应该在所有分组中生效', () => {
    linkFilter.setSort('name-asc')
    const results = linkFilter.filteredLinks.value

    // 每个分组都应该按名称排序
    results.forEach(section => {
      const titles = section.links.map(l => l.title)
      const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'zh-CN'))
      expect(titles).toEqual(sorted)
    })
  })
})

describe('useLinkFilter > 搜索和排序组合', () => {
  let linkFilter: ReturnType<typeof useLinkFilter>

  beforeEach(() => {
    linkFilter = useLinkFilter()
    linkFilter.setAllLinks(mockLinks)
  })

  it('搜索结果应该按指定方式排序', () => {
    linkFilter.searchLinks('官方')
    linkFilter.setSort('name-asc')

    const results = linkFilter.filteredLinks.value
    expect(results.length).toBeGreaterThan(0)

    // 检查排序是否生效
    results.forEach(section => {
      const titles = section.links.map(l => l.title)
      const sorted = [...titles].sort((a, b) => a.localeCompare(b, 'zh-CN'))
      expect(titles).toEqual(sorted)
    })
  })
})

describe('useLinkFilter > LINK_SORT_OPTIONS', () => {
  it('应该包含所有排序选项', () => {
    expect(LINK_SORT_OPTIONS).toHaveLength(3)
    expect(LINK_SORT_OPTIONS.map(opt => opt.value)).toEqual([
      'default',
      'name-asc',
      'name-desc'
    ])
  })

  it('每个选项应该有正确的属性', () => {
    LINK_SORT_OPTIONS.forEach(option => {
      expect(option).toHaveProperty('value')
      expect(option).toHaveProperty('label')
      expect(option).toHaveProperty('icon')
      expect(typeof option.value).toBe('string')
      expect(typeof option.label).toBe('string')
      expect(typeof option.icon).toBe('string')
    })
  })
})

describe('useLinkFilter > 边界情况', () => {
  it('空链接列表应该正常工作', () => {
    const linkFilter = useLinkFilter()
    linkFilter.setAllLinks([])

    linkFilter.searchLinks('anything')
    expect(linkFilter.filteredLinks.value).toHaveLength(0)
  })

  it('只有空分组的链接列表应该返回空', () => {
    const linkFilter = useLinkFilter()
    linkFilter.setAllLinks([
      {
        id: 'empty',
        title: '空分组',
        links: []
      }
    ])

    expect(linkFilter.filteredLinks.value).toHaveLength(0)
  })

  it('搜索前后空格应该被 trim', () => {
    const linkFilter = useLinkFilter()
    linkFilter.setAllLinks(mockLinks)

    linkFilter.searchLinks('  Vue  ')
    expect(linkFilter.filteredLinks.value.length).toBeGreaterThan(0)
  })

  it('只搜索空格应该返回所有链接', () => {
    const linkFilter = useLinkFilter()
    linkFilter.setAllLinks(mockLinks)

    linkFilter.searchLinks('   ')
    const results = linkFilter.filteredLinks.value
    expect(results[0].links.length + results[1].links.length).toBe(5)
  })

  it('特殊字符搜索应该正常处理', () => {
    const linkFilter = useLinkFilter()
    linkFilter.setAllLinks(mockLinks)

    linkFilter.searchLinks('@#$%')
    expect(linkFilter.filteredLinks.value).toHaveLength(0)
  })
})

describe('useLinkFilter > 状态管理', () => {
  it('query 应该是响应式的', () => {
    const linkFilter = useLinkFilter()

    linkFilter.searchLinks('test')
    expect(linkFilter.query.value).toBe('test')

    linkFilter.searchLinks('another')
    expect(linkFilter.query.value).toBe('another')
  })

  it('sortBy 应该是响应式的', () => {
    const linkFilter = useLinkFilter()

    linkFilter.setSort('name-asc')
    expect(linkFilter.sortBy.value).toBe('name-asc')

    linkFilter.setSort('name-desc')
    expect(linkFilter.sortBy.value).toBe('name-desc')
  })

  it('filteredLinks 应该是计算属性', () => {
    const linkFilter = useLinkFilter()
    linkFilter.setAllLinks(mockLinks)

    const initialLength = linkFilter.filteredLinks.value.length

    linkFilter.searchLinks('Vue')
    expect(linkFilter.filteredLinks.value.length).toBeLessThan(initialLength)

    linkFilter.searchLinks('')
    expect(linkFilter.filteredLinks.value.length).toBe(initialLength)
  })
})
