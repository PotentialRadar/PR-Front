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

    <div class="form-container">
      <div class="form-content">
        <div class="form-section">
          <div class="section-header">
            <div class="section-title">새로운 프로젝트</div>
          </div>
          <div class="input-group">
            <input
              type="text"
              v-model="formData.projectTitle"
              :class="['project-title-input', { 'error': getError('projectTitle').value }]"
              placeholder="ex) 서비스 출시하기 까지, 신규 APP 개발 등"
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
              placeholder="프로젝트의 간략한 소제목을 입력해주세요."
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
                placeholder="숫자"
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
                placeholder="지금 서비스의 MVP 매뉴 개발하려 하니다.&#10;직업 이식의 개발팀을 전화한니다.&#10;상세 기술사량 업최년의 마로 문양 전축하고 싶습니다."
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
            <p class="upload-label">참고 파일</p>
            <p class="upload-note">* 향후의 파일은 전면 상담 메시지용 직접 첨부할 수 있으며, 프로젝트 공급 결과 파일 섭니다.</p>

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
import { ref, reactive, computed, onMounted } from 'vue'
// DateRangeInput 컴포넌트는 더 이상 사용되지 않으므로 주석 처리하거나 삭제합니다.
// import DateRangeInput from '@/components/projectComponents/DateRangeInput.vue'
import PersonnelCounter from '@/components/projectComponents/PersonnelCounter.vue'
import TechStackSelector from '@/components/projectComponents/TechStackSelector.vue'
import FileUploadArea from '@/components/projectComponents/FileUploadArea.vue'
import { useFormValidation } from '@/composables/useFormValidation.js'

export default {
  name: 'ProjectInquiryPage',
  components: {
    // DateRangeInput, // 제거
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

    const showSuccess = ref(false)

    const formData = reactive({
      projectTitle: '', // 프로젝트 제목 추가
      projectSubtitle: '', // 소제목 추가
      projectDurationValue: null, // 진행 기간 숫자 값
      projectDurationUnit: '',    // 진행 기간 단위
      // dateRange: { // 프로젝트 일정 제거에 따라 dateRange 속성도 제거
      //   startDate: '',
      //   endDate: ''
      // },
      personnel: 6,
      techStack: [],
      projectDescription: '',
      files: []
    })

    // Validation schema
    const validationSchema = {
      projectTitle: [ // 프로젝트 제목 유효성 검사 추가
        'required',
        { minLength: 5, message: '프로젝트 제목은 최소 5자 이상이어야 합니다.' },
        { maxLength: 100, message: '프로젝트 제목은 최대 100자까지 가능합니다.' }
      ],
      projectSubtitle: [ // 소제목 유효성 검사 추가 (선택 사항이라면 'required' 제거)
        // 'required', // 소제목이 필수라면 이 주석을 해제하세요.
        { maxLength: 200, message: '소제목은 최대 200자까지 가능합니다.' }
      ],
      projectDurationValue: [ // 진행 기간 숫자 값 유효성 검사 추가
        'required',
        (value) => {
          if (value === null || value === '' || isNaN(value) || value < 0) return '올바른 진행 기간 숫자를 입력해주세요.'
          return true
        }
      ],
      projectDurationUnit: [ // 진행 기간 단위 유효성 검사 추가
        'required',
        (value) => {
          if (!value) return '진행 기간 단위를 선택해주세요.'
          return true
        }
      ],
      // dateRange: [ // 프로젝트 일정 제거에 따라 dateRange 유효성 검사도 제거
      //   'required',
      //   (value) => {
      //     if (!value.startDate || !value.endDate) return '시작일과 종료일을 모두 입력해주세요.'
      //     if (new Date(value.endDate) <= new Date(value.startDate)) return '종료일은 시작일보다 늦어야 합니다.'
      //     return true
      //   }
      // ],
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
          // File size validation (5MB max per file)
          const maxSize = 5 * 1024 * 1024
          for (const file of files) {
            if (file.size > maxSize) {
              return `파일 크기는 5MB 이하여야 합니다: ${file.name}`
            }
          }
          // File type validation
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

    const submitForm = async () => {
      // 진행 기간 유효성 검사를 위해 추가합니다.
      validateField('projectDurationValue', formData.projectDurationValue, validationSchema.projectDurationValue);
      validateField('projectDurationUnit', formData.projectDurationUnit, validationSchema.projectDurationUnit);


      if (!validateForm(formData, validationSchema)) {
        return
      }

      isSubmitting.value = true

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Success
        showSuccess.value = true
        clearErrors()

        console.log('Form submitted successfully:', formData)

      } catch (error) {
        console.error('Submission error:', error)
        alert('등록 중 오류가 발생했습니다. 다시 시도해주세요.')
      } finally {
        isSubmitting.value = false
      }
    }

    const resetForm = () => {
      // Reset form data
      Object.assign(formData, {
        projectTitle: '',
        projectSubtitle: '',
        projectDurationValue: null,
        projectDurationUnit: '',
        // dateRange: { startDate: '', endDate: '' }, // 프로젝트 일정 제거에 따라 제거
        personnel: 6,
        techStack: [],
        projectDescription: '',
        files: []
      })

      clearErrors()
      showSuccess.value = false
    }

    // Auto-validate on data changes after submit attempt
    const watchedFields = computed(() => [
      formData.projectTitle,
      formData.projectSubtitle,
      formData.projectDurationValue,
      formData.projectDurationUnit,
      // formData.dateRange, // 프로젝트 일정 제거에 따라 제거
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
  padding: 168px 20px 100px 20px;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
  background: var(--color-white-solid, #FFF);
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
  margin-bottom: 30px;
  animation: fadeInUp 0.6s ease-out;
}

.duration-personnel-group {
  display: flex; /* 자식 요소들을 가로로 배열 */
  gap: 20px; /* 자식 요소들 사이의 간격 */
  align-self: stretch; /* 부모 너비에 맞춤 */
  margin-bottom: 30px; /* 다른 섹션과 동일한 하단 여백 */
}

.duration-personnel-group .form-section {
  flex: 1; /* 각 섹션이 사용 가능한 공간을 균등하게 분할 */
  margin-bottom: 0; /* 부모에 마진을 주었으므로 자식에서는 제거 */
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
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
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

.upload-label {
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.upload-note {
  color: var(--color-orange-57, #FE7C25);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
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