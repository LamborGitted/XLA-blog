import { onMounted, onUnmounted } from 'vue'
import type { RippleConfig, RippleEffectType } from '@/client/domain/ripple/ripple'

/**
 * 全局涟漪效果 Composable
 * 为整个应用添加点击涟漪效果，支持 6 种美丽效果
 */
export function useGlobalRipple(config: RippleConfig) {
  const {
    type,
    size,
    duration,
    maxRipples,
    zIndex,
    ignoreSelector,
    color,
    secondaryColor,
    intensity,
  } = config

  let activeRipples = 0
  let clickHandler: ((event: MouseEvent) => void) | null = null

  /**
   * 创建星芒扩散效果 (Starburst)
   * ✨ 星星形状，4-8 个星芒向外辐射
   */
  function createStarburst(x: number, y: number): HTMLElement {
    const container = document.createElement('span')
    container.className = 'ripple-starburst'

    // 主星形
    const star = document.createElement('span')
    star.className = 'starburst-core'

    // 创建 4-8 个星芒射线
    const rayCount = 4 + Math.floor(Math.random() * 5) // 4-8 个
    for (let i = 0; i < rayCount; i++) {
      const ray = document.createElement('span')
      ray.className = 'starburst-ray'
      const angle = (360 / rayCount) * i
      ray.style.setProperty('--angle', `${angle}deg`)
      ray.style.animationDelay = `${i * 0.05}s`
      container.appendChild(ray)
    }

    container.appendChild(star)
    setCommonStyles(container, x, y)

    return container
  }

  /**
   * 创建水滴涟漪效果 (Water Ripple)
   * 💧 多层同心圆，模拟真实水波纹
   */
  function createWaterRipple(x: number, y: number): HTMLElement {
    const container = document.createElement('span')
    container.className = 'ripple-water'

    // 创建 3 层波纹
    for (let i = 0; i < 3; i++) {
      const wave = document.createElement('span')
      wave.className = 'water-wave'
      wave.style.animationDelay = `${i * 0.1}s`
      wave.style.setProperty('--wave-index', String(i))
      container.appendChild(wave)
    }

    setCommonStyles(container, x, y)

    return container
  }

  /**
   * 创建光环脉冲效果 (Pulse)
   * 💫 3-5 层光环依次扩散，科技感
   */
  function createPulseRing(x: number, y: number): HTMLElement {
    const container = document.createElement('span')
    container.className = 'ripple-pulse'

    // 创建 3-5 层光环
    const ringCount = 3 + Math.floor(Math.random() * 3) // 3-5 个
    for (let i = 0; i < ringCount; i++) {
      const ring = document.createElement('span')
      ring.className = 'pulse-ring'
      ring.style.animationDelay = `${i * 0.12}s`
      ring.style.setProperty('--ring-index', String(i))
      container.appendChild(ring)
    }

    setCommonStyles(container, x, y)

    return container
  }

  /**
   * 创建花朵绽放效果 (Blossom)
   * 🌸 花瓣旋转扩散效果
   */
  function createBlossom(x: number, y: number): HTMLElement {
    const container = document.createElement('span')
    container.className = 'ripple-blossom'

    // 创建 6-8 个花瓣
    const petalCount = 6 + Math.floor(Math.random() * 3) // 6-8 个
    for (let i = 0; i < petalCount; i++) {
      const petal = document.createElement('span')
      petal.className = 'blossom-petal'
      const angle = (360 / petalCount) * i
      petal.style.setProperty('--angle', `${angle}deg`)
      petal.style.animationDelay = `${i * 0.04}s`
      container.appendChild(petal)
    }

    // 花芯
    const center = document.createElement('span')
    center.className = 'blossom-center'
    container.appendChild(center)

    setCommonStyles(container, x, y)

    return container
  }

  /**
   * 创建极光辉映效果 (Aurora)
   * 🌌 径向渐变 + 外发光
   */
  function createAurora(x: number, y: number): HTMLElement {
    const aurora = document.createElement('span')
    aurora.className = 'ripple-aurora'

    setCommonStyles(aurora, x, y)

    return aurora
  }

  /**
   * 创建闪烁星光效果 (Sparkle)
   * ⭐ 粒子闪烁 + 星星散开
   */
  function createSparkle(x: number, y: number): HTMLElement {
    const container = document.createElement('span')
    container.className = 'ripple-sparkle'

    // 主星
    const mainStar = document.createElement('span')
    mainStar.className = 'sparkle-main'
    container.appendChild(mainStar)

    // 创建 6-8 个小星粒子
    const particleCount = 6 + Math.floor(Math.random() * 3) // 6-8 个
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('span')
      particle.className = 'sparkle-particle'
      const angle = (360 / particleCount) * i + Math.random() * 30
      const distance = 0.5 + Math.random() * 0.5 // 随机距离
      particle.style.setProperty('--angle', `${angle}deg`)
      particle.style.setProperty('--distance', String(distance))
      particle.style.animationDelay = `${Math.random() * 0.1}s`
      container.appendChild(particle)
    }

    setCommonStyles(container, x, y)

    return container
  }

  /**
   * 根据类型创建对应效果的涟漪元素
   */
  function createRippleByType(x: number, y: number): HTMLElement {
    switch (type) {
      case 'starburst':
        return createStarburst(x, y)
      case 'ripple':
        return createWaterRipple(x, y)
      case 'pulse':
        return createPulseRing(x, y)
      case 'blossom':
        return createBlossom(x, y)
      case 'aurora':
        return createAurora(x, y)
      case 'sparkle':
        return createSparkle(x, y)
      default:
        return createAurora(x, y)
    }
  }

  /**
   * 设置通用样式
   */
  function setCommonStyles(element: HTMLElement, x: number, y: number) {
    Object.assign(element.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: String(zIndex),
      // CSS 变量供子元素使用
      '--ripple-size': `${size}px`,
      '--ripple-duration': `${duration}ms`,
      '--ripple-color': color,
      '--ripple-secondary': secondaryColor || color,
      '--ripple-intensity': String(intensity),
    })
  }

  /**
   * 处理点击事件
   */
  function handleClick(event: MouseEvent) {
    // 只响应左键点击
    if (event.button !== 0) return

    // 检查是否在忽略的元素上
    if (ignoreSelector) {
      const target = event.target as HTMLElement
      if (target.closest(ignoreSelector)) return
    }

    // 限制同时存在的涟漪数量
    if (activeRipples >= maxRipples) return

    console.log('[Ripple] Creating ripple effect at:', event.clientX, event.clientY, 'type:', type)
    const ripple = createRippleByType(event.clientX, event.clientY)
    document.body.appendChild(ripple)
    activeRipples++

    console.log('[Ripple] Ripple element:', ripple.outerHTML.substring(0, 200))

    ripple.addEventListener('animationend', () => {
      console.log('[Ripple] Animation ended, removing ripple')
      ripple.remove()
      activeRipples--
    }, { once: true })
  }

  /**
   * 初始化涟漪效果
   */
  function init() {
    if (clickHandler) return
    clickHandler = handleClick
    document.addEventListener('click', clickHandler, {
      capture: true,
      passive: true,
    })
  }

  /**
   * 销毁涟漪效果
   */
  function destroy() {
    if (clickHandler) {
      document.removeEventListener('click', clickHandler, { capture: true } as any)
      clickHandler = null
    }
    document.querySelectorAll('[class^="ripple-"]').forEach(r => r.remove())
    activeRipples = 0
  }

  onMounted(init)
  onUnmounted(destroy)

  return { init, destroy }
}
