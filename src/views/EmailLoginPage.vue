<template>
  <section class="login-page">
    <div class="login-section">
      <div class="section-container">
        <div class="main-container">
          <div class="heading-primary">
            <h1 class="main-title">이메일로 로그인</h1>

            <form @submit.prevent="handleEmailLogin">
              <div class="form-container">
                <div class="input-group">
                  <label class="input-label">이메일</label>
                  <input
                    v-model="email"
                    type="email"
                    class="form-input"
                    placeholder="이메일을 입력해주세요"
                    required
                  />
                </div>

                <div class="input-group">
                  <label class="input-label">비밀번호</label>
                  <div class="password-wrapper">
                    <input
                      v-model="password"
                      :type="showPassword ? 'text' : 'password'"
                      class="form-input"
                      placeholder="비밀번호를 입력해주세요"
                      required
                    />
                  </div>
                </div>

                <button
                  class="login-button"
                  type="submit"
                  :disabled="!canSubmit"
                  :class="{ active: canSubmit }"
                >
                  <span class="button-text">로그인</span>
                </button>
              </div>

              <div class="auth-links">
                <router-link to="/reset-password" class="auth-link"
                  >비밀번호 재설정</router-link
                >
                <span class="link-divider">|</span>
                <router-link to="/signup" class="auth-link"
                  >회원가입</router-link
                >
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast 알림 -->
    <div v-if="showToast" :class="['toast', `toast-${toastType}`]">
      <div class="toast-content">
        <div class="toast-icon">
          <i v-if="toastType === 'error'" class="bi bi-exclamation-circle"></i>
          <i v-if="toastType === 'success'" class="bi bi-check-circle"></i>
          <i v-if="toastType === 'warning'" class="bi bi-exclamation-triangle"></i>
          <i v-if="toastType === 'info'" class="bi bi-info-circle"></i>
        </div>
        <span class="toast-message">{{ toastMessage }}</span>
        <button @click="showToast = false" class="toast-close">
          <i class="bi bi-x"></i>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { loginByEmail } from "../api/login";

// Toast 알림 상태
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('error'); // 'success', 'error', 'warning', 'info'

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const router = useRouter();
const userStore = useUserStore();

const canSubmit = computed(() => email.value && password.value);

// Toast 메시지 표시 함수들
const showErrorToast = (message) => {
  toastMessage.value = message;
  toastType.value = 'error';
  showToast.value = true;
  
  // 3초 후 자동 숨김
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const showSuccessToast = (message) => {
  toastMessage.value = message;
  toastType.value = 'success';
  showToast.value = true;
  
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// 이메일 로그인 처리
const handleEmailLogin = async () => {
  try {
    await loginByEmail({
      email: email.value,
      password: password.value,
    });

    // 로그아웃 플래그 제거(가드/헤더에 즉시 반영)
    try { sessionStorage.removeItem('clientLoggedOut') } catch (_) {}

    // 서버 인증 상태로 확정(쿠키 기반)
    await userStore.checkLogin();

    // 프로필은 선택적으로 로드(실패해도 로그인 상태 유지)
    try {
      await userStore.fetchProfile();
    } catch (e) {
      console.warn('프로필 로드 실패(무시 가능):', e?.response?.status || e?.message || e);
    }

    console.log("로그인 성공!", {
      userId: userStore.userId,
      email: userStore.email,
    });
    router.push("/");
  } catch (error) {
    console.error("로그인 실패:", error);
    
    // 백엔드에서 온 구체적인 에러 메시지 추출
    const errorMessage = error?.response?.data?.message || error?.message || "서버 오류가 발생했습니다";
    
    showErrorToast(errorMessage);
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80vh;
  margin: auto 0;
  flex-shrink: 0;
  background-color: #ffffff;
}

.login-section {
  display: flex;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  align-items: center;
}

.section-container {
  width: 100%;
  max-width: 400px;
  background-color: #ffffff;
}

.main-container {
  margin-top: 56px;
  scrollbar-width: none;
}

.heading-primary {
  text-align: center;
  margin-top: -37px;
}

.main-title {
  margin-bottom: 80px;
  line-height: 135.8%;
}

.sub-title {
  margin-bottom: 60px;
}

form {
  display: block;
  margin-top: 0em;
  unicode-bidi: isolate;
}

.form-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto 16px auto;
  max-width: 360px;
  justify-content: center;
  gap: 16px;
}

.input-group {
  position: relative;
}

.input-label {
  display: block;
  font-size: 14px;
  font-weight: 400;
  color: #999;
  margin-bottom: 8px;
  text-align: left;
}

.form-input {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--color-grey-89);
  padding: 16px 20px;
  font-size: 16px;
  background-color: #ffffff;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-input::placeholder {
  color: #c7c8c9;
  opacity: 1;
}

.form-input::-webkit-input-placeholder {
  color: #c7c8c9;
}

.form-input::-moz-placeholder {
  color: #c7c8c9;
  opacity: 1;
}

.form-input:-ms-input-placeholder {
  color: #c7c8c9;
}

.password-wrapper {
  position: relative;
  width: 100%;
}

.toggle-password {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
  user-select: none;
}

.login-button {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--color-grey-89);
  cursor: not-allowed;
  padding: 16px 24px;
  background: var(--color-grey-95);
  transition: all 0.2s ease;
}

.login-button.active {
  background-color: #4caf50;
  border-color: #4caf50;
  cursor: pointer;
}

/* .login-button.active:hover {
  background: #e8f5e8;
  color: #4CAF50;
  border-color: #4CAF50;
} */

.button-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-grey-33);
}

.login-button.active .button-text {
  color: #ffffff;
}

.auth-links {
  display: flex;
  justify-content: center;
  padding-right: 20px;
}

.auth-link {
  color: rgba(55, 56, 60, 0.61);
  text-align: center;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  cursor: pointer;
  text-decoration: none;
}

.auth-link:hover {
  color: var(--color-black-solid);
}

.link-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(55, 56, 60, 0.61);
  margin-top: 30px;
  padding: 0 25px 0 20px;
}

/* Toast 알림 스타일 */
.toast {
  position: fixed;
  /* 헤더 높이(68px) + 여백 */
  top: 84px;
  right: 20px;
  /* 헤더(2000)보다 높게 설정 */
  z-index: 3000;
  min-width: 300px;
  max-width: 500px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideIn 0.3s ease-out;
  backdrop-filter: blur(10px);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.toast-error {
  background: linear-gradient(135deg, #ff6b6b, #ee5a5a);
  color: white;
  border-left: 4px solid #ff4757;
}

.toast-success {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border-left: 4px solid #2E7D32;
}

.toast-warning {
  background: linear-gradient(135deg, #ffa726, #ff9800);
  color: white;
  border-left: 4px solid #f57c00;
}

.toast-info {
  background: linear-gradient(135deg, #42a5f5, #2196f3);
  color: white;
  border-left: 4px solid #1976d2;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  color: inherit;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 모바일 대응 */
@media (max-width: 768px) {
  .toast {
    top: 78px; /* 모바일에서도 헤더 아래에 표시 */
    right: 10px;
    left: 10px;
    min-width: auto;
    max-width: none;
  }
}
</style>
