import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    email: '', // 사용자 이메일 등 저장 가능
    userId: null,
    accessToken: null,
  }),
  actions: {
    login({ email, userId, accessToken }) {
      this.isLoggedIn = true;
      this.email = email;
      this.userId = userId;
      this.accessToken = accessToken;
      console.log('로그인 성공!', { userId, email, accessToken });
    },
    logout() {
      this.isLoggedIn = false;
      this.email = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    checkLogin() {
      // 실제 토큰 확인 로직 활성화
      const token = localStorage.getItem('accessToken');
      this.isLoggedIn = !!token;
    },
  },
});
