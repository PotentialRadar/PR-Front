// src/api/login.js
import api from './axios';

export const loginByEmail = async ({ email, password }) => {
  try {
    const response = await api.post('/login', { email, password });
    
    // httpOnly 쿠키 방식에서는 토큰이 response.data에 포함되지 않음
    // 서버가 자동으로 쿠키에 토큰을 설정하므로 localStorage 저장 불필요
    
    console.log('로그인 성공');
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('에러 상세:', error.response);
    }
    throw error;
  }
};
