<template>
  <section class="login-page">
    <div class="login-section">
      <div class="section-container">
        <div class="main-container">
          <div class="heading-primary">
            <h1 class="main-title">쉽게 가입하고간편하게 로그인하세요.</h1>
            <h2 class="sub-title">일하는 사람들의 모든 가능성</h2>

            <form>
              <div class="button-container">
                <button
                  class="kakao-button"
                  type="button"
                  @click="handleKakaoLogin">
                  <!-- 카카오 로그인 연동 -->
                  <span class="icon-wrap">
                    <svg class="kakao-icon" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.00035 3.03467C5.28277 3.03467 2.26562 5.37834 2.26562 8.26079C2.26562 10.0589 3.43073 11.6281 5.20868 12.5844L4.46114 15.3255C4.44704 15.38 4.44993 15.4375 4.46946 15.4903C4.48898 15.5432 4.52419 15.5888 4.57035 15.621C4.61653 15.6533 4.67145 15.6707 4.72777 15.6707C4.78408 15.6709 4.83909 15.6539 4.88542 15.6218L8.15848 13.4465C8.43461 13.4465 8.71749 13.4937 9.00035 13.4937C12.7179 13.4937 15.735 11.15 15.735 8.26079C15.735 5.37161 12.7179 3.03467 9.00035 3.03467Z" fill="#181600"/>
                    </svg>
                  </span>
                  <p class="button-text">카카오 계정으로 계속하기</p>
                </button>

                <button
                  class="google-button"
                  type="button"
                  @click="handleGoogleLogin">
                  <!-- 구글 로그인 연동 -->
                  <span class="icon-wrap">
                    <svg class="google-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.98 7.50624C13.98 7.02774 13.9373 6.56723 13.857 6.12549H7.5V8.73623H11.133C10.9763 9.58002 10.5007 10.2955 9.78603 10.774V12.4675H11.967C13.2435 11.2922 13.98 9.562 13.98 7.50624Z" fill="#3D82F0"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50002 14.1027C9.32256 14.1027 10.8503 13.4983 11.967 12.4678L9.78605 10.7735C9.18153 11.1785 8.40827 11.4178 7.50002 11.4178C5.74203 11.4178 4.25403 10.2305 3.72302 8.63525H1.46777V10.3842C2.57852 12.59 4.86152 14.1027 7.50002 14.1027Z" fill="#31A752"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.723 8.63529C3.588 8.23029 3.5115 7.79754 3.5115 7.3528C3.5115 6.90804 3.588 6.47529 3.723 6.07029V4.32129H1.46775C1.011 5.23254 0.75 6.26379 0.75 7.3528C0.75 8.4418 1.011 9.47308 1.46775 10.3843L3.723 8.63529Z" fill="#F9BA00"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50002 3.28754C8.49078 3.28754 9.38101 3.62804 10.08 4.29704L12.0165 2.36128C10.8472 1.27154 9.3195 0.602539 7.50002 0.602539C4.86152 0.602539 2.57852 2.11529 1.46777 4.32179L3.72302 6.07004C4.25403 4.47479 5.74203 3.28754 7.50002 3.28754Z" fill="#E64234"/>
                    </svg>
                  </span>
                  <p class="button-text">구글 계정으로 계속하기</p>
                </button>

                <router-link to="/email-login">
                  <button class="email-button" type="button">
                    <span class="email-button-text">이메일로 계속하기</span>
                  </button>
                </router-link>
              </div>

              <div class="auth-links">
                <!-- 비밀번호 재설정 -->
                <button class="auth-link" @click="handleFindAccount">
                  <p>비밀번호 재설정</p>
                </button>
                <span class="link-divider">|</span>
                <router-link to="/signUp" class="auth-link">회원가입</router-link>
              </div>
            </form>

          </div> <!-- 내용전체 컨테이너 -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { KAKAO_AUTH_URL, GOOGLE_AUTH_URL } from '../constants/oauth';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

// 카카오 로그인 처리
const handleKakaoLogin = () => {
  window.location.href = KAKAO_AUTH_URL;
};

// 구글 로그인 처리
const handleGoogleLogin = () => {
  window.location.href = GOOGLE_AUTH_URL;
};

// 비밀번호 재설정
const handleFindAccount = () => {
  console.log('Find account clicked');
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
  /* min-height: 739px; */
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
  margin-bottom: 16px;
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

.button-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto 16px auto;
  max-width: 360px;
  justify-content: center;
  gap: 16px;
}

.kakao-button {
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-radius: 10px;
  border: 1px solid #e1e2e4;
  cursor: pointer;
  padding: 0;
  background-color: #fee500;
  border: 1px solid #fee500;
}

.kakao-button:hover {
  background: #f5d700;
  border-color: #f5d700;
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.google-button {
  width: 100%;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-radius: 10px;
  border: 1px solid #e1e2e4;
  cursor: pointer;
  padding: 0;
  background-color: #ffffff;
  border: 1px solid #e1e2e4;
}

.google-button:hover {
  background: #f8f9fa;
  border-color: #dadce0;
}

.email-button {
  width: 100%;
  height: 48px;
  min-height: 48px;
  border-radius: 10px;
  border: none;
  font-size: 16px;
  cursor: pointer;
  background-color: #ffffff;
  border: 1px solid rgba(112, 115, 124, 0.22);
  width: 100%;
  margin: 0;
}

.email-button:hover {
  background: #f8f9fa;
  border-color: #dadce0;
}

.kakao-icon {
  width: 18px;
  height: 18px;
}

.google-icon {
  width: 14px;
  height: 14px;
}

.button-text,
.email-button-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  gap: 8px;
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
.form-input {
  width: 100%;
  height: 40px;
  margin-bottom: 10px;
  padding: 0 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
.email-form {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Responsive design */
/* @media (max-width: 1440px) {
  .login-page {
    padding: 0px 50px;
  }
  
  .section-container {
    padding: 86.41px 300px 86.4px 300px;
  }
}

@media (max-width: 1200px) {
  .section-container {
    padding: 60px 200px;
  }
  
  .login-section {
    width: 100%;
    max-width: 1000px;
  }
}

@media (max-width: 900px) {
  .login-page {
    padding: 0px 20px;
  }
  
  .section-container {
    padding: 40px 100px;
  }
}

@media (max-width: 600px) {
  .section-container {
    padding: 40px 20px;
  }
  
  .button-container {
    width: 100%;
    max-width: 100%;
  }
  
  .main-title {
    font-size: 22px;
    line-height: 32px;
  }
  
  .sub-title {
    font-size: 14px;
    line-height: 20px;
  }
}

@media (max-width: 400px) {
  .main-container {
    max-width: 320px;
  }
} */
</style>
