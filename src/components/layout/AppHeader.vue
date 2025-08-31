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
        <template v-if="authCheckCompleted && isLoggedIn">
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
                    <div class="notification-content" @click="handleNotificationClickLocal(notification)">
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
        
        <template v-else-if="authCheckCompleted && !isLoggedIn">
          <div class="user-menu">
            <router-link to="/login" class="auth-link">로그인</router-link>
            <span class="separator">|</span>
            <router-link to="/signUp" class="auth-link">회원가입</router-link>
          </div>
        </template>
        
        <template v-else>
          <!-- 인증 확인 중 로딩 상태 -->
          <div class="user-menu">
            <span class="auth-link" style="color: #ccc;">로딩 중...</span>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import { useNotifications } from '@/composables/useNotifications'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const toast = useToast()
const router = useRouter()

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
  handleNotificationClick,
  cleanup: cleanupNotifications,
  resetNotifications
} = useNotifications()

// 계산된 속성
const isLoggedIn = computed(() => {
  const loggedIn = userStore.isLoggedIn
  const userId = userStore.userId
  const email = userStore.email
  const nickname = userStore.nickname
  
  console.log('🔍 AppHeader isLoggedIn computed:', {
    isLoggedIn: loggedIn,
    userId: userId,
    email: email,
    nickname: nickname,
    storeState: userStore.$state
  })
  
  // 명시적으로 boolean 값으로 반환
  return Boolean(loggedIn)
  return userStore.isLoggedIn
})

// 반응형 데이터
const showChat = ref(false)
const showNotifications = ref(false)
const authCheckCompleted = ref(false)


// 실시간 알림만 사용
const notifications = realTimeNotifications


const finalUnreadNotificationCount = computed(() => {
  // 실시간 알림 수만 사용
  return unreadNotificationCount.value
})

// 메서드
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
  showChat.value = false
}

const handleNotificationClickLocal = async (notification) => {
  
  // 초대 알림인 경우 직접 처리
  if (notification.type === 'invite' || notification.notificationType === 'INVITATION') {
    try {
      // 1. 알림의 url 필드 먼저 확인 (백엔드에서 "/projects/{projectId}" 형태로 설정)
      if (notification.url && notification.url.startsWith('/projects/')) {
        const projectIdFromUrl = notification.url.split('/projects/')[1]
        if (projectIdFromUrl && !isNaN(projectIdFromUrl)) {
          await router.push(`/projects/${projectIdFromUrl}`)
          showNotifications.value = false
          return
        }
      }
      
      // 2. invitationId가 있으면 초대 상세 조회
      if (notification.invitationId) {
        
        try {
          const token = localStorage.getItem('accessToken')
          const userId = userStore.userId
          
          if (!userId) {
            await router.push('/projects')
            showNotifications.value = false
            return
          }
          
          const response = await fetch('/api/invitations/received', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-Id': userId.toString(),
              'Content-Type': 'application/json'
            }
          })
          
          if (response.ok) {
            const invitations = await response.json()
            
            const invitation = invitations.find(inv => 
              inv.invitationId === notification.invitationId || 
              inv.invitationId === parseInt(notification.invitationId)
            )
            
            if (invitation && invitation.projectId) {
              await router.push(`/projects/${invitation.projectId}`)
              showNotifications.value = false
              return
            }
          }
        } catch (apiError) {
          console.error('초대 API 호출 실패:', apiError)
        }
      }
      
      // 3. 알림 메시지에서 프로젝트 이름 추출하여 검색
      const message = notification.message || notification.content
      
      const projectNameMatch = message.match(/'(.+?)' 프로젝트에 초대했습니다/)
      if (projectNameMatch) {
        const projectName = projectNameMatch[1]
        
        try {
          const token = localStorage.getItem('accessToken')
          const projectsResponse = await fetch('/api/projects', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
          
          if (projectsResponse.ok) {
            const projectsResult = await projectsResponse.json()
            
            let projects = []
            if (projectsResult.content) {
              projects = projectsResult.content
            } else if (Array.isArray(projectsResult)) {
              projects = projectsResult
            }
            
            const project = projects.find(p => p.title === projectName)
            if (project) {
              await router.push(`/projects/${project.projectId}`)
              showNotifications.value = false
              return
            }
          }
        } catch (searchError) {
          console.error('프로젝트 검색 실패:', searchError)
        }
      }
      
      // 4. 모든 방법 실패 시 프로젝트 목록으로 이동
      await router.push('/projects')
      
    } catch (error) {
      console.error('초대 처리 중 오류:', error)
      await router.push('/projects')
    }
  } else {
    // 다른 알림은 기존 함수로 처리
    await handleNotificationClick(notification)
  }
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

const handleLogout = async () => {
  console.log('🚪 AppHeader handleLogout 시작')
  
  // 알림 연결 정리
  cleanupNotifications()
  resetNotifications()
  // 클라이언트 로그아웃 플래그 (라우터가 즉시 로그인 페이지 접근 허용)
  try { sessionStorage.setItem('clientLoggedOut', '1') } catch (_) {}
  
  // 로그아웃 API 호출 및 상태 정리만 수행 (페이지 리다이렉트 없음)
  try {
    console.log('🔄 userStore.logout() 호출 전')
    await userStore.logout()
    console.log('✅ userStore.logout() 완료')
  } catch (error) {
    console.error('❌ 로그아웃 처리 실패:', error)
  }
  
  // 프론트 상태는 이미 초기화됨. 즉시 UI 갱신만 수행
  authCheckCompleted.value = true
  console.log('✅ 로그아웃 후 UI 상태 갱신 완료 (재검사 생략)')
  
  toast.success('로그아웃되었습니다.', {
    position: 'top-center',
    timeout: 1500,
    hideProgressBar: true,
  })

  // 즉시 로그인 페이지로 이동 (사용자는 거기서 로그인/회원가입 선택)
  router.push({ path: '/login', query: { redirect: '/' } })
  
  // 토스트가 보이는 시간을 확보한 후 로그아웃 (한 번만 호출)
  setTimeout(() => {
    userStore.logout()
  }, 500)
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
  const handleFocus = async () => {
    // 탭 포커스/가시성 변경 시 인증 상태 재확인 (쿠키 만료/삭제 반영)
    if (!userStore.isLoggingOut) {
      await userStore.checkLogin()
    }
  }
  window.addEventListener('focus', handleFocus)
  document.addEventListener('visibilitychange', handleFocus)
  
  
  // AppHeader 마운트 시 인증 상태 확인
  console.log('🔍 AppHeader에서 인증 상태 확인 시작')
  await userStore.checkLogin()
  authCheckCompleted.value = true
  console.log('🔍 AppHeader 인증 상태 확인 완료:', {
    isLoggedIn: userStore.isLoggedIn,
    userId: userStore.userId,
    email: userStore.email
  })
  
  // 전역 객체에도 저장
  window.debugAppHeaderUserStore = userStore
  
  // 로그인 + userId 동시 충족 시 초기화, 로그아웃/해제 시 정리
  watch(
    () => userStore.isLoggedIn,
    (newValue, oldValue) => {
      
      if (newValue && !oldValue) {
        // 로그인 상태로 변경된 경우만 초기화
        // userStore에 userId가 설정될 때까지 기다림
        const checkAndInit = () => {
          if (userStore.userId) {
            initializeNotifications()
          } else {
            setTimeout(checkAndInit, 500)
          }
        }
        checkAndInit()
      } else if (!newValue && oldValue) {
        // 로그아웃된 경우만 정리
        cleanupNotifications()
        resetNotifications()
      }
    },
    { immediate: true }
  )
  
  // 언마운트 시 제거를 위해 참조 보관
  // eslint-disable-next-line vue/no-setup-props-destructure
  onUnmounted(() => {
    window.removeEventListener('focus', handleFocus)
    document.removeEventListener('visibilitychange', handleFocus)
  })
  
  // 컴포넌트 마운트 시 로그인 상태 확인 (초기화 지연)
  setTimeout(() => {
    if (userStore.isLoggedIn && userStore.userId) {
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
