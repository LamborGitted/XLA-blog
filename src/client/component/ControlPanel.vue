<script setup lang="ts">
import { computed } from 'vue'
import { DEFAULT_CONTROL_PANEL } from '@/client/domain/controlPanel/controlPanel'
import ControlPanelItem from './control-panel/ControlPanelItem.vue'

// 从 domain 获取配置
const panelConfig = computed(() => DEFAULT_CONTROL_PANEL)
</script>

<template>
  <div class="control-panel">
    <!-- 遍历所有控制组 -->
    <div
      v-for="section in panelConfig.sections"
      :key="section.id"
      v-show="section.visible !== false"
      class="control-group"
    >
      <!-- 遍历控制组内的所有项 -->
      <ControlPanelItem
        v-for="item in section.items"
        :key="item.id"
        :item="item"
      />
    </div>

    <!-- 预留扩展区域 -->
    <div class="expand-area">
      <!-- 后续可添加更多控件 -->
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  position: fixed;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  z-index: 150;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 36px;
  padding: 16px;
}

/* 预留扩展区域 */
.expand-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .control-panel {
    right: 20px;
  }
}

@media (max-width: 768px) {
  .control-panel {
    right: 16px;
    gap: 16px;
    top: auto;
    bottom: 16px;
    transform: none;
  }

  .control-group {
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .control-panel {
    right: 12px;
    bottom: 12px;
    gap: 12px;
  }

  .control-group {
    padding: 10px;
    border-radius: 28px;
  }
}
</style>
