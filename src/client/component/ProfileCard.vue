<script setup lang="ts">
import { ref, watch } from 'vue'
import { getProfile, type Profile } from '@/client/domain/profile/profile'
import { useGetIcon } from '@/client/composables/useIcons'
import { useProfile } from '@/client/composables/useProfile'

// 使用全局状态
const { isProfileCardVisible, hideProfileCard } = useProfile()

// 组件本地状态（支持通过 ref 调用）
const visible = ref(false)

// 个人简介数据
const profile = ref<Profile>(getProfile())

// 监听全局状态变化
watch(isProfileCardVisible, (newValue) => {
  visible.value = newValue
})

// 显示/隐藏（支持通过 ref 调用）
function show() {
  visible.value = true
  isProfileCardVisible.value = true
}
function hide() {
  visible.value = false
  hideProfileCard()
}

// 暴露方法供父组件调用
defineExpose({ show, hide })

// 获取社交图标
const getSocialIcon = (iconName?: string) => {
  if (!iconName) return null
  return useGetIcon(iconName as 'github' | 'envelope')
}
</script>

<template>
  <Transition name="profile-card">
    <div v-if="visible" class="profile-card-overlay" @click="hide">
      <!-- 个人简介卡片容器 -->
      <div class="profile-card-container" @click.stop>
        <!-- 关闭按钮 -->
        <button class="close-button" @click="hide">
          <span class="close-icon">×</span>
        </button>

        <!-- 卡片内容 -->
        <div class="profile-content">
          <!-- 头部信息 -->
          <div class="profile-header">
            <div class="avatar-placeholder">
              <span class="avatar-text">{{ profile.name.charAt(0) }}</span>
            </div>
            <h2 class="profile-name">{{ profile.name }}</h2>
            <p class="profile-title">{{ profile.title }}</p>
          </div>

          <!-- 个人简介 -->
          <div class="profile-section">
            <h3 class="section-title">关于我</h3>
            <p class="profile-bio">{{ profile.bio }}</p>
          </div>

          <!-- 技能标签 -->
          <div v-if="profile.skills && profile.skills.length > 0" class="profile-section">
            <h3 class="section-title">技能</h3>
            <div class="skills-list">
              <span
                v-for="(skill, index) in profile.skills"
                :key="index"
                class="skill-tag"
              >
                {{ skill }}
              </span>
            </div>
          </div>

          <!-- 社交链接 -->
          <div v-if="profile.social && profile.social.length > 0" class="profile-section">
            <h3 class="section-title">社交媒体</h3>
            <div class="social-links">
              <a
                v-for="(social, index) in profile.social"
                :key="index"
                :href="social.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-link"
                :title="social.name"
              >
                <component :is="getSocialIcon(social.icon)" v-if="getSocialIcon(social.icon)" />
                <span v-else>{{ social.name.charAt(0) }}</span>
              </a>
            </div>
          </div>

          <!-- 联系方式 -->
          <div v-if="profile.contacts && profile.contacts.length > 0" class="profile-section">
            <h3 class="section-title">联系方式</h3>
            <div class="contacts-list">
              <div
                v-for="(contact, index) in profile.contacts"
                :key="index"
                class="contact-item"
              >
                <component
                  :is="getSocialIcon(contact.icon)"
                  v-if="getSocialIcon(contact.icon)"
                  class="contact-icon"
                />
                <div class="contact-info">
                  <span class="contact-label">{{ contact.label }}</span>
                  <span class="contact-value">{{ contact.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ==================== 遮罩层 ==================== */
.profile-card-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(8px) saturate(120%);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 暗色模式下的遮罩 */
[data-theme-mode="dark"] .profile-card-overlay {
  background: rgba(0, 0, 0, 0.6);
}

/* ==================== 卡片容器 ==================== */
.profile-card-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  background: linear-gradient(
    135deg,
    var(--color-surface),
    var(--color-surfaceBlur)
  );
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  border-radius: 24px;
  box-shadow: var(--color-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

/* ==================== 关闭按钮 ==================== */
.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: var(--color-muted);
  opacity: 0.6;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.close-button:hover {
  background: var(--color-text-secondary);
  opacity: 1;
  transform: rotate(90deg) scale(1.1);
}

.close-button:active {
  transform: rotate(90deg) scale(0.95);
}

.close-icon {
  font-size: 28px;
  color: var(--color-text);
  line-height: 1;
  font-weight: 300;
}

/* ==================== 内容区域 ==================== */
.profile-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

/* 隐藏滚动条但保持滚动功能 */
.profile-content::-webkit-scrollbar {
  width: 6px;
}

.profile-content::-webkit-scrollbar-track {
  background: transparent;
}

.profile-content::-webkit-scrollbar-thumb {
  background: var(--color-muted);
  border-radius: 3px;
  opacity: 0.5;
}

.profile-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
  opacity: 0.7;
}

/* ==================== 头部信息 ==================== */
.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-text {
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.profile-name {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.profile-title {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}

/* ==================== 内容区块 ==================== */
.profile-section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 12px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-bio {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* ==================== 技能标签 ==================== */
.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-block;
  padding: 6px 12px;
  background: var(--color-muted);
  opacity: 0.7;
  border-radius: 12px;
  font-size: 13px;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s ease;
}

.skill-tag:hover {
  opacity: 1;
  transform: translateY(-2px);
}

/* ==================== 社交链接 ==================== */
.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-muted);
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--color-text);
}

.social-link:hover {
  background: var(--color-primary);
  opacity: 1;
  transform: translateY(-3px);
}

.social-link svg {
  width: 18px;
  height: 18px;
}

/* ==================== 联系方式 ==================== */
.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-muted);
  opacity: 0.6;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.contact-item:hover {
  opacity: 0.8;
}

.contact-icon {
  width: 18px;
  height: 18px;
  color: var(--color-primary);
  flex-shrink: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.contact-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ==================== 动画效果 ==================== */
/* 遮罩层淡入淡出 */
.profile-card-enter-active .profile-card-overlay {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-card-leave-active .profile-card-overlay {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 1, 1);
}

/* 卡片容器动画：缩放 + 上滑 + 淡入 */
.profile-card-enter-active .profile-card-container {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.profile-card-leave-active .profile-card-container {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.profile-card-enter-from {
  opacity: 0;
}

.profile-card-enter-from .profile-card-container {
  transform: translateY(60px) scale(0.9) perspective(1000px) rotateX(10deg);
  opacity: 0;
}

.profile-card-leave-to {
  opacity: 0;
}

.profile-card-leave-to .profile-card-container {
  transform: translateY(40px) scale(0.95);
  opacity: 0;
}

/* 内部元素错落动画 */
.profile-card-enter-active .profile-header {
  animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
}

.profile-card-enter-active .profile-section {
  animation: fadeInUp 0.5s ease-out 0.2s both;
}

.profile-card-enter-active .profile-section:nth-child(2) {
  animation-delay: 0.25s;
}

.profile-card-enter-active .profile-section:nth-child(3) {
  animation-delay: 0.3s;
}

.profile-card-enter-active .profile-section:nth-child(4) {
  animation-delay: 0.35s;
}

/* 关闭按钮动画 */
.profile-card-enter-active .close-button {
  animation: rotateIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s both;
}

/* 关键帧动画 */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes rotateIn {
  from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
  }
  to {
    opacity: 1;
    transform: rotate(0) scale(1);
  }
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  .profile-card-container {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 20px 20px 0 0;
    margin-top: auto;
  }

  .profile-content {
    padding: 20px;
  }

  .profile-header {
    margin-bottom: 20px;
    padding-bottom: 20px;
  }

  .avatar-placeholder {
    width: 70px;
    height: 70px;
  }

  .avatar-text {
    font-size: 28px;
  }

  .profile-name {
    font-size: 20px;
  }

  .close-button {
    width: 32px;
    height: 32px;
  }

  .close-icon {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .profile-card-overlay {
    padding: 0;
    align-items: flex-end;
  }

  .profile-card-container {
    max-height: 90vh;
    border-radius: 20px 20px 0 0;
  }

  .profile-content {
    padding: 16px;
  }

  .avatar-placeholder {
    width: 60px;
    height: 60px;
  }

  .avatar-text {
    font-size: 24px;
  }

  .profile-name {
    font-size: 18px;
  }

  .profile-title {
    font-size: 13px;
  }
}
</style>
