// src/client/composables/useWidgetClock.ts

import { ref, computed, onUnmounted, watch } from 'vue'
import type { ClockWidgetConfig, ClockRefreshMode } from '@/client/domain/widgets/widgets'

/**
 * 时钟时间信息
 */
export interface ClockTime {
  /** 小时 */
  hours: number
  /** 分钟 */
  minutes: number
  /** 秒数 */
  seconds: number
  /** 是否为上午 */
  isAm: boolean
  /** 12小时制的小时 */
  hours12: number
}

/**
 * 时钟日期信息
 */
export interface ClockDate {
  /** 年 */
  year: number
  /** 月 */
  month: number
  /** 日 */
  day: number
  /** 星期 */
  weekday: number
  /** 月名称（中文） */
  monthName: string
  /** 星期名称（中文） */
  weekdayName: string
}

/**
 * 时钟 Composable
 */
export function useWidgetClock(config?: Partial<ClockWidgetConfig>) {
  // 当前时间
  const currentTime = ref(new Date())

  // 定时器 ID
  let timerId: number | null = null

  // 合并配置
  const clockConfig: ClockWidgetConfig = {
    refreshMode: config?.refreshMode || 'seconds',
    showDate: config?.showDate !== false,
    showSeconds: config?.showSeconds !== false,
    format: config?.format || '24h',
  }

  // 时间信息
  const time = computed((): ClockTime => {
    const date = currentTime.value
    const hours = date.getHours()
    const isAm = hours < 12
    const hours12 = hours % 12 || 12

    return {
      hours,
      minutes: date.getMinutes(),
      seconds: date.getSeconds(),
      isAm,
      hours12,
    }
  })

  // 日期信息
  const dateInfo = computed((): ClockDate => {
    const date = currentTime.value
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = date.getDay()

    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
    const weekdayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

    return {
      year,
      month,
      day,
      weekday,
      monthName: monthNames[month - 1],
      weekdayName: weekdayNames[weekday],
    }
  })

  // 格式化时间字符串（24小时制）
  const time24Format = computed(() => {
    const h = String(time.value.hours).padStart(2, '0')
    const m = String(time.value.minutes).padStart(2, '0')
    const s = String(time.value.seconds).padStart(2, '0')

    if (clockConfig.showSeconds) {
      return `${h}:${m}:${s}`
    }
    return `${h}:${m}`
  })

  // 格式化时间字符串（12小时制）
  const time12Format = computed(() => {
    const h = String(time.value.hours12).padStart(2, '0')
    const m = String(time.value.minutes).padStart(2, '0')
    const s = String(time.value.seconds).padStart(2, '0')
    const ampm = time.value.isAm ? 'AM' : 'PM'

    if (clockConfig.showSeconds) {
      return `${h}:${m}:${s} ${ampm}`
    }
    return `${h}:${m} ${ampm}`
  })

  // 当前时间字符串（根据配置的格式）
  const timeString = computed(() => {
    return clockConfig.format === '24h' ? time24Format.value : time12Format.value
  })

  // 日期字符串（YYYY-MM-DD）
  const dateString = computed(() => {
    const { year, month, day } = dateInfo.value
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  })

  // 完整日期字符串（中文格式）
  const fullDateString = computed(() => {
    const { year, month, day, monthName, weekdayName } = dateInfo.value
    return `${year}年${month}月${day}日 ${weekdayName}`
  })

  /**
   * 启动时钟
   */
  function start(): void {
    stop()

    const interval = clockConfig.refreshMode === 'seconds' ? 1000 : 60000

    timerId = window.setInterval(() => {
      currentTime.value = new Date()
    }, interval)
  }

  /**
   * 停止时钟
   */
  function stop(): void {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
  }

  /**
   * 更新刷新模式
   */
  function setRefreshMode(mode: ClockRefreshMode): void {
    clockConfig.refreshMode = mode
    start() // 重新启动以应用新的刷新间隔
  }

  /**
   * 获取当前配置
   */
  function getConfig(): ClockWidgetConfig {
    return { ...clockConfig }
  }

  // 启动时钟
  start()

  // 组件卸载时清除定时器
  onUnmounted(() => {
    stop()
  })

  return {
    // 状态
    currentTime,
    time,
    dateInfo,

    // 格式化字符串
    timeString,
    time24Format,
    time12Format,
    dateString,
    fullDateString,

    // 方法
    start,
    stop,
    setRefreshMode,
    getConfig,
  }
}
