import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import EmailLoginPage from '@/views/EmailLoginPage.vue';
import SignUpPage from '@/views/SignUpPage.vue';
import ProjectDetailPage from '@/views/ProjectDetailPage.vue';
import MyProjectListPage from '@/views/MyProjectListPage.vue';
import MyMessagesPage from '@/views/MyMessagesPage.vue';
import ProjectListPage from '@/views/ProjectListPage.vue';
import ProjectCreatePage from '@/views/ProjectCreatePage.vue';
import ProfileEditPage from '@/views/ProfileEditPage.vue';
import PortfolioPage from '@/views/PortfolioPage.vue';
import PortfolioUpdatePage from '@/views/PortfolioUpdatePage.vue';
import PortfolioListPage from '@/views/PortfolioListPage.vue';
import FavoritesPage from '@/views/FavoritesPage.vue';
import DashboardOverview from '@/views/DashboardOverview.vue';
import DashboardProjects from '@/views/DashboardProjects.vue';
import DashboardMessages from '@/views/DashboardMessages.vue';
import SiderDashBoardLayout from '../components/dashboard/SiderDashBoardLayout.vue';

// 새로운 대시보드 스타일 컴포넌트들
import MyPortfolioPage from '@/views/MyPortfolioPage.vue';
import ProjectManagePage from '@/views/ProjectManagePage.vue';

const routes = [
  {
    // 메인
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    // 로그인
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    // 이메일 로그인
    path: '/email-login',
    name: 'EmailLogin',
    component: EmailLoginPage,
  },
  {
    path: '/oauth/success',
    name: 'OAuthSuccess',
    component: () => import('@/views/OAuthSuccess.vue'),
  },
  {
    // 회원가입
    path: '/signUp',
    name: 'SignUp',
    component: SignUpPage,
  },
  {
    // 내 프로젝트 리스트 (기존 라우트 유지)
    path: '/my-projects',
    name: 'MyProjectList',
    component: MyProjectListPage,
  },
  {
    path: '/my-messages',
    name: 'MyMessages',
    component: MyMessagesPage,
  },
  {
    // 프로젝트 리스트
    path: '/projects',
    name: 'ProjectList',
    component: ProjectListPage,
  },
  {
    // 프로젝트 상세
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: ProjectDetailPage,
    props: true,
  },
  {
    // 프로젝트 생성
    path: '/new-project',
    name: 'ProjectCreate',
    component: ProjectCreatePage,
    meta: { requiresAuth: true }, // 프로젝트 생성은 인증 필요
  },
  {
    // 포트폴리오 리스트
    path: '/portfolios',
    name: 'PortfolioList',
    component: PortfolioListPage,
  },
  {
    // AI 추천 페이지
    path: '/ai-recommendations',
    name: 'AIRecommendations',
    component: () => import('@/views/AIRecommendationsPage.vue'),
  },

  // ===========================================
  // 대시보드 스타일 마이페이지 관련 라우트들
  // ===========================================
  {
    path: '/myPage',
    component: SiderDashBoardLayout,
    meta: { requiresAuth: true }, // 마이페이지는 인증 필요
    children: [
      {
        // 마이페이지 기본 페이지 (내 포트폴리오로 리다이렉트)
        path: '',
        redirect: '/myPage/portfolio',
      },
      {
        // 내 포트폴리오 (대시보드 스타일)
        path: 'portfolio',
        name: 'MyPortfolio',
        component: MyPortfolioPage,
        meta: { requiresAuth: true },
      },
      {
        // 좋아요 목록 (대시보드 스타일)
        path: 'favorites',
        name: 'MyFavorites',
        component: FavoritesPage,
        meta: { requiresAuth: true },
      },
      {
        // 포트폴리오 편집 (대시보드 스타일)
        path: 'edit-profile',
        name: 'ProfileEdit',
        component: ProfileEditPage,
        meta: { requiresAuth: true },
      },
      {
        // 포트폴리오 프로젝트 선택 페이지
        path: 'projects',
        name: 'PortfolioProjects',
        component: MyProjectListPage,
        meta: { requiresAuth: true },
      },
      {
        // 내 프로젝트 관리 (전체 목록)
        path: 'all-projects',
        name: 'MyProjects',
        component: () => import('@/views/MyProjectListPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        // 프로젝트 관리 상세 페이지
        path: 'projects/:projectId/manage',
        name: 'ProjectManage',
        component: ProjectManagePage,
        props: true,
        meta: { requiresAuth: true },
      },
      {
        // 프로젝트 수정 페이지
        path: 'projects/:projectId/edit',
        name: 'ProjectEdit',
        component: ProjectCreatePage, // Create page is reused for editing
        props: true,
        meta: { requiresAuth: true },
      },
      // {
      //   // 받은 메시지
      //   path: 'messages',
      //   name: 'MyMessages',
      //   component: () => import('@/views/MyMessagesPage.vue'),
      // },
      // {
      //   // 계정 설정
      //   path: 'settings',
      //   name: 'MySettings',
      //   component: () => import('@/views/MySettingsPage.vue'),
      // }
    ],
  },

  // ===========================================
  // 기존 개별 페이지 라우트들 (하위 호환성 유지)
  // ===========================================
  {
    // 유저 포트폴리오 (다른 사용자 포트폴리오 보기용)
    path: '/portfolio/:userId?',
    name: 'Portfolio',
    component: PortfolioPage,
    props: true,
  },
  {
    // 포트폴리오 수정 (개별 페이지로도 접근 가능)
    path: '/edit-portfolio',
    name: 'PortfolioUpdate',
    component: PortfolioUpdatePage,
    props: true,
  },
  {
    // 좋아요 목록 (개별 페이지로도 접근 가능)
    path: '/favorites',
    name: 'FavoritesPage',
    component: FavoritesPage,
  },

  // ===========================================
  // Dashboard Routes (관리자용 또는 추후 확장)
  // ===========================================
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardOverview,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/projects',
    name: 'DashboardProjects',
    component: DashboardProjects,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/dashboard/messages',
    name: 'DashboardMessages',
    component: DashboardMessages,
    meta: { requiresAuth: true, role: 'admin' }
  },
  // {
  //   path: '/dashboard/analytics',
  //   name: 'DashboardAnalytics',
  //   component: () => import('@/views/DashboardAnalytics.vue'),
  //   meta: { requiresAuth: true, role: 'admin' }
  // },
  // {
  //   path: '/dashboard/inquiries',
  //   name: 'DashboardInquiries',
  //   component: () => import('@/views/DashboardInquiries.vue'),
  //   meta: { requiresAuth: true, role: 'admin' }
  // },
  // {
  //   path: '/dashboard/proposals',
  //   name: 'DashboardProposals',
  //   component: () => import('@/views/DashboardProposals.vue'),
  //   meta: { requiresAuth: true, role: 'admin' }
  // },
  // {
  //   path: '/dashboard/reviews',
  //   name: 'DashboardReviews',
  //   component: () => import('@/views/DashboardReviews.vue'),
  //   meta: { requiresAuth: true, role: 'admin' }
  // },
  // {
  //   path: '/dashboard/profile',
  //   name: 'DashboardProfile',
  //   component: () => import('@/views/DashboardProfile.vue'),
  //   meta: { requiresAuth: true, role: 'admin' }
  // },
  // {
  //   path: '/dashboard/portfolio',
  //   name: 'DashboardPortfolio',
  //   component: () => import('@/views/DashboardPortfolio.vue'),
  //   meta: { requiresAuth: true, role: 'admin' }
  // },
  // {
  //   path: '/dashboard/settings',
  //   name: 'DashboardSettings',
  //   component: () => import('@/views/DashboardSettings.vue'),
  //   meta: { requiresAuth: true, role: 'admin' }
  // },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 저장된 스크롤 위치가 있으면 복원
    if (savedPosition) {
      return savedPosition;
    }
    
    // 해시가 있으면 해당 요소로 스크롤
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      };
    }
    
    // 일반적인 페이지 이동 시 최상단으로 스크롤
    return { top: 0 };
  },
});

// 라우터 가드 추가 (인증이 필요한 페이지 보호 및 로그인 페이지 리다이렉트 처리)
router.beforeEach(async (to, from, next) => {
  console.log('🔍 라우터 가드:', { to: to.path, from: from.path });
  
  // 인증이 필요한 페이지인지 확인
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  
  // 로그인/회원가입 페이지인지 확인 (이미 로그인된 사용자는 메인으로 리다이렉트)
  const authPages = ['/login', '/email-login', '/signUp'];
  const isAuthPage = authPages.includes(to.path);
  // 클라이언트 로그아웃 플래그: 로그아웃 직후 서버의 상태 지연을 무시하고 비인증으로 처리
  let clientLoggedOut = false;
  try { clientLoggedOut = sessionStorage.getItem('clientLoggedOut') === '1' } catch (_) {}
  
  // 인증 상태 확인 (OAuth Success 페이지는 제외)
  let isAuthenticated = false;
  if (to.path !== '/oauth/success') {
    if (clientLoggedOut) {
      isAuthenticated = false;
      console.log('🔍 인증 상태(클라 로그아웃 우선):', isAuthenticated);
    } else {
      isAuthenticated = await checkAuth();
      console.log('🔍 인증 상태:', isAuthenticated);
    }
  }
  
  // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우
  if (isAuthPage && isAuthenticated && !clientLoggedOut) {
    console.log('✅ 이미 로그인됨 - 메인 페이지로 리다이렉트');
    next('/');
    return;
  }
  // 클라 로그아웃 플래그가 있으면 인증 페이지 접근 허용하고 플래그 제거
  if (isAuthPage && clientLoggedOut) {
    try { sessionStorage.removeItem('clientLoggedOut') } catch (_) {}
  }
  
  // 인증이 필요한 페이지 접근 처리
  if (requiresAuth) {
    if (!isAuthenticated) {
      // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
      console.log('❌ 인증 필요 - 로그인 페이지로 리다이렉트');
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      return;
    }
    
    // 권한 확인 (admin 전용 페이지 등)
    if (to.meta.role && !await hasRole(to.meta.role)) {
      // 권한이 없는 사용자는 홈으로 리다이렉트
      console.log('❌ 권한 없음 - 메인 페이지로 리다이렉트');
      next('/');
      return;
    }
  }
  
  console.log('✅ 라우터 가드 통과');
  next();
});

// httpOnly 쿠키 방식 인증 확인 함수
async function checkAuth() {
  try {
    const response = await fetch('/api/auth/status', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });
    
    if (response.ok) {
      const authData = await response.json();
      return authData.authenticated;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 라우터 가드 인증 확인 실패:', error);
    return false;
  }
}

// 역할 확인 함수 (httpOnly 쿠키 방식)
async function hasRole(requiredRole) {
  try {
    const response = await fetch('/api/auth/status', {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });
    
    if (response.ok) {
      const authData = await response.json();
      // 실제로는 사용자의 역할 정보를 서버에서 받아와야 함
      // 현재는 admin 권한 체크만 구현되어 있지 않으므로 false 반환
      return false;
    }
    
    return false;
  } catch (error) {
    console.error('❌ 라우터 가드 권한 확인 실패:', error);
    return false;
  }
}

export default router;
