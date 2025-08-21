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
    techStacks: [], // 사용자 기술스택 정보 추가
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
      console.log('🚪 logout() 호출됨 - 호출 스택:', new Error().stack);
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
        this.techStacks = [];
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // 메인페이지로 리다이렉트
        window.location.href = '/';
      }
    },
    async checkLogin() {
      console.log('🔍 checkLogin() 호출됨 - 호출 스택:', new Error().stack.split('\n')[1]);
      const token = localStorage.getItem('accessToken');
      console.log('🔑 localStorage 전체:', localStorage);
      console.log('🔑 토큰 확인:', token, 'userId:', this.userId, 'profile:', !!this.profile);
      console.log('🔑 현재 this.accessToken:', this.accessToken);
      
      if (token) {
        this.isLoggedIn = true;
        this.accessToken = token;
        
        // 프로필 정보가 없고, 사용자 정보(userId)도 없으면 가져오기
        if (!this.profile && !this.userId) {
          console.log('📋 프로필 정보 없음 - fetchProfile 호출');
          try {
            await this.fetchProfile();
          } catch (error) {
            console.error('로그인 체크 중 프로필 조회 실패:', error);
            console.error('프로필 조회 실패 상세:', error.response?.data || error.message);
            // 프로필 조회 실패시 로그아웃 처리
            console.log('❌ 프로필 조회 실패로 logout 호출');
            this.logout();
          }
        } else {
          console.log('✅ 프로필 또는 userId 있음 - fetchProfile 스킵');
        }
      } else {
        this.isLoggedIn = false;
        this.accessToken = null;
      }
    },
    
    async fetchProfile() {
      try {
        console.log('🔍 fetchProfile 호출 - 현재 토큰:', this.accessToken);
        const response = await getUserProfile();
        console.log('✅ fetchProfile 성공:', response.data);
        
        this.profile = response.data;
        this.email = response.data.email;
        this.userId = response.data.userId || response.data.id;
        this.nickname = response.data.nickname;
        // 기술스택 정보도 저장 (API 응답에 있다면)
        if (response.data.techStacks) {
          this.techStacks = response.data.techStacks;
        }
        return response.data;
      } catch (error) {
        console.error('❌ fetchProfile 실패:', error);
        console.error('상태 코드:', error.response?.status);
        console.error('응답 데이터:', error.response?.data);
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
