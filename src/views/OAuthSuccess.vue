<!-- src/views/OAuthSuccess.vue -->
<template>
  <div class="success-page">
    <h2>✅ 로그인 성공</h2>
    <p>잠시 후 메인 페이지로 이동합니다...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 서버에서 받은 HttpOnly 쿠키는 JS에서 안 보임 → 보안상 맞음
  // 하지만 쿠키로 인증된 상태이므로, 바로 홈으로 이동시킬 수 있음

  setTimeout(() => {
    router.push('/');
  }, 2000);
});
</script>

<style scoped>
.success-page {
  text-align: center;
  margin-top: 100px;
}
</style>
