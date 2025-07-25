import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import LoginPage from '@/views/LoginPage.vue';
import SignUpPage from '@/views/SignUpPage.vue';
import ContactPage from '@/views/ContactPage.vue';
import ProjectDetailPage from '@/views/ProjectDetailPage.vue';
import ProjectListPage from '@/views/ProjectListPage.vue';
import ProjectCreatePage from '@/views/ProjectCreatePage.vue';
import DashboardOverview from '@/views/DashboardOverview.vue';
import DashboardProjects from '@/views/DashboardProjects.vue';
import DashboardMessages from '@/views/DashboardMessages.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUpPage,
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: ProjectListPage,
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetailPage,
  },
  {
    path: '/new-project',
    name: 'ProjectCreate',
    component: ProjectCreatePage,
  },
  // Dashboard Routes
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
});

export default router;
