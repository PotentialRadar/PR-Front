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
    // httpOnly 쿠키 방식에서는 URL 파라미터로 토큰을 받지 않음
    // 서버가 OAuth 성공 시 쿠키에 토큰을 자동 설정함
    
    // 서버에서 사용자 정보 가져오기 (쿠키의 토큰으로 인증됨)
    await userStore.fetchProfile();
    
    // userStore에 로그인 정보 저장 (fetchProfile에서 이미 설정됨)
    userStore.isLoggedIn = true;

    // 로그아웃 플래그 제거(혹시 남아있다면)
    try { sessionStorage.removeItem('clientLoggedOut') } catch (_) {}
    
    console.log('✅ OAuth 로그인 성공 - httpOnly 쿠키를 통한 인증');
  } catch (error) {
    console.error('❌ OAuth 로그인 처리 실패:', error);
    // 인증 실패 시 로그인 페이지로 리다이렉트
    setTimeout(() => {
      router.push('/login');
    }, 2000);
    return;
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
