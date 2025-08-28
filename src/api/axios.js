// src/api/axios.js
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

// 개발 환경에서는 Vite proxy(`/api` -> 백엔드) 사용을 위해 상대 경로 사용
// 프로덕션에서는 환경변수로 주입된 절대 경로를 사용할 수 있음
const api = axios.create({
  baseURL: import.meta.env.PROD
    ? `http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}/api`
    : '/api',
  timeout: 15000,
  // httpOnly 쿠키를 자동으로 포함하도록 설정
  withCredentials: true,
});

api.interceptors.request.use(
  config => {
    // FormData면 Content-Type 지움(브라우저가 boundary 포함해 자동 설정)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
    // 그 외(일반 객체 등)는 axios가 자동 설정하므로 건드릴 필요 없음

    // httpOnly 쿠키 방식에서는 Authorization 헤더를 수동으로 설정하지 않음
    // 브라우저가 자동으로 쿠키를 포함해서 전송함
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 에러 발생 시 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 백엔드의 /api/token 엔드포인트로 토큰 갱신 요청
        // refresh_token 쿠키는 자동으로 포함됨 (withCredentials: true)
        const response = await api.post('/token');
        
        // 새로운 access_token은 응답 쿠키로 자동 설정됨
        console.log('✅ 토큰 갱신 성공:', response.data.message);
        
        // 원래 요청을 다시 시도
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 실패:', refreshError);
        // 토큰 갱신 실패 시 프론트 상태 정리 후 로그인 페이지로 이동
        try {
          const userStore = useUserStore();
          userStore.clearUserData();
        } catch (e) {
          // Pinia 미초기화 등 예외는 무시
          console.warn('Pinia store 접근 실패(무시 가능):', e?.message || e);
        }
        // httpOnly 쿠키는 서버에서 만료 처리됨
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
