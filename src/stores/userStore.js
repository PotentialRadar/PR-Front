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
    techStacks: [],
    isLoggingOut: false,
    isAuthChecked: false,
  }),
  actions: {
    login({ email, userId }) {
      this.isLoggedIn = true;
      this.email = email;
      this.userId = userId;
      
      console.log('로그인 성공!', { userId, email });
    },
    
    clearUserData() {
      this.isLoggedIn = false;
      this.email = '';
      this.userId = null;
      this.nickname = null;
      this.profile = null;
      this.techStacks = [];
      this.isAuthChecked = true; // 인증 확인은 완료된 상태로 설정
      
      try {
        sessionStorage.setItem('clientLoggedOut', '1');
      } catch (_) {
        console.warn('sessionStorage 접근 실패');
      }
    },

    async logout() {
      console.log('🚪 logout() 호출됨 - 호출 스택:', new Error().stack);
      
      this.isLoggingOut = true;
      
      try {
        console.log('📡 로그아웃 API 호출 시작');
        const response = await logoutApi();
        console.log('📡 로그아웃 API 응답:', response);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('❌ 로그아웃 API 호출 실패:', error);
        console.error('❌ 에러 상세:', error.response?.data || error.message);
      } finally {
        this.clearUserData();
        this.isLoggingOut = false;
        console.log('✅ 로그아웃 상태 정리 완료');
        
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userTechStacks');
        localStorage.removeItem('projectFeedbacks');
        
        window.location.href = '/';
      }
    },

    async checkLogin() {
      console.log('🔍 checkLogin() 호출됨 - 호출 스택:', new Error().stack.split('\n')[1]);
      
      if (this.isLoggingOut) {
        console.log('🚪 로그아웃 진행 중 - checkLogin 스킵');
        return;
      }
      
      try {
        console.log('📡 /api/auth/status API 호출 시작');
        const response = await api.get('/auth/status');
        console.log('📡 /api/auth/status API 응답:', response);
        
        if (response.status === 200) {
          const authData = response.data;
          console.log('🔍 인증 상태 응답:', authData);
          
          if (this.isLoggingOut) {
            console.log('🚪 로그아웃 진행 중 - 서버 응답 무시');
            return;
          }
          
          if (authData.authenticated) {
            this.isLoggedIn = true;
            this.userId = authData.userId;
            this.email = authData.email;
            this.nickname = authData.nickname;
            this.isAuthChecked = true; // 인증 확인 완료

            try {
              sessionStorage.removeItem('clientLoggedOut');
            } catch (_) {
              console.warn('sessionStorage 접근 실패');
            }
            
            if (!this.profile) {
              try {
                await this.fetchProfile();
              } catch (profileError) {
                console.warn('⚠️ 프로필 정보 로딩 실패 (인증은 성공):', profileError);
              }
            }
            
            console.log('✅ 인증 성공:', { userId: this.userId, email: this.email });
          } else {
            console.log('❌ 인증되지 않음');
            this.clearUserData();
          }
        } else {
          console.error('❌ 인증 상태 확인 API 응답 상태 이상:', response.status);
          this.clearUserData();
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 중 오류:', error);
        this.clearUserData();
      } finally {
        this.isAuthChecked = true; // 성공/실패 상관없이 확인 완료 표시
      }
    },
    
    async fetchProfile() {
      try {
        console.log('🔍 fetchProfile 호출 - httpOnly 쿠키를 통한 인증 시도');
        const response = await getUserProfile();
        console.log('✅ fetchProfile 성공:', response.data);
        
        this.profile = response.data;
        this.email = response.data.email;
        this.userId = response.data.userId || response.data.id;
        this.nickname = response.data.nickname;
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