<script setup>
import api from '@/api/axios';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const userStore = useUserStore();

onMounted(async () => {
  // 앱 시작 시 로그인 상태 확인
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
