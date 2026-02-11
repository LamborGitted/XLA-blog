<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { getLinkListConfig, getLinkListConfigSync, getFaviconUrl } from '@/client/domain/linkList/linkList'
import type { LinkSection, LinkItem } from '@/client/domain/linkList/linkList'
import { useLayoutTransform } from '@/client/composables/useLayoutTransform'
import { useLinkFilter } from '@/client/composables/useLinkFilter'

const { isLinkListMode } = useLayoutTransform()
const { setAllLinks, filteredLinks } = useLinkFilter()

// 使用响应式数据存储链接列表
const allLinkSections = ref<LinkSection[]>(getLinkListConfigSync())
const isLoading = ref(false)

// 初始化过滤器状态（确保首次渲染时有数据）
setAllLinks(allLinkSections.value)

// 显示的链接（使用过滤后的结果）
const displayLinks = computed(() => filteredLinks.value)

// 弹窗相关状态
const showModal = ref(false)
const selectedLink = ref<LinkItem | null>(null)

/**
 * 加载链接配置
 */
async function loadLinkConfig() {
  if (!isLoading.value) {
    isLoading.value = true
    try {
      const sections = await getLinkListConfig()
      allLinkSections.value = sections
      // 更新过滤器的数据源
      setAllLinks(sections)
    } finally {
      isLoading.value = false
    }
  }
}

// 监听链接列表模式，进入模式时加载配置
watch(isLinkListMode, (newVal) => {
  if (newVal) {
    loadLinkConfig()
  }
})

// 组件挂载时立即加载配置
onMounted(async () => {
  // 立即加载最新的链接配置
  await loadLinkConfig()
  // 初始化过滤器数据（使用已加载的数据）
  setAllLinks(allLinkSections.value)
})

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
    <div v-for="section in displayLinks" :key="section.id" class="link-section">
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
  padding: 32px 24px;

  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: var(--color-border) transparent;
}

/* Webkit 浏览器滚动条样式 */
.link-list::-webkit-scrollbar {
  width: 8px;
}

.link-list::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.link-list::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 4px;
  transition: background 0.3s ease;
}

.link-list::-webkit-scrollbar-thumb:hover {
  background: var(--color-textSecondary);
}

.link-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--color-text);
  border-left: 4px solid var(--color-primary);
  padding-left: 12px;
  transition: border-color 0.3s ease;
}

.section-title:hover {
  border-color: var(--color-success);
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
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 18px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  position: relative;
}

/* 流动的彩色渐变边框 */
.link-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: inherit;
  padding: 4px;
  background: conic-gradient(
    from 0deg,
    #ff6b6b,
    #ffd93d,
    #6bcb77,
    #4d96ff,
    #cc78ff,
    #ff6b6b
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.3s ease;
  animation: borderFlow 3s linear infinite;
  pointer-events: none;
  z-index: 0;
}

.link-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;
  z-index: 1;
}

.link-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.link-card:hover::before {
  opacity: 1;
}

.link-card:hover::after {
  opacity: 0.05;
}

@keyframes borderFlow {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.link-card:active {
  transform: translateY(-3px) scale(1.01);
}

.link-icon {
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}


.link-icon img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  transition: filter 0.3s ease;
}


.link-content {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.link-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.link-card:hover .link-title {
  color: var(--color-primary);
}

.link-description {
  font-size: 0.85rem;
  color: var(--color-textSecondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

/* 响应式 - 大屏幕 */
@media (min-width: 1920px) {
  .link-list {
    max-width: 1400px;
  }

  .link-grid {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .link-card {
    padding: 20px;
  }

  .link-icon {
    width: 56px;
    height: 56px;
  }

  .link-icon img {
    width: 36px;
    height: 36px;
  }

  .link-title {
    font-size: 1.1rem;
  }

  .link-description {
    font-size: 0.9rem;
  }
}

/* 响应式 - 中等屏幕 */
@media (max-width: 1200px) {
  .link-list {
    width: 92%;
    padding: 28px 20px;
  }

  .link-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 14px;
  }
}

/* 响应式 - 平板 */
@media (max-width: 768px) {
  .link-list {
    width: 95%;
    max-height: 85vh;
    padding: 24px 16px;
  }

  .link-list::-webkit-scrollbar {
    width: 6px;
  }

  .link-section {
    margin-bottom: 32px;
  }

  .section-title {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }

  .link-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
  }

  .link-card {
    padding: 14px;
    border-radius: 14px;
  }

  .link-card:hover {
    transform: translateY(-4px) scale(1.01);
  }

  .link-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
  }

  .link-icon img {
    width: 26px;
    height: 26px;
  }

  .link-title {
    font-size: 0.95rem;
  }

  .link-description {
    font-size: 0.8rem;
  }
}

/* 响应式 - 手机 */
@media (max-width: 480px) {
  .link-list {
    width: 96%;
    padding: 20px 12px;
  }

  .link-list::-webkit-scrollbar {
    width: 4px;
  }

  .link-section {
    margin-bottom: 28px;
  }

  .section-title {
    font-size: 1.15rem;
    margin-bottom: 14px;
    padding-left: 10px;
    border-left-width: 3px;
  }

  .link-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .link-card {
    padding: 12px;
    gap: 12px;
    border-radius: 12px;
  }

  .link-card:hover {
    transform: translateY(-3px);
  }

  .link-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .link-icon img {
    width: 24px;
    height: 24px;
  }

  .link-title {
    font-size: 0.9rem;
    margin-bottom: 4px;
  }

  .link-description {
    font-size: 0.75rem;
  }
}

/* 入场动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.link-section {
  animation: fadeInUp 0.5s ease forwards;
}

.link-section:nth-child(1) { animation-delay: 0.05s; }
.link-section:nth-child(2) { animation-delay: 0.1s; }
.link-section:nth-child(3) { animation-delay: 0.15s; }
.link-section:nth-child(4) { animation-delay: 0.2s; }
</style>
