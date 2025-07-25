<template>
  <section class="portfolio-header">
    <div class="header-background">
      <!-- Background Image -->
      <div class="header-image"></div>

      <!-- Job category label -->
     
      <!-- User info container -->
      <div class="user-info-container">
         <div class="job-category-label">
          {{ profileData.jobCategory }}
        </div>
        <div class="profile-picture-container">
          <img class="profile-picture" :src="profileData.avatar" alt="Profile picture" />
        </div>
        <div class="user-details">
          <div class="name-section">
            <h1 class="username">{{ profileData.username }}</h1>
          </div>
          <p class="job-title">{{ profileData.jobTitle }}</p>
          <p class="handle">{{ profileData.handle }}</p>
        </div>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="header-actions">
      <div class="social-actions">
        <button class="like-button" @click="toggleLike" :class="{ liked: isLiked }">
          <i class="bi bi-heart" v-if="!isLiked"></i>
          <i class="bi bi-heart-fill" v-else></i>
          <span class="like-count">{{ likeCount }}</span>
        </button>

        <button class="share-button" @click="copyLink">
          <i class="bi bi-share"></i>
          <span>공유</span>
        </button>
      </div>

      <button v-if="!isOwnProfile" class="chat-button" @click="openChatModal">
        <i class="bi bi-chat-dots"></i>
        <span>채팅</span>
      </button>
    </div>

    <!-- Toast Notifications -->
    <ToastNotification
      v-if="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="hideToast"
    />
  </section>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import ToastNotification from '../common/ToastNotification.vue'

// Props
const props = defineProps({
  userId: {
    type: String,
    default: 'jamie'
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  }
})

// Check if this is the user's own profile
const isOwnProfile = computed(() => {
  // This would normally check against current user ID
  return props.userId === 'current-user-id' // placeholder logic
})

// Reactive data
const isLiked = ref(false)
const likeCount = ref(42)
const showContactModal = ref(false)

// Toast notification state
const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

// Profile data (this would typically come from an API)
const profileData = ref({
  username: 'jamie',
  jobTitle: '프로덕트 디자이너',
  jobCategory: 'Designer', // Frontend Developer, Backend Developer, Designer, etc.
  handle: '@jamiee',
  avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/ef81e2192667247c983c115e37a8d421e66c194c?width=250'
})

// Methods
const showToast = (message, type = 'success') => {
  toast.visible = true
  toast.message = message
  toast.type = type
}

const hideToast = () => {
  toast.visible = false
}

const toggleLike = () => {
  const wasLiked = isLiked.value
  isLiked.value = !isLiked.value
  likeCount.value += isLiked.value ? 1 : -1

  // Show feedback toast
  if (isLiked.value) {
    showToast('포트폴리오에 좋아요를 표시했습니다!', 'success')
  } else {
    showToast('좋아요가 취소되었습니다.', 'info')
  }

  // Here you would typically sync with your API
  // syncLikeWithAPI(profileData.value.userId, isLiked.value)
}

const openChatModal = () => {
  showContactModal.value = true
}

const closeContactModal = () => {
  showContactModal.value = false
}

const handleContactSend = (formData) => {
  console.log('Chat message sent:', formData)
  // Here you would typically send the data to your API
}

// Sharing functionality
const getPortfolioUrl = () => {
  return window.location.href
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(getPortfolioUrl())
    showToast('링크가 복사되었습니다!', 'success')
  } catch (err) {
    console.error('Failed to copy link:', err)
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = getPortfolioUrl()
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      showToast('링크가 복사되었습니다!', 'success')
    } catch (fallbackErr) {
      showToast('링크 복사에 실패했습니다.', 'error')
    }
  }
}
</script>

<style scoped>
.portfolio-header {
  height: 233px;
  min-height: 233px;
  width: 100%;
  position: relative;
}

.header-background {
  width: 100%;
  height: 233px;
  flex-shrink: 0;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 0;
}

.header-image {
  width: 100%;
  height: 233px;
  flex-shrink: 0;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(135deg, #66BB6A 0%, #388E3C 100%);
}

.job-category-label {
  display: flex;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  justify-content: center;
  align-items: center;
  color: #FFF;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-style: normal;
  font-weight: 600;
  line-height: 1;
  position: absolute;
  left: 30px;
  top: 30px;
  white-space: nowrap;
}

.user-info-container {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 60px 20px 0 30px;
  position: absolute;
  left: 0;
  top: 0;
  height: 202px;
}

.profile-picture-container {
  display: flex;
  width: 120px;
  height: 120px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 60px;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.profile-picture {
  flex: 1 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  width: 100%;
}

.name-section {
  display: flex;
  width: 658px;
  max-width: 658px;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  color: #FFF;
  font-size: 29px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  letter-spacing: 0.6px;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.job-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0.3px;
  margin: 0;
}

.handle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 1.2;
  letter-spacing: 0.3px;
  margin: 0;
}

.header-actions {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  z-index: 10;
}

.social-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chat-button {
  background: #FFF;
  color: #4CAF50;
  border: 2px solid #FFF;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.chat-button:hover {
  background: #4CAF50;
  color: #FFF;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.chat-button i {
  font-size: 16px;
}

.like-button {
  background: rgba(255, 255, 255, 0.2);
  color: #FFF;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
}

.like-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.5);
}

.like-button.liked {
  background: #FFF;
  color: #4CAF50;
  border-color: #FFF;
  animation: likeAnimation 0.3s ease;
}

.like-button i {
  font-size: 14px;
}

.like-count {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

@keyframes likeAnimation {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.share-button {
  background: rgba(255, 255, 255, 0.2);
  color: #FFF;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  backdrop-filter: blur(10px);
}

.share-button:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.share-button:active {
  background: #FFF;
  color: #4CAF50;
  border-color: #FFF;
  transform: scale(0.95);
}

.share-button i {
  font-size: 14px;
}

@media (max-width: 768px) {
  .job-category-label {
    left: 20px;
    top: 20px;
    font-size: 11px;
    padding: 4px 8px;
  }

  .user-info-container {
    padding: 50px 15px 0 20px;
    gap: 15px;
  }

  .profile-picture-container {
    width: 100px;
    height: 100px;
    border-radius: 50px;
  }

  .user-details {
    gap: 4px;
  }

  .name-section {
    width: 100%;
    max-width: 400px;
  }

  .username {
    font-size: 24px;
  }

  .job-title {
    font-size: 14px;
  }

  .handle {
    font-size: 12px;
  }

  .header-actions {
    top: 15px;
    right: 15px;
    gap: 8px;
  }

  .social-actions {
    flex-direction: row;
    gap: 6px;
  }

  .chat-button,
  .like-button,
  .share-button {
    padding: 6px 10px;
    font-size: 12px;
  }

  .chat-button i,
  .like-button i,
  .share-button i {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .job-category-label {
    left: 15px;
    top: 15px;
    font-size: 10px;
    padding: 3px 6px;
  }

  .user-info-container {
    padding: 40px 10px 0 15px;
    gap: 12px;
  }

  .profile-picture-container {
    width: 80px;
    height: 80px;
    border-radius: 40px;
    border-width: 3px;
  }

  .user-details {
    gap: 3px;
  }

  .username {
    font-size: 20px;
  }

  .job-title {
    font-size: 13px;
  }

  .handle {
    font-size: 11px;
  }

  .header-actions {
    top: 10px;
    right: 10px;
    gap: 6px;
    flex-direction: column;
    align-items: flex-end;
  }

  .social-actions {
    gap: 4px;
  }

  .like-button,
  .share-button {
    padding: 5px 8px;
    font-size: 11px;
  }

  .chat-button {
    padding: 6px 10px;
    font-size: 11px;
  }

  .like-button i,
  .share-button i,
  .chat-button i {
    font-size: 10px;
  }
}
</style>