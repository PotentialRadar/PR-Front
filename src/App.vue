<script setup>
import api from '@/api/axios';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const userStore = useUserStore();

onMounted(async () => {
  // 임시로 checkLogin 비활성화 - 로그인 페이지에서 이미 처리됨
  // await userStore.checkLogin();
  
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
    <router-view />
  </main>
  <AppFooter />
</template>

<style scoped>
.main-content {
  margin-top: 68px; /* Height of fixed header */
  min-height: calc(100vh - 68px);
}
</style>
