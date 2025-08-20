<!-- src/views/OAuthSuccess.vue -->
<template>
  <div class="success-page">
    <h2>✅ 로그인 성공</h2>
    <p>잠시 후 메인 페이지로 이동합니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  try {
    // URL 파라미터에서 토큰 정보 추출
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');
    const email = urlParams.get('email');
    const userId = urlParams.get('userId');

    if (accessToken && email && userId) {
      // userStore에 로그인 정보 저장
      userStore.login({
        email,
        userId: parseInt(userId),
        accessToken,
        refreshToken
      });

      // 프로필 정보 가져오기
      await userStore.fetchProfile();
      
      console.log('✅ OAuth 로그인 성공:', { userId, email });
    } else {
      console.warn('⚠️ OAuth 응답에서 필요한 정보를 찾을 수 없습니다');
    }
  } catch (error) {
    console.error('❌ OAuth 로그인 처리 실패:', error);
  }

  setTimeout(() => {
    router.push('/');
  }, 2000);
});
</script>

<style scoped>
.success-page {
  text-align: center;
  margin-top: 100px;
}
</style>
