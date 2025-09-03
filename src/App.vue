<script setup>
import api from '@/api/axios';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';

const userStore = useUserStore();
const isAuthChecked = ref(false);

// 앱 로드 시 바로 인증 상태 확인
(async () => {
  await userStore.checkLogin();
  isAuthChecked.value = true;
})();

onMounted(async () => {
  console.log('App mounted - 인증 상태 확인 완료');
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
