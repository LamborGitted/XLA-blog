<script setup lang="ts">
import { useGithubStats } from '@/client/composables/useGithubStats'
import { WidgetType } from '@/client/domain/widgets/widgets'
import type { GithubReposWidgetConfig } from '@/client/domain/widgets/widgets'

interface Props {
  config?: Partial<GithubReposWidgetConfig>
}

const props = defineProps<Props>()

const {
  repoCount,
  totalStars,
  totalForks,
  isLoading,
  error,
  displayText,
} = useGithubStats(props.config)

const config: GithubReposWidgetConfig = {
  type: WidgetType.GithubRepos,
  enabled: true,
  order: 4,
  showStars: props.config?.showStars ?? false,
  showForks: props.config?.showForks ?? false,
}
</script>

<template>
  <div class="github-repos-widget widget-card">
    <div class="widget-icon">💻</div>
    <div class="widget-content">
      <div class="widget-title">GitHub 项目</div>
      <div v-if="isLoading" class="loading-text">加载中...</div>
      <div v-else-if="error" class="error-text">加载失败</div>
      <div v-else class="repo-count">{{ repoCount }}</div>
      <div v-if="!isLoading && !error && (config.showStars || config.showForks)" class="repo-details">
        <span v-if="config.showStars">⭐ {{ totalStars }}</span>
        <span v-if="config.showStars && config.showForks"> · </span>
        <span v-if="config.showForks">🔱 {{ totalForks }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.github-repos-widget {
  display: flex;
  align-items: center;
  gap: 12px;
}

.repo-count {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.repo-details {
  font-size: 0.85rem;
  color: var(--color-textSecondary);
  margin-top: 4px;
}

.loading-text,
.error-text {
  font-size: 1rem;
  color: var(--color-textSecondary);
}

.error-text {
  color: var(--color-error, #ff4757);
}
</style>
