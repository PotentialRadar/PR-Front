// src/api/login.js
import api from './axios'; // ✅ axios가 아니라 api 임포트

export const loginByEmail = async ({ email, password }) => {
  try {
    const response = await api.post('/login', { email, password }); // ✅ 한 줄만
    console.log('🔥 로그인 성공 응답:', response.data);
    return response.data;
  } catch (error) {
    console.error('🔥 로그인 실패 error:', error);
    console.error('🔥 error.response:', error.response);
    throw error;
  }
};
