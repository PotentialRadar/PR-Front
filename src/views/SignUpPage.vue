<template>
  <div class="contact-page">
    <div class="contact-container">
      <header class="contact-header">
        <h1 class="page-title">회원가입</h1>
      </header>

      <!-- 중복확인 할건지, 메일인증버튼 넣을건지 -->
      <form class="contact-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email" class="form-label">이메일</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            class="form-input"
            placeholder="이메일을 입력해주세요."
            required
          />
            <div class="phone-input-group">
              <input
                v-model="formData.phoneNumber"
                type="tel"
                class="form-input phone-input"
                placeholder="(예시) 01012345678"
                required
              />
              <button 
                type="button" 
                class="verification-button"
                @click="requestVerification"
                :disabled="verificationRequested"
              >
                인증번호 받기
              </button>
            </div>
            <input
            v-if="verificationRequested"
            v-model="formData.verificationCode"
            type="text"
            class="form-input verification-input"
            placeholder="인증번호를 입력해주세요."
            required
          />
        </div>

        <!-- <div class="form-group">
          <label class="form-label">휴대폰 번호</label>
          <div class="phone-group">
            <select v-model="formData.countryCode" class="country-select">
              <option value="+82">South Korea +82</option>
              <option value="+1">United States +1</option>
              <option value="+86">China +86</option>
              <option value="+81">Japan +81</option>
            </select>
            <div class="phone-input-group">
              <input
                v-model="formData.phoneNumber"
                type="tel"
                class="form-input phone-input"
                placeholder="(예시) 01012345678"
                required
              />
              <button 
                type="button" 
                class="verification-button"
                @click="requestVerification"
                :disabled="verificationRequested"
              >
                인증번호 받기
              </button>
            </div>
          </div>
          <input
            v-if="verificationRequested"
            v-model="formData.verificationCode"
            type="text"
            class="form-input verification-input"
            placeholder="인증번호를 입력해주세요."
            required
          />
        </div> -->

        <div class="form-group">
          <label for="name" class="form-label">이름</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="이름을 입력해주세요."
            required
          />
        </div>

        <!-- 닉네임 -->
        <div class="form-group">
          <label for="name" class="form-label">닉네임</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            class="form-input"
            placeholder="닉네임을 입력해주세요."
            required
          />
        </div>

        

        <div class="form-group">
          <label for="password" class="form-label">비밀번호</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            class="form-input"
            placeholder="비밀번호를 입력해주세요."
            required
          />
          <div class="agreement-section">
            <p class="agreement-text">
              영문 대소문자, 숫자, 특수문자를 3가지 이상으로 조합하여 8자 이상
              16자 이하로 입력해주세요.
            </p>
          </div>
        </div>

        <div class="form-group">
          <input
            v-model="formData.confirmPassword"
            type="password"
            class="form-input"
            placeholder="비밀번호를 다시 한번 입력해주세요."
            required
          />
        </div>

        <button type="submit" class="submit-button" :disabled="!isFormValid">
          회원가입
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = ref({
  email: '',
  name: '',
  countryCode: '+82',
  phoneNumber: '',
  verificationCode: '',
  password: '',
  confirmPassword: ''
})

const verificationRequested = ref(false)
const agreeAll = ref(false)

const isFormValid = computed(() => {
  return formData.value.email &&
        formData.value.name &&
        formData.value.phoneNumber &&
        formData.value.password &&
        formData.value.confirmPassword &&
        formData.value.password === formData.value.confirmPassword &&
        agreeAll.value
})

const goBack = () => {
  router.go(-1)
}

const requestVerification = () => {
  if (formData.value.phoneNumber) {
    verificationRequested.value = true
    // Here you would typically call an API to send verification code
    console.log('Verification code requested for:', formData.value.countryCode + formData.value.phoneNumber)
  }
}

const toggleAllAgreements = () => {
  // Handle agreement logic
  console.log('All agreements toggled:', agreeAll.value)
}

const handleSubmit = () => {
  if (isFormValid.value) {
    console.log('Form submitted:', formData.value)
    // Handle form submission logic here
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #fff;
  padding: 20px;
  font-family: var(--font-family-freesentation);
}

.contact-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.contact-header {
  text-align: center;
  margin-bottom: 60px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: var(--color-grey-67);
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: var(--color-grey-33);
}

.page-title {
  font-size: 32px;
  font-weight: var(--font-weight-700);
  color: var(--color-grey-15);
  margin: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  font-size: 16px;
  font-weight: var(--font-weight-600);
  color: var(--color-grey-15);
  margin-bottom: 8px;
}

.form-input {
  padding: 16px 20px;
  border: 1px solid var(--color-grey-89);
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  transition: border-color 0.2s ease;
  background: #fff;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-blue-48);
  box-shadow: 0 0 0 3px rgba(38, 61, 209, 0.1);
}

.form-input::placeholder {
  color: var(--color-grey-67);
}

.phone-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.country-select {
  padding: 16px 20px;
  border: 1px solid var(--color-grey-89);
  border-radius: 12px;
  font-size: 16px;
  font-family: inherit;
  background: #fff;
  cursor: pointer;
}

.country-select:focus {
  outline: none;
  border-color: var(--color-blue-48);
}

.phone-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.phone-input {
  flex: 1;
}

.verification-button {
  padding: 16px 24px;
  background: var(--color-grey-95);
  border: 1px solid var(--color-grey-89);
  border-radius: 12px;
  color: var(--color-grey-33);
  font-size: 14px;
  font-weight: var(--font-weight-600);
  white-space: nowrap;
  transition: all 0.2s ease;
}

.verification-button:hover:not(:disabled) {
  background: var(--color-grey-91);
}

.verification-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.verification-input {
  margin-top: 12px;
}

.agreement-section {
  margin-top: 20px;
}

.agreement-text {
  font-size: 14px;
  color: var(--color-grey-67);
  line-height: 1.5;
  margin-bottom: 20px;
}

.checkbox-group {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 16px;
  font-weight: var(--font-weight-600);
  color: var(--color-grey-15);
}

.checkbox-input {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-grey-89);
  border-radius: 4px;
  cursor: pointer;
}

.checkbox-input:checked {
  background: var(--color-blue-48);
  border-color: var(--color-blue-48);
}

.checkbox-text {
  font-size: 16px;
  font-weight: var(--font-weight-600);
}

.submit-button {
  margin-top: 40px;
  padding: 18px 24px;
  background: var(--color-blue-48);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: var(--font-weight-600);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #1e32b8;
  transform: translateY(-1px);
}

.submit-button:disabled {
  background: var(--color-grey-89);
  color: var(--color-grey-67);
  cursor: not-allowed;
  transform: none;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .contact-container {
    padding: 20px 16px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .phone-input-group {
    flex-direction: column;
    align-items: stretch;
  }
  
  .verification-button {
    width: 100%;
  }
}
</style>
