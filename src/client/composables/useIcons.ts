import { markRaw } from 'vue'
import { BsFillPaletteFill, BsGithub, BsFillSunFill, BsMoonFill } from 'vue-icons-plus/bs'

/**
 * 图标名称类型
 */
export type IconName = 'sun' | 'moon' | 'palette' | 'github'

/**
 * 图标组件映射（使用 markRaw 优化性能，避免重复渲染）
 */
const iconMap = markRaw({
  sun: markRaw(BsFillSunFill),
  moon: markRaw(BsMoonFill),
  palette: markRaw(BsFillPaletteFill),
  github: markRaw(BsGithub)
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
