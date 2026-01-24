<script setup lang="ts">
import { useWidgetClock } from '@/client/composables/useWidgetClock'
import { WidgetType, ClockRefreshMode } from '@/client/domain/widgets/widgets'
import type { ClockWidgetConfig } from '@/client/domain/widgets/widgets'

interface Props {
  config?: Partial<ClockWidgetConfig>
}

const props = defineProps<Props>()

const {
  timeString,
  fullDateString,
  dateInfo,
  time,
  getConfig,
} = useWidgetClock(props.config)

const config: ClockWidgetConfig = {
  type: WidgetType.Clock,
  enabled: true,
  order: 1,
  refreshMode: props.config?.refreshMode ?? ClockRefreshMode.Seconds,
  showDate: props.config?.showDate ?? true,
  showSeconds: props.config?.showSeconds ?? true,
  format: props.config?.format ?? '24h',
}
</script>

<template>
  <div class="clock-widget widget-card">
    <div class="widget-icon">🕐</div>
    <div class="widget-content">
      <div class="widget-title">当前时间</div>
      <div class="clock-time">{{ timeString }}</div>
      <div v-if="config.showDate" class="clock-date">{{ fullDateString }}</div>
    </div>
  </div>
</template>

<style scoped>
.clock-widget {
  display: flex;
  align-items: center;
  gap: 12px;
}

.clock-time {
  font-size: 2rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', 'Consolas', monospace;
  color: var(--color-text);
  line-height: 1.2;
}

.clock-date {
  font-size: 0.85rem;
  color: var(--color-textSecondary);
  margin-top: 4px;
}
</style>
