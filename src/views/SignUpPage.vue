<template>
  <div class="contact-page">
    <div class="contact-container">
      <header class="contact-header">
        <h1 class="page-title">회원가입</h1>
      </header>

      <form class="contact-form" @submit.prevent="handleSubmit">
        <!-- 이메일 입력 및 인증번호 요청 -->
        <div class="form-group">
          <label for="email" class="form-label">이메일</label>
          <div class="email-input-group">
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input email-input"
              :class="{ 'invalid-input': !isEmailValid && formData.email }"
              placeholder="이메일을 입력해주세요."
              required
            />
            <button
              type="button"
              class="verification-button"
              @click="requestVerification"
            >
              {{ verificationRequested ? '인증번호 재전송' : '인증번호 받기' }}
            </button>
          </div>

          <p
            v-if="formData.email && emailTouched && !isEmailValid"
            class="email-error-message"
          >
            올바른 이메일 형식을 입력해주세요.
          </p>

          <!-- 인증번호 입력창 및 인증번호 확인 버튼 -->
          <div class="email-input-group" v-if="verificationRequested">
            <input
              v-model="formData.verificationCode"
              type="text"
              class="form-input confirm-input"
              :class="{ 'disabled-input': isVerified }"
              placeholder="인증번호를 입력해주세요."
              :disabled="isVerified"
              required
            />
            <button
              type="button"
              class="verification-button confirm-mail"
              @click="verifyCode"
              :disabled="isVerified"
            >
              인증번호 확인
            </button>
          </div>
        </div>

        <!-- 이름 유효성 검사 -->
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
          <p v-if="nameStatusMessage" :class="nameMessageClass">
            {{ nameStatusMessage }}
          </p>
        </div>

        <!-- 닉네임 유효성 검사 및 중복 확인 -->
        <div class="form-group">
          <label for="nickName" class="form-label">닉네임</label>
          <input
            id="nickName"
            v-model="formData.nickName"
            type="text"
            class="form-input"
            placeholder="닉네임을 입력해주세요."
            required
          />
          <p v-if="nickNameStatusMessage" :class="nickNameMessageClass">
            {{ nickNameStatusMessage }}
          </p>
        </div>

        <!-- 비밀번호 및 비밀번호 확인 -->
        <div class="form-group">
          <label for="password" class="form-label">비밀번호</label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            :class="{
              'form-input': true,
              'invalid-input': formData.password && !isPasswordValid,
              'valid-input': formData.password && isPasswordValid,
            }"
            placeholder="비밀번호를 입력해주세요."
            required
          />
          <p
            v-if="formData.password"
            :class="{
              'validation-message': true,
              error: !isPasswordValid,
              success: isPasswordValid,
            }"
          >
            {{
              isPasswordValid
                ? '사용 가능한 비밀번호입니다.'
                : '비밀번호는 8~20자이며 대소문자, 숫자, 특수문자를 포함해야 합니다.'
            }}
          </p>

          <input
            v-model="formData.confirmPassword"
            type="password"
            class="form-input confirm-pwd"
            placeholder="비밀번호를 다시 한번 입력해주세요."
            required
          />
          <p
            v-if="formData.confirmPassword"
            :class="{
              'validation-message': true,
              error: !isPasswordMatch,
              success: isPasswordMatch,
            }"
          >
            {{
              isPasswordMatch
                ? '비밀번호가 일치합니다.'
                : '비밀번호가 일치하지 않습니다.'
            }}
          </p>
        </div>

        <button type="submit" class="submit-button" :disabled="!isFormValid">
          회원가입
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import {
  sendVerificationCode,
  verifyEmailCode,
  checkNickname,
  signUp,
} from '@/api/user';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { debounce } from 'lodash';

const toast = useToast();
const router = useRouter();

const formData = ref({
  email: '',
  verificationCode: '',
  name: '',
  nickName: '',
  password: '',
  confirmPassword: '',
});

const verificationRequested = ref(false);
const isVerified = ref(false);
const nickNameTouched = ref(false);
const nameTouched = ref(false);
const emailTouched = ref(false);
const isNickNameAvailable = ref(null); // null: 확인 전, true: 사용 가능, false: 중복됨

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(formData.value.email);
});

const isPasswordValid = computed(() => {
  const password = formData.value.password;
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
  return regex.test(password);
});

const isPasswordMatch = computed(() => {
  return formData.value.password === formData.value.confirmPassword;
});

const isNameValid = computed(() => {
  const name = formData.value.name;
  const regex = /^[가-힣]{1,50}$/;
  return regex.test(name);
});

const isNickNameValid = computed(() => {
  const regex = /^[a-zA-Z0-9가-힣]+$/;
  const len = formData.value.nickName.length;
  return len >= 2 && len <= 20 && regex.test(formData.value.nickName);
});

// 이름 관련 computed
const nameStatusMessage = computed(() => {
  if (!formData.value.name || !nameTouched.value) {
    return '';
  }

  return isNameValid.value
    ? '사용 가능한 이름입니다.'
    : '이름은 한글로 1~50자 이내로 입력해주세요.';
});

const nameMessageClass = computed(() => {
  if (!formData.value.name || !nameTouched.value) {
    return '';
  }

  return isNameValid.value
    ? 'validation-message success'
    : 'validation-message error';
});

// 닉네임 관련 computed
const nickNameStatusMessage = computed(() => {
  if (!formData.value.nickName || !nickNameTouched.value) {
    return '';
  }

  if (!isNickNameValid.value) {
    return '닉네임은 2~20자, 한글/영문/숫자만 가능합니다.';
  }

  if (isNickNameAvailable.value === false) {
    return '이미 사용 중인 닉네임입니다.';
  }

  if (isNickNameAvailable.value === true) {
    return '사용 가능한 닉네임입니다.';
  }

  return '중복 확인 중입니다...';
});

const nickNameMessageClass = computed(() => {
  if (!formData.value.nickName || !nickNameTouched.value) {
    return '';
  }

  if (!isNickNameValid.value || isNickNameAvailable.value === false) {
    return 'validation-message error';
  }

  if (isNickNameValid.value && isNickNameAvailable.value === true) {
    return 'validation-message success';
  }

  return 'validation-message checking'; // 중복 확인 중
});

const isFormValid = computed(() => {
  return (
    formData.value.email &&
    formData.value.name &&
    formData.value.nickName &&
    formData.value.password &&
    formData.value.confirmPassword &&
    isPasswordValid.value &&
    isPasswordMatch.value &&
    isNameValid.value &&
    isNickNameValid.value &&
    isNickNameAvailable.value === true
  );
});

const goBack = () => {
  router.go(-1);
};

const requestVerification = async () => {
  // [Backend Required] 이메일 인증번호 전송 (서버에 이메일 전달)
  // [백엔드 연동] 이메일 인증번호 발송 요청
  // ex) /api/users/send-code
  if (!isEmailValid.value) {
    toast.error('올바른 이메일 형식을 입력해주세요.', {
      position: 'top-center',
      timeout: 2000,
      hideProgressBar: true,
    });
    return;
  }

  verificationRequested.value = true;
  isVerified.value = false;
  formData.value.verificationCode = '';

  try {
    await sendVerificationCode(formData.value.email);

    toast.success('인증메일이 전송됐어요', {
      position: 'top-center',
      timeout: 2000,
      toastClassName: 'signup-toast',
      bodyClassName: 'signup-toast-body',
      hideProgressBar: true,
    });
  } catch (e) {
    toast.error('인증 메일 전송에 실패했습니다.', {
      position: 'top-center',
      timeout: 2000,
      hideProgressBar: true,
    });
  }
};

const handleSubmit = async () => {
  // [Backend Required] 회원가입 요청 처리
  // [백엔드 연동] 회원가입 제출 처리
  // 성공/실패 토스트 메시지 및 리다이렉트 로직 포함
  if (!isFormValid.value) return;

  try {
    const response = await signUp({
      email: formData.value.email,
      name: formData.value.name,
      nickname: formData.value.nickName,
      password: formData.value.password,
    });

    if (response.status === 200 || response.status === 201) {
      toast.success('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.', {
        position: 'top-center',
        timeout: 2000,
        hideProgressBar: true,
      });
      setTimeout(() => router.push('/login'), 2000);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || '회원가입에 실패했습니다.', {
      position: 'top-center',
      timeout: 2000,
      hideProgressBar: true,
    });
  }
};

// 이름 입력 감시
watch(
  () => formData.value.name,
  () => {
    nameTouched.value = true;
  }
);

// 닉네임 입력 감시
watch(
  () => formData.value.nickName,
  () => {
    nickNameTouched.value = true;
    isNickNameAvailable.value = null;
    if (isNickNameValid.value) {
      debouncedCheckNickName();
    }
  }
);

// 이메일 입력 감시
watch(
  () => formData.value.email,
  () => {
    emailTouched.value = true;
  }
);

const checkNickName = async () => {
  // [Backend Required] 닉네임 중복 확인 (DB 조회 필요)
  // [백엔드 연동] 닉네임 중복 확인
  // ex) /api/users/check-nickname?nickname=xxx
  // 이건 잘 모르겠어용..
  const nickname = formData.value.nickName;
  if (!nickname || !isNickNameValid.value) {
    isNickNameAvailable.value = null;
    return;
  }

  try {
    const response = await checkNickname(nickname);

    isNickNameAvailable.value = !response.data.duplicate;
  } catch (error) {
    console.error('닉네임 중복 확인 실패', error);
    isNickNameAvailable.value = null;
  }
};

const debouncedCheckNickName = debounce(checkNickName, 500);

const verifyCode = async () => {
  // [Backend Required] 입력된 인증번호 유효성 확인
  // [백엔드 연동] 인증번호 확인 요청
  // ex) /api/users/verify-code
  try {
    const response = await verifyEmailCode(
      formData.value.email,
      formData.value.verificationCode
    );
    if (response.data.success) {
      isVerified.value = true;
      toast.success('인증이 완료되었습니다.', {
        position: 'top-center',
        timeout: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.error('인증번호가 일치하지 않습니다.', {
        position: 'top-center',
        timeout: 2000,
        hideProgressBar: true,
      });
    }
  } catch (error) {
    toast.error('인증번호 확인 중 오류가 발생했습니다.', {
      position: 'top-center',
      timeout: 2000,
      hideProgressBar: true,
    });
  }
};
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

.page-title {
  font-size: 32px;
  font-weight: var(--font-weight-700);
  color: var(--color-grey-15);
  margin: 0;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
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

.email-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.email-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.email-input {
  flex: 1;
}

.confirm-input {
  flex: 1;
  margin: 12px 0 12px 0;
}

.verification-button {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 24px;
  background: var(--color-grey-95);
  border: 1px solid var(--color-grey-89);
  border-radius: 12px;
  color: var(--color-grey-33);
  font-size: 14px;
  font-weight: var(--font-weight-600);
  white-space: nowrap;
  transition: all 0.2s ease;
  width: 115.68px;
}

.verification-button:hover:not(:disabled) {
  background: var(--color-grey-91);
}

.verification-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.email-error-message {
  color: red;
  font-size: 14px;
  margin-top: 8px;
}

.verification-input {
  margin-top: 12px;
}

.confirm-pwd,
.confirm-mail {
  margin: 12px 0 12px 0;
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
  margin-top: 15px;
  padding: 18px 24px;
  background: var(--color-blue-48);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: var(--font-weight-600);
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

.invalid-input {
  border-color: red;
}

.validation-message {
  font-size: 14px;
  margin-top: 8px;
}

.validation-message.checking {
  color: #999999;
}

.validation-message.error {
  color: red;
}

.validation-message.success {
  color: green;
}

.disabled-input {
  background-color: var(--color-grey-95);
  cursor: not-allowed;
}

/* Mobile responsiveness */
/* @media (max-width: 768px) {
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
} */
</style>
