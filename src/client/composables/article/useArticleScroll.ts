import { nextTick } from 'vue'

/**
 * 文章滚动管理 Composable
 * 负责文章切换时自动滚动到顶部
 */
export function useArticleScroll() {
  /**
   * 当文章切换时滚动到顶部
   */
  async function scrollToTop(): Promise<void> {
    await nextTick()

    // 使用 setTimeout 确保 DOM 更新后再滚动
    setTimeout(() => {
      const scrollLayer = document.querySelector('.content-scroll-layer')
      if (scrollLayer) {
        scrollLayer.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 100)
  }

  /**
   * 获取当前滚动位置
   */
  function getScrollTop(): number {
    const scrollLayer = document.querySelector('.content-scroll-layer')
    return scrollLayer?.scrollTop ?? 0
  }

  /**
   * 滚动到指定位置
   */
  function scrollToPosition(top: number, behavior: ScrollBehavior = 'smooth'): void {
    const scrollLayer = document.querySelector('.content-scroll-layer')
    if (scrollLayer) {
      scrollLayer.scrollTo({ top, behavior })
    }
  }

  return {
    scrollToTop,
    getScrollTop,
    scrollToPosition
  }
}
