// src/api/axios.js
import axios from 'axios';

// 개발 환경에서는 Vite proxy(`/api` -> 백엔드) 사용을 위해 상대 경로 사용
// 프로덕션에서는 환경변수로 주입된 절대 경로를 사용할 수 있음
const api = axios.create({
  baseURL: import.meta.env.PROD
    ? `http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}/api`
    : '/api',
  timeout: 15000,
});

api.interceptors.request.use(
  config => {
    // FormData면 Content-Type 지움(브라우저가 boundary 포함해 자동 설정)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      delete config.headers['content-type'];
    }
    // 그 외(일반 객체 등)는 axios가 자동 설정하므로 건드릴 필요 없음

    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post(
            `http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}/api/auth/refresh`,
            { refreshToken }
          );

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      } else {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
