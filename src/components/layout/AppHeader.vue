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
          <router-link to="/portfolios" class="nav-item">포트폴리오</router-link>
          <router-link to="/new-project" class="nav-item">프로젝트 생성</router-link>
        </nav>
      </div>

      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <!-- 채팅 버튼 -->
          <div class="icon-button-container">
            <button 
              class="icon-button chat-button"
              @click="toggleChat"
              :class="{ 'active': showChat }"
            >
              <span class="icon">💬</span>
              <span v-if="unreadChatCount > 0" class="badge chat-badge">{{ unreadChatCount > 99 ? '99+' : unreadChatCount }}</span>
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
              <span v-if="unreadNotificationCount > 0" class="badge notification-badge">{{ unreadNotificationCount > 99 ? '99+' : unreadNotificationCount }}</span>
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
                    @click="handleNotificationClick(notification)"
                  >
                    <div class="notification-icon" :class="notification.type">
                      <span>{{ getNotificationIcon(notification.type) }}</span>
                    </div>
                    <div class="notification-content">
                      <p class="notification-message">{{ notification.message }}</p>
                      <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                    </div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'

const userStore = useUserStore()
const toast = useToast()

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

// 샘플 알림 데이터 (김개발자가 받은 알림들)
const notifications = ref([
  {
    id: 1,
    type: 'project',
    message: 'E-commerce 플랫폼 프로젝트에 새로운 지원자가 있습니다',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    isRead: false
  },
  {
    id: 3,
    type: 'review',
    message: 'AI 챗봇 서비스 프로젝트에 새로운 리뷰가 등록되었습니다',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3시간 전
    isRead: false
  },

])

// 계산된 속성
const unreadChatCount = computed(() => {
  return chatMessages.value.filter(chat => !chat.isRead).length
})

const unreadNotificationCount = computed(() => {
  return notifications.value.filter(notification => !notification.isRead).length
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

const openChat = (chatId) => {
  // 채팅 읽음 처리
  const chat = chatMessages.value.find(c => c.id === chatId)
  if (chat) {
    chat.isRead = true
  }
  
  // 채팅 페이지로 이동
  console.log('채팅 열기:', chatId)
  showChat.value = false
}

const handleNotificationClick = (notification) => {
  // 알림 읽음 처리
  notification.isRead = true
  
  // 알림 타입에 따른 페이지 이동
  console.log('알림 클릭:', notification)
  showNotifications.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.isRead = true
  })
}

const getNotificationIcon = (type) => {
  const iconMap = {
    project: '📁',
    message: '💬',
    review: '⭐',
    payment: '💳',
    system: '⚙️'
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
  });
  
  // 전역 객체에도 저장
  window.debugAppHeaderUserStore = userStore;
  
  // 로그인 상태 확인 및 프로필 정보 가져오기
  if (userStore.isLoggedIn && !userStore.profile) {
    try {
      await userStore.fetchProfile()
    } catch (error) {
      console.error('프로필 조회 실패:', error)
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
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
  transition: color 0.3s ease;
}

.nav-item:hover {
  color: #333;
}

.nav-item.router-link-active {
  color: #333;
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
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f5f5f5;
  position: relative;
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
