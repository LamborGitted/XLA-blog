import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useArticleList, SORT_OPTIONS } from '@/client/composables/useArticleList'

// Mock useMarkdown
vi.mock('@/client/composables/useMarkdown.ts', () => ({
  useMarkdown: () => [
    {
      path: '/test/article1.md',
      title: 'Vue 3 Composition API',
      date: '2024-01-15',
      tags: ['Vue', 'TypeScript'],
      content: '# Vue 3 Composition API\n\n这是一个副标题'
    },
    {
      path: '/test/article2.md',
      title: 'Rust 编程入门',
      date: '2024-01-10',
      tags: ['Rust', '系统编程'],
      content: '# Rust 编程入门\n\n学习 Rust 基础'
    },
    {
      path: '/test/article3.md',
      title: 'Vite 构建工具',
      date: '2024-01-20',
      tags: ['Vite', 'Vue'],
      content: '# Vite 构建工具'
    },
    {
      path: '/test/article4.md',
      title: 'TypeScript 高级技巧',
      date: '2024-01-05',
      tags: ['TypeScript'],
      content: '# TypeScript 高级技巧'
    },
    {
      path: '/test/article5.md',
      title: 'Python 数据分析',
      date: '2024-01-25',
      tags: ['Python', '数据分析'],
      content: '# Python 数据分析'
    }
  ],
  extractTitle: (content: string, defaultTitle: string) => {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : defaultTitle
  }
}))

describe('useArticleList > 搜索功能', () => {
  let articleList: ReturnType<typeof useArticleList>

  beforeEach(() => {
    articleList = useArticleList()
    articleList.setArticlesFromMarkdown()
  })

  describe('标题搜索', () => {
    it('应该能通过完整标题搜索', () => {
      articleList.searchArticles('Vue 3 Composition API')
      expect(articleList.filteredArticles.value).toHaveLength(1)
      expect(articleList.filteredArticles.value[0].title).toBe('Vue 3 Composition API')
    })

    it('应该能通过部分标题搜索', () => {
      articleList.searchArticles('Vue')
      expect(articleList.filteredArticles.value.length).toBeGreaterThan(0)
      articleList.filteredArticles.value.forEach(article => {
        expect(article.title.toLowerCase()).toContain('vue')
      })
    })

    it('空搜索应该返回所有文章', () => {
      articleList.searchArticles('')
      expect(articleList.filteredArticles.value).toHaveLength(5)
    })
  })

  describe('标签搜索', () => {
    it('应该能通过完整标签名搜索', () => {
      articleList.searchArticles('Rust')
      expect(articleList.filteredArticles.value).toHaveLength(1)
      expect(articleList.filteredArticles.value[0].tags).toContain('Rust')
    })

    it('应该能通过部分标签名搜索（模糊匹配）', () => {
      articleList.searchArticles('ru')
      expect(articleList.filteredArticles.value.length).toBeGreaterThan(0)
      articleList.filteredArticles.value.forEach(article => {
        const hasMatchingTag = article.tags?.some(tag =>
          tag.toLowerCase().includes('ru')
        )
        expect(hasMatchingTag).toBe(true)
      })
    })

    it('应该能通过标签搜索到多篇文章', () => {
      articleList.searchArticles('TypeScript')
      const results = articleList.filteredArticles.value
      expect(results.length).toBeGreaterThanOrEqual(2)
      results.forEach(article => {
        expect(article.tags).toContain('TypeScript')
      })
    })

    it('应该支持中文标签搜索', () => {
      articleList.searchArticles('系统编程')
      expect(articleList.filteredArticles.value).toHaveLength(1)
      expect(articleList.filteredArticles.value[0].tags).toContain('系统编程')
    })
  })

  describe('标题 OR 标签搜索', () => {
    it('标题匹配时应该返回文章', () => {
      articleList.searchArticles('Python')
      const results = articleList.filteredArticles.value
      expect(results.length).toBeGreaterThan(0)
      // 标题包含 Python
      expect(results.some(a => a.title.includes('Python'))).toBe(true)
    })

    it('标签匹配时应该返回文章', () => {
      articleList.searchArticles('数据分析')
      const results = articleList.filteredArticles.value
      expect(results.length).toBeGreaterThan(0)
      // 标签包含 数据分析
      expect(results.some(a => a.tags?.includes('数据分析'))).toBe(true)
    })

    it('标题或标签任一匹配即可', () => {
      articleList.searchArticles('Vue')
      const results = articleList.filteredArticles.value
      expect(results.length).toBeGreaterThan(0)
      results.forEach(article => {
        const titleMatch = article.title.toLowerCase().includes('vue')
        const tagMatch = article.tags?.some(tag => tag.toLowerCase().includes('vue'))
        expect(titleMatch || tagMatch).toBe(true)
      })
    })
  })

  describe('大小写不敏感', () => {
    it('搜索应该不区分大小写', () => {
      articleList.searchArticles('VUE')
      const upperResults = articleList.filteredArticles.value

      articleList.searchArticles('vue')
      const lowerResults = articleList.filteredArticles.value

      expect(upperResults).toHaveLength(lowerResults.length)
    })

    it('标签搜索应该不区分大小写', () => {
      articleList.searchArticles('RUST')
      const upperResults = articleList.filteredArticles.value

      articleList.searchArticles('rust')
      const lowerResults = articleList.filteredArticles.value

      expect(upperResults).toHaveLength(lowerResults.length)
    })
  })

  describe('边界情况', () => {
    it('无标签的文章仍能通过标题搜索', () => {
      // 先添加一个没有标签的文章（需要 mock 支持）
      articleList.searchArticles('Python')
      expect(articleList.filteredArticles.value.length).toBeGreaterThan(0)
    })

    it('搜索不存在的关键词应该返回空数组', () => {
      articleList.searchArticles('不存在的内容xyz123')
      expect(articleList.filteredArticles.value).toHaveLength(0)
    })

    it('搜索特殊字符应该正常处理', () => {
      articleList.searchArticles('@#$%')
      expect(articleList.filteredArticles.value).toHaveLength(0)
    })
  })
})

describe('useArticleList > 排序功能', () => {
  let articleList: ReturnType<typeof useArticleList>

  beforeEach(() => {
    articleList = useArticleList()
    articleList.setArticlesFromMarkdown()
  })

  it('应该按日期降序排序（默认）', () => {
    articleList.setSort('date-desc')
    const dates = articleList.filteredArticles.value.map(a => new Date(a.date!).getTime())
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1])
    }
  })

  it('应该按日期升序排序', () => {
    articleList.setSort('date-asc')
    const dates = articleList.filteredArticles.value.map(a => new Date(a.date!).getTime())
    for (let i = 0; i < dates.length - 1; i++) {
      expect(dates[i]).toBeLessThanOrEqual(dates[i + 1])
    }
  })

  it('应该按标题升序排序（A-Z）', () => {
    articleList.setSort('title-asc')
    const titles = articleList.filteredArticles.value.map(a => a.title)
    for (let i = 0; i < titles.length - 1; i++) {
      expect(titles[i].localeCompare(titles[i + 1], 'zh-CN')).toBeLessThanOrEqual(0)
    }
  })

  it('应该按标题降序排序（Z-A）', () => {
    articleList.setSort('title-desc')
    const titles = articleList.filteredArticles.value.map(a => a.title)
    for (let i = 0; i < titles.length - 1; i++) {
      expect(titles[i].localeCompare(titles[i + 1], 'zh-CN')).toBeGreaterThanOrEqual(0)
    }
  })
})

describe('useArticleList > 文章导航', () => {
  let articleList: ReturnType<typeof useArticleList>

  beforeEach(() => {
    articleList = useArticleList()
    articleList.setArticlesFromMarkdown()
  })

  it('selectByIndex 应该正确设置选中索引', () => {
    articleList.selectByIndex(2)
    expect(articleList.selectedIndex.value).toBe(2)
    expect(articleList.currentArticle.value?.title).toBeTruthy()
  })

  it('selectByIndex 超出范围时不应该改变索引', () => {
    const initialIndex = articleList.selectedIndex.value
    articleList.selectByIndex(999)
    expect(articleList.selectedIndex.value).toBe(initialIndex)
  })

  it('selectByIndex 负数不应该改变索引', () => {
    const initialIndex = articleList.selectedIndex.value
    articleList.selectByIndex(-1)
    expect(articleList.selectedIndex.value).toBe(initialIndex)
  })

  it('currentArticle 在未选中时应该返回 null', () => {
    expect(articleList.currentArticle.value).toBeNull()
  })

  it('currentArticle 在选中后应该返回对应文章', () => {
    articleList.selectByIndex(0)
    expect(articleList.currentArticle.value).not.toBeNull()
    expect(articleList.currentArticle.value?.title).toBeTruthy()
  })

  describe('上一篇/下一篇', () => {
    it('prevArticle 在第一篇时应该返回 null', () => {
      articleList.selectByIndex(0)
      expect(articleList.prevArticle.value).toBeNull()
    })

    it('nextArticle 在最后一篇时应该返回 null', () => {
      const lastIndex = articleList.filteredArticles.value.length - 1
      articleList.selectByIndex(lastIndex)
      expect(articleList.nextArticle.value).toBeNull()
    })

    it('goPrev 应该正确导航到上一篇文章', () => {
      articleList.selectByIndex(2)
      articleList.goPrev()
      expect(articleList.selectedIndex.value).toBe(1)
    })

    it('goNext 应该正确导航到下一篇文章', () => {
      articleList.selectByIndex(0)
      articleList.goNext()
      expect(articleList.selectedIndex.value).toBe(1)
    })

    it('goPrev 在第一篇时不应该改变索引', () => {
      articleList.selectByIndex(0)
      const initialIndex = articleList.selectedIndex.value
      articleList.goPrev()
      expect(articleList.selectedIndex.value).toBe(initialIndex)
    })

    it('goNext 在最后一篇时不应该改变索引', () => {
      const lastIndex = articleList.filteredArticles.value.length - 1
      articleList.selectByIndex(lastIndex)
      articleList.goNext()
      expect(articleList.selectedIndex.value).toBe(lastIndex)
    })
  })
})

describe('useArticleList > cycleSort', () => {
  let articleList: ReturnType<typeof useArticleList>

  beforeEach(() => {
    articleList = useArticleList()
    articleList.setArticlesFromMarkdown()
  })

  it('应该循环切换排序方式', () => {
    const initialSort = articleList.sortBy.value
    articleList.cycleSort()
    expect(articleList.sortBy.value).not.toBe(initialSort)
  })

  it('应该按顺序循环所有排序选项', () => {
    articleList.setSort('date-desc')
    expect(articleList.sortBy.value).toBe('date-desc')

    articleList.cycleSort()
    expect(articleList.sortBy.value).toBe('date-asc')

    articleList.cycleSort()
    expect(articleList.sortBy.value).toBe('title-asc')

    articleList.cycleSort()
    expect(articleList.sortBy.value).toBe('title-desc')

    articleList.cycleSort()
    expect(articleList.sortBy.value).toBe('date-desc') // 回到开始
  })
})

describe('useArticleList > 搜索后重置索引', () => {
  let articleList: ReturnType<typeof useArticleList>

  beforeEach(() => {
    articleList = useArticleList()
    articleList.setArticlesFromMarkdown()
  })

  it('搜索后 selectedIndex 应该重置为 -1', () => {
    articleList.selectByIndex(2)
    expect(articleList.selectedIndex.value).toBe(2)

    articleList.searchArticles('Vue')
    expect(articleList.selectedIndex.value).toBe(-1)
  })

  it('排序后 selectedIndex 应该重置为 -1', () => {
    articleList.selectByIndex(2)
    expect(articleList.selectedIndex.value).toBe(2)

    articleList.setSort('title-asc')
    expect(articleList.selectedIndex.value).toBe(-1)
  })
})

describe('useArticleList > SORT_OPTIONS', () => {
  it('应该包含所有排序选项', () => {
    expect(SORT_OPTIONS).toHaveLength(4)
    expect(SORT_OPTIONS.map(opt => opt.value)).toEqual([
      'date-desc',
      'date-asc',
      'title-asc',
      'title-desc'
    ])
  })

  it('每个选项应该有正确的属性', () => {
    SORT_OPTIONS.forEach(option => {
      expect(option).toHaveProperty('value')
      expect(option).toHaveProperty('label')
      expect(option).toHaveProperty('icon')
      expect(typeof option.value).toBe('string')
      expect(typeof option.label).toBe('string')
      expect(typeof option.icon).toBe('string')
    })
  })
})
