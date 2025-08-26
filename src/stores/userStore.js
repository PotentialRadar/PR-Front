import { defineStore } from 'pinia';
import { getUserProfile, logout as logoutApi } from '../api/user';
import api from '../api/axios';

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
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userTechStacks');
        localStorage.removeItem('projectFeedbacks');
        
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
        console.log('🔄 토큰이 있음 - 로그인 상태 설정 시작');
        this.isLoggedIn = true;
        this.accessToken = token;
        console.log('🔄 accessToken 설정 완료:', this.accessToken ? '있음' : '없음');
        console.log('🔄 isLoggedIn 설정 완료:', this.isLoggedIn);
        
        // 프로필 정보가 없으면 가져오기 (userId 조건 제거)
        if (!this.profile) {
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
              // 다른 에러의 경우에도 토큰이 있다면 로그인 상태 유지
              // 단, 토큰이 유효한지 확인할 수 없으므로 기본 상태만 설정
              console.log('⚠️ 프로필 조회 실패 - 토큰 유효성 불확실, 로그인 상태는 유지');
              this.isLoggedIn = true; // 토큰이 있으므로 로그인 상태 유지
              
              // 기본 사용자 정보만 설정 (토큰에서 추출 가능한 정보)
              try {
                const tokenPayload = JSON.parse(atob(this.accessToken.split('.')[1]));
                this.email = tokenPayload.sub || '';
                this.userId = tokenPayload.id || null;
              } catch (tokenError) {
                console.error('토큰 파싱 실패:', tokenError);
                // 토큰 파싱도 실패하면 로그아웃 처리
                this.clearUserData();
              }
            }
          }
        } else {
          console.log('✅ 프로필 있음 - fetchProfile 스킵');
        }
      } else {
        console.log('❌ 토큰이 없음 - 로그아웃 상태 설정');
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
    
    // 기술스택 정보를 별도로 조회하는 함수 추가
    async fetchTechStacks() {
      try {
        console.log('🔧 기술스택 조회 시작', {
          accessToken: this.accessToken ? '있음' : '없음',
          userId: this.userId
        });
        
        const response = await api.get('/user/tech-stacks');
        console.log('✅ 기술스택 조회 성공:', response.data);
        
        this.techStacks = response.data;
        return response.data;
      } catch (error) {
        console.error('❌ 기술스택 조회 실패:', error);
        console.error('상태 코드:', error.response?.status);
        console.error('응답 데이터:', error.response?.data);
        
        this.techStacks = [];
        return [];
      }
    },
  },
});
