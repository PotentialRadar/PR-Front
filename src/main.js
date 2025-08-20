import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

import './style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import { useUserStore } from './stores/userStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Toast);

// 앱 시작시 로그인 상태 확인
const userStore = useUserStore();
userStore.checkLogin().then(() => {
  app.mount('#app');
}).catch(() => {
  app.mount('#app');
});
