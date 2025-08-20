// src/api/login.js
import api from './axios';

export const loginByEmail = async ({ email, password }) => {
  try {
    const response = await api.post('/login', { email, password });
    
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
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
