// src/client/composables/useProfile.ts

import { ref } from 'vue'

// 全局状态：个人简介卡片是否显示
const isProfileCardVisible = ref(false)

/**
 * 个人简介卡片管理 Composable
 */
export function useProfile() {
  /**
   * 显示个人简介卡片
   */
  function showProfileCard() {
    isProfileCardVisible.value = true
  }

  /**
   * 隐藏个人简介卡片
   */
  function hideProfileCard() {
    isProfileCardVisible.value = false
  }

  /**
   * 切换个人简介卡片显示状态
   */
  function toggleProfileCard() {
    isProfileCardVisible.value = !isProfileCardVisible.value
  }

  return {
    isProfileCardVisible,
    showProfileCard,
    hideProfileCard,
    toggleProfileCard,
  }
}
