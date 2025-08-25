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
    
    // 사용자 데이터만 정리하는 메서드 (페이지 이동 없음)
    clearUserData() {
      this.isLoggedIn = false;
      this.email = '';
      this.userId = null;
      this.nickname = null;
      this.profile = null;
      this.accessToken = null;
      this.techStacks = [];
      
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },

    // 실제 로그아웃 API 호출 및 리다이렉트
    async logout() {
      console.log('🚪 logout() 호출됨 - 호출 스택:', new Error().stack);
      try {
        await logoutApi();
      } catch (error) {
        console.error('로그아웃 API 호출 실패:', error);
      } finally {
        this.clearUserData();
        
        // 라우터가 없는 경우에만 강제 이동
        if (typeof window !== 'undefined') {
          // SPA 환경에서는 라우터 사용을 권장하지만, 
          // 완전한 상태 초기화를 위해 페이지 새로고침
          window.location.href = '/';
        }
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
            
            // 401 에러(토큰 만료)인 경우만 로그아웃 처리
            if (error.response?.status === 401) {
              console.log('❌ 토큰 만료로 인한 로그아웃');
              this.clearUserData();
            } else {
              // 다른 에러는 토큰은 유지하되 로그인 상태만 false로 설정
              console.log('⚠️ 프로필 조회 실패 - 토큰은 유지하고 로그인 상태만 false로 변경');
              this.isLoggedIn = false;
            }
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
