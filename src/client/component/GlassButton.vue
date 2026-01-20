<template>
  <button
      class="glass-button"
      :class="[
      `glass-${variant}`,
      { 'is-disabled': disabled }
    ]"
      :type="type"
      :disabled="disabled"
  >
    <!-- Icon 模式 -->
    <span v-if="variant === 'icon'" class="glass-icon">
      <slot name="icon" />
    </span>

    <!-- 通用按钮 -->
    <span v-else class="glass-text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'icon'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  disabled: false,
  type: 'button'
})
</script>

<style scoped>
/* ===== 基础变量 ===== */
.glass-button {
  transform: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.6rem 1.1rem;
  border-radius: 25px;
  border: 1px solid var(--color-border);
  background: linear-gradient(
      135deg,
      var(--color-surface),
      var(--color-surfaceBlur)
  );
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);

  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 8px 20px var(--color-shadow);
  transition:
      /* background 0.25s ease, */
      transform 0.15s ease,
      box-shadow 0.25s ease;
}

/* ===== Hover / Active ===== */
.glass-button:hover {
  background: linear-gradient(
      135deg,
      var(--color-surface),
      var(--color-surfaceBlur)
  );
  opacity: 0.85;
  box-shadow: 0 12px 28px var(--color-shadow);
}

.glass-button:active {
  transform: scale(1.2);
  box-shadow: 0 6px 16px var(--color-shadow);
}

/* ===== Disabled ===== */
.glass-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ===== 通用按钮 ===== */
.glass-default {
  min-height: 36px;
}

/* ===== Icon 按钮 ===== */
.glass-icon {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.glass-icon :deep(svg) {
  width: 18px;
  height: 18px;
  fill: currentColor;
}
</style>
