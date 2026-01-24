<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getSiteAgeDetails } from '@/client/domain/widgets/siteInfo'
import type { SiteAgeWidgetConfig } from '@/client/domain/widgets/widgets'

interface Props {
  config?: Partial<SiteAgeWidgetConfig>
}

const props = defineProps<Props>()

const config: SiteAgeWidgetConfig = {
  format: props.config?.format || 'text',
}

// 站点时长信息
const siteAge = ref(getSiteAgeDetails())

// 定时器
let timerId: number | null = null

// 更新站点时长
function updateSiteAge() {
  siteAge.value = getSiteAgeDetails()
}

onMounted(() => {
  // 每分钟更新一次
  timerId = window.setInterval(updateSiteAge, 60000)
})

onUnmounted(() => {
  if (timerId !== null) {
    clearInterval(timerId)
  }
})
</script>

<template>
  <div class="site-age-widget widget-card">
    <div class="widget-icon">🚀</div>
    <div class="widget-content">
      <div class="widget-title">开站时长</div>
      <div class="age-text">{{ siteAge.text }}</div>
      <div v-if="config.format === 'detailed'" class="age-details">
        {{ siteAge.days }} 天 {{ siteAge.hours }} 小时 {{ siteAge.minutes }} 分钟
      </div>
    </div>
  </div>
</template>

<style scoped>
.site-age-widget {
  display: flex;
  align-items: center;
  gap: 12px;
}

.age-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1.2;
}

.age-details {
  font-size: 0.85rem;
  color: var(--color-textSecondary);
  margin-top: 4px;
}
</style>
