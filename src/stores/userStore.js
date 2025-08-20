import { defineStore } from 'pinia';
import { getUserProfile, logout as logoutApi } from '../api/user';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    email: '',
    userId: null,
    nickname: null,
    profile: null,
    accessToken: null,
  }),
  actions: {
    login({ email, userId, accessToken, refreshToken }) {
      this.isLoggedIn = true;
      this.email = email;
      this.userId = userId;
      this.accessToken = accessToken;
      
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      console.log('로그인 성공!', { userId, email });
    },
    
    async logout() {
      try {
        await logoutApi();
      } catch (error) {
        console.error('로그아웃 API 호출 실패:', error);
      } finally {
        this.isLoggedIn = false;
        this.email = '';
        this.userId = null;
        this.nickname = null;
        this.profile = null;
        this.accessToken = null;
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // 메인페이지로 리다이렉트
        window.location.href = '/';
      }
    },
    async checkLogin() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.isLoggedIn = true;
        this.accessToken = token;
        
        // 프로필 정보가 없으면 가져오기
        if (!this.profile) {
          try {
            await this.fetchProfile();
          } catch (error) {
            console.error('로그인 체크 중 프로필 조회 실패:', error);
            // 프로필 조회 실패시 로그아웃 처리
            this.logout();
          }
        }
      } else {
        this.isLoggedIn = false;
        this.accessToken = null;
      }
    },
    
    async fetchProfile() {
      try {
        const response = await getUserProfile();
        this.profile = response.data;
        this.email = response.data.email;
        this.userId = response.data.userId;
        this.nickname = response.data.nickname;
        return response.data;
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        throw error;
      }
    },
    
    updateProfile(profileData) {
      if (this.profile) {
        this.profile = { ...this.profile, ...profileData };
        if (profileData.nickname) {
          this.nickname = profileData.nickname;
        }
      }
    },
  },
});
