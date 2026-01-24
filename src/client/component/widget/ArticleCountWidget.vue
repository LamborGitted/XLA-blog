<script setup lang="ts">
import { computed } from 'vue'
import { inject } from 'vue'
import type { useArticleList } from '@/client/composables/useArticleList'
import { WidgetType } from '@/client/domain/widgets/widgets'
import type { ArticleCountWidgetConfig } from '@/client/domain/widgets/widgets'

interface Props {
  config?: Partial<ArticleCountWidgetConfig>
}

const props = defineProps<Props>()

const articleListState = inject<ReturnType<typeof useArticleList>>('articleListState')!
const { originalArticles, filteredArticles } = articleListState

const config: ArticleCountWidgetConfig = {
  type: WidgetType.ArticleCount,
  enabled: true,
  order: 2,
  showDetails: props.config?.showDetails ?? false,
}

const totalCount = computed(() => originalArticles.value.length)
const filteredCount = computed(() => filteredArticles.value.length)
const isFiltered = computed(() => totalCount.value !== filteredCount.value)

const displayText = computed(() => {
  if (config.showDetails && isFiltered.value) {
    return `${filteredCount.value} / ${totalCount.value}`
  }
  return `${totalCount.value}`
})
</script>

<template>
  <div class="article-count-widget widget-card">
    <div class="widget-icon">📝</div>
    <div class="widget-content">
      <div class="widget-title">文章总数</div>
      <div class="count-number">{{ displayText }}</div>
      <div v-if="isFiltered" class="count-hint">已筛选</div>
    </div>
  </div>
</template>

<style scoped>
.article-count-widget {
  display: flex;
  align-items: center;
  gap: 12px;
}

.count-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
}

.count-hint {
  font-size: 0.75rem;
  color: var(--color-textSecondary);
  margin-top: 4px;
}
</style>
