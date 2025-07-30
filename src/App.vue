<script setup>
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const userStore = useUserStore();

onMounted(async () => {
  const token = localStorage.getItem('accessToken'); // ❌ 없으면 로그인 안 됨!
  if (token) {
    try {
      const res = await axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // 쿠키 기반 로그인 시 필요
      });
      userStore.login(token, res.data);
    } catch (e) {
      console.error('❌ 토큰으로 유저 조회 실패', e);
      localStorage.removeItem('accessToken');
      userStore.logout();
    }
  }
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
