// src/client/composables/useGithubStats.ts

import { ref, computed } from 'vue'
import { githubManager, type GithubStats } from '@/client/domain/widgets/github'
import type { GithubReposWidgetConfig } from '@/client/domain/widgets/widgets'

/**
 * GitHub 统计 Composable
 */
export function useGithubStats(config?: Partial<GithubReposWidgetConfig>) {
  // 统计数据
  const stats = ref<GithubStats | null>(null)

  // 加载状态
  const isLoading = ref(false)

  // 错误信息
  const error = ref<string | null>(null)

  // 合并配置
  const githubConfig: GithubReposWidgetConfig = {
    type: 'github-repos' as any, // 使用 any 避免循环依赖
    enabled: true,
    order: 4,
    showStars: config?.showStars ?? false,
    showForks: config?.showForks ?? false,
  }

  // 公开仓库数量
  const repoCount = computed(() => stats.value?.repoCount ?? 0)

  // 总星标数
  const totalStars = computed(() => stats.value?.totalStars ?? 0)

  // 总 fork 数
  const totalForks = computed(() => stats.value?.totalForks ?? 0)

  // 是否有数据
  const hasData = computed(() => stats.value !== null)

  // 是否来自缓存
  const isCached = computed(() => stats.value?.isCached ?? false)

  // 格式化显示文本
  const displayText = computed(() => {
    const parts: string[] = []

    parts.push(`${repoCount.value} 个项目`)

    if (githubConfig.showStars) {
      parts.push(`${totalStars.value} ⭐`)
    }

    if (githubConfig.showForks) {
      parts.push(`${totalForks.value} 🔱`)
    }

    return parts.join(' · ')
  })

  /**
   * 获取 GitHub 统计信息
   */
  async function fetchStats(): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      stats.value = await githubManager.getStats()
    } catch (err) {
      const message = err instanceof Error ? err.message : '获取数据失败'
      error.value = message
      console.error('获取 GitHub 统计失败:', err)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 刷新数据（清除缓存后重新获取）
   */
  async function refresh(): Promise<void> {
    githubManager.clearCache()
    await fetchStats()
  }

  /**
   * 设置 GitHub 用户名
   */
  function setUsername(username: string): void {
    githubManager.setUsername(username)
    // 清除缓存并重新获取
    refresh()
  }

  /**
   * 获取当前配置
   */
  function getConfig(): GithubReposWidgetConfig {
    return { ...githubConfig }
  }

  /**
   * 更新配置
   */
  function updateConfig(newConfig: Partial<GithubReposWidgetConfig>): void {
    Object.assign(githubConfig, newConfig)
  }

  // 初始化时获取数据
  fetchStats()

  return {
    // 状态
    stats,
    isLoading,
    error,

    // 计算属性
    repoCount,
    totalStars,
    totalForks,
    hasData,
    isCached,
    displayText,

    // 方法
    fetchStats,
    refresh,
    setUsername,
    getConfig,
    updateConfig,
  }
}
