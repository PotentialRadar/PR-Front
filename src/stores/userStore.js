import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    email: '', // 사용자 이메일 등 저장 가능
  }),
  actions: {
    login(email) {
      this.isLoggedIn = true;
      this.email = email;
    },
    logout() {
      this.isLoggedIn = false;
      this.email = '';
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    checkLogin() {
      const token = localStorage.getItem('accessToken');
      this.isLoggedIn = !!token;
    },
  },
});
