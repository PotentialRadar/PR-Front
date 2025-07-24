import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
<<<<<<< HEAD
import LoginPage from '@/views/LoginPage.vue';
import SignUpPage from '@/views/SignUpPage.vue';
=======
import ContactPage from '@/views/ContactPage.vue';
import ProjectDetailPage from '@/views/ProjectDetailPage.vue';
import ProjectListPage from '@/views/ProjectListPage.vue';
>>>>>>> fd4b635d31e010595a9cb4ebed8ccbc972f45b6e

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
<<<<<<< HEAD
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,
  },

=======
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
>>>>>>> fd4b635d31e010595a9cb4ebed8ccbc972f45b6e
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
