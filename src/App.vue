<script setup>
import api from '@/api/axios';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const userStore = useUserStore();

onMounted(async () => {
<<<<<<< HEAD
  // 앱 시작 시 로그인 상태 확인
=======
  // checkLogin 활성화 - 새로고침 시 토큰으로 로그인 상태 복원
>>>>>>> f89207d (feat: 팀원 추천 기능 수정)
  await userStore.checkLogin();
  
  console.log('App mounted - userStore 상태:', {
    isLoggedIn: userStore.isLoggedIn,
    userId: userStore.userId,
    email: userStore.email
  });
});
</script>

<template>
  <AppHeader />
  <main class="main-content">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </main>
  <AppFooter />
</template>

<style scoped>
.main-content {
  margin-top: 68px; /* Height of fixed header */
  min-height: calc(100vh - 68px);
}
</style>
