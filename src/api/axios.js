// src/api/axios.js
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';

// 개발 환경에서는 Vite proxy(`/api` -> 백엔드) 사용을 위해 상대 경로 사용
// 프로덕션에서는 환경변수로 주입된 절대 경로를 사용할 수 있음
const resolvedBaseURL = (() => {
  // 우선순위: VITE_API_BASE_URL 설정 시 => `${VITE_API_BASE_URL}/api`
  // 아니면 동일 오리진 프록시(`/api`) 사용
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (apiBase && typeof apiBase === 'string' && apiBase.trim()) {
    return `${apiBase.replace(/\/$/, '')}/api`;
  }
  return '/api';
})();

const api = axios.create({
  baseURL: resolvedBaseURL,
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

// 토큰 갱신 중복 방지를 위한 플래그
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // 401 에러 발생 시 토큰 갱신 시도
    if (error.response?.status === 401 && !originalRequest._retry) {
      // 인증 관련 엔드포인트에서는 갱신/리다이렉트 시도 금지 (화면이 에러를 처리하도록)
      const url = originalRequest.url || '';
      const isAuthFlowRequest = (
        url.includes('/login') ||
        url.includes('/signup') ||
        url.includes('/user/send-code') ||
        url.includes('/user/verify-code')
      );
      if (isAuthFlowRequest) {
        return Promise.reject(error);
      }
      
      // 클라이언트 로그아웃 플래그 확인
      let clientLoggedOut = false;
      try { 
        clientLoggedOut = sessionStorage.getItem('clientLoggedOut') === '1';
      } catch (_) {}
      
      if (clientLoggedOut) {
        console.log('🔒 클라이언트 로그아웃 상태 - 토큰 갱신 건너뜀');
        return Promise.reject(error);
      }

      // 토큰 갱신 API 자체의 401 에러는 갱신 시도하지 않음
      if (originalRequest.url?.includes('/token')) {
        console.log('🔑 토큰 갱신 API 자체 실패 - 로그인 페이지로 이동');
        try {
          const userStore = useUserStore();
          userStore.clearUserData();
        } catch (e) {
          console.warn('Pinia store 접근 실패(무시 가능):', e?.message || e);
        }
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 큐에 추가
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // fetch를 직접 사용해서 interceptor 무한루프 방지
        const response = await fetch('/api/token', {
          method: 'POST',
          credentials: 'include',
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ 토큰 갱신 성공:', data.message);
          
          processQueue(null);
          isRefreshing = false;
          
          // 원래 요청을 다시 시도
          return api(originalRequest);
        } else {
          throw new Error(`토큰 갱신 실패: ${response.status}`);
        }
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 실패:', refreshError);
        
        processQueue(refreshError);
        isRefreshing = false;
        
        // 토큰 갱신 실패 시 프론트 상태 정리 후 로그인 페이지로 이동
        try {
          const userStore = useUserStore();
          userStore.clearUserData();
        } catch (e) {
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
