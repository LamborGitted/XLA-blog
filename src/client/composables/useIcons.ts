import { markRaw } from 'vue'
import { BsFillPaletteFill, BsGithub, BsFillSunFill, BsMoonFill, BsPersonFill, BsEnvelopeFill, BsArrowRight } from 'vue-icons-plus/bs'

/**
 * 图标名称类型
 */
export type IconName = 'sun' | 'moon' | 'palette' | 'github' | 'person' | 'envelope' | 'arrow-right'

/**
 * 图标组件映射（使用 markRaw 优化性能，避免重复渲染）
 */
const iconMap = markRaw({
  sun: markRaw(BsFillSunFill),
  moon: markRaw(BsMoonFill),
  palette: markRaw(BsFillPaletteFill),
  github: markRaw(BsGithub),
  person: markRaw(BsPersonFill),
  envelope: markRaw(BsEnvelopeFill),
  'arrow-right': markRaw(BsArrowRight)
})

/**
 * 获取图标组件
 */
export function useGetIcon(iconName: IconName) {
  return iconMap[iconName] || null
}

/**
 * 主题相关图标
 */
export function useThemeIcons() {
  return {
    sun: useGetIcon('sun'),
    moon: useGetIcon('moon'),
    palette: useGetIcon('palette'),
    github: useGetIcon('github')
  }
}
