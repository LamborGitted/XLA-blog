<script setup lang="ts">
import { onMounted } from 'vue'
import { getProfile } from '@/client/domain/profile/profile'
import { useGlobalRipple } from '@/client/composables/useGlobalRipple'
import { RIPPLE_PRESETS } from '@/client/domain/ripple/ripple'

// 应用启动时预加载头像
onMounted(() => {
  const profile = getProfile()
  if (profile.avatar) {
    const img = new Image()
    img.src = profile.avatar
  }
})

// 初始化全局涟漪效果 - 使用预设配置
// 可选预设: 'starburst' | 'ripple' | 'pulse' | 'blossom' | 'aurora' | 'sparkle'
useGlobalRipple(RIPPLE_PRESETS.starburst)

// 或者切换到其他效果：
// useGlobalRipple(RIPPLE_PRESETS.aurora)
// useGlobalRipple(RIPPLE_PRESETS.blossom)
// useGlobalRipple(RIPPLE_PRESETS.pulse)
// useGlobalRipple(RIPPLE_PRESETS.ripple)
// useGlobalRipple(RIPPLE_PRESETS.sparkle)
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
