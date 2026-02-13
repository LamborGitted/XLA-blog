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

    { src: '/backgrounds/4 (2).webp', description: '' },

    { src: '/backgrounds/1.webp', description: '' },
    { src: '/backgrounds/2.webp', description: '' },
    { src: '/backgrounds/3.webp', description: '' },
    { src: '/backgrounds/4.webp', description: '' },

    { src: '/backgrounds/1 (2).webp', description: '' },
    { src: '/backgrounds/2 (2).webp', description: '' },
    { src: '/backgrounds/3 (2).webp', description: '' },

    { src: '/backgrounds/d1.webp', description: '' },
    { src: '/backgrounds/d2.webp', description: '' },
    { src: '/backgrounds/d3.webp', description: '' },
    { src: '/backgrounds/d4.webp', description: '' },
    { src: '/backgrounds/d5.webp', description: '' },
    { src: '/backgrounds/d6.webp', description: '' },
    { src: '/backgrounds/d7.webp', description: '' },
    { src: '/backgrounds/d8.webp', description: '' },

    { src: '/backgrounds/1a7a9ff30d0b7cf03b9fdbd1dd4cf0ad90a344eb.jpg', description: '' },
    { src: '/backgrounds/464b547c424f36e7c6c38e0c2c151759a3bc68ec.jpg', description: '' },
    { src: '/backgrounds/4986499bffa3b14c572c22c1ce441fc2cd94d63f.jpg', description: '' },
    { src: '/backgrounds/5d662a33907ffe4edd7261ea4b374ff0a01e2dde.jpg', description: '' },
    { src: '/backgrounds/6765bb292ea65ebcff37845ee718cc0e290750052.jpg', description: '' },
    { src: '/backgrounds/711ce964e0a5c708aa174d8f6d7ee4e4bb60d356.jpg', description: '' },
    { src: '/backgrounds/91ae6186d2cf1af536b57c78ad7134ca1c8cbfe0.jpg', description: '' },
    { src: '/backgrounds/ca3c3f88c47fac7bdda5b8b29ca638dcee769704.jpg', description: '' },
    { src: '/backgrounds/db67d185b865ebeb42be0ee1948952586147971e.jpg', description: '' },
    { src: '/backgrounds/fd450b78411a7548183aa291bb4cbb99d0bc2bed.jpg', description: '' },
    { src: '/backgrounds/cover.jpg', description: '' },
]
