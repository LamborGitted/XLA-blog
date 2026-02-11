<script setup lang="ts">
import { getEnabledWidgetConfigs } from '@/client/domain/widgets/widgets'
import type { ClockWidgetConfig, ArticleCountWidgetConfig, SiteAgeWidgetConfig, GithubReposWidgetConfig } from '@/client/domain/widgets/widgets'
import ClockWidget from './ClockWidget.vue'
import ArticleCountWidget from './ArticleCountWidget.vue'
import SiteAgeWidget from './SiteAgeWidget.vue'
import GithubReposWidget from './GithubReposWidget.vue'
import { WidgetType } from '@/client/domain/widgets/widgets'

const widgetConfigs = getEnabledWidgetConfigs()
</script>

<template>
  <div class="widget-panel">
    <TransitionGroup name="widget-slide">
      <ClockWidget
        v-if="widgetConfigs.find(c => c.type === WidgetType.Clock)"
        :key="WidgetType.Clock"
        :config="widgetConfigs.find(c => c.type === WidgetType.Clock) as Partial<ClockWidgetConfig>"
        class="widget-item"
      />
      <ArticleCountWidget
        v-if="widgetConfigs.find(c => c.type === WidgetType.ArticleCount)"
        :key="WidgetType.ArticleCount"
        :config="widgetConfigs.find(c => c.type === WidgetType.ArticleCount) as Partial<ArticleCountWidgetConfig>"
        class="widget-item"
      />
      <SiteAgeWidget
        v-if="widgetConfigs.find(c => c.type === WidgetType.SiteAge)"
        :key="WidgetType.SiteAge"
        :config="widgetConfigs.find(c => c.type === WidgetType.SiteAge) as Partial<SiteAgeWidgetConfig>"
        class="widget-item"
      />
      <GithubReposWidget
        v-if="widgetConfigs.find(c => c.type === WidgetType.GithubRepos)"
        :key="WidgetType.GithubRepos"
        :config="widgetConfigs.find(c => c.type === WidgetType.GithubRepos) as Partial<GithubReposWidgetConfig>"
        class="widget-item"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.widget-panel {
  position: absolute;
  right: 200px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 16px;
  z-index: 5;
  pointer-events: none;
}

.widget-item {
  pointer-events: auto;
  opacity: 0;
  transform: translateX(100%);
  animation: slideIn 0.5s ease forwards;
}

.widget-item:nth-child(1) { animation-delay: 0.1s; }
.widget-item:nth-child(2) { animation-delay: 0.2s; }
.widget-item:nth-child(3) { animation-delay: 0.3s; }
.widget-item:nth-child(4) { animation-delay: 0.4s; }

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 小组件滑出动画 */
.widget-slide-leave-active {
  transition: all 0.4s ease;
}

.widget-slide-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 通用小组件卡片样式 */
.widget-card {
  position: relative;
  background: var(--color-surface);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: var(--color-shadow);
  min-width: 200px;
  max-width: 320px;
  transition: all 0.3s ease;
}

.widget-card:hover {
  transform: translateX(-8px) ;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* 流动的彩色渐变边框 */
.widget-card::before {
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

}

.widget-card:hover::before {
  opacity: 1;
}

@keyframes borderFlow {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}

.widget-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.widget-content {
  flex: 1;
  min-width: 0;
}

.widget-title {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-textSecondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .widget-panel {
    right: 100px;
    gap: 12px;
  }

  .widget-card {
    min-width: 180px;
    max-width: 280px;
    padding: 14px 16px;
  }
}

@media (max-width: 1024px) {
  .widget-panel {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    right: 100px;
  }

  .widget-card {
    max-width: 240px;
  }

  .widget-icon {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .widget-panel {
    position: fixed;
    top: auto;
    bottom: 24px;
    right: 16px;
    left: 16px;
    transform: none;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .widget-card {
    min-width: 0;
    max-width: none;
    padding: 12px 14px;
  }

  .widget-icon {
    font-size: 1.3rem;
  }
}
</style>
