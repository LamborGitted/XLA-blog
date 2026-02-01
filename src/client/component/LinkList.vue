<script setup lang="ts">
import { getLinkListConfig, getFaviconUrl } from '@/client/domain/linkList/linkList'
import type { LinkSection, LinkItem } from '@/client/domain/linkList/linkList'

const linkSections = getLinkListConfig()

/**
 * 处理图标加载失败，显示 SVG 占位
 */
function handleImageError(event: Event) {
  const img = event.target as HTMLImageElement
  // 设置默认 SVG 占位图标
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23888" stroke-width="2"%3E%3Crect x="3" y="3" width="18" height="18" rx="2" ry="2"/%3E%3Cline x1="9" y1="9" x2="15" y2="15"/%3E%3Cline x1="15" y1="9" x2="9" y2="15"/%3E%3C/svg%3E'
}
</script>

<template>
  <div class="link-list">
    <div v-for="section in linkSections" :key="section.id" class="link-section">
      <h3 class="section-title">{{ section.title }}</h3>
      <div class="link-grid">
        <a
          v-for="link in section.links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="link-card"
        >
          <div class="link-icon">
            <img
              :src="getFaviconUrl(link.url)"
              :alt="link.title"
              @error="handleImageError"
            />
          </div>
          <div class="link-content">
            <div class="link-title">{{ link.title }}</div>
            <div class="link-description">{{ link.description }}</div>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-list {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1200px;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 10;
  padding: 24px;
}

.link-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text);
  border-left: 4px solid var(--color-primary);
  padding-left: 12px;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--color-surface);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: var(--color-shadow);
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary);
}

.link-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  border-radius: 8px;
  overflow: hidden;
}

.link-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.link-content {
  flex: 1;
  min-width: 0;
}

.link-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-description {
  font-size: 0.85rem;
  color: var(--color-textSecondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 响应式 */
@media (max-width: 768px) {
  .link-list {
    width: 95%;
    max-height: 85vh;
    padding: 16px;
  }

  .section-title {
    font-size: 1.25rem;
    margin-bottom: 16px;
  }

  .link-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .link-card {
    padding: 12px;
  }

  .link-icon {
    width: 40px;
    height: 40px;
  }

  .link-icon img {
    width: 24px;
    height: 24px;
  }

  .link-title {
    font-size: 0.9rem;
  }

  .link-description {
    font-size: 0.75rem;
  }
}
</style>
