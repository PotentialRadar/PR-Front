import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import ContactPage from '@/views/ContactPage.vue';
import ProjectDetailPage from '@/views/ProjectDetailPage.vue';
import ProjectListPage from '@/views/ProjectListPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/projects',
    name: 'ProjectList',
    component: ProjectListPage,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
  },
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: ProjectDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
