import { ref, computed, watch, onUnmounted } from 'vue'

/**
 * 色调滑条逻辑
 */
export function useHueSlider(initialHue: number, onHueChange: (hue: number) => void) {
  // 滑条显示状态
  const showSlider = ref(false)

  // 延迟关闭定时器
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  // 本地滑条值（用于实时预览）
  const localHue = ref(initialHue)

  // 同步初始 hue 到本地值
  watch(() => initialHue, (newHue) => {
    localHue.value = newHue
  })

  // 滑块位置百分比
  const sliderPercent = computed(() => {
    return (localHue.value / 255) * 100
  })

  // 清除关闭定时器
  const clearCloseTimer = () => {
    if (closeTimer) {
      clearTimeout(closeTimer)
      closeTimer = null
    }
  }

  // 悬浮显示滑条
  const handleMouseEnter = () => {
    clearCloseTimer()
    showSlider.value = true
  }

  // 鼠标离开时隐藏滑条
  const handleMouseLeave = () => {
    clearCloseTimer()
    closeTimer = setTimeout(() => {
      showSlider.value = false
    }, 300)
  }

  // 处理滑条变化（实时更新）
  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const hue = parseInt(target.value)
    localHue.value = hue
    onHueChange(hue) // 实时更新主题
  }

  // 处理滑条释放（更新主题）
  const handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const hue = parseInt(target.value)
    onHueChange(hue)
  }

  // 组件卸载时清理定时器
  onUnmounted(() => {
    clearCloseTimer()
  })

  return {
    showSlider,
    localHue,
    sliderPercent,
    handleMouseEnter,
    handleMouseLeave,
    handleInput,
    handleChange
  }
}
