<template>
  <header class="app-header">
    <div class="container">
      <div class="header-left">
        <div class="logo-container">
          <router-link to="/" class="logo-link">
            <img src="/pr-logo.png" alt="로고" class="logo" />
          </router-link>
        </div>
        <nav class="nav-menu">
          <router-link to="/projects" class="nav-item">프로젝트</router-link>
          <router-link to="/portfolio" class="nav-item portfolio-search"
            >포트폴리오</router-link
          >
          <div class="nav-dropdown">
            <span class="dropdown-trigger">더보기</span>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/8730bce826a38c42e3781f01f73b07caeccbd593?width=28"
              alt="더보기"
              class="dropdown-icon"
            />
          </div>
        </nav>
      </div>

      <div class="header-right">
        <template v-if="userStore.isLoggedIn">
          <router-link to="/mypage" class="auth-link">마이페이지</router-link>
          <button @click="userStore.logout" class="auth-link">로그아웃</button>
        </template>
        <template v-else>
          <router-link to="/login" class="auth-link"
            >로그인&nbsp; | &nbsp;회원가입</router-link
          >
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();
</script>

<style scoped>
.app-header {
  width: 100%;
  height: 65px;
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
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); /* 선택 */
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
  height: 40px; /* 또는 로고 이미지에 맞는 높이로 설정 */
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
  color: #ff7d12;
}

.portfolio-search {
  text-decoration: underline;
}

.nav-dropdown {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 22px 5px 25px 20px;
  cursor: pointer;
}

.dropdown-trigger {
  color: #555;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
}

.dropdown-icon {
  width: 14px;
  height: 9px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.auth-link {
  color: #666;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  text-decoration: none;
  padding-top: 3px;
}

.auth-link:hover {
  color: #ff7d12;
}

.separator {
  color: #666;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  padding-top: 3px;
}
</style>
