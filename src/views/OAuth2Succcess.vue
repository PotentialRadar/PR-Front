<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import axios from 'axios';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  const token = new URLSearchParams(window.location.search).get('token');
  if (token) {
    localStorage.setItem('accessToken', token); // ✅ 저장!
    try {
      const res = await axios.get('/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      userStore.login(token, res.data);
      router.replace('/');
    } catch (e) {
      console.error('❌ 사용자 정보 조회 실패', e);
      localStorage.removeItem('accessToken');
      userStore.logout();
    }
  } else {
    router.replace('/login');
  }
});
</script>

<template>
  <div>로그인 처리 중입니다...</div>
</template>
