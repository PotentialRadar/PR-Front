<script setup>
import api from '@/api/axios';
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';

import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const userStore = useUserStore();

onMounted(async () => {
  // httpOnly 쿠키 방식에서는 App.vue에서 전역적으로 checkLogin을 호출하지 않음
  // 각 페이지나 컴포넌트에서 필요에 따라 개별적으로 인증 상태를 확인함
  // 이렇게 하면 무한 루프와 불필요한 API 호출을 방지할 수 있음

  // checkLogin 활성화 - 새로고침 시 토큰으로 로그인 상태 복원
  await userStore.checkLogin();
  
  console.log('App mounted - 인증 상태는 필요시에만 개별적으로 확인');
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
