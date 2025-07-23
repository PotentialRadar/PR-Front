<template>
  <div class="login-page">
    <div class="login-section">
      <div class="section-container">
        <div class="main-container">
          <div class="content-background">
            <div class="form-container">
              <div class="heading-primary">
                <h1 class="main-title">
                  쉽게 가입하고간편하게 로그인하세요.
                </h1>
              </div>
              <div class="heading-secondary">
                <h2 class="sub-title">
                  일하는 사람들의 모든 가능성
                </h2>
              </div>
              <div class="auth-form">
                <div class="button-container">
                  <button class="kakao-button" @click="handleKakaoLogin">
                    <svg class="kakao-icon" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.00035 3.03467C5.28277 3.03467 2.26562 5.37834 2.26562 8.26079C2.26562 10.0589 3.43073 11.6281 5.20868 12.5844L4.46114 15.3255C4.44704 15.38 4.44993 15.4375 4.46946 15.4903C4.48898 15.5432 4.52419 15.5888 4.57035 15.621C4.61653 15.6533 4.67145 15.6707 4.72777 15.6707C4.78408 15.6709 4.83909 15.6539 4.88542 15.6218L8.15848 13.4465C8.43461 13.4465 8.71749 13.4937 9.00035 13.4937C12.7179 13.4937 15.735 11.15 15.735 8.26079C15.735 5.37161 12.7179 3.03467 9.00035 3.03467Z" fill="#181600"/>
                    </svg>
                    <div class="button-margin">
                      <span class="button-text">카카오 계정으로 계속하기</span>
                    </div>
                  </button>
                  
                  <button class="google-button" @click="handleGoogleLogin">
                    <svg class="google-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M13.98 7.50624C13.98 7.02774 13.9373 6.56723 13.857 6.12549H7.5V8.73623H11.133C10.9763 9.58002 10.5007 10.2955 9.78603 10.774V12.4675H11.967C13.2435 11.2922 13.98 9.562 13.98 7.50624Z" fill="#3D82F0"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50002 14.1027C9.32256 14.1027 10.8503 13.4983 11.967 12.4678L9.78605 10.7735C9.18153 11.1785 8.40827 11.4178 7.50002 11.4178C5.74203 11.4178 4.25403 10.2305 3.72302 8.63525H1.46777V10.3842C2.57852 12.59 4.86152 14.1027 7.50002 14.1027Z" fill="#31A752"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M3.723 8.63529C3.588 8.23029 3.5115 7.79754 3.5115 7.3528C3.5115 6.90804 3.588 6.47529 3.723 6.07029V4.32129H1.46775C1.011 5.23254 0.75 6.26379 0.75 7.3528C0.75 8.4418 1.011 9.47308 1.46775 10.3843L3.723 8.63529Z" fill="#F9BA00"/>
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M7.50002 3.28754C8.49078 3.28754 9.38101 3.62804 10.08 4.29704L12.0165 2.36128C10.8472 1.27154 9.3195 0.602539 7.50002 0.602539C4.86152 0.602539 2.57852 2.11529 1.46777 4.32179L3.72302 6.07004C4.25403 4.47479 5.74203 3.28754 7.50002 3.28754Z" fill="#E64234"/>
                    </svg>
                    <div class="button-margin">
                      <span class="button-text">구글 계정으로 계속하기</span>
                    </div>
                  </button>
                  
                  <button class="email-button" @click="handleEmailLogin">
                    <div class="email-button-container">
                      <span class="email-button-text">이메일로 계속하기</span>
                    </div>
                  </button>
                </div>
                
                <div class="auth-links">
                  <div class="link-group">
                    <div class="link-container">
                      <span class="auth-link" @click="handleFindAccount">기존 계정 찾기</span>
                      <span class="link-divider">|</span>
                      <span class="auth-link" @click="handleSignUp">회원가입</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const handleKakaoLogin = () => {
  console.log('Kakao login clicked')
  // Implement Kakao login logic here
}

const handleGoogleLogin = () => {
  console.log('Google login clicked')
  // Implement Google login logic here
}

const handleEmailLogin = () => {
  console.log('Email login clicked')
  // Implement email login logic here
}

const handleFindAccount = () => {
  console.log('Find account clicked')
  // Implement find account logic here
}

const handleSignUp = () => {
  console.log('Sign up clicked')
  // Implement sign up logic here
}
</script>

<style scoped>
:root {
  --color-white-solid: #FFF;
  --width-400: 400px;
  --item-spacing-s: 16px;
  --id-wanted-jobs-black: var(--color-black-solid, #000);
  --font-family-Font-1: Inter;
  --font-weight-700: 700;
  --line-height-37_8: 37.8px;
  --letter-spacing--0_66: -0.661px;
  --id-wanted-jobs-tuna-61: var(--color-grey-2361, rgba(55, 56, 60, 0.61));
  --font-weight-600: 600;
  --line-height-24: 24px;
  --letter-spacing-0_09: 0.09px;
  --item-spacing-48: 48px;
  --width-360: 360px;
  --item-spacing-xs: 8px;
  --stroke-weight-1: 1px;
  --color-yellow-50: #FEE500;
  --line-height-22: 22px;
  --letter-spacing-0_14: 0.144px;
  --color-grey-89: #E1E2E4;
  --color-grey-4622: rgba(112, 115, 124, 0.22);
  --id-wanted-jobs-woodsmoke: var(--color-grey-9, #171719);
  --item-spacing-3_99: 3.99px;
  --line-height-20: 20px;
  --letter-spacing-0_2: 0.203px;
  --color-black-solid: #000;
  --color-grey-2361: rgba(55, 56, 60, 0.61);
  --color-grey-9: #171719;
}

.login-page {
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 0px 100px;
  justify-content: center;
  align-items: center;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.10);
  background: #FFF;
}

.login-section {
  display: flex;
  width: 1240px;
  min-height: 739px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  background: #FFF;
}

.section-container {
  display: flex;
  height: 733px;
  padding: 86.41px 520px 86.4px 520px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: #FFF;
}

.main-container {
  display: flex;
  max-width: var(--width-400);
  flex-direction: column;
  align-items: center;
  align-self: stretch;
}

.content-background {
  display: flex;
  max-width: var(--width-400);
  padding-top: 17.695px;
  flex-direction: column;
  align-items: flex-start;
  background: #FFF;
}

.form-container {
  display: flex;
  min-width: var(--width-400);
  flex-direction: column;
  align-items: flex-start;
  gap: var(--item-spacing-s);
}

.heading-primary {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
}

.main-title {
  color: var(--color-black-solid);
  text-align: center;
  font-family: var(--font-family-Font-1), -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 26.906px;
  font-style: normal;
  font-weight: var(--font-weight-700);
  line-height: var(--line-height-37_8);
  letter-spacing: var(--letter-spacing--0_66);
  margin: 0;
}

.heading-secondary {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
}

.sub-title {
  color: var(--color-grey-2361);
  text-align: center;
  font-family: var(--font-family-Font-1), -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15.25px;
  font-style: normal;
  font-weight: var(--font-weight-600);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-0_09);
  margin: 0;
}

.auth-form {
  display: flex;
  padding-top: 44px;
  flex-direction: column;
  align-items: center;
  gap: var(--item-spacing-48);
  align-self: stretch;
}

.button-container {
  display: flex;
  width: var(--width-360);
  max-width: var(--width-360);
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: var(--item-spacing-s);
}

.kakao-button {
  display: flex;
  height: 48px;
  padding: 1px;
  justify-content: center;
  align-items: center;
  gap: var(--item-spacing-xs);
  align-self: stretch;
  border-radius: 10px;
  border: var(--stroke-weight-1) solid var(--color-yellow-50);
  background: var(--color-yellow-50);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.kakao-button:hover {
  background: #F5D700;
  border-color: #F5D700;
}

.kakao-button:active {
  transform: translateY(1px);
}

.kakao-icon {
  width: 18px;
  height: 18px;
}

.google-button {
  display: flex;
  height: 48px;
  padding: 1px;
  justify-content: center;
  align-items: center;
  gap: var(--item-spacing-xs);
  align-self: stretch;
  border-radius: 10px;
  border: var(--stroke-weight-1) solid var(--color-grey-89);
  background: #FFF;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.google-button:hover {
  background: #f8f9fa;
  border-color: #dadce0;
}

.google-button:active {
  transform: translateY(1px);
}

.google-icon {
  width: 14px;
  height: 14px;
}

.email-button {
  display: flex;
  height: 48px;
  max-width: var(--width-360);
  min-height: 48px;
  padding: 1px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-radius: 10px;
  border: var(--stroke-weight-1) solid var(--color-grey-4622);
  background: #FFF;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.email-button:hover {
  background: #f8f9fa;
  border-color: #dadce0;
}

.email-button:active {
  transform: translateY(1px);
}

.button-margin {
  display: flex;
  padding: 13px 0px;
  flex-direction: column;
  align-items: flex-start;
}

.button-text {
  color: var(--color-black-solid);
  font-family: var(--font-family-Font-1), -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14.297px;
  font-style: normal;
  font-weight: var(--font-weight-600);
  line-height: var(--line-height-22);
  letter-spacing: var(--letter-spacing-0_14);
}

.email-button-container {
  display: flex;
  align-items: flex-start;
}

.email-button-text {
  color: var(--color-grey-9);
  font-family: var(--font-family-Font-1), -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15.25px;
  font-style: normal;
  font-weight: var(--font-weight-600);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-0_09);
}

.auth-links {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
}

.link-group {
  display: flex;
  align-items: center;
  gap: var(--item-spacing-3_99);
}

.link-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--item-spacing-3_99);
}

.auth-link {
  color: var(--color-grey-2361);
  font-family: var(--font-family-Font-1), -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13.344px;
  font-style: normal;
  font-weight: var(--font-weight-600);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-0_2);
  cursor: pointer;
  transition: color 0.2s ease;
}

.auth-link:hover {
  color: var(--color-black-solid);
}

.link-divider {
  color: var(--color-grey-2361);
  font-family: var(--font-family-Font-1), -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13.344px;
  font-style: normal;
  font-weight: var(--font-weight-600);
  line-height: var(--line-height-20);
  letter-spacing: var(--letter-spacing-0_2);
}

/* Responsive design */
@media (max-width: 1440px) {
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
  
  .form-container {
    min-width: 320px;
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
  .form-container {
    min-width: 280px;
  }
  
  .main-container {
    max-width: 320px;
  }
  
  .content-background {
    max-width: 320px;
  }
}
</style>
