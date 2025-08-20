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

// 임시로 초기 checkLogin 비활성화 - 각 페이지에서 필요시 개별 처리
// const userStore = useUserStore();
// userStore.checkLogin().then(() => {
//   app.mount('#app');
// }).catch(() => {
//   app.mount('#app');
// });

app.mount('#app');
