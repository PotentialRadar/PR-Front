<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import api from '@/api/axios';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(true);
const message = ref('로그인 처리 중입니다...');
const error = ref(null);

onMounted(async () => {
  try {
    const token = new URLSearchParams(window.location.search).get('accessToken');
    const refreshToken = new URLSearchParams(window.location.search).get('refreshToken');
    
    console.log('URL 파라미터 확인:', {
      fullUrl: window.location.href,
      token: token,
      refreshToken: refreshToken
    });
    
    if (token) {
      message.value = '토큰 저장 중...';
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('accessToken', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      console.log('토큰 저장 완료, API 호출 시작');
      console.log('저장된 토큰:', localStorage.getItem('accessToken'));
      console.log('Authorization 헤더:', `Bearer ${token}`);
      
      message.value = '사용자 정보 조회 중...';
      
      // 사용자 프로필 정보 조회
      const response = await api.get('/users/me');
      const userProfile = response.data;
      
      message.value = '로그인 완료!';
      
      // 스토어에 로그인 정보 저장
      userStore.login({
        userId: userProfile.id,
        email: userProfile.email,
        accessToken: token,
        refreshToken: refreshToken
      });
      
      console.log('OAuth2 로그인 성공:', userProfile);
      console.log('userStore 상태:', {
        isLoggedIn: userStore.isLoggedIn,
        userId: userStore.userId,
        email: userStore.email
      });
      
      // 전역 객체에 상태 저장 (디버깅용)
      window.debugUserStore = {
        isLoggedIn: userStore.isLoggedIn,
        userId: userStore.userId,
        email: userStore.email
      };
      
      // 로그인 상태 저장 후 바로 리다이렉션
      console.log('로그인 완료, 메인 페이지로 이동합니다');
      router.replace('/');
    } else {
      console.error('토큰이 없습니다');
      error.value = '인증 토큰을 받지 못했습니다.';
      message.value = '로그인에 실패했습니다.';
      setTimeout(() => {
        router.replace('/login');
      }, 3000);
    }
  } catch (err) {
    console.error('❌ OAuth2 로그인 처리 실패:', err);
    error.value = err.response?.data?.message || err.message || '로그인 처리 중 오류가 발생했습니다.';
    message.value = '로그인에 실패했습니다.';
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    userStore.logout();
    
    setTimeout(() => {
      router.replace('/login');
    }, 3000);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="oauth-callback-container">
    <div class="oauth-callback-content">
      <div v-if="loading" class="loading-spinner">
        <div class="spinner"></div>
      </div>
      
      <div class="message-container">
        <h2 v-if="!error" class="success-message">{{ message }}</h2>
        <div v-if="error" class="error-container">
          <h2 class="error-message">{{ message }}</h2>
          <p class="error-detail">{{ error }}</p>
        </div>
      </div>
      
      <div v-if="!loading && !error" class="success-animation">
        ✅
      </div>
    </div>
  </div>
</template>

<style scoped>
.oauth-callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.oauth-callback-content {
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.loading-spinner {
  margin-bottom: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.message-container {
  margin: 20px 0;
}

.success-message {
  color: #28a745;
  font-size: 24px;
  margin: 0;
}

.error-container {
  color: #dc3545;
}

.error-message {
  font-size: 24px;
  margin: 0 0 10px 0;
}

.error-detail {
  font-size: 16px;
  margin: 0;
  opacity: 0.8;
}

.success-animation {
  font-size: 48px;
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 20%, 60%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(-5px);
  }
}
</style>
