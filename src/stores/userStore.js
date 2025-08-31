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
    // httpOnly 쿠키 방식에서는 프론트엔드에서 토큰을 직접 관리하지 않음
    techStacks: [], // 사용자 기술스택 정보 추가
    isLoggingOut: false, // 로그아웃 진행 중 플래그
  }),
  actions: {
    // httpOnly 쿠키 방식에서는 토큰을 매개변수로 받지 않음
    login({ email, userId }) {
      this.isLoggedIn = true;
      this.email = email;
      this.userId = userId;
      
      // httpOnly 쿠키 방식에서는 localStorage에 토큰을 저장하지 않음
      // 토큰은 브라우저가 자동으로 쿠키를 통해 관리함
      
      console.log('로그인 성공!', { userId, email });
    },
    
    // 사용자 데이터만 정리하는 메서드 (페이지 이동 없음)
    clearUserData() {
      this.isLoggedIn = false;
      this.email = '';
      this.userId = null;
      this.nickname = null;
      this.profile = null;
      this.techStacks = [];
      
      // 클라이언트 로그아웃 플래그 설정 (axios interceptor에서 토큰 갱신 시도 방지)
      try {
        sessionStorage.setItem('clientLoggedOut', '1');
      } catch (_) {
        console.warn('sessionStorage 접근 실패');
      }
      
      // httpOnly 쿠키는 브라우저에서 직접 삭제할 수 없음
      // 서버에서 logout API를 통해 쿠키를 만료시켜야 함
    },

    // 실제 로그아웃 API 호출 (페이지 리다이렉트 없음)
    async logout() {
      console.log('🚪 logout() 호출됨 - 호출 스택:', new Error().stack);
      
      // 로그아웃 진행 중 플래그 설정
      this.isLoggingOut = true;
      
      try {
        console.log('📡 로그아웃 API 호출 시작');
        const response = await logoutApi();
        console.log('📡 로그아웃 API 응답:', response);
        
        // 로그아웃 성공 후 잠깐 대기 (쿠키 삭제가 완료되도록)
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error('❌ 로그아웃 API 호출 실패:', error);
        console.error('❌ 에러 상세:', error.response?.data || error.message);
      } finally {
        this.clearUserData();
        this.isLoggingOut = false; // 로그아웃 완료
        console.log('✅ 로그아웃 상태 정리 완료');
        
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
      
      // 로그아웃 진행 중이면 checkLogin을 실행하지 않음
      if (this.isLoggingOut) {
        console.log('🚪 로그아웃 진행 중 - checkLogin 스킵');
        return;
      }
      
      // httpOnly 쿠키 방식에서는 새로운 /api/auth/status API를 사용하여 인증 상태 확인
      try {
        const response = await fetch('/api/auth/status', {
          method: 'GET',
          credentials: 'include', // 쿠키 포함
        });
        
        if (response.ok) {
          const authData = await response.json();
          console.log('🔍 인증 상태 응답:', authData);
          
          // 로그아웃 진행 중이면 서버 응답 무시
          if (this.isLoggingOut) {
            console.log('🚪 로그아웃 진행 중 - 서버 응답 무시');
            return;
          }
          
      if (authData.authenticated) {
        // 서버에서 인증됨 - 사용자 정보 설정
        this.isLoggedIn = true;
        this.userId = authData.userId;
        this.email = authData.email;
        this.nickname = authData.nickname;

        // 클라이언트 로그아웃 플래그가 남아있다면 제거하여 라우터 가드 오작동 방지
        try {
          sessionStorage.removeItem('clientLoggedOut');
        } catch (_) {
          console.warn('sessionStorage 접근 실패');
        }
            
            // 프로필 정보가 없으면 추가로 가져오기
            if (!this.profile) {
              try {
                await this.fetchProfile();
              } catch (profileError) {
                console.warn('⚠️ 프로필 정보 로딩 실패 (인증은 성공):', profileError);
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
            
            console.log('✅ 인증 성공:', { userId: this.userId, email: this.email });
          } else {
            // 서버에서 인증 실패 - 로그아웃 상태로 설정
            console.log('❌ 인증되지 않음');
            this.clearUserData();
          }
        } else {
          // API 호출 실패
          console.error('❌ 인증 상태 확인 API 호출 실패:', response.status);
          this.clearUserData();
        }
      } catch (error) {
        console.error('❌ 인증 상태 확인 중 오류:', error);
        this.clearUserData();
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
        console.log('🔍 fetchProfile 호출 - httpOnly 쿠키를 통한 인증 시도');
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
