<template>
  <div class="dashboard-layout">
    <!-- Sidebar: Always visible -->
    <nav class="dashboard-sidebar">
      <div class="sidebar-content">
        <div class="sidebar-header">
          <router-link to="/" class="logo-link">
            <!-- logo -->
          </router-link>
        </div>

        <div class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-section-title">마이페이지</h3>

            <!-- 내 포트폴리오 -->
            <router-link
              :to="`/myPage/portfolio`"
              class="nav-item"
              active-class="active"
            >
              <i class="bi bi-layout-text-window-reverse"></i>
              <span>내 포트폴리오</span>
            </router-link>

            <!-- 내 프로젝트 페이지 보여주기   -->
            <!-- <router-link to="/myPage/#" class="nav-item" active-class="active">
              <i class="bi bi-heart"></i>
              <span>내 프로젝트</span>
            </router-link> -->

            <!-- 좋아요 목록 -->
            <router-link
              to="/myPage/favorites"
              class="nav-item"
              active-class="active"
            >
              <i class="bi bi-heart"></i>
              <span>좋아요 목록</span>
            </router-link>

            <!-- 내 정보 수정 -->
            <router-link
              to="/myPage/edit-portfolio"
              class="nav-item"
              active-class="active"
            >
              <i class="bi bi-pencil-square"></i>
              <span>내 정보 수정</span>
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <main class="dashboard-main">
      <router-view />
    </main>
  </div>
</template>
<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'DashboardLayout',
  setup() {
    const route = useRoute();
    const showNotifications = ref(false);
    const showUserMenu = ref(false);
    const isDark = ref(false);

    // Sample user data
    const user = ref({
      id: 1,
      name: '김개발자',
      email: 'developer@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=김개발자',
    });

    // Sample notifications
    const notifications = ref([
      {
        id: 1,
        type: 'project',
        message: '새로운 프로젝트 문의가 도착했습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        read: false,
      },
      {
        id: 2,
        type: 'message',
        message: '클라이언트가 메시지를 보냈습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
      },
      {
        id: 3,
        type: 'payment',
        message: '프로젝트 결제가 완료되었습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        read: true,
      },
    ]);

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
        '/dashboard/settings': '설정',
        '/favorites': '좋아요 목록',
        '/edit-portfolio': '내 정보 수정',
      };
      return routeMap[route.path] || '대시보드';
    });

    const unreadCount = computed(() => {
      return notifications.value.filter(n => !n.read).length;
    });

    // Methods
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      showUserMenu.value = false;
    };

    const toggleUserMenu = () => {
      showUserMenu.value = !showUserMenu.value;
      showNotifications.value = false;
    };

    const toggleTheme = () => {
      isDark.value = !isDark.value;
      document.documentElement.setAttribute(
        'data-theme',
        isDark.value ? 'dark' : 'light'
      );
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    };

    const markAllAsRead = () => {
      notifications.value.forEach(n => (n.read = true));
    };

    const getNotificationIcon = type => {
      const iconMap = {
        project: 'bi bi-folder-plus',
        message: 'bi bi-chat-dots',
        payment: 'bi bi-credit-card',
        review: 'bi bi-star-fill',
      };
      return iconMap[type] || 'bi bi-bell';
    };

    const formatTime = timestamp => {
      const now = new Date();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (minutes < 60) return `${minutes}분 전`;
      if (hours < 24) return `${hours}시간 전`;
      return `${days}일 전`;
    };

    const logout = () => {
      // Handle logout logic
      console.log('Logging out...');
    };

    // Handle click outside
    const handleClickOutside = event => {
      if (
        !event.target.closest('.notifications') &&
        !event.target.closest('.user-menu')
      ) {
        showNotifications.value = false;
        showUserMenu.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);

      // Load theme preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        isDark.value = savedTheme === 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    });

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    return {
      showNotifications,
      showUserMenu,
      isDark,
      user,
      notifications,
      currentPageTitle,
      unreadCount,
      toggleNotifications,
      toggleUserMenu,
      toggleTheme,
      markAllAsRead,
      getNotificationIcon,
      formatTime,
      logout,
    };
  },
};
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

.dashboard-sidebar {
  width: 250px;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
  padding: 20px;
}

.dashboard-main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 8px;
  text-decoration: none;
  color: #333;
  border-radius: 8px;
  transition: background 0.2s;
}

.nav-item:hover {
  background-color: #f3f4f6;
}

.nav-item.active {
  background-color: #e0e7ff;
  font-weight: bold;
}

.nav-item i {
  margin-right: 10px;
}

.sidebar-header {
  margin-bottom: 24px;
}
</style>
