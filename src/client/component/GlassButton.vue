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
  --glass-bg: rgba(255, 255, 255, 0.35);
  --glass-border: rgba(255, 255, 255, 0.45);
  --glass-shadow: rgba(0, 0, 0, 0.08);
  --glass-text: #1f2328;
  transform: none;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  padding: 0.6rem 1.1rem;
  border-radius: 25px;
  border: 1px solid var(--glass-border);
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.55),
      rgba(255, 255, 255, 0.25)
  );
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);

  color: var(--glass-text);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 8px 20px var(--glass-shadow);
  transition:
      /* background 0.25s ease, */
      transform 0.15s ease,
      box-shadow 0.25s ease;
}

/* ===== Hover / Active ===== */
.glass-button:hover {
  background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.65),
      rgba(255, 255, 255, 0.35)
  );
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.glass-button:active {
  transform: scale(1.2);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
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
