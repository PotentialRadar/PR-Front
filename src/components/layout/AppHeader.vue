<template>
  <header class="app-header">
    <div class="container">
      <div class="header-left">
        <div class="logo-container">
          <router-link to="/" class="logo-link">
            <img src="/pr-Photoroom.png" alt="로고" class="logo" />
          </router-link>
        </div>

        <nav class="nav-menu">
          <router-link to="/projects" class="nav-item">프로젝트</router-link>
          <router-link to="/ai-recommendations" class="nav-item ai-nav-item">AI 추천</router-link>
          <router-link to="/portfolios" class="nav-item">포트폴리오</router-link>
          <router-link v-if="isLoggedIn" to="/new-project" class="nav-item">프로젝트 생성</router-link>
        </nav>
      </div>

      <div class="header-right">
        <template v-if="isLoggedIn">
          <!-- 채팅 버튼 -->
          <div class="icon-button-container">
            <button 
              class="icon-button chat-button"
              @click="toggleChat"
              :class="{ 'active': showChat }"
            >
              <span class="icon">💬</span>
              <span v-if="finalUnreadChatCount > 0" class="badge chat-badge">{{ finalUnreadChatCount > 99 ? '99+' : finalUnreadChatCount }}</span>
            </button>
            
            <!-- 채팅 드롭다운 -->
            <div v-if="showChat" class="dropdown chat-dropdown" @click.stop>
              <div class="dropdown-header">
                <h3>메시지</h3>
                <button @click="showChat = false" class="close-btn">✕</button>
              </div>
              
              <div class="chat-list">
                <div v-if="chatMessages.length > 0">
                  <div 
                    v-for="chat in chatMessages" 
                    :key="chat.id"
                    class="chat-item"
                    :class="{ 'unread': !chat.isRead }"
                    @click="openChat(chat.id)"
                  >
                    <div class="chat-avatar">
                      <img :src="chat.avatar" :alt="chat.senderName" />
                      <div v-if="chat.isOnline" class="online-indicator"></div>
                    </div>
                    <div class="chat-content">
                      <div class="chat-header">
                        <span class="chat-name">{{ chat.senderName }}</span>
                        <span class="chat-time">{{ formatTime(chat.timestamp) }}</span>
                      </div>
                      <p class="chat-preview">{{ chat.lastMessage }}</p>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-chat">
                  <span class="empty-icon">💬</span>
                  <p>메시지가 없습니다</p>
                </div>
              </div>
              
              <div class="dropdown-footer">
                <router-link to="/my-messages" class="view-all-btn chat-view-all">
                  모든 메시지 보기
                </router-link>
              </div>
            </div>
          </div>

          <!-- 알림 버튼 -->
          <div class="icon-button-container">
            <button 
              class="icon-button notification-button"
              @click="toggleNotifications"
              :class="{ 'active': showNotifications }"
            >
              <span class="icon">🔔</span>
              <span v-if="finalUnreadNotificationCount > 0" class="badge notification-badge">{{ finalUnreadNotificationCount > 99 ? '99+' : finalUnreadNotificationCount }}</span>
            </button>
            
            <!-- 알림 드롭다운 -->
            <div v-if="showNotifications" class="dropdown notification-dropdown" @click.stop>
              <div class="dropdown-header">
                <h3>알림</h3>
                <div class="header-actions">
                  <button @click="markAllAsRead" class="mark-read-btn">모두 읽음</button>
                  <button @click="showNotifications = false" class="close-btn">✕</button>
                </div>
              </div>
              
              <div class="notification-list">
                <div v-if="notifications.length > 0">
                  <div 
                    v-for="notification in notifications.slice(0, 5)" 
                    :key="notification.id"
                    class="notification-item"
                    :class="{ 'unread': !notification.isRead }"
                  >
                    <div class="notification-icon" :class="notification.type">
                      <span>{{ getNotificationIcon(notification.type) }}</span>
                    </div>
                    <div class="notification-content" @click="handleNotificationClick(notification)">
                      <p class="notification-message">{{ notification.message }}</p>
                      <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                    </div>
                    <button 
                      class="notification-delete-btn"
                      @click.stop="handleDeleteNotification(notification.id)"
                      title="알림 삭제"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div v-else class="empty-notifications">
                  <span class="empty-icon">🔔</span>
                  <p>새로운 알림이 없습니다</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 사용자 메뉴 -->
          <div class="user-menu">
            <router-link to="/myPage" class="auth-link">마이페이지</router-link>
            <span class="separator">|</span>
            <button @click="handleLogout" class="auth-link logout-btn">로그아웃</button>
          </div>
        </template>
        
        <template v-else>
          <div class="user-menu">
            <router-link to="/login" class="auth-link">로그인</router-link>
            <span class="separator">|</span>
            <router-link to="/signUp" class="auth-link">회원가입</router-link>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import { useNotifications } from '@/composables/useNotifications'

const userStore = useUserStore()
const toast = useToast()

// 실시간 알림 관리
const {
  notifications: realTimeNotifications,
  hasNewChatMessage,
  totalUnreadNotifications,
  unreadNotificationCount,
  unreadChatCount,
  initializeNotifications,
  markAllAsRead: markAllNotificationsAsRead,
  markChatAsRead,
  deleteNotification,
  acceptInvitation,
  rejectInvitation,
  handleNotificationClick: handleRealTimeNotificationClick,
  cleanup: cleanupNotifications,
  resetNotifications
} = useNotifications()

// 계산된 속성
const isLoggedIn = computed(() => {
  console.log('🔍 AppHeader isLoggedIn computed:', userStore.isLoggedIn, 'userId:', userStore.userId)
  return userStore.isLoggedIn
})

// 반응형 데이터
const showChat = ref(false)
const showNotifications = ref(false)

// 샘플 채팅 데이터 (김개발자가 받은 메시지들)
const chatMessages = ref([
  {
    id: 1,
    senderName: '박디자이너',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    lastMessage: 'UI 디자인 검토 부탁드려요!',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15분 전
    isRead: false,
    isOnline: true
  },
  {
    id: 2,
    senderName: '이백엔드',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    lastMessage: 'API 연동 관련해서 질문이 있어요',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2시간 전
    isRead: false,
    isOnline: false
  },
  {
    id: 3,
    senderName: '최AI',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    lastMessage: '네, 좋은 아이디어네요! 진행해봅시다.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1일 전
    isRead: true,
    isOnline: true
  }
])

// 실시간 알림만 사용
const notifications = realTimeNotifications

// 계산된 속성 - 실시간 알림과 기존 로직 통합
const finalUnreadChatCount = computed(() => {
  // 실시간 채팅 알림이 있으면 우선 사용
  if (unreadChatCount.value > 0) {
    return unreadChatCount.value
  }
  // 기존 샘플 데이터의 미읽음 채팅 수
  return chatMessages.value.filter(chat => !chat.isRead).length
})

const finalUnreadNotificationCount = computed(() => {
  // 실시간 알림 수만 사용
  return unreadNotificationCount.value
})

// 메서드
const toggleChat = () => {
  showChat.value = !showChat.value
  showNotifications.value = false
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showChat.value = false
}

const openChat = async (chatId) => {
  // 실시간 채팅 알림 읽음 처리
  if (hasNewChatMessage.value) {
    await markChatAsRead()
  }
  
  // 기존 샘플 채팅 읽음 처리
  const chat = chatMessages.value.find(c => c.id === chatId)
  if (chat) {
    chat.isRead = true
  }
  
  // 채팅 페이지로 이동
  console.log('채팅 열기:', chatId)
  showChat.value = false
}

const handleNotificationClick = async (notification) => {
  // 실시간 알림 처리
  await handleRealTimeNotificationClick(notification)
  showNotifications.value = false
}

const handleDeleteNotification = async (notificationId) => {
  try {
    // 실시간 알림 삭제 API 호출
    await deleteNotification(notificationId)
    
    toast.success('알림이 삭제되었습니다.', {
      position: 'top-center',
      timeout: 1500,
      hideProgressBar: true,
    })
  } catch (error) {
    console.error('알림 삭제 실패:', error)
    toast.error('알림 삭제 중 오류가 발생했습니다.', {
      position: 'top-center',
      timeout: 2000,
      hideProgressBar: true,
    })
  }
}

const markAllAsRead = async () => {
  try {
    // 실시간 알림 모두 읽음 처리
    await markAllNotificationsAsRead()
    
    toast.success('모든 알림을 읽음 처리했습니다.', {
      position: 'top-center',
      timeout: 2000,
      hideProgressBar: true,
    })
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error)
    toast.error('알림 처리 중 오류가 발생했습니다.', {
      position: 'top-center',
      timeout: 2000,
      hideProgressBar: true,
    })
  }
}

const getNotificationIcon = (type) => {
  const iconMap = {
    project: '📁',
    comment: '💬',
    message: '💬',
    review: '⭐',
    invite: '✉️',
    invitation: '✉️',
    application: '🚀',
    payment: '💳',
    system: '⚙️',
    COMMENT: '💬',
    APPLICATION: '🚀',
    INVITATION: '✉️'
  }
  return iconMap[type] || '📢'
}

const formatTime = (timestamp) => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`
  
  return timestamp.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const handleLogout = () => {
  // 알림 연결 정리
  cleanupNotifications()
  resetNotifications()
  
  userStore.logout()
  toast.success('로그아웃되었습니다.', {
    position: 'top-center',
    timeout: 2000,
    hideProgressBar: true,
  })
}

// 외부 클릭 감지
const handleClickOutside = (event) => {
  if (!event.target.closest('.icon-button-container')) {
    showChat.value = false
    showNotifications.value = false
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  
  // 디버깅용 로그
  console.log('AppHeader mounted - userStore 상태:', {
    isLoggedIn: userStore.isLoggedIn,
    userId: userStore.userId,
    email: userStore.email
  })
  
  // 전역 객체에도 저장
  window.debugAppHeaderUserStore = userStore
  
  // 로그인 상태 변화 감지하여 알림 초기화
  watch(
    () => userStore.isLoggedIn,
    (newValue, oldValue) => {
      console.log('👀 로그인 상태 변화 감지:', { newValue, oldValue, userId: userStore.userId })
      
      if (newValue && !oldValue) {
        // 로그인 상태로 변경된 경우만 초기화
        console.log('✅ 로그인 감지 - 실시간 알림 초기화')
        // userStore에 userId가 설정될 때까지 기다림
        const checkAndInit = () => {
          if (userStore.userId) {
            console.log('🆔 userId 확인됨 - 알림 시스템 시작')
            initializeNotifications()
          } else {
            console.log('⏳ userId 대기 중...')
            setTimeout(checkAndInit, 500)
          }
        }
        checkAndInit()
      } else if (!newValue && oldValue) {
        // 로그아웃된 경우만 정리
        console.log('❌ 로그아웃 감지 - 실시간 알림 정리')
        cleanupNotifications()
        resetNotifications()
      }
    },
    { immediate: false } // immediate를 false로 변경하여 초기 실행 방지
  )
  
  // 컴포넌트 마운트 시 로그인 상태 확인 (초기화 지연)
  setTimeout(() => {
    if (userStore.isLoggedIn && userStore.userId) {
      console.log('🔄 지연된 마운트 시 로그인 상태 확인됨 - 알림 초기화')
      initializeNotifications()
    }
  }, 2000) // 2초 지연으로 App.vue의 checkLogin 완료 대기
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // 컴포넌트 언마운트 시 알림 연결 정리
  cleanupNotifications()
})
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 68px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.container {
  display: flex;
  width: 1080px;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  width: auto;
  height: 40px;
  opacity: 1;
  margin-right: 40px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 35px;
}

.nav-item {
  color: #424953;
  font-size: 15px;
  font-weight: 400;
  line-height: 27px;
  text-decoration: none;
  padding: 20px 5px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: #28a745;
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #28a745;
}

.nav-item:hover::before,
.nav-item.router-link-active::before {
  opacity: 1;
  transform: scaleX(1);
}

.nav-item.router-link-active {
  color: #28a745;
  font-weight: 700;
}

.ai-nav-item {
  color: #424953;
  font-weight: 400;
}

.ai-nav-item:hover {
  color: #28a745;
}

.ai-nav-item.router-link-active {
  color: #28a745;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 아이콘 버튼 스타일 */
.icon-button-container {
  position: relative;
}

.icon-button {
  position: relative;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.icon-button:hover {
  background: rgba(0, 0, 0, 0.05);
}

.icon-button.active {
  background: rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.icon-button:hover .icon {
  transform: scale(1.1);
}

/* 뱃지 스타일 */
.badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: #FF4444;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.chat-badge {
  background: #4CAF50;
}

.notification-badge {
  background: #FF9800;
}

/* 드롭다운 스타일 */
.dropdown {
  position: absolute;
  top: 50px;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 3000;
  animation: dropdownSlide 0.3s ease-out;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-dropdown {
  width: 320px;
  max-height: 480px;
}

.notification-dropdown {
  width: 360px;
  max-height: 480px;
}

.dropdown-header {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
  color: #333;
}

.dropdown-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mark-read-btn {
  background: #e9ecef;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.mark-read-btn:hover {
  background: #dee2e6;
}

.close-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.close-btn:hover {
  background: #e9ecef;
}

/* 채팅 리스트 */
.chat-list,
.notification-list {
  max-height: 320px;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  padding: 12px 20px;
  gap: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
}

.chat-item:hover {
  background: #f8f9fa;
}

.chat-item.unread {
  background: rgba(76, 175, 80, 0.05);
}

.chat-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #4CAF50;
}

.chat-avatar {
  position: relative;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #4CAF50;
  border: 2px solid white;
  border-radius: 50%;
}

.chat-content {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.chat-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.chat-time {
  font-size: 12px;
  color: #888;
}

.chat-preview {
  font-size: 13px;
  color: #666;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 알림 리스트 */
.notification-item {
  display: flex;
  padding: 12px 20px;
  gap: 12px;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
  align-items: flex-start;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: rgba(255, 152, 0, 0.05);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: #FF9800;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.notification-icon.project {
  background: rgba(108, 117, 125, 0.1);
}

.notification-icon.message {
  background: rgba(33, 150, 243, 0.1);
}

.notification-icon.review {
  background: rgba(255, 193, 7, 0.1);
}

.notification-icon.payment {
  background: rgba(156, 39, 176, 0.1);
}

.notification-icon.system {
  background: rgba(108, 117, 125, 0.1);
}

.notification-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.notification-message {
  font-size: 14px;
  color: #333;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: #888;
}

/* 알림 삭제 버튼 */
.notification-delete-btn {
  background: none;
  border: none;
  color: #999;
  font-size: 14px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s ease;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-item:hover .notification-delete-btn {
  opacity: 1;
}

.notification-delete-btn:hover {
  background: #f0f0f0;
  color: #ff4444;
  transform: scale(1.1);
}

/* 빈 상태 */
.empty-chat,
.empty-notifications {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.5;
}

/* 드롭다운 푸터 */
.dropdown-footer {
  padding: 12px 20px;
  border-top: 1px solid #f0f0f0;
  background: #f8f9fa;
}

.view-all-btn {
  display: block;
  text-align: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.view-all-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.chat-view-all {
  color: #4CAF50;
}

.chat-view-all:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

/* 사용자 메뉴 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-link {
  color: #666;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
  text-decoration: none;
  padding: 8px 4px;
  transition: color 0.3s ease;
}

.auth-link:hover {
  color: #333;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 4px;
}

.separator {
  color: #666;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .container {
    width: 100%;
    padding: 0 20px;
  }

  .nav-menu {
    display: none;
  }

  .chat-dropdown,
  .notification-dropdown {
    width: 280px;
    right: -20px;
  }

  .dropdown-header {
    padding: 12px 16px;
  }

  .chat-item,
  .notification-item {
    padding: 10px 16px;
  }
}
</style>
