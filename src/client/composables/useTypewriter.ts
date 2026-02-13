import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import type { TypewriterConfig } from '@/client/domain/view/PageTitle'

/**
 * 打字机效果返回值
 */
export interface TypewriterResult {
  /** 当前显示的文本 */
  text: Ref<string>
  /** 是否正在打字 */
  isTyping: Ref<boolean>
  /** 打字是否完成 */
  isComplete: Ref<boolean>
}

/**
 * 打字机效果 Composable
 *
 * @param getText - 获取文本内容的函数
 * @param getConfig - 获取打字机配置的函数
 * @returns 打字机结果对象
 */
export function useTypewriter(
  getText: () => string,
  getConfig: () => TypewriterConfig
): TypewriterResult {
  // 当前显示的文本
  const displayedText = ref('')
  // 是否正在打字
  const isTyping = ref(false)
  // 打字是否完成
  const isComplete = ref(false)

  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let currentIndex = 0

  /**
   * 执行打字动画
   */
  const typeNextChar = () => {
    const fullText = getText()
    const config = getConfig()
    const speed = config.speed ?? 100

    if (currentIndex < fullText.length) {
      displayedText.value += fullText.charAt(currentIndex)
      currentIndex++
      timeoutId = setTimeout(typeNextChar, speed)
    } else {
      // 打字完成
      isTyping.value = false
      isComplete.value = true
    }
  }

  /**
   * 启动打字机效果
   */
  const start = () => {
    const fullText = getText()
    const config = getConfig()
    const delay = config.delay ?? 500

    // 重置状态
    displayedText.value = ''
    currentIndex = 0
    isTyping.value = true
    isComplete.value = false

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    // 延迟后开始打字
    if (fullText) {
      timeoutId = setTimeout(typeNextChar, delay)
    } else {
      // 空文本直接完成
      isTyping.value = false
      isComplete.value = true
    }
  }

  // 组件挂载时启动动画
  onMounted(() => {
    start()
  })

  // 组件卸载时清理定时器
  onUnmounted(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return {
    text: displayedText,
    isTyping,
    isComplete,
  }
}
