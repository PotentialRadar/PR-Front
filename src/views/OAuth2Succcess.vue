<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import api from '@/api/axios';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    const token = new URLSearchParams(window.location.search).get('token');
    const refreshToken = new URLSearchParams(window.location.search).get('refreshToken');
    
    if (token) {
      // 토큰을 localStorage에 저장
      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // 사용자 프로필 정보 조회
      const response = await api.get('/user/profile');
      const userProfile = response.data;
      
      // 스토어에 로그인 정보 저장
      userStore.login({
        userId: userProfile.userId,
        email: userProfile.email,
        accessToken: token,
        refreshToken: refreshToken
      });
      
      console.log('OAuth2 로그인 성공:', userProfile);
      router.replace('/');
    } else {
      console.error('토큰이 없습니다');
      router.replace('/login');
    }
  } catch (error) {
    console.error('❌ OAuth2 로그인 처리 실패:', error);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    userStore.logout();
    router.replace('/login');
  }
});
</script>

<template>
  <div>로그인 처리 중입니다...</div>
</template>
