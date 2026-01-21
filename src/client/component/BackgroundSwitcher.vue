<script setup lang="ts">
import { useBackground } from '@/client/composables/useBackground'
import { useTheme } from '@/client/composables/useTheme'

const { currentBg } = useBackground(10000)
const { currentConfig } = useTheme()
</script>

<template>
  <div class="background-wrapper">
    <div
        class="background-switcher"
        :style="{ backgroundImage: `url(${currentBg.src})` }"
    ></div>
    <div
        v-if="currentConfig.mode === 'dark'"
        class="background-overlay"
    ></div>
  </div>
</template>

<style scoped>
.background-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}

.background-switcher {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 1s ease-in-out;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  pointer-events: none;
}
</style>
