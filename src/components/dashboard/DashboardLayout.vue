<template>
  <div class="dashboard-layout">
    <!-- Dashboard Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <button @click="toggleSidebar" class="sidebar-toggle" :aria-expanded="sidebarOpen">
            <i class="bi bi-list"></i>
          </button>
          <h1 class="dashboard-title">{{ currentPageTitle }}</h1>
        </div>
        
        <div class="header-right">
          <div class="theme-toggle">
            <button @click="toggleTheme" class="theme-btn" :aria-label="isDark ? '라이트 모드로 전환' : '다크 모드로 전환'">
              <i :class="isDark ? 'bi bi-sun' : 'bi bi-moon'"></i>
            </button>
          </div>
          
          <div class="notifications">
            <button class="notification-btn" @click="toggleNotifications" :aria-label="'알림'">
              <i class="bi bi-bell"></i>
              <span v-if="unreadCount > 0" class="notification-badge">{{ unreadCount }}</span>
            </button>
            
            <div v-if="showNotifications" class="notification-dropdown">
              <div class="notification-header">
                <h3>알림</h3>
                <button @click="markAllAsRead" class="mark-read-btn">모두 읽음</button>
              </div>
              <div class="notification-list">
                <div v-for="notification in notifications" :key="notification.id" 
                     :class="['notification-item', { 'unread': !notification.read }]">
                  <div class="notification-icon">
                    <i :class="getNotificationIcon(notification.type)"></i>
                  </div>
                  <div class="notification-content">
                    <p class="notification-message">{{ notification.message }}</p>
                    <span class="notification-time">{{ formatTime(notification.timestamp) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="user-menu">
            <button @click="toggleUserMenu" class="user-btn">
              <img :src="user.avatar" :alt="user.name" class="user-avatar">
              <span class="user-name">{{ user.name }}</span>
              <i class="bi bi-chevron-down"></i>
            </button>
            
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="user-info">
                <img :src="user.avatar" :alt="user.name" class="user-avatar-large">
                <div>
                  <p class="user-name-large">{{ user.name }}</p>
                  <p class="user-email">{{ user.email }}</p>
                </div>
              </div>
              <hr class="dropdown-divider">
              <router-link to="/dashboard/profile" class="dropdown-item">
                <i class="bi bi-person"></i>
                프로필
              </router-link>
              <router-link to="/dashboard/settings" class="dropdown-item">
                <i class="bi bi-gear"></i>
                설정
              </router-link>
              <hr class="dropdown-divider">
              <button @click="logout" class="dropdown-item logout-btn">
                <i class="bi bi-box-arrow-right"></i>
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Dashboard Sidebar -->
    <nav :class="['dashboard-sidebar', { 'open': sidebarOpen }]">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <router-link to="/" class="logo-link">
            <svg class="logo" width="120" height="24" viewBox="0 0 91 17" fill="none">
              <path d="M90.4999 5.08235V16.1419H89.2221V14.0282C89.0581 14.2413 88.8862 14.4461 88.7056 14.6427C88.5416 14.8229 88.3616 14.9868 88.165 15.1342C87.9684 15.2817 87.7557 15.4292 87.5259 15.5766C87.3625 15.6585 87.1899 15.7404 87.0099 15.8223C86.8299 15.9043 86.6494 15.978 86.4694 16.0436C86.2888 16.1091 86.1088 16.1583 85.9288 16.191C85.7482 16.2402 85.5602 16.2811 85.3636 16.3139C85.183 16.3466 84.995 16.3712 84.7983 16.3876C84.6017 16.404 84.4051 16.4122 84.2085 16.4122C82.4062 16.4122 80.8905 15.8469 79.6615 14.7164C78.4657 13.5695 77.8672 12.2014 77.8672 10.6121C77.8672 9.02281 78.4657 7.6547 79.6615 6.5078C80.8905 5.37727 82.4062 4.81201 84.2085 4.81201C84.7983 4.81201 85.3716 4.88574 85.9288 5.0332C86.502 5.18066 87.0592 5.39366 87.5998 5.67219C88.2716 6.06542 88.8122 6.55693 89.2221 7.1468V5.08235H90.4999ZM80.5953 7.39255C79.6288 8.31009 79.1455 9.39147 79.1455 10.6367C79.1455 11.8819 79.6288 12.9551 80.5953 13.8562C81.6111 14.7738 82.8321 15.2325 84.2572 15.2325C84.7324 15.2325 85.183 15.1833 85.6089 15.0851C86.0348 14.9868 86.4367 14.8393 86.8133 14.6427C87.1899 14.4297 87.5425 14.1675 87.8704 13.8562C88.3456 13.4138 88.6976 12.9223 88.9269 12.3816C89.1562 11.841 89.2708 11.2511 89.2708 10.6121C89.2708 9.36688 88.7956 8.2855 87.8457 7.36796C86.846 6.45048 85.6422 5.99171 84.2325 5.99171C82.8235 5.99171 81.6111 6.45867 80.5953 7.39255Z" fill="currentColor"/>
            </svg>
          </router-link>
        </div>
        
        <div class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-section-title">대시보드</h3>
            <router-link to="/dashboard" class="nav-item" exact-active-class="active">
              <i class="bi bi-speedometer2"></i>
              <span>개요</span>
            </router-link>
            <router-link to="/dashboard/analytics" class="nav-item" active-class="active">
              <i class="bi bi-graph-up"></i>
              <span>분석</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">프로젝트</h3>
            <router-link to="/dashboard/projects" class="nav-item" active-class="active">
              <i class="bi bi-folder"></i>
              <span>내 프로젝트</span>
              <span v-if="projectCount > 0" class="nav-badge">{{ projectCount }}</span>
            </router-link>
            <router-link to="/dashboard/inquiries" class="nav-item" active-class="active">
              <i class="bi bi-envelope"></i>
              <span>문의 관리</span>
              <span v-if="inquiryCount > 0" class="nav-badge">{{ inquiryCount }}</span>
            </router-link>
            <router-link to="/dashboard/proposals" class="nav-item" active-class="active">
              <i class="bi bi-file-text"></i>
              <span>제안서</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">소통</h3>
            <router-link to="/dashboard/messages" class="nav-item" active-class="active">
              <i class="bi bi-chat-dots"></i>
              <span>메시지</span>
              <span v-if="messageCount > 0" class="nav-badge">{{ messageCount }}</span>
            </router-link>
            <router-link to="/dashboard/reviews" class="nav-item" active-class="active">
              <i class="bi bi-star"></i>
              <span>리뷰</span>
            </router-link>
          </div>

          <div class="nav-section">
            <h3 class="nav-section-title">계정</h3>
            <router-link to="/dashboard/profile" class="nav-item" active-class="active">
              <i class="bi bi-person"></i>
              <span>프로필</span>
            </router-link>
            <router-link to="/dashboard/portfolio" class="nav-item" active-class="active">
              <i class="bi bi-collection"></i>
              <span>포트폴리오</span>
            </router-link>
            <router-link to="/dashboard/settings" class="nav-item" active-class="active">
              <i class="bi bi-gear"></i>
              <span>설정</span>
            </router-link>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="quick-stats">
            <div class="quick-stat">
              <span class="stat-label">이번 달 수익</span>
              <span class="stat-value">₩{{ formatMoney(monthlyEarnings) }}</span>
            </div>
            <div class="quick-stat">
              <span class="stat-label">완료 프로젝트</span>
              <span class="stat-value">{{ completedProjects }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="dashboard-main">
      <div class="main-content">
        <slot />
      </div>
    </main>

    <!-- Overlay for mobile sidebar -->
    <div v-if="sidebarOpen" @click="closeSidebar" class="sidebar-overlay"></div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

export default {
  name: 'DashboardLayout',
  setup() {
    const route = useRoute()
    const sidebarOpen = ref(false)
    const showNotifications = ref(false)
    const showUserMenu = ref(false)
    const isDark = ref(false)

    // Sample user data
    const user = ref({
      id: 1,
      name: '김개발자',
      email: 'developer@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=김개발자'
    })

    // Sample notifications
    const notifications = ref([
      {
        id: 1,
        type: 'project',
        message: '새로운 프로젝트 문의가 도착했습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false
      },
      {
        id: 2,
        type: 'message',
        message: '클라이언트가 메시지를 보냈습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false
      },
      {
        id: 3,
        type: 'payment',
        message: '프로젝트 결제가 완료되었습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true
      }
    ])

    // Sample stats
    const projectCount = ref(12)
    const inquiryCount = ref(5)
    const messageCount = ref(3)
    const monthlyEarnings = ref(2500000)
    const completedProjects = ref(47)

    // Computed properties
    const currentPageTitle = computed(() => {
      const routeMap = {
        '/dashboard': '대시보드 개요',
        '/dashboard/analytics': '분석',
        '/dashboard/projects': '프로젝트 관리',
        '/dashboard/inquiries': '문의 관리',
        '/dashboard/proposals': '제안서',
        '/dashboard/messages': '메시지',
        '/dashboard/reviews': '리뷰',
        '/dashboard/profile': '프로필',
        '/dashboard/portfolio': '포트폴리오',
        '/dashboard/settings': '설정'
      }
      return routeMap[route.path] || '대시보드'
    })

    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length
    })

    // Methods
    const toggleSidebar = () => {
      sidebarOpen.value = !sidebarOpen.value
    }

    const closeSidebar = () => {
      sidebarOpen.value = false
    }

    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value
      showUserMenu.value = false
    }

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value
      showNotifications.value = false
    }

    const toggleTheme = () => {
      isDark.value = !isDark.value
      document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    }

    const markAllAsRead = () => {
      notifications.value.forEach(n => n.read = true)
    }

    const getNotificationIcon = (type) => {
      const iconMap = {
        project: 'bi bi-folder-plus',
        message: 'bi bi-chat-dots',
        payment: 'bi bi-credit-card',
        review: 'bi bi-star-fill'
      }
      return iconMap[type] || 'bi bi-bell'
    }

    const formatTime = (timestamp) => {
      const now = new Date()
      const diff = now - timestamp
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 60) return `${minutes}분 전`
      if (hours < 24) return `${hours}시간 전`
      return `${days}일 전`
    }

    const formatMoney = (amount) => {
      return new Intl.NumberFormat('ko-KR').format(amount)
    }

    const logout = () => {
      // Handle logout logic
      console.log('Logging out...')
    }

    // Handle click outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.notifications') && !event.target.closest('.user-menu')) {
        showNotifications.value = false
        showUserMenu.value = false
      }
    }

    // Handle responsive sidebar
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        sidebarOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)
      
      // Load theme preference
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme) {
        isDark.value = savedTheme === 'dark'
        document.documentElement.setAttribute('data-theme', savedTheme)
      }
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    })

    return {
      sidebarOpen,
      showNotifications,
      showUserMenu,
      isDark,
      user,
      notifications,
      projectCount,
      inquiryCount,
      messageCount,
      monthlyEarnings,
      completedProjects,
      currentPageTitle,
      unreadCount,
      toggleSidebar,
      closeSidebar,
      toggleNotifications,
      toggleUserMenu,
      toggleTheme,
      markAllAsRead,
      getNotificationIcon,
      formatTime,
      formatMoney,
      logout
    }
  }
}
</script>

<style scoped>
/* Dashboard Layout Styles */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bg-color, #f8f9fa);
  transition: all 0.3s ease;
}

/* Header Styles */
.dashboard-header {
  position: fixed;
  top: 0;
  left: 280px;
  right: 0;
  height: 70px;
  background: var(--header-bg, #ffffff);
  border-bottom: 1px solid var(--border-color, #e9ecef);
  z-index: 1000;
  transition: left 0.3s ease;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sidebar-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sidebar-toggle:hover {
  background: var(--hover-bg, #f8f9fa);
}

.dashboard-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary, #212529);
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.theme-toggle, .notifications, .user-menu {
  position: relative;
}

.theme-btn, .notification-btn, .user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: none;
  background: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-secondary, #6c757d);
}

.theme-btn:hover, .notification-btn:hover, .user-btn:hover {
  background: var(--hover-bg, #f8f9fa);
  color: var(--text-primary, #212529);
}

.notification-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: var(--danger-color, #dc3545);
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: var(--text-primary, #212529);
}

/* Dropdown Styles */
.notification-dropdown, .user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 320px;
  background: var(--dropdown-bg, #ffffff);
  border: 1px solid var(--border-color, #e9ecef);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  overflow: hidden;
  animation: dropdownFadeIn 0.2s ease;
}

.notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, #e9ecef);
}

.notification-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #212529);
}

.mark-read-btn {
  background: none;
  border: none;
  color: var(--primary-color, #FF7D12);
  font-size: 14px;
  cursor: pointer;
}

.notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light, #f8f9fa);
  transition: background 0.2s ease;
}

.notification-item:hover {
  background: var(--hover-bg, #f8f9fa);
}

.notification-item.unread {
  background: rgba(255, 125, 18, 0.05);
}

.notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light, rgba(255, 125, 18, 0.1));
  border-radius: 50%;
  color: var(--primary-color, #FF7D12);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: var(--text-primary, #212529);
  line-height: 1.4;
}

.notification-time {
  font-size: 12px;
  color: var(--text-secondary, #6c757d);
}

.user-dropdown {
  width: 280px;
}

.user-info {
  display: flex;
  gap: 12px;
  padding: 20px;
  border-bottom: 1px solid var(--border-color, #e9ecef);
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name-large {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #212529);
}

.user-email {
  margin: 0;
  font-size: 14px;
  color: var(--text-secondary, #6c757d);
}

.dropdown-divider {
  margin: 0;
  border: none;
  border-top: 1px solid var(--border-color, #e9ecef);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 20px;
  border: none;
  background: none;
  text-decoration: none;
  color: var(--text-primary, #212529);
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: var(--hover-bg, #f8f9fa);
  color: var(--text-primary, #212529);
}

.logout-btn:hover {
  background: rgba(220, 53, 69, 0.1);
  color: var(--danger-color, #dc3545);
}

/* Sidebar Styles */
.dashboard-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: var(--sidebar-bg, #ffffff);
  border-right: 1px solid var(--border-color, #e9ecef);
  transform: translateX(0);
  transition: transform 0.3s ease;
  z-index: 1002;
  overflow-y: auto;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 24px 24px 16px;
  border-bottom: 1px solid var(--border-color, #e9ecef);
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary, #212529);
}

.logo {
  width: auto;
  height: 32px;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 0;
}

.nav-section {
  margin-bottom: 32px;
}

.nav-section-title {
  margin: 0 0 12px 0;
  padding: 0 24px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--text-secondary, #6c757d);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  text-decoration: none;
  color: var(--text-secondary, #6c757d);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item:hover {
  background: var(--hover-bg, #f8f9fa);
  color: var(--text-primary, #212529);
}

.nav-item.active {
  background: var(--primary-light, rgba(255, 125, 18, 0.1));
  color: var(--primary-color, #FF7D12);
  border-right: 3px solid var(--primary-color, #FF7D12);
}

.nav-item i {
  font-size: 18px;
  width: 18px;
  text-align: center;
}

.nav-badge {
  margin-left: auto;
  background: var(--primary-color, #FF7D12);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.sidebar-footer {
  padding: 24px;
  border-top: 1px solid var(--border-color, #e9ecef);
}

.quick-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quick-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary, #6c757d);
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary, #212529);
}

/* Main Content */
.dashboard-main {
  margin-left: 280px;
  margin-top: 70px;
  min-height: calc(100vh - 70px);
  transition: margin-left 0.3s ease;
}

.main-content {
  padding: 32px;
}

/* Overlay */
.sidebar-overlay {
  display: none;
}

/* Mobile Responsive */
@media (max-width: 1024px) {
  .dashboard-header {
    left: 0;
  }

  .sidebar-toggle {
    display: flex;
  }

  .dashboard-sidebar {
    transform: translateX(-100%);
  }

  .dashboard-sidebar.open {
    transform: translateX(0);
  }

  .dashboard-main {
    margin-left: 0;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1001;
  }

  .main-content {
    padding: 20px;
  }
}

@media (max-width: 768px) {
  .dashboard-title {
    font-size: 20px;
  }

  .header-right {
    gap: 8px;
  }

  .user-name {
    display: none;
  }

  .notification-dropdown, .user-dropdown {
    width: 280px;
    right: -20px;
  }

  .main-content {
    padding: 16px;
  }
}

/* Dark Theme */
[data-theme="dark"] {
  --bg-color: #1a1d23;
  --header-bg: #2d3748;
  --sidebar-bg: #2d3748;
  --dropdown-bg: #2d3748;
  --text-primary: #ffffff;
  --text-secondary: #a0aec0;
  --border-color: #4a5568;
  --border-light: #4a5568;
  --hover-bg: #4a5568;
  --primary-light: rgba(255, 125, 18, 0.2);
}

/* Animations */
@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar */
.notification-list::-webkit-scrollbar,
.dashboard-sidebar::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track,
.dashboard-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb,
.dashboard-sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color, #e9ecef);
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover,
.dashboard-sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary, #6c757d);
}
</style>
