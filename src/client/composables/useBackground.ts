// src/client/composables/useBackground.ts

import { ref, onMounted, onUnmounted, computed } from 'vue'
import { backgrounds, type Background } from '@/client/domain/theme/backgrounds'
import { detectOrientations, type ImageOrientation } from '@/client/utils/imageOrientationDetector'

/**
 * 防抖函数
 */
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
    let timeout: ReturnType<typeof setTimeout> | null = null
    return ((...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }) as T
}

export function useBackground(intervalMs = 4000) {
    // 当前屏幕方向
    const currentOrientation = ref<ImageOrientation>('landscape')

    // 分类后的背景图片集合
    const orientedBackgrounds = ref<{
        landscape: Background[]
        portrait: Background[]
    }>({ landscape: [], portrait: [] })

    // 当前背景索引（针对当前方向的列表）
    const currentIndex = ref(0)

    // 当前显示的背景
    const currentBg = ref<Background>(backgrounds[0]!)

    // 上一张背景（用于淡出动画）
    const prevBg = ref<Background | null>(null)

    // 轮播定时器
    let timer: number | null = null
    let isLoadingNext = false

    /**
     * 获取当前方向对应的背景列表
     */
    const currentBgList = computed(() => {
        const list = orientedBackgrounds.value[currentOrientation.value]
        // 降级策略：如果当前方向没有图片，使用另一个方向的图片
        if (list.length === 0) {
            const fallbackOrientation = currentOrientation.value === 'landscape' ? 'portrait' : 'landscape'
            console.warn(`[useBackground] ${currentOrientation.value} 方向无图片，降级使用 ${fallbackOrientation} 方向图片`)
            return orientedBackgrounds.value[fallbackOrientation] || []
        }
        return list
    })

    /**
     * 计算下一张背景（预加载用）
     */
    const nextBg = computed(() => {
        const list = currentBgList.value
        if (list.length === 0) return backgrounds[0]!
        const nextIndex = (currentIndex.value + 1) % list.length
        return list[nextIndex]!
    })

    /**
     * 切换到指定方向的背景图片
     * @param orientation - 目标方向
     */
    const switchToOrientation = async (orientation: ImageOrientation) => {
        console.log(`[useBackground] 切换方向: ${currentOrientation.value} -> ${orientation}`)

        // 更新当前方向
        currentOrientation.value = orientation

        // 重置索引到第一张
        currentIndex.value = 0

        // 获取新方向的第一张背景
        const newList = currentBgList.value
        if (newList.length > 0) {
            const newBg = newList[0]!

            // 预加载新背景
            await preloadAndSwitch(newBg)
        }
    }

    /**
     * 预加载并切换到指定背景
     */
    const preloadAndSwitch = (targetBg: Background): Promise<void> => {
        return new Promise((resolve) => {
            // 如果已经是当前背景，直接返回
            if (targetBg.src === currentBg.value.src) {
                resolve()
                return
            }

            isLoadingNext = true
            const img = new Image()

            img.onload = () => {
                // 保存当前背景为上一张背景（用于淡出动画）
                prevBg.value = currentBg.value
                // 切换到新背景
                currentBg.value = targetBg
                isLoadingNext = false

                // 动画结束后清除上一张背景的引用
                setTimeout(() => {
                    prevBg.value = null
                }, 1000) // 与 CSS transition 时间一致（1秒）

                resolve()
            }

            img.onerror = () => {
                // 加载失败，跳过此图片
                console.warn(`[useBackground] 预加载失败: ${targetBg.src}`)
                isLoadingNext = false
                resolve() // 即使失败也 resolve，避免阻塞
            }

            // 开始加载
            img.src = targetBg.src
        })
    }

    /**
     * 切换到下一张背景
     */
    const next = () => {
        // 防止重复加载
        if (isLoadingNext) return

        const list = currentBgList.value
        if (list.length === 0) return

        const nextBgValue = nextBg.value
        const nextIndex = (currentIndex.value + 1) % list.length

        // 预加载并切换
        preloadAndSwitch(nextBgValue).then(() => {
            // 切换成功后更新索引
            currentIndex.value = nextIndex
        })
    }

    /**
     * 设置屏幕方向检测
     */
    const setupOrientationDetection = () => {
        // 检测初始方向
        const isPortrait = window.matchMedia('(orientation: portrait)').matches
        const initialOrientation: ImageOrientation = isPortrait ? 'portrait' : 'landscape'
        console.log(`[useBackground] 初始方向: ${initialOrientation}`)

        // 如果初始方向与默认方向不同，立即切换
        if (initialOrientation !== currentOrientation.value) {
            switchToOrientation(initialOrientation)
        }

        // 防抖后的方向更新函数
        const updateOrientation = debounce(() => {
            const isPortraitNow = window.matchMedia('(orientation: portrait)').matches
            const newOrientation: ImageOrientation = isPortraitNow ? 'portrait' : 'landscape'

            if (newOrientation !== currentOrientation.value) {
                switchToOrientation(newOrientation)
            }
        }, 300) // 300ms 防抖，避免频繁切换

        // 监听方向变化
        const mediaQuery = window.matchMedia('(orientation: portrait)')

        // 兼容不同浏览器的监听方式
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', updateOrientation)
        } else {
            // 旧版浏览器兼容（Safari < 14）
            mediaQuery.addListener(updateOrientation)
        }

        // 返回清理函数
        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', updateOrientation)
            } else {
                mediaQuery.removeListener(updateOrientation)
            }
        }
    }

    onMounted(async () => {
        console.log('[useBackground] 初始化背景轮播系统')

        // 1. 分类所有背景图片（异步进行，不阻塞首屏）
        try {
            const { landscape, portrait } = await detectOrientations(backgrounds)
            orientedBackgrounds.value = { landscape, portrait }

            // 设置初始背景（根据当前方向）
            const isPortrait = window.matchMedia('(orientation: portrait)').matches
            const initialOrientation: ImageOrientation = isPortrait ? 'portrait' : 'landscape'
            currentOrientation.value = initialOrientation

            // 选择第一张背景
            const initialList = orientedBackgrounds.value[initialOrientation]
            if (initialList.length > 0) {
                currentBg.value = initialList[0]!
            }
        } catch (error) {
            console.error('[useBackground] 背景分类失败:', error)
            // 降级：使用所有图片
            orientedBackgrounds.value = {
                landscape: backgrounds,
                portrait: backgrounds
            }
            currentBg.value = backgrounds[0]!
        }

        // 2. 设置方向检测
        const cleanupOrientation = setupOrientationDetection()

        // 3. 启动自动轮播
        timer = window.setInterval(next, intervalMs)

        // 保存清理函数
        onUnmounted(() => {
            cleanupOrientation?.()
        })
    })

    onUnmounted(() => {
        if (timer) clearInterval(timer)
    })

    return {
        currentBg,
        prevBg,
        nextBg
    }
}
