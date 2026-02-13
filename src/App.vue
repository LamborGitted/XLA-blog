<script setup lang="ts">
import { onMounted } from 'vue'
import { getProfile } from '@/client/domain/profile/profile'

// 应用启动时预加载头像
onMounted(() => {
  const profile = getProfile()
  if (profile.avatar) {
    const img = new Image()
    img.src = profile.avatar
  }
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
