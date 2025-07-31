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
          <!-- <router-link to="/portfolio/:userId?" class="auth-link">마이페이지</router-link>
          <button @click="handleLogout" class="auth-link">로그아웃</button> -->
          <router-link to="/login" class="auth-link">로그인&nbsp; | &nbsp;회원가입</router-link>
        </template>
        <template v-else>
          <!-- <router-link to="/login" class="auth-link">로그인&nbsp; | &nbsp;회원가입</router-link> -->
          <router-link to="/portfolio/:userId?" class="auth-link">마이페이지</router-link>
          <span class="auth-link">|</span>
          <button @click="handleLogout" class="auth-link">로그아웃</button>
        </template>

      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'vue-toastification';
const userStore = useUserStore();
const toast = useToast();

const handleLogout = () => {
  userStore.logout();

  toast.success('로그아웃되었습니다.', {
    position: 'top-center',
    timeout: 2000,
    hideProgressBar: true,
  });
};
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
}

.nav-item:hover {
  color: #4CAF50;

}

.nav-item.router-link-active {
  color: #4CAF50;
  font-weight: 700;
}

.nav-dropdown {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 20px 5px;
  cursor: pointer;
}

.dropdown-trigger {
  color: #424953;
  font-size: 15px;
  font-weight: 400;
  line-height: 27px;
}

.dropdown-icon {
  width: 14px;
  height: 10px;
}

.header-right {
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
  padding-top: 3px;
}

.auth-link:hover {
  color: #4CAF50;
}

.separator {
  color: #666;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  padding-top: 3px;
}
</style>
