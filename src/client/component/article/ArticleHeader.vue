<script setup lang="ts">
import TagBadge from '@/client/component/TagBadge.vue'

interface ArticleDetail {
  title?: string
  subtitle?: string
  date?: string
  tags?: string[]
}

interface Props {
  article: ArticleDetail | null
}

defineProps<Props>()
</script>

<template>
  <div v-if="article" class="article-header">
    <h1 class="article-title">{{ article.title }}</h1>
    <p v-if="article.subtitle" class="article-subtitle">
      {{ article.subtitle }}
    </p>
    <div v-if="article.date" class="article-meta">
      <span class="article-date">{{ article.date }}</span>
    </div>
    <div v-if="article.tags && article.tags.length > 0" class="article-tags">
      <TagBadge
        v-for="tag in article.tags"
        :key="tag"
        :tag="tag"
        size="medium"
      />
    </div>
  </div>
</template>

<style scoped>
/* ==================== 文章头部样式 ==================== */
.article-header {
  margin-bottom: 40px;
  padding-bottom: 25px;
  border-bottom: 1px solid var(--color-border);
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 15px 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.article-subtitle {
  font-size: 1.2rem;
  color: var(--color-textSecondary);
  margin: 0 0 15px 0;
  line-height: 1.5;
  font-weight: 400;
}

.article-meta {
  display: flex;
  gap: 15px;
  align-items: center;
}

.article-date {
  font-size: 0.9rem;
  color: var(--color-muted);
  font-weight: 500;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-title {
    font-size: 1.8rem;
  }

  .article-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .article-header {
    margin-bottom: 25px;
    padding-bottom: 15px;
  }

  .article-title {
    font-size: 1.5rem;
  }
}
</style>
