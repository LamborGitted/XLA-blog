// src/client/utils/imageOrientationDetector.ts

import type { Background } from '@/client/domain/theme/backgrounds'

/**
 * 图片方向类型
 */
export type ImageOrientation = 'landscape' | 'portrait'

/**
 * 分类后的背景图片集合
 */
export interface OrientedBackgrounds {
    landscape: Background[]
    portrait: Background[]
}

/**
 * 图片元数据缓存
 * 存储图片尺寸信息，避免重复加载
 */
const imageMetadataCache = new Map<string, { width: number; height: number; orientation: ImageOrientation }>()

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

/**
 * 检测单张图片的方向
 *
 * @param background - 背景图片对象
 * @param useCache - 是否使用缓存（默认 true）
 * @returns Promise<'landscape' | 'portrait'>
 */
export async function detectImageOrientation(
    background: Background,
    useCache: boolean = true
): Promise<ImageOrientation> {
    // 1. 检查手动标注的方向
    if (background.orientation) {
        return background.orientation as ImageOrientation
    }

    // 2. 检查缓存
    if (useCache && imageMetadataCache.has(background.src)) {
        const cached = imageMetadataCache.get(background.src)!
        return cached.orientation
    }

    // 3. 加载图片获取尺寸
    return new Promise((resolve) => {
        const img = new Image()

        img.onload = () => {
            const width = img.naturalWidth
            const height = img.naturalHeight
            const aspectRatio = width / height
            const orientation: ImageOrientation = aspectRatio >= 1 ? 'landscape' : 'portrait'

            // 4. 缓存结果
            imageMetadataCache.set(background.src, { width, height, orientation })

            resolve(orientation)
        }

        img.onerror = () => {
            // 加载失败时，默认为横向
            console.warn(`Failed to load image for orientation detection: ${background.src}`)
            const fallbackOrientation: ImageOrientation = 'landscape'
            imageMetadataCache.set(background.src, { width: 1920, height: 1080, orientation: fallbackOrientation })
            resolve(fallbackOrientation)
        }

        // 开始加载
        img.src = background.src
    })
}

/**
 * 批量检测并分类背景图片
 *
 * @param backgrounds - 背景图片数组
 * @returns Promise<OrientedBackgrounds> - 分类后的图片集合
 */
export async function detectOrientations(backgrounds: Background[]): Promise<OrientedBackgrounds> {
    const result: OrientedBackgrounds = {
        landscape: [],
        portrait: []
    }

    // 并行加载所有图片检测方向
    const detections = await Promise.allSettled(
        backgrounds.map(bg => detectImageOrientation(bg))
    )

    // 根据检测结果分类
    detections.forEach((detection, index) => {
        const background = backgrounds[index]!

        if (detection.status === 'fulfilled') {
            const orientation = detection.value
            result[orientation].push(background)
        } else {
            // 检测失败时，默认为横向
            console.warn(`Orientation detection failed for ${background.src}, defaulting to landscape`)
            result.landscape.push(background)
        }
    })

    console.log(`[imageOrientationDetector] 分类完成: ${result.landscape.length} 张横向, ${result.portrait.length} 张竖向`)

    return result
}

/**
 * 清除元数据缓存
 * 用于测试或内存清理
 */
export function clearImageMetadataCache(): void {
    imageMetadataCache.clear()
}

/**
 * 获取缓存大小
 */
export function getCacheSize(): number {
    return imageMetadataCache.size
}
