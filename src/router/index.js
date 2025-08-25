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
import PortfolioProjectsPage from '@/views/PortfolioProjectsPage.vue';

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
    component: () => import('@/views/OAuth2Succcess.vue'),
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
  },
  {
    // 포트폴리오 리스트
    path: '/portfolios',
    name: 'PortfolioList',
    component: PortfolioListPage,
  },

  // ===========================================
  // 대시보드 스타일 마이페이지 관련 라우트들
  // ===========================================
  {
    path: '/myPage',
    component: SiderDashBoardLayout,
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
      },
      {
        // 좋아요 목록 (대시보드 스타일)
        path: 'favorites',
        name: 'MyFavorites',
        component: FavoritesPage,
      },
      {
        // 포트폴리오 편집 (대시보드 스타일)
        path: 'edit-profile',
        name: 'ProfileEdit',
        component: ProfileEditPage,
      },
      {
        // 포트폴리오 프로젝트 선택 페이지
        path: 'projects',
        name: 'PortfolioProjects',
        component: PortfolioProjectsPage,
      },
      {
        // 내 프로젝트 관리 (전체 목록)
        path: 'all-projects',
        name: 'MyProjects',
        component: () => import('@/views/MyProjectListPage.vue'),
      },
      {
        // 프로젝트 관리 상세 페이지
        path: 'projects/:projectId/manage',
        name: 'ProjectManage',
        component: ProjectManagePage,
        props: true,
      },
      {
        // 프로젝트 수정 페이지
        path: 'projects/:projectId/edit',
        name: 'ProjectEdit',
        component: ProjectCreatePage, // Create page is reused for editing
        props: true,
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

// 라우터 가드 추가 (인증이 필요한 페이지 보호)
router.beforeEach((to, from, next) => {
  // 인증이 필요한 페이지인지 확인
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isAuthenticated = checkAuth(); // 실제 인증 확인 함수
  
  if (requiresAuth && !isAuthenticated) {
    // 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else if (to.meta.role && !hasRole(to.meta.role)) {
    // 권한이 없는 사용자는 홈으로 리다이렉트
    next('/');
  } else {
    next();
  }
});

// 인증 확인 함수 (실제 구현 필요)
function checkAuth() {
  // 실제로는 토큰 검증, 세션 확인 등을 수행
  // 저장 키를 전역에서 사용하는 'accessToken'으로 통일
  const token = localStorage.getItem('accessToken');
  return !!token;
}

// 역할 확인 함수 (실제 구현 필요)
function hasRole(requiredRole) {
  // 실제로는 사용자의 역할을 확인
  const userRole = localStorage.getItem('userRole');
  return userRole === requiredRole;
}

export default router;
