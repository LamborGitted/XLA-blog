import { ref, computed, onMounted, onUnmounted, type Ref } from 'vue'

/**
 * 虚拟滚动配置
 */
export interface VirtualScrollConfig {
  containerHeight: Ref<number>  // 容器高度（响应式）
  itemHeight: number            // 每项高度
  overscan?: number             // 预渲染的额外项数
}

/**
 * 虚拟滚动 composable
 */
export function useVirtualScroll<T>(
  items: Ref<T[]>,
  config: VirtualScrollConfig
) {
  const { containerHeight, itemHeight, overscan = 3 } = config

  // 当前滚动位置
  const scrollTop = ref(0)

  // 计算可见范围
  const visibleRange = computed(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
    const endIndex = Math.min(
      items.value.length,
      Math.ceil((scrollTop.value + containerHeight.value) / itemHeight) + overscan
    )
    return { startIndex, endIndex }
  })

  // 可见项
  const visibleItems = computed(() => {
    return items.value.slice(visibleRange.value.startIndex, visibleRange.value.endIndex)
  })

  // 总高度（用于撑开滚动容器）
  const totalHeight = computed(() => {
    return items.value.length * itemHeight
  })

  // 偏移量（用于定位可见项）
  const offsetY = computed(() => {
    return visibleRange.value.startIndex * itemHeight
  })

  // 处理滚动事件
  const handleScroll = (event: Event) => {
    const target = event.target as HTMLElement
    scrollTop.value = target.scrollTop
  }

  // 滚动到指定索引
  const scrollToIndex = (index: number) => {
    if (index < 0 || index >= items.value.length) return
    scrollTop.value = index * itemHeight
  }

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    scrollToIndex,
    scrollTop
  }
}
