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
                <router-link to="/reset-password" class="auth-link">비밀번호 재설정</router-link>
                <span class="link-divider">|</span>
                <router-link to="/signup" class="auth-link">회원가입</router-link>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { loginByEmail } from '../api/login'
import api from '@/api/axios'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()
const userStore = useUserStore()

const canSubmit = computed(() => email.value && password.value)

// 이메일 로그인 처리
const handleEmailLogin = async () => {
  try {
    const result = await loginByEmail({
      email: email.value,
      password: password.value,
    });
    
    // 토큰 저장
    localStorage.setItem('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);

    // 사용자 정보 가져오기
    const userProfileResponse = await api.get('/users/me');
    const userProfile = userProfileResponse.data;
    
    // Pinia 상태 갱신 (OAuth와 동일한 형식)
    userStore.login({
      userId: userProfile.id,
      email: userProfile.email,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken
    });

    console.log('로그인 성공!', { userId: userProfile.id, email: userProfile.email });
    router.push('/');
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('로그인 실패: ' + (error?.response?.data?.message || '서버 오류'));
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
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-input::placeholder {
  color: #C7C8C9;
  opacity: 1;
}

.form-input::-webkit-input-placeholder {
  color: #C7C8C9;
}

.form-input::-moz-placeholder {
  color: #C7C8C9;
  opacity: 1;
}

.form-input:-ms-input-placeholder {
  color: #C7C8C9;
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
  background-color: #4CAF50;
  border-color: #4CAF50;
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
</style>