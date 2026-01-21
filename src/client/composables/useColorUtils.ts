import { computed, type Ref } from 'vue'

/**
 * 主题配置类型
 */
export interface ThemeConfig {
  hue: number
  mode: 'light' | 'dark'
}

/**
 * 将 0-255 的 hue 值转换为 HSL 颜色字符串
 */
export function hueToHsl(hue: number, saturation = 100, lightness = 50): string {
  const degrees = Math.round((hue / 255) * 360)
  return `hsl(${degrees}, ${saturation}%, ${lightness}%)`
}

/**
 * 生成彩虹色渐变背景（水平方向）
 */
export function createRainbowGradient(): string {
  return `linear-gradient(to right,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  )`
}

/**
 * 颜色工具 composable
 */
export function useColorUtils(config: Ref<ThemeConfig> | ThemeConfig | (() => ThemeConfig)) {
  // 当前主题色
  const currentColor = computed(() => {
    let cfg: ThemeConfig
    if (typeof config === 'function') {
      cfg = config()
    } else if ('value' in config) {
      cfg = config.value
    } else {
      cfg = config
    }
    return hueToHsl(cfg.hue)
  })

  // 滑条背景：彩虹色渐变（水平方向）
  const sliderBackground = computed(() => {
    return createRainbowGradient()
  })

  return {
    currentColor,
    sliderBackground
  }
}
