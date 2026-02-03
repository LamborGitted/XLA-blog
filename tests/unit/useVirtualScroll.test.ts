import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useVirtualScroll } from '@/client/composables/useVirtualScroll'

describe('useVirtualScroll', () => {
  const mockItems = ref(Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` })))
  const containerHeight = ref(500)
  const itemHeight = 50

  describe('基本功能', () => {
    it('应该初始化正确的总高度', () => {
      const { totalHeight } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      expect(totalHeight.value).toBe(5000) // 100 items * 50px
    })

    it('应该初始化正确的偏移量', () => {
      const { offsetY } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      expect(offsetY.value).toBe(0)
    })

    it('应该初始化滚动位置为 0', () => {
      const { scrollTop } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      expect(scrollTop.value).toBe(0)
    })
  })

  describe('可见范围计算', () => {
    it('应该正确计算初始可见范围', () => {
      const { visibleRange } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      // 容器 500px，每项 50px，可见 10 项
      // 加上 overscan 3，应该是 0-13
      expect(visibleRange.value.startIndex).toBe(0)
      expect(visibleRange.value.endIndex).toBeLessThanOrEqual(13)
      expect(visibleRange.value.endIndex).toBeGreaterThan(10)
    })

    it('滚动后应该更新可见范围', () => {
      const { visibleRange, handleScroll } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      // 模拟滚动到 250px（第 5 项）
      handleScroll({ target: { scrollTop: 250 } } as any)

      expect(visibleRange.value.startIndex).toBeGreaterThan(0)
      expect(visibleRange.value.startIndex).toBeLessThanOrEqual(5)
    })

    it('滚动到底部应该正确处理边界', () => {
      const { visibleRange, handleScroll } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      // 滚动到底部
      handleScroll({ target: { scrollTop: 4500 } } as any)

      expect(visibleRange.value.endIndex).toBeLessThanOrEqual(100)
      expect(visibleRange.value.endIndex).toBeGreaterThan(90)
    })

    it('不应该超出数组范围', () => {
      const { visibleRange } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      expect(visibleRange.value.startIndex).toBeGreaterThanOrEqual(0)
      expect(visibleRange.value.endIndex).toBeLessThanOrEqual(100)
    })
  })

  describe('可见项计算', () => {
    it('应该返回正确的可见项', () => {
      const { visibleItems } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      expect(visibleItems.value.length).toBeGreaterThan(0)
      expect(visibleItems.value.length).toBeLessThanOrEqual(100)
      expect(visibleItems.value[0]).toEqual({ id: 0, name: 'Item 0' })
    })

    it('滚动后应该更新可见项', () => {
      const { visibleItems, handleScroll } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      handleScroll({ target: { scrollTop: 250 } } as any)

      expect(visibleItems.value[0].id).toBeGreaterThan(0)
    })

    it('空数组应该返回空可见项', () => {
      const emptyItems = ref([])
      const { visibleItems, totalHeight } = useVirtualScroll(emptyItems, {
        containerHeight,
        itemHeight,
      })

      expect(visibleItems.value).toHaveLength(0)
      expect(totalHeight.value).toBe(0)
    })

    it('少量项目应该全部可见', () => {
      const smallList = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
      const { visibleItems } = useVirtualScroll(smallList, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      expect(visibleItems.value).toHaveLength(3)
    })
  })

  describe('偏移量计算', () => {
    it('应该正确计算初始偏移量', () => {
      const { offsetY } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      expect(offsetY.value).toBe(0)
    })

    it('滚动后应该更新偏移量', () => {
      const { offsetY, handleScroll } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      handleScroll({ target: { scrollTop: 250 } } as any)

      expect(offsetY.value).toBeGreaterThan(0)
      expect(offsetY.value).toBeLessThan(250)
    })

    it('偏移量应该是 itemHeight 的倍数', () => {
      const { offsetY, handleScroll } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 3,
      })

      handleScroll({ target: { scrollTop: 275 } } as any)

      expect(offsetY.value % itemHeight).toBe(0)
    })
  })

  describe('scrollToIndex 功能', () => {
    it('应该正确滚动到指定索引', () => {
      const { scrollTop, scrollToIndex } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      scrollToIndex(5)

      expect(scrollTop.value).toBe(250) // 5 * 50
    })

    it('应该滚动到第一个索引', () => {
      const { scrollTop, scrollToIndex } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      scrollToIndex(0)

      expect(scrollTop.value).toBe(0)
    })

    it('应该滚动到最后一个索引', () => {
      const { scrollTop, scrollToIndex } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      scrollToIndex(99)

      expect(scrollTop.value).toBe(4950) // 99 * 50
    })

    it('超出范围的索引不应该改变滚动位置', () => {
      const { scrollTop, scrollToIndex } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      const initialScrollTop = scrollTop.value
      scrollToIndex(999)

      expect(scrollTop.value).toBe(initialScrollTop)
    })

    it('负数索引不应该改变滚动位置', () => {
      const { scrollTop, scrollToIndex } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      const initialScrollTop = scrollTop.value
      scrollToIndex(-1)

      expect(scrollTop.value).toBe(initialScrollTop)
    })
  })

  describe('动态容器高度', () => {
    it('容器高度变化后应该更新可见范围', () => {
      const dynamicHeight = ref(500)
      const { visibleRange } = useVirtualScroll(mockItems, {
        containerHeight: dynamicHeight,
        itemHeight,
        overscan: 3,
      })

      const initialEndIndex = visibleRange.value.endIndex

      // 增加容器高度
      dynamicHeight.value = 1000

      // 可见项应该增加
      expect(visibleRange.value.endIndex).toBeGreaterThan(initialEndIndex)
    })

    it('容器高度为 0 时应该处理正常', () => {
      const zeroHeight = ref(0)
      const { visibleRange } = useVirtualScroll(mockItems, {
        containerHeight: zeroHeight,
        itemHeight,
        overscan: 3,
      })

      expect(visibleRange.value.startIndex).toBe(0)
      expect(visibleRange.value.endIndex).toBeLessThanOrEqual(3) // 只有 overscan
    })
  })

  describe('动态项目列表', () => {
    it('项目数量变化后应该更新总高度', () => {
      const dynamicItems = ref([{ id: 1 }, { id: 2 }])
      const { totalHeight } = useVirtualScroll(dynamicItems, {
        containerHeight,
        itemHeight,
      })

      expect(totalHeight.value).toBe(100) // 2 * 50

      dynamicItems.value.push({ id: 3 })

      expect(totalHeight.value).toBe(150) // 3 * 50
    })

    it('清空列表后总高度应该为 0', () => {
      const { totalHeight } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      expect(totalHeight.value).toBe(5000)

      mockItems.value = []

      expect(totalHeight.value).toBe(0)
    })
  })

  describe('自定义 overscan', () => {
    it('overscan 为 0 时应该只渲染可见项', () => {
      const { visibleRange } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 0,
      })

      // 容器 500px，每项 50px，可见 10 项
      const visibleCount = visibleRange.value.endIndex - visibleRange.value.startIndex
      expect(visibleCount).toBeLessThanOrEqual(10)
    })

    it('overscan 为 10 时应该预渲染更多项', () => {
      const { visibleRange } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
        overscan: 10,
      })

      const visibleCount = visibleRange.value.endIndex - visibleRange.value.startIndex
      expect(visibleCount).toBeGreaterThan(10)
      expect(visibleCount).toBeLessThanOrEqual(30) // 10 (可见) + 10 (上) + 10 (下)
    })

    it('默认 overscan 应该为 3', () => {
      const { visibleRange } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight,
      })

      const visibleCount = visibleRange.value.endIndex - visibleRange.value.startIndex
      expect(visibleCount).toBeGreaterThan(10)
      expect(visibleCount).toBeLessThanOrEqual(16) // 10 (可见) + 3 (上) + 3 (下)
    })
  })

  describe('边界情况', () => {
    it('itemHeight 为 1 时应该正常工作', () => {
      const { totalHeight, visibleRange } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight: 1,
      })

      expect(totalHeight.value).toBe(100) // 100 * 1
      expect(visibleRange.value.endIndex).toBeGreaterThan(500)
    })

    it('itemHeight 很大时应该正常工作', () => {
      const { totalHeight, visibleRange } = useVirtualScroll(mockItems, {
        containerHeight,
        itemHeight: 1000,
      })

      expect(totalHeight.value).toBe(100000) // 100 * 1000
      expect(visibleRange.value.endIndex).toBeLessThanOrEqual(1)
    })

    it('单行列表应该正常工作', () => {
      const singleItem = ref([{ id: 1 }])
      const { totalHeight, visibleItems, offsetY } = useVirtualScroll(singleItem, {
        containerHeight,
        itemHeight,
      })

      expect(totalHeight.value).toBe(50)
      expect(visibleItems.value).toHaveLength(1)
      expect(offsetY.value).toBe(0)
    })
  })
})
