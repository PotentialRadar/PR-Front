import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import EmailLoginPage from '@/views/EmailLoginPage.vue';
import SignUpPage from '@/views/SignUpPage.vue';
import ProjectDetailPage from '@/views/ProjectDetailPage.vue';
import ProjectListPage from '@/views/ProjectListPage.vue';
import ProjectCreatePage from '@/views/ProjectCreatePage.vue';
import PortfolioPage from '@/views/PortfolioPage.vue';
import PortfolioUpdatePage from '@/views/PortfolioUpdatePage.vue';
import PortfolioListPage from '@/views/PortfolioListPage.vue';
import FavoritesPage from '@/views/FavoritesPage.vue';
import DashboardOverview from '@/views/DashboardOverview.vue';
import DashboardProjects from '@/views/DashboardProjects.vue';
import DashboardMessages from '@/views/DashboardMessages.vue';

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
  },
  {
    // 프로젝트 생성
    path: '/new-project',
    name: 'ProjectCreate',
    component: ProjectCreatePage,
  },
  {
    // 유저 포트폴리오
    path: '/portfolio/:userId?',
    name: 'Portfolio',
    component: PortfolioPage,
    props: true,
  },
  {
    // 포트폴리오 수정
    path: '/edit-portfolio',
    name: 'PortfolioUpdate',
    component: PortfolioUpdatePage,
    props: true,
  },
  {
    // 포트폴리오 리스트
    path: '/portfolios',
    name: 'PortfolioList',
    component: PortfolioListPage,
  },
  {
    // 좋아요 목록
    path: '/favorites',
    name: 'FavoritesPage',
    component: FavoritesPage,
  },

  // Dashboard Routes(나중에 사용)
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardOverview,
  },
  {
    path: '/dashboard/projects',
    name: 'DashboardProjects',
    component: DashboardProjects,
  },
  {
    path: '/dashboard/messages',
    name: 'DashboardMessages',
    component: DashboardMessages,
  },
  {
    path: '/dashboard/analytics',
    name: 'DashboardAnalytics',
    component: () => import('@/views/DashboardOverview.vue'), // Placeholder
  },
  {
    path: '/dashboard/inquiries',
    name: 'DashboardInquiries',
    component: () => import('@/views/DashboardProjects.vue'), // Placeholder
  },
  {
    path: '/dashboard/proposals',
    name: 'DashboardProposals',
    component: () => import('@/views/DashboardProjects.vue'), // Placeholder
  },
  {
    path: '/dashboard/reviews',
    name: 'DashboardReviews',
    component: () => import('@/views/DashboardOverview.vue'), // Placeholder
  },
  {
    path: '/dashboard/profile',
    name: 'DashboardProfile',
    component: () => import('@/views/DashboardOverview.vue'), // Placeholder
  },
  {
    path: '/dashboard/portfolio',
    name: 'DashboardPortfolio',
    component: () => import('@/views/DashboardOverview.vue'), // Placeholder
  },
  {
    path: '/dashboard/settings',
    name: 'DashboardSettings',
    component: () => import('@/views/DashboardOverview.vue'), // Placeholder
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 페이지 이동 시 항상 최상단으로 스크롤
    return { top: 0 };
  },
});

export default router;
