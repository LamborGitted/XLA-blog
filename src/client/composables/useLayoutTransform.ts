// src/client/composables/useLayoutTransform.ts

import { reactive, computed } from 'vue'
import {
  layoutStateManager,
  LayoutMode,
  type LayoutState,
  type LayoutTransformConfig,
} from '@/client/domain/view/layoutTransform'

// 创建共享的响应式状态（单例）
const sharedState = reactive<LayoutState>(layoutStateManager.getState())

/**
 * 布局变换 Composable
 */
export function useLayoutTransform() {
  // 当前布局模式
  const mode = computed(() => sharedState.mode)

  // 是否为默认布局
  const isDefaultMode = computed(() => sharedState.mode === LayoutMode.Default)

  // 是否为小组件布局
  const isWidgetsMode = computed(() => sharedState.mode === LayoutMode.Widgets)

  // 是否正在变换中
  const isTransforming = computed(() => sharedState.isTransforming)

  /**
   * 切换布局模式
   */
  function toggleMode(): LayoutMode {
    const newMode = layoutStateManager.toggleMode()
    // 更新共享状态
    Object.assign(sharedState, layoutStateManager.getState())
    return newMode
  }

  /**
   * 设置布局模式
   */
  function setMode(newMode: LayoutMode): void {
    layoutStateManager.setMode(newMode)
    // 更新共享状态
    Object.assign(sharedState, layoutStateManager.getState())
  }

  /**
   * 切换到默认布局
   */
  function toDefaultMode(): void {
    setMode(LayoutMode.Default)
  }

  /**
   * 切换到小组件布局
   */
  function toWidgetsMode(): void {
    setMode(LayoutMode.Widgets)
  }

  /**
   * 获取配置
   */
  function getConfig(): LayoutTransformConfig {
    return layoutStateManager.getConfig()
  }

  /**
   * 更新配置
   */
  function updateConfig(config: Partial<LayoutTransformConfig>): void {
    layoutStateManager.updateConfig(config)
  }

  /**
   * 重置为默认状态
   */
  function reset(): void {
    layoutStateManager.reset()
    // 更新共享状态
    Object.assign(sharedState, layoutStateManager.getState())
  }

  return {
    // 状态
    state: sharedState,
    mode,
    isDefaultMode,
    isWidgetsMode,
    isTransforming,

    // 方法
    toggleMode,
    setMode,
    toDefaultMode,
    toWidgetsMode,
    getConfig,
    updateConfig,
    reset,
  }
}
