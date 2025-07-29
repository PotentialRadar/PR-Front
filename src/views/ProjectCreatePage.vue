<template>
  <div class="new-project-page">
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">프로젝트를 등록 중입니다...</p>
      </div>
    </div>

    <div v-if="showSuccess" class="success-overlay">
      <div class="success-card">
        <div class="success-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h3 class="success-title">프로젝트가 성공적으로 등록되었습니다!</h3>
        <button @click="resetForm" class="success-button">새 프로젝트 작성</button>
      </div>
    </div>

    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">새로운 프로젝트</h1>
          <div class="title-underline"></div>
        </div>
        <p class="page-subtitle">프로젝트 정보를 입력하여 맞춤형 개발자를 찾아보세요</p>
      </div>
    </div>

    <div class="form-container">
      <div class="form-content">
        <div class="form-section">
          <div class="section-title">프로젝트 기본 정보</div>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.projectTitle"
              :class="['project-title-input', { 'error': getError('projectTitle').value }]"
              placeholder="프로젝트의 제목을 입력해주세요."
              @blur="validateField('projectTitle', formData.projectTitle, validationSchema.projectTitle)"
            />
            <div v-if="getError('projectTitle').value" class="error-message">
              {{ getError('projectTitle').value }}
            </div>
          </div>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.projectSubtitle"
              :class="['project-subtitle-input', { 'error': getError('projectSubtitle').value }]"
              placeholder="프로젝트의 간략한 소개말을 입력해주세요."
              @blur="validateField('projectSubtitle', formData.projectSubtitle, validationSchema.projectSubtitle)"
            />
            <div v-if="getError('projectSubtitle').value" class="error-message">
              {{ getError('projectSubtitle').value }}
            </div>
          </div>
        </div>

        <div class="duration-personnel-group">
          <div class="form-section duration-section">
            <div class="section-title">진행기간</div>
            <div class="duration-input-group">
              <input
                type="number"
                v-model.number="formData.projectDurationValue"
                :class="['duration-value-input', { 'error': getError('projectDurationValue').value }]"
                min="0"
                placeholder="기간"
                @blur="validateField('projectDurationValue', formData.projectDurationValue, validationSchema.projectDurationValue)"
              />
              <select
                v-model="formData.projectDurationUnit"
                :class="['duration-unit-select', { 'error': getError('projectDurationUnit').value }]"
                @blur="validateField('projectDurationUnit', formData.projectDurationUnit, validationSchema.projectDurationUnit)"
              >
                <option value="">단위 선택</option>
                <option value="days">일</option>
                <option value="weeks">주</option>
                <option value="months">개월</option>
                <option value="years">년</option>
              </select>
            </div>
            <div v-if="getError('projectDurationValue').value || getError('projectDurationUnit').value" class="error-message">
              {{ getError('projectDurationValue').value || getError('projectDurationUnit').value }}
            </div>
          </div>

          <div class="form-section personnel-section">
             <div class="section-title personnel-title">진행인원</div>
            <div class="personnel-content">
              <PersonnelCounter
                v-model="formData.personnel"
                :error="getError('personnel').value"
                @change="validateField('personnel', formData.personnel, validationSchema.personnel)"
              />
            </div>
            <div v-if="getError('personnel').value" class="error-message personnel-error">
              {{ getError('personnel').value }}
            </div>
          </div>
        </div>
        <div class="form-section">
          <div class="section-title">기술 스택</div>
          <p class="upload-note">입력된 기술 스택은 프로젝트 추천 서비스에 이용됩니다.</p>
          <TechStackSelector
            v-model="formData.techStack"
            :error="getError('techStack').value"
            @change="validateField('techStack', formData.techStack, validationSchema.techStack)"
          />
          <div v-if="getError('techStack').value" class="error-message">
            {{ getError('techStack').value }}
          </div>
        </div>

        <div class="form-section">

          <div class="section-title">프로젝트 내용</div>
          <div class="form-inputs">
            <div class="input-group">
              <textarea
                v-model="formData.projectDescription"
                :class="['project-description-textarea', { 'error': getError('projectDescription').value }]"
                placeholder="프로젝트에 대한 정보를 입력해주세요."
                rows="6"
                @blur="validateField('projectDescription', formData.projectDescription, validationSchema.projectDescription)"
              ></textarea>
              <div v-if="getError('projectDescription').value" class="error-message">
                {{ getError('projectDescription').value }}
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="upload-section">
            <div class="section-title">참고 파일</div>
            <FileUploadArea
              v-model="formData.files"
              :error="getError('files').value"
              @change="validateField('files', formData.files, validationSchema.files)"
            />
            <div v-if="getError('files').value" class="error-message">
              {{ getError('files').value }}
            </div>
          </div>
        </div>

        <div class="submit-section">
          <button
            @click="submitForm"
            :disabled="isSubmitting || hasErrors"
            :class="['submit-button', { 'loading': isSubmitting, 'disabled': hasErrors }]"
          >
            <span v-if="!isSubmitting">작성하기</span>
            <span v-else class="submit-loading">
              <div class="mini-spinner"></div>
              등록 중...
            </span>
          </button>

          <div v-if="submitAttempted && hasErrors" class="form-error-summary">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>입력 내용을 다시 확인해주세요.</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import PersonnelCounter from '@/components/projectComponents/PersonnelCounter.vue'
import TechStackSelector from '@/components/projectComponents/TechStackSelector.vue'
import FileUploadArea from '@/components/projectComponents/FileUploadArea.vue'
import { useFormValidation } from '@/composables/useFormValidation.js'
import {useRouter} from "vue-router";

const API_URL = 'http://localhost:8080/api/projects'

export default {
  name: 'ProjectCreatePage',
  components: {
    PersonnelCounter,
    TechStackSelector,
    FileUploadArea
  },
  setup() {
    const {
      errors,
      isSubmitting,
      submitAttempted,
      validateField,
      validateForm,
      clearErrors,
      hasErrors,
      hasError,
      getError
    } = useFormValidation()

    const router = useRouter()
    const showSuccess = ref(false)

    const formData = reactive({
      projectTitle: '',
      projectSubtitle: '',
      projectDurationValue: null,
      projectDurationUnit: '',
      personnel: 1,
      techStack: [],
      projectDescription: '',
      files: []
    })

    const validationSchema = {
      projectTitle: [
        'required',
        { minLength: 5, message: '프로젝트 제목은 최소 5자 이상이어야 합니다.' },
        { maxLength: 100, message: '프로젝트 제목은 최대 100자까지 가능합니다.' }
      ],
      projectSubtitle: [
        { maxLength: 200, message: '소제목은 최대 200자까지 가능합니다.' }
      ],
      projectDurationValue: [
        'required',
        (value) => {
          if (value === null || value === '' || isNaN(value) || value < 0) return '올바른 진행 기간 숫자를 입력해주세요.'
          return true
        }
      ],
      projectDurationUnit: [
        'required',
        (value) => {
          if (!value) return '진행 기간 단위를 선택해주세요.'
          return true
        }
      ],
      personnel: [
        'required',
        'personnel'
      ],
      techStack: [
        'techStack'
      ],
      projectDescription: [
        'required',
        { minLength: 20 },
        { maxLength: 1000 }
      ],
      files: [
        (files) => {
          if (!files || files.length === 0) return true
          const maxSize = 5 * 1024 * 1024
          for (const file of files) {
            if (file.size > maxSize) {
              return `파일 크기는 5MB 이하여야 합니다: ${file.name}`
            }
          }
          const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif']
          for (const file of files) {
            const extension = '.' + file.name.split('.').pop().toLowerCase()
            if (!allowedExtensions.includes(extension)) {
              return `지원하지 않는 파일 형식입니다: ${file.name}`
            }
          }
          return true
        }
      ]
    }

    // 날짜 유틸
    function addDurationToDate(start, value, unit) {
      const date = new Date(start)
      if (unit === 'days') date.setDate(date.getDate() + value)
      if (unit === 'weeks') date.setDate(date.getDate() + value * 7)
      if (unit === 'months') date.setMonth(date.getMonth() + value)
      if (unit === 'years') date.setFullYear(date.getFullYear() + value)
      return date.toISOString().slice(0, 10)
    }

    //구인글 등록 submitForm 실제 동작 코드
    const submitForm = async () => {
      validateField('projectDurationValue', formData.projectDurationValue, validationSchema.projectDurationValue)
      validateField('projectDurationUnit', formData.projectDurationUnit, validationSchema.projectDurationUnit)
      submitAttempted.value = true

      if (!validateForm(formData, validationSchema)) {
        isSubmitting.value = false
        return
      }

      isSubmitting.value = true

      try {
        // 1. 파일 업로드(S3)
        let fileUrl = null
        if (formData.files && formData.files.length > 0) {
          const uploadData = new FormData()
          uploadData.append('file', formData.files[0])
          const uploadRes = await axios.post(`${API_URL}/upload-file`, uploadData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
          fileUrl = uploadRes.data // S3 URL
        }

        // 2. 날짜 계산 (시작일: 오늘, 마감일: 오늘+기간)
        const today = new Date()
        const startDate = today.toISOString().slice(0, 10)
        const endDate = addDurationToDate(today, formData.projectDurationValue, formData.projectDurationUnit)

        // 3. techStacks DTO 변환
        const techStacks = formData.techStack.map(ts => ({
          techStackName: ts.techStackName || ts.name, // 실제 구조에 맞게
          recruitCount: ts.recruitCount || 1 // 기본값 1
        }))

        // 4. 등록 DTO 맞춰서 body 생성
        const body = {
          title: formData.projectTitle,
          description: formData.projectDescription,
          recruitDeadline: endDate,
          startDate: startDate,
          endDate: endDate,
          fileUrl: fileUrl,
          status: 'RECRUITING',
          techStacks: techStacks,
          recruitCount: formData.personnel
        }

        // 5. 실제 구인글 등록 요청 (userId=1는 임시)
        await axios.post(`${API_URL}?userId=1`, body, {
          headers: { 'Content-Type': 'application/json' }
        })

        showSuccess.value = true
        clearErrors()
        router.push('/projects')
        // 필요시 resetForm()
      } catch (error) {
        console.error('Submission error:', error)
        alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
      } finally {
        isSubmitting.value = false
      }
    }

    const resetForm = () => {
      Object.assign(formData, {
        projectTitle: '',
        projectSubtitle: '',
        projectDurationValue: null,
        projectDurationUnit: '',
        personnel: 1,
        techStack: [],
        projectDescription: '',
        files: []
      })
      clearErrors()
      showSuccess.value = false
    }

    const watchedFields = computed(() => [
      formData.projectTitle,
      formData.projectSubtitle,
      formData.projectDurationValue,
      formData.projectDurationUnit,
      formData.personnel,
      formData.techStack,
      formData.projectDescription,
      formData.files
    ])

    return {
      formData,
      validationSchema,
      errors,
      isSubmitting,
      submitAttempted,
      showSuccess,
      hasErrors,
      hasError,
      getError,
      validateField,
      submitForm,
      resetForm
    }
  }
}
</script>

<style scoped>
.new-project-page {
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 100px 20px 100px 20px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  background: var(--color-white-solid, #FFF);
}

/* 페이지 헤더 */
.page-header {
  width: 100%;
  max-width: 1110px;
  margin-bottom: 60px;
  text-align: center;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 50px 20px 40px 20px;
}

.title-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 42px;
  font-weight: 700;
  color: var(--color-grey-15, #262626);
  margin: 0;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, var(--www-freemoa-net-pumpkin, #FF7D12) 0%, var(--color-orange-57, #FE7C25) 100%);
  border-radius: 2px;
  position: relative;
  animation: expandLine 1s ease-out;
}

.title-underline::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: var(--www-freemoa-net-pumpkin, #FF7D12);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.page-subtitle {
  font-size: 18px;
  color: var(--color-grey-50, #808080);
  margin: 0;
  font-weight: 400;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

@keyframes expandLine {
  0% {
    width: 0;
  }
  100% {
    width: 80px;
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 125, 18, 0.7);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 125, 18, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 125, 18, 0);
  }
}

.form-container {
  display: flex;
  width: 100%;
  max-width: 1110px;
  min-height: auto;
  justify-content: center;
  align-items: flex-start;
  gap: 25px;
  flex-shrink: 0;
  position: relative;
}

.form-content {
  display: flex;
  width: 100%;
  max-width: 600px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  position: relative;
}

.form-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
  margin-bottom: 80px;
  animation: fadeInUp 0.6s ease-out;
}

.section-title {
  font-weight: 700;
  font-size: 18px;
}

.duration-personnel-group {
  display: flex; 
  gap: 20px; 
  align-self: stretch; 
  margin-bottom: 30px; 
}

.duration-personnel-group .form-section {
  flex: 1;
  margin-bottom: 80px; 

}

/* 진행인원 섹션 오른쪽 정렬 */
.personnel-section {
  align-items: flex-end; /* 전체 섹션을 오른쪽 정렬 */
}

.personnel-title {
  align-self: flex-end; /* 제목을 오른쪽 정렬 */
}

.personnel-content {
  display: flex;
  justify-content: flex-end; /* PersonnelCounter를 오른쪽 정렬 */
  width: 100%;
}

.personnel-error {
  align-self: flex-end; /* 에러 메시지도 오른쪽 정렬 */
}

.form-inputs {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  position: relative;
  gap: 8px;
}

.project-title-input,
.project-subtitle-input, 
.project-description-textarea {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-white-solid, #FFF);
  position: relative;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  transition: all 0.3s ease;
  outline: none;
}

.project-title-input:focus,
.project-subtitle-input:focus, 
.project-description-textarea:focus {
  border-color: var(--www-freemoa-net-pumpkin, #FF7D12);
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.1);
  transform: translateY(-1px);
}

.project-title-input.error,
.project-subtitle-input.error,
.project-description-textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.project-description-textarea {
  height: 180px;
  resize: vertical;
  min-height: 120px;
  max-height: 400px;
}

.project-title-input::placeholder,
.project-subtitle-input::placeholder, 
.project-description-textarea::placeholder {
  color: var(--color-grey-67, #AAA);
}

.duration-input-group {
  display: flex;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  position: relative;
}

.duration-value-input {
  flex: 1;
  padding: 16px;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-white-solid, #FFF);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  transition: all 0.3s ease;
  outline: none;
}

.duration-value-input:focus {
  border-color: var(--www-freemoa-net-pumpkin, #FF7D12);
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.1);
}

.duration-value-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.duration-unit-select {
  padding: 16px;
  border-radius: 8px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-white-solid, #FFF);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  transition: all 0.3s ease;
  outline: none;
  cursor: pointer;
}

.duration-unit-select:focus {
  border-color: var(--www-freemoa-net-pumpkin, #FF7D12);
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.1);
}

.duration-unit-select.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.upload-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
}

.upload-note {
  color: var(--color-orange-57, #FE7C25);
  font-size: 13px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  padding: 8px 12px;
  background: rgba(254, 124, 37, 0.1);
  border-radius: 4px;
  border-left: 3px solid var(--color-orange-57, #FE7C25);
}

.submit-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 40px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-top: 1px solid var(--color-grey-91, #E8E8E8);
  position: relative;
}

.submit-button {
  display: flex;
  width: 100%;
  max-width: 300px;
  padding: 15px 30px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: var(--www-freemoa-net-pumpkin, #FF7D12);
  border: none;
  color: var(--color-white-solid, #FFF);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(255, 125, 18, 0.2);
}

.submit-button:hover:not(.disabled) {
  background: var(--www-freemoa-net-dark-pumpkin, #E66C00);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(255, 125, 18, 0.3);
}

.submit-button.disabled {
  background: var(--color-grey-75, #C0C0C0);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.submit-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mini-spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #FFF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

.form-error-summary {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  border-radius: 6px;
  background-color: #ffebe9;
  color: #dc3545;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  margin-top: 10px;
}

.form-error-summary i {
  font-size: 18px;
}

.error-message {
  color: #dc3545;
  font-size: 13px;
  margin-top: -5px; /* input-group gap에 의해 생기는 간격 조정 */
  align-self: flex-start; /* 왼쪽 정렬 */
  padding-left: 5px; /* 시각적 여백 */
}

/* 로딩 오버레이 */
.loading-overlay, .success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner, .success-card {
  background: #FFF;
  padding: 40px 60px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid var(--www-freemoa-net-pumpkin, #FF7D12);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--color-grey-15, #262626);
  font-size: 18px;
  font-weight: 600;
}

.success-icon {
  font-size: 60px;
  color: #28a745; /* Success green */
  margin-bottom: 10px;
}

.success-title {
  color: var(--color-grey-15, #262626);
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 25px;
}

.success-button {
  padding: 12px 25px;
  background: var(--www-freemoa-net-pumpkin, #FF7D12);
  border: none;
  border-radius: 6px;
  color: #FFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.success-button:hover {
  background: var(--www-freemoa-net-dark-pumpkin, #E66C00);
}

/* 반응형 헤더 */
@media (max-width: 768px) {
  .page-header {
    margin-bottom: 40px;
  }
  
  .header-content {
    padding: 40px 15px 30px 15px;
    gap: 16px;
  }
  
  .page-title {
    font-size: 32px;
    letter-spacing: -0.5px;
  }
  
  .title-underline {
    width: 60px;
    height: 3px;
  }
  
  .title-underline::after {
    width: 10px;
    height: 10px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>