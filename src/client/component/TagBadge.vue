<script setup lang="ts">
interface Props {
  tag: string
  size?: 'small' | 'medium' | 'large'
  clickable?: boolean
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  clickable: false,
  active: false
})

const emit = defineEmits<{
  click: [tag: string]
}>()

function handleClick() {
  if (props.clickable) {
    emit('click', props.tag)
  }
}
</script>

<template>
  <span
    class="tag-badge"
    :class="[size, { clickable, active }]"
    @click="handleClick"
  >
    <slot>{{ tag }}</slot>
  </span>
</template>

<style scoped>
.tag-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  background: var(--color-muted);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text);
  transition: all 0.2s ease;
  white-space: nowrap;
}

/* Size variants */
.tag-badge.small {
  padding: 3px 8px;
  font-size: 11px;
}

.tag-badge.medium {
  padding: 4px 12px;
  font-size: 12px;
}

.tag-badge.large {
  padding: 6px 16px;
  font-size: 14px;
}

/* Light theme */
[data-theme-mode="light"] .tag-badge {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Dark theme */
[data-theme-mode="dark"] .tag-badge {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

/* Clickable state */
.tag-badge.clickable {
  cursor: pointer;
}

.tag-badge.clickable:hover {
  background: var(--color-primary);
  color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-color: var(--color-primary);
}

/* Active state */
.tag-badge.active {
  background: var(--color-primary);
  color: #ffffff;
  border-color: var(--color-primary);
}

.tag-badge.clickable:active {
  transform: translateY(0);
}
</style>
