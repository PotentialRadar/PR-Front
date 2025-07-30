import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false);
  const accessToken = ref('');
  const userInfo = ref(null);

  const login = (token, info) => {
    isLoggedIn.value = true;
    accessToken.value = token;
    userInfo.value = info;
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    isLoggedIn.value = false;
    accessToken.value = '';
    userInfo.value = null;
    localStorage.removeItem('accessToken');
  };

  return { isLoggedIn, accessToken, userInfo, login, logout };
});
