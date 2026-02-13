// src/client/domain/theme/backgrounds.ts

/**
 * 图片方向类型
 * - landscape: 横向（宽高比 >= 1）
 * - portrait: 竖向（宽高比 < 1）
 * - auto: 自动检测（运行时根据图片尺寸判断）
 */
export type ImageOrientation = 'landscape' | 'portrait' | 'auto'

/**
 * 背景图片接口
 */
export interface Background {
    src: string
    description?: string
    /** 可选：手动指定图片方向（优先于自动检测） */
    orientation?: ImageOrientation
}

/**
 * 分类后的背景图片集合
 */
export interface OrientedBackgrounds {
    /** 横向背景图片列表 */
    landscape: Background[]
    /** 竖向背景图片列表 */
    portrait: Background[]
}

export const backgrounds: Background[] = [
    { src: '/backgrounds/1.webp', description: '' },
    { src: '/backgrounds/2.webp', description: '' },
    { src: '/backgrounds/3.webp', description: '' },
    { src: '/backgrounds/4.webp', description: '' },
    { src: '/backgrounds/5.webp', description: '' },
    { src: '/backgrounds/6.webp', description: '' },
    { src: '/backgrounds/7.webp', description: '' },
    { src: '/backgrounds/8.webp', description: '' },
    { src: '/backgrounds/9.webp', description: '' },
    { src: '/backgrounds/10.webp', description: '' },
    { src: '/backgrounds/11.webp', description: '' },
    { src: '/backgrounds/12.webp', description: '' },
    { src: '/backgrounds/13.jpg', description: '' },
    { src: '/backgrounds/14.jpg', description: '' },
    { src: '/backgrounds/15.jpg', description: '' },
    { src: '/backgrounds/16.jpg', description: '' },
    { src: '/backgrounds/17.jpg', description: '' },
    { src: '/backgrounds/18.jpg', description: '' },
    { src: '/backgrounds/19.jpg', description: '' },
    { src: '/backgrounds/20.jpg', description: '' },
    { src: '/backgrounds/21.jpg', description: '' },
    { src: '/backgrounds/22.jpg', description: '' },
    { src: '/backgrounds/23.jpg', description: '' },
]
