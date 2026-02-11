import { describe, it, expect } from 'vitest'
import { hueToDegrees, hueToHsl, createRainbowGradient, useColorUtils, type ThemeConfig } from '@/client/composables/useColorUtils'
import { ref } from 'vue'

describe('useColorUtils > hueToDegrees', () => {
  it('应该将 0 转换为 0 度', () => {
    expect(hueToDegrees(0)).toBe(0)
  })

  it('应该将 127.5 转换为 180 度', () => {
    expect(hueToDegrees(127.5)).toBe(180)
  })

  it('应该将 255 转换为 360 度', () => {
    expect(hueToDegrees(255)).toBe(360)
  })

  it('应该正确转换中间值', () => {
    expect(hueToDegrees(64)).toBe(90) // (64/255)*360 ≈ 90
    expect(hueToDegrees(191)).toBe(270) // (191/255)*360 ≈ 270
  })

  it('应该返回整数结果', () => {
    const result = hueToDegrees(100)
    expect(Number.isInteger(result)).toBe(true)
  })
})

describe('useColorUtils > hueToHsl', () => {
  it('应该生成标准的 HSL 颜色字符串', () => {
    const result = hueToHsl(127)
    expect(result).toMatch(/^hsl\(\d+, 100%, 50%\)$/)
  })

  it('应该使用默认饱和度和亮度', () => {
    const result = hueToHsl(100)
    expect(result).toContain('100%') // 饱和度
    expect(result).toContain('50%') // 亮度
  })

  it('应该支持自定义饱和度', () => {
    const result = hueToHsl(100, 80)
    expect(result).toContain('80%')
    expect(result).toContain('50%') // 亮度仍是默认值
  })

  it('应该支持自定义亮度', () => {
    const result = hueToHsl(100, 100, 30)
    expect(result).toContain('30%')
  })

  it('应该同时支持自定义饱和度和亮度', () => {
    const result = hueToHsl(200, 75, 25)
    expect(result).toBe('hsl(283, 75%, 25%)')
  })
})

describe('useColorUtils > createRainbowGradient', () => {
  it('应该生成线性渐变字符串', () => {
    const result = createRainbowGradient()
    expect(result).toMatch(/^linear-gradient/)
  })

  it('应该包含完整的彩虹色谱', () => {
    const result = createRainbowGradient()
    expect(result).toContain('hsl(0') // 红色
    expect(result).toContain('hsl(60') // 黄色
    expect(result).toContain('hsl(120') // 绿色
    expect(result).toContain('hsl(180') // 青色
    expect(result).toContain('hsl(240') // 蓝色
    expect(result).toContain('hsl(300') // 紫色
    expect(result).toContain('hsl(360') // 红色
  })

  it('应该是水平方向渐变', () => {
    const result = createRainbowGradient()
    expect(result).toContain('to right')
  })
})

describe('useColorUtils > useColorUtils composable', () => {
  it('应该接受 ref 类型的配置', () => {
    const config = ref<ThemeConfig>({ hue: 128, mode: 'light' })
    const { currentColor } = useColorUtils(config)

    expect(currentColor.value).toBe('hsl(181, 100%, 50%)')
  })

  it('应该接受对象类型的配置', () => {
    const config: ThemeConfig = { hue: 64, mode: 'dark' }
    const { currentColor } = useColorUtils(config)

    expect(currentColor.value).toBe('hsl(90, 100%, 50%)')
  })

  it('应该接受函数类型的配置', () => {
    const config = () => ({ hue: 200, mode: 'light' })
    const { currentColor } = useColorUtils(config)

    expect(currentColor.value).toBe('hsl(283, 100%, 50%)')
  })

  it('currentColor 应该响应配置变化', () => {
    const config = ref<ThemeConfig>({ hue: 0, mode: 'light' })
    const { currentColor } = useColorUtils(config)

    expect(currentColor.value).toBe('hsl(0, 100%, 50%)')

    config.value.hue = 128
    expect(currentColor.value).toBe('hsl(181, 100%, 50%)')
  })

  it('sliderBackground 应该返回彩虹渐变', () => {
    const config = ref<ThemeConfig>({ hue: 128, mode: 'light' })
    const { sliderBackground } = useColorUtils(config)

    expect(sliderBackground.value).toContain('linear-gradient')
    expect(sliderBackground.value).toContain('to right')
  })

  it('sliderBackground 应该包含所有彩虹色', () => {
    const config = ref<ThemeConfig>({ hue: 128, mode: 'light' })
    const { sliderBackground } = useColorUtils(config)

    expect(sliderBackground.value).toContain('hsl(0')
    expect(sliderBackground.value).toContain('hsl(360')
  })
})
