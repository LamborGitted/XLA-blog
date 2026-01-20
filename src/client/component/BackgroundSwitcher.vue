<script setup lang="ts">
import { useBackground } from '@/client/composables/useBackground'

const { currentBg } = useBackground(10000)
</script>

<template>
  <div
      class="background-switcher"
      :style="{ backgroundImage: `url(${currentBg.src})` }"
  ></div>
</template>

<style scoped>
.background-switcher {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 1s ease-in-out;
  z-index: -1; 
}
</style>
