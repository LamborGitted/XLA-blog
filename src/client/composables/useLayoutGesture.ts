// src/client/composables/useLayoutGesture.ts

import { onMounted, onUnmounted } from 'vue'
import { useLayoutTransform } from './useLayoutTransform'

/**
 * 手势配置
 */
interface GestureConfig {
  /** 触发滚轮切换的阈值（像素） */
  wheelThreshold: number
  /** 触发滑动手势的阈值（像素） */
  swipeThreshold: number
  /** 防抖时间（毫秒） */
  debounceTime: number
  /** 手势生效的 CSS 选择器（默认为整个页面） */
  targetSelector?: string
}

/**
 * 默认配置
 */
const DEFAULT_CONFIG: GestureConfig = {
  // 滚轮阈值：用户需要滚动此距离才会触发布局切换（约 2-3 次鼠标滚轮）
  wheelThreshold: 800,
  // 滑动阈值：用户需要滑动此距离才会触发布局切换（约 1/3 屏幕宽度）
  swipeThreshold: 150,
  // 防抖时间：两次触发之间的最小间隔（毫秒），防止频繁切换
  debounceTime: 1000,
  // 目标选择器：指定手势生效的区域，undefined 表示整个页面
  targetSelector: undefined,
}

/**
 * 布局手势 Composable
 */
export function useLayoutGesture(config: Partial<GestureConfig> = {}) {
  const { toggleMode, isWidgetsMode, isDefaultMode, isLinkListMode, toLinkListMode, toWidgetsMode } = useLayoutTransform()

  const finalConfig: GestureConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  }

  /**
   * 检查事件是否在目标区域内
   */
  function isEventInTarget(event: Event): boolean {
    // 如果没有指定目标选择器，整个页面都生效
    if (!finalConfig.targetSelector) {
      return true
    }

    const target = event.target as HTMLElement
    return target.closest(finalConfig.targetSelector) !== null
  }

  /**
   * 检查友链组件是否滚动到顶部
   */
  function isLinkListAtTop(): boolean {
    const linkList = document.querySelector('.link-list')
    if (!linkList) return true

    return linkList.scrollTop === 0
  }

  /**
   * 检查事件是否在友链组件内
   */
  function isEventInLinkList(event: Event): boolean {
    const target = event.target as HTMLElement
    return target.closest('.link-list') !== null
  }

  // 累计滚轮距离（分别记录向上和向下）
  let accumulatedDown = 0
  let accumulatedUp = 0
  // 最后触发时间
  let lastTriggerTime = 0
  // 重置滚轮定时器
  let resetWheelTimer: ReturnType<typeof setTimeout> | null = null

  // 触摸相关
  let touchStartX = 0
  let touchStartY = 0
  let isTracking = false

  /**
   * 重置累计的滚轮距离
   */
  function resetAccumulatedWheel() {
    accumulatedDown = 0
    accumulatedUp = 0
  }

  /**
   * 检查是否可以触发（防抖）
   */
  function canTrigger(): boolean {
    const now = Date.now()
    return now - lastTriggerTime > finalConfig.debounceTime
  }

  /**
   * 记录触发时间
   */
  function recordTrigger() {
    lastTriggerTime = Date.now()
  }

  /**
   * 处理滚轮事件
   */
  function handleWheel(event: WheelEvent) {
    // 检查是否在目标区域内
    if (!isEventInTarget(event)) {
      return
    }

    // 如果在友链组件内，需要检查是否滚动到顶部
    if (isEventInLinkList(event) && !isLinkListAtTop()) {
      // 在友链组件内且未滚动到顶部，不触发布局切换
      return
    }

    // 防抖检查
    if (!canTrigger()) {
      return
    }

    // 清除之前的重置定时器
    if (resetWheelTimer) {
      clearTimeout(resetWheelTimer)
    }

    // 根据滚动方向累计
    if (event.deltaY > 0) {
      // 向下滚动
      accumulatedDown += event.deltaY
      accumulatedUp = 0 // 清空反向累计

      // 默认模式 -> 小组件模式
      if (accumulatedDown >= finalConfig.wheelThreshold && isDefaultMode.value) {
        console.log('触发：向下滚动，切换到小组件布局')
        toggleMode()
        recordTrigger()
        resetAccumulatedWheel()
        return
      }

      // 小组件模式 -> 链接列表模式
      if (accumulatedDown >= finalConfig.wheelThreshold && isWidgetsMode.value) {
        console.log('触发：向下滚动，切换到链接列表布局')
        toLinkListMode()
        recordTrigger()
        resetAccumulatedWheel()
        return
      }
    } else {
      // 向上滚动
      accumulatedUp += Math.abs(event.deltaY)
      accumulatedDown = 0 // 清空反向累计

      // 链接列表模式 -> 小组件模式
      if (accumulatedUp >= finalConfig.wheelThreshold && isLinkListMode.value) {
        console.log('触发：向上滚动，回到小组件布局')
        toWidgetsMode()
        recordTrigger()
        resetAccumulatedWheel()
        return
      }

      // 小组件模式 -> 默认模式
      if (accumulatedUp >= finalConfig.wheelThreshold && isWidgetsMode.value) {
        console.log('触发：向上滚动，回到默认布局')
        toggleMode()
        recordTrigger()
        resetAccumulatedWheel()
        return
      }
    }

    // 设置新的重置定时器（300ms 无操作后重置）
    resetWheelTimer = setTimeout(() => {
      resetAccumulatedWheel()
    }, 300)
  }

  /**
   * 处理触摸开始
   */
  function handleTouchStart(event: TouchEvent) {
    const touch = event.touches[0]
    if (touch) {
      touchStartX = touch.clientX
      touchStartY = touch.clientY
      isTracking = true
    }
  }

  /**
   * 处理触摸移动
   */
  function handleTouchMove(event: TouchEvent) {
    if (!isTracking || event.touches.length !== 1) {
      return
    }

    // 检查是否在目标区域内
    if (!isEventInTarget(event)) {
      return
    }

    const touch = event.touches[0]
    if (!touch) return

    const deltaX = touchStartX - touch.clientX
    const deltaY = touchStartY - touch.clientY

    // 判断是否是水平滑动（水平距离大于垂直距离）
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 左滑：切换到小组件布局
      if (deltaX > finalConfig.swipeThreshold && isDefaultMode.value && canTrigger()) {
        console.log('触发：左滑，切换到小组件布局')
        toggleMode()
        recordTrigger()
        isTracking = false
      }
      // 右滑：回到默认布局
      else if (deltaX < -finalConfig.swipeThreshold && isWidgetsMode.value && canTrigger()) {
        console.log('触发：右滑，回到默认布局')
        toggleMode()
        recordTrigger()
        isTracking = false
      }
    }
  }

  /**
   * 处理触摸结束
   */
  function handleTouchEnd() {
    isTracking = false
  }

  /**
   * 启用手势监听
   */
  function startListening() {
    console.log('启用手势监听', finalConfig)
    // 监听滚轮事件
    window.addEventListener('wheel', handleWheel, { passive: true })

    // 监听触摸事件
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  /**
   * 停止手势监听
   */
  function stopListening() {
    window.removeEventListener('wheel', handleWheel)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)

    if (resetWheelTimer) {
      clearTimeout(resetWheelTimer)
    }
  }

  // 生命周期钩子
  onMounted(() => {
    startListening()
  })

  onUnmounted(() => {
    stopListening()
  })

  return {
    startListening,
    stopListening,
  }
}
