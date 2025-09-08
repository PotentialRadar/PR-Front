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
              :disabled="resendCooldown > 0"
            >
              <template v-if="resendCooldown > 0">
                재전송 ({{ resendCooldown }}초)
              </template>
              <template v-else>
                {{ verificationRequested ? "인증번호 재전송" : "인증번호 받기" }}
              </template>
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
              :class="{ 
                'disabled-input': isVerified || isVerificationExpired,
                'expired-input': isVerificationExpired 
              }"
              placeholder="인증번호를 입력해주세요."
              :disabled="isVerified || isVerificationExpired"
              required
            />
            <button
              type="button"
              class="verification-button confirm-mail"
              @click="verifyCode"
              :disabled="isVerified || isVerificationExpired || !formData.verificationCode.trim()"
            >
              인증번호 확인
            </button>
          </div>

          <!-- 타이머 및 상태 표시 -->
          <div v-if="verificationRequested" class="verification-status">
            <div class="timer-container" v-if="!isVerified">
              <div class="timer-progress">
                <div 
                  class="timer-bar" 
                  :class="{ 'expired': isVerificationExpired, 'warning': timeRemaining < 60 }"
                  :style="{ width: `${(timeRemaining / 300) * 100}%` }"
                ></div>
              </div>
              <div class="timer-text" :class="{ 'expired': isVerificationExpired, 'warning': timeRemaining < 60 }">
                <i class="bi" :class="isVerificationExpired ? 'bi-clock-history' : 'bi-clock'"></i>
                <span v-if="!isVerificationExpired">{{ formatTime(timeRemaining) }} 남음</span>
                <span v-else class="expired-text">인증시간 만료</span>
              </div>
            </div>
            
            <div v-if="isVerified" class="verification-success">
              <i class="bi bi-check-circle-fill"></i>
              <span>이메일 인증 완료</span>
            </div>

            <div v-if="isVerificationExpired" class="verification-expired">
              <p class="expired-message">인증번호가 만료되었습니다. 새로운 인증번호를 요청해주세요.</p>
            </div>
          </div>
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
                ? "사용 가능한 비밀번호입니다."
                : "비밀번호는 8~20자이며 대소문자, 숫자, 특수문자를 포함해야 합니다."
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
                ? "비밀번호가 일치합니다."
                : "비밀번호가 일치하지 않습니다."
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
} from "@/api/user";
import { ref, computed, watch, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { debounce } from "lodash";

const toast = useToast();
const router = useRouter();

const formData = ref({
  email: "",
  verificationCode: "",
  nickName: "",
  password: "",
  confirmPassword: "",
});

const verificationRequested = ref(false);
const isVerified = ref(false);
const nickNameTouched = ref(false);
const emailTouched = ref(false);
const isNickNameAvailable = ref(null); // null: 확인 전, true: 사용 가능, false: 중복됨

// 타이머 관련
const timeRemaining = ref(300); // 5분 = 300초
const timerInterval = ref(null);
const isVerificationExpired = ref(false);
const resendCooldown = ref(0);
const resendInterval = ref(null);

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

const isNickNameValid = computed(() => {
  const regex = /^[a-zA-Z0-9가-힣]+$/;
  const len = formData.value.nickName.length;
  return len >= 2 && len <= 20 && regex.test(formData.value.nickName);
});

// 닉네임 관련 computed
const nickNameStatusMessage = computed(() => {
  if (!formData.value.nickName || !nickNameTouched.value) {
    return "";
  }

  if (!isNickNameValid.value) {
    return "닉네임은 2~20자, 한글/영문/숫자만 가능합니다.";
  }

  if (isNickNameAvailable.value === false) {
    return "이미 사용 중인 닉네임입니다.";
  }

  if (isNickNameAvailable.value === true) {
    return "사용 가능한 닉네임입니다.";
  }

  return "중복 확인 중입니다...";
});

const nickNameMessageClass = computed(() => {
  if (!formData.value.nickName || !nickNameTouched.value) {
    return "";
  }

  if (!isNickNameValid.value || isNickNameAvailable.value === false) {
    return "validation-message error";
  }

  if (isNickNameValid.value && isNickNameAvailable.value === true) {
    return "validation-message success";
  }

  return "validation-message checking"; // 중복 확인 중
});

const isFormValid = computed(() => {
  return (
    formData.value.email &&
    formData.value.nickName &&
    formData.value.password &&
    formData.value.confirmPassword &&
    isPasswordValid.value &&
    isPasswordMatch.value &&
    isNickNameValid.value &&
    isNickNameAvailable.value === true &&
    isVerified.value
  );
});

// 시간 포맷팅 함수
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 타이머 시작
const startTimer = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
  }
  
  timeRemaining.value = 300; // 5분
  isVerificationExpired.value = false;
  
  timerInterval.value = setInterval(() => {
    timeRemaining.value--;
    
    if (timeRemaining.value <= 0) {
      clearInterval(timerInterval.value);
      isVerificationExpired.value = true;
      formData.value.verificationCode = '';
      toast.warning("인증시간이 만료되었습니다. 새로운 인증번호를 요청해주세요.", {
        position: "top-center",
        timeout: 3000,
        hideProgressBar: true,
      });
    }
  }, 1000);
};

// 재전송 쿨타임 시작
const startResendCooldown = () => {
  resendCooldown.value = 30; // 30초
  
  if (resendInterval.value) {
    clearInterval(resendInterval.value);
  }
  
  resendInterval.value = setInterval(() => {
    resendCooldown.value--;
    
    if (resendCooldown.value <= 0) {
      clearInterval(resendInterval.value);
    }
  }, 1000);
};

// 타이머 정리
const clearTimers = () => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
  if (resendInterval.value) {
    clearInterval(resendInterval.value);
    resendInterval.value = null;
  }
};

const goBack = () => {
  router.go(-1);
};

const requestVerification = async () => {
  // [Backend Required] 이메일 인증번호 전송 (서버에 이메일 전달)
  // 이메일 인증번호 발송 요청
  // ex) /api/users/send-code
  if (!isEmailValid.value) {
    toast.error("올바른 이메일 형식을 입력해주세요.", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true,
    });
    return;
  }

  // 재전송 쿨타임 체크
  if (resendCooldown.value > 0) {
    return;
  }

  verificationRequested.value = true;
  isVerified.value = false;
  formData.value.verificationCode = "";

  try {
    await sendVerificationCode(formData.value.email);

    // 타이머 시작
    startTimer();
    // 재전송 쿨타임 시작
    startResendCooldown();

    toast.success("인증메일이 전송됐어요! 5분 내에 인증을 완료해주세요.", {
      position: "top-center",
      timeout: 3000,
      toastClassName: "signup-toast",
      bodyClassName: "signup-toast-body",
      hideProgressBar: true,
    });
  } catch (e) {
    toast.error("인증 메일 전송에 실패했습니다.", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true,
    });
    verificationRequested.value = false;
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
      nickname: formData.value.nickName,
      password: formData.value.password,
    });

    if (response.status === 200 || response.status === 201) {
      toast.success("회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.", {
        position: "top-center",
        timeout: 2000,
        hideProgressBar: true,
      });
      setTimeout(() => router.push("/login"), 2000);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "회원가입에 실패했습니다.", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true,
    });
  }
};

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
  // 닉네임 중복 확인
  // ex) /api/users/check-nickname?nickname=xxx
  const nickname = formData.value.nickName;
  if (!nickname || !isNickNameValid.value) {
    isNickNameAvailable.value = null;
    return;
  }

  try {
    const response = await checkNickname(nickname);

    isNickNameAvailable.value = !response.data.duplicate;
  } catch (error) {
    console.error("닉네임 중복 확인 실패", error);
    isNickNameAvailable.value = null;
  }
};

const debouncedCheckNickName = debounce(checkNickName, 500);

const verifyCode = async () => {
  // [Backend Required] 입력된 인증번호 유효성 확인
  // 인증번호 확인 요청
  // ex) /api/users/verify-code
  if (!formData.value.verificationCode.trim()) {
    toast.error("인증번호를 입력해주세요.", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true,
    });
    return;
  }

  if (isVerificationExpired.value) {
    toast.error("인증시간이 만료되었습니다. 새로운 인증번호를 요청해주세요.", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true,
    });
    return;
  }

  try {
    const response = await verifyEmailCode(
      formData.value.email,
      formData.value.verificationCode
    );
    if (response.data.success) {
      isVerified.value = true;
      clearTimers(); // 인증 완료 시 타이머 정지
      toast.success("🎉 이메일 인증이 완료되었습니다!", {
        position: "top-center",
        timeout: 3000,
        hideProgressBar: true,
      });
    } else {
      toast.error("인증번호가 일치하지 않습니다. 다시 확인해주세요.", {
        position: "top-center",
        timeout: 2000,
        hideProgressBar: true,
      });
    }
  } catch (error) {
    toast.error("인증번호 확인 중 오류가 발생했습니다.", {
      position: "top-center",
      timeout: 2000,
      hideProgressBar: true,
    });
  }
};

// 컴포넌트 언마운트 시 타이머 정리
onUnmounted(() => {
  clearTimers();
});
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
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1); /* 초록색 그림자 */
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
  background: #e8f5e8; /* 연한 초록색 배경 */
  color: #4caf50; /* 초록색 텍스트 */
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

.submit-button {
  margin-top: 15px;
  padding: 18px 24px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: var(--font-weight-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  background: #45a049;
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

.expired-input {
  border-color: #ff6b6b;
  background-color: #fff5f5;
}

/* 인증 상태 스타일 */
.verification-status {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timer-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.timer-progress {
  flex: 1;
  height: 6px;
  background-color: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
}

.timer-bar {
  height: 100%;
  background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%);
  transition: width 1s ease, background-color 0.3s ease;
  border-radius: 3px;
}

.timer-bar.warning {
  background: linear-gradient(90deg, #ff9800 0%, #ffb74d 100%);
  animation: pulse 1.5s ease-in-out infinite alternate;
}

.timer-bar.expired {
  background: linear-gradient(90deg, #f44336 0%, #ef5350 100%);
}

@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.7;
  }
}

.timer-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #4caf50;
  white-space: nowrap;
}

.timer-text.warning {
  color: #ff9800;
}

.timer-text.expired {
  color: #f44336;
}

.timer-text i {
  font-size: 16px;
}

.verification-success {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8f1 100%);
  border: 1px solid #4caf50;
  border-radius: 8px;
  color: #2e7d32;
  font-weight: 600;
}

.verification-success i {
  color: #4caf50;
  font-size: 18px;
}

.verification-expired {
  padding: 12px 16px;
  background: linear-gradient(135deg, #fff5f5 0%, #ffebee 100%);
  border: 1px solid #ff6b6b;
  border-radius: 8px;
}

.expired-message {
  color: #d32f2f;
  font-size: 14px;
  font-weight: 500;
  margin: 0;
}

.expired-text {
  font-weight: 600;
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
