// src/client/domain/ripple/ripple.ts

/**
 * 涟漪效果类型
 */
export type RippleEffectType =
  | 'starburst'  // 星芒扩散 - 星星形状，星芒效果
  | 'ripple'     // 水滴涟漪 - 水波纹效果
  | 'pulse'      // 光环脉冲 - 多层光环
  | 'blossom'    // 花朵绽放 - 旋转花瓣效果
  | 'aurora'     // 极光辉映 - 渐变光晕
  | 'sparkle'    // 闪烁星光 - 粒子闪烁效果

/**
 * 涟漪效果配置
 */
export interface RippleConfig {
  type: RippleEffectType        // 涟漪效果类型
  size: number                  // 涟漪大小（px）
  duration: number              // 动画时长（ms）
  maxRipples: number            // 同时存在的最大涟漪数
  zIndex: number                // z-index 值
  ignoreSelector: string         // 忽略的元素选择器
  color: string                 // 主色调
  secondaryColor?: string       // 次要色调（用于渐变效果）
  intensity: number             // 强度 0-1（影响透明度和扩散范围）
}

/**
 * 预设的涟漪效果配置
 */
export const RIPPLE_PRESETS: { [K in 'starburst' | 'ripple' | 'pulse' | 'blossom' | 'aurora' | 'sparkle']: RippleConfig } = {
  // 星芒扩散 - ✨ 星星形状的涟漪
  starburst: {
    type: 'starburst',
    size: 80,
    duration: 800,
    maxRipples: 8,
    zIndex: 9999,
    ignoreSelector: '.no-ripple, [data-no-ripple]',
    color: 'rgba(255, 215, 0, 0.6)',
    secondaryColor: 'rgba(255, 255, 255, 0.8)',
    intensity: 0.7,
  },

  // 水滴涟漪 - 💧 水波纹效果
  ripple: {
    type: 'ripple',
    size: 100,
    duration: 600,
    maxRipples: 10,
    zIndex: 9999,
    ignoreSelector: '.no-ripple, [data-no-ripple]',
    color: 'rgba(100, 180, 255, 0.5)',
    intensity: 0.6,
  },

  // 光环脉冲 - 💫 多层光环扩散
  pulse: {
    type: 'pulse',
    size: 120,
    duration: 700,
    maxRipples: 6,
    zIndex: 9999,
    ignoreSelector: '.no-ripple, [data-no-ripple]',
    color: 'rgba(138, 43, 226, 0.5)',
    secondaryColor: 'rgba(0, 191, 255, 0.4)',
    intensity: 0.65,
  },

  // 花朵绽放 - 🌸 旋转花瓣效果
  blossom: {
    type: 'blossom',
    size: 100,
    duration: 900,
    maxRipples: 5,
    zIndex: 9999,
    ignoreSelector: '.no-ripple, [data-no-ripple]',
    color: 'rgba(255, 182, 193, 0.6)',
    secondaryColor: 'rgba(255, 105, 180, 0.4)',
    intensity: 0.7,
  },

  // 极光辉映 - 🌌 渐变光晕效果
  aurora: {
    type: 'aurora',
    size: 90,
    duration: 750,
    maxRipples: 8,
    zIndex: 9999,
    ignoreSelector: '.no-ripple, [data-no-ripple]',
    color: 'rgba(0, 255, 127, 0.5)',
    secondaryColor: 'rgba(138, 43, 226, 0.4)',
    intensity: 0.6,
  },

  // 闪烁星光 - ⭐ 粒子闪烁效果
  sparkle: {
    type: 'sparkle',
    size: 60,
    duration: 500,
    maxRipples: 12,
    zIndex: 9999,
    ignoreSelector: '.no-ripple, [data-no-ripple]',
    color: 'rgba(255, 255, 255, 0.9)',
    intensity: 0.8,
  },
}

/**
 * 默认涟漪配置
 */
export const DEFAULT_RIPPLE_CONFIG: RippleConfig = RIPPLE_PRESETS.starburst

/**
 * 获取随机涟漪效果类型（用于演示）
 */
export function getRandomRippleType(): RippleEffectType {
  const types: RippleEffectType[] = ['starburst', 'ripple', 'pulse', 'blossom', 'aurora', 'sparkle']
  return types[Math.floor(Math.random() * types.length)]!
}
