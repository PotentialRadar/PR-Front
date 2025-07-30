// src/api/login.js
import api from './axios'; // ✅ axios가 아니라 api 임포트

export const loginByEmail = async ({ email, password }) => {
  try {
    const response = await api.post('/login', { email, password }); // ✅ 한 줄만
    console.log('로그인 성공');
    return response.data;
  } catch (error) {
    console.error('로그인 실패:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error('에러 상세:', error.response);
    }
  }
};
