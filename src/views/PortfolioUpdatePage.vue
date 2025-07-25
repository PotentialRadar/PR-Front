<template>
  <div class="portfolio-create-page">
    <div v-if="isSubmitting" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">포트폴리오를 저장 중입니다...</p>
      </div>
    </div>

    <div v-if="showSuccess" class="success-overlay">
      <div class="success-card">
        <div class="success-icon">
          <i class="bi bi-check-circle-fill"></i>
        </div>
        <h3 class="success-title">포트폴리오가 성공적으로 저장되었습니다!</h3>
        <button @click="goToPortfolio" class="success-button">포트폴리오 보기</button>
      </div>
    </div>

    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">포트폴리오 작성</h1>
          <div class="title-underline"></div>
        </div>
        <p class="page-subtitle">PR과 함께 나만의 포트폴리오를 작성해보세요</p>
      </div>
    </div>

    <div class="form-container">
      <div class="form-content">
        
        <!-- 기본 정보 섹션 -->
        <div class="form-section">
          <div class="section-title">기본 정보</div>

          <div class="input-group">
            <label class="input-label">프로필 사진</label>
            <div class="file-upload-area">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                style="display: none"
              />
              <div v-if="!formData.avatar" class="upload-placeholder" @click="$refs.fileInput.click()">
                <i class="bi bi-camera-fill"></i>
                <span>프로필 사진 업로드</span>
              </div>
              <div v-else class="uploaded-image" @click="$refs.fileInput.click()">
                <img :src="formData.avatar" alt="프로필" />
                <div class="image-overlay">
                  <i class="bi bi-camera-fill"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">닉네임</label>
            <input
              type="text"
              v-model="formData.username"
              :class="['form-input', { 'error': getError('username').value }]"
              placeholder="닉네임을 입력해주세요"
              @blur="validateField('username', formData.username, validationSchema.username)"
            />
            <div v-if="getError('username').value" class="error-message">
              {{ getError('username').value }}
            </div>
          </div>
          
          <div class="input-group">
            <label class="input-label">직무</label>
            <select
              v-model="formData.jobCategory"
              :class="['form-select', { 'error': getError('jobCategory').value }]"
              @blur="validateField('jobCategory', formData.jobCategory, validationSchema.jobCategory)"
            >
              <option value="">직무를 선택해주세요</option>
              <option value="Designer">Designer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Fullstack Developer">Fullstack Developer</option>
              <option value="Product Manager">Product Manager</option>
            </select>
            <div v-if="getError('jobCategory').value" class="error-message">
              {{ getError('jobCategory').value }}
            </div>
          </div>

          <div class="input-group">
            <label class="input-label">상세 직책</label>
            <input
              type="text"
              v-model="formData.jobTitle"
              :class="['form-input', { 'error': getError('jobTitle').value }]"
              placeholder="예: UI/UX 디자이너, 프론트엔드 개발자"
              @blur="validateField('jobTitle', formData.jobTitle, validationSchema.jobTitle)"
            />
            <div v-if="getError('jobTitle').value" class="error-message">
              {{ getError('jobTitle').value }}
            </div>
          </div>         
        </div>

        <!-- 자기소개 섹션 -->
        <div class="form-section">
          <div class="section-title">자기소개</div>
          <div class="input-group">
            <textarea
              v-model="formData.introduction"
              :class="['form-textarea', { 'error': getError('introduction').value }]"
              placeholder="자신을 소개하는 글을 작성해주세요"
              rows="6"
              @blur="validateField('introduction', formData.introduction, validationSchema.introduction)"
            ></textarea>
            <div v-if="getError('introduction').value" class="error-message">
              {{ getError('introduction').value }}
            </div>
          </div>
        </div>

        <!-- 교육 이력 섹션 -->
        <div class="form-section">
          <div class="section-title">교육 이력</div>
          <div class="education-list">
            <div 
              v-for="(education, index) in formData.educations" 
              :key="index"
              class="education-item"
            >
              <div class="education-header">
                <span class="education-number">{{ index + 1 }}.</span>
                <button v-if="formData.educations.length > 1" @click="removeEducation(index)" class="remove-button">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              
              <div class="education-inputs">
                <div class="input-group">
                  <label class="input-label">기관명</label>
                  <input
                    type="text"
                    v-model="education.school"
                    class="form-input"
                    placeholder="학교명을 입력해주세요"
                  />
                </div>
                
                <div class="input-group">
                  <label class="input-label">교육 내용</label>
                  <input
                    type="text"
                    v-model="education.major"
                    class="form-input"
                    placeholder="전공/학과를 입력해주세요"
                  />
                </div>
                
                <div class="date-group">
                  <div class="input-group">
                    <label class="input-label">시작일</label>
                    <input
                      type="month"
                      v-model="education.startDate"
                      class="form-input"
                    />
                  </div>
                  
                  <div class="input-group">
                    <label class="input-label">종료일</label>
                    <input
                      type="month"
                      v-model="education.endDate"
                      class="form-input"
                      :disabled="education.isCurrentlyEnrolled"
                    />
                  </div>
                  
                  <div class="current-checkbox">
                    <input
                      type="checkbox"
                      :id="`currently-enrolled-${index}`"
                      v-model="education.isCurrentlyEnrolled"
                      @change="handleCurrentlyEnrolledToggle(index)"
                    />
                    <label :for="`currently-enrolled-${index}`">진행중</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button @click="addEducation" class="add-button">
            <i class="bi bi-plus"></i>
            교육 이력 추가
          </button>
        </div>

        <!-- 경력 섹션 -->
        <div class="form-section">
          <div class="section-title">경력</div>
          <div class="career-list">
            <div 
              v-for="(career, index) in formData.careers" 
              :key="index"
              class="career-item"
            >
              <div class="career-header">
                <span class="career-number">{{ index + 1 }}.</span>
                <button v-if="formData.careers.length > 1" @click="removeCareer(index)" class="remove-button">
                  <i class="bi bi-x"></i>
                </button>
              </div>
              
              <div class="career-inputs">
                <div class="input-group">
                  <label class="input-label">회사명</label>
                  <input
                    type="text"
                    v-model="career.company"
                    class="form-input"
                    placeholder="회사명을 입력해주세요"
                  />
                </div>
                
                <div class="input-group">
                  <label class="input-label">직책</label>
                  <input
                    type="text"
                    v-model="career.position"
                    class="form-input"
                    placeholder="직책을 입력해주세요"
                  />
                </div>
                
                <div class="date-group">
                  <div class="input-group">
                    <label class="input-label">시작일</label>
                    <input
                      type="month"
                      v-model="career.startDate"
                      class="form-input"
                    />
                  </div>
                  
                  <div class="input-group">
                    <label class="input-label">종료일</label>
                    <input
                      type="month"
                      v-model="career.endDate"
                      class="form-input"
                      :disabled="career.isCurrent"
                    />
                  </div>
                  
                  <div class="current-checkbox">
                    <input
                      type="checkbox"
                      :id="`current-${index}`"
                      v-model="career.isCurrent"
                      @change="handleCurrentToggle(index)"
                    />
                    <label :for="`current-${index}`">재직중</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button @click="addCareer" class="add-button">
            <i class="bi bi-plus"></i>
            경력 추가
          </button>
        </div>

        <!-- 기술 스택 섹션 -->
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

        <!-- 프로젝트 섹션 -->
        <div class="form-section">
          <div class="section-title">프로젝트</div>
          

          <button @click="addProject" class="add-button">
            <i class="bi bi-plus"></i>
            프로젝트 추가
          </button>
        </div>

        <!-- 제출 버튼 -->
        <div class="submit-section">
          <button
            @click="submitForm"
            :disabled="isSubmitting || hasErrors"
            :class="['submit-button', { 'loading': isSubmitting, 'disabled': hasErrors }]"
          >
            <span v-if="!isSubmitting">포트폴리오 저장</span>
            <span v-else class="submit-loading">
              <div class="mini-spinner"></div>
              저장 중...
            </span>
          </button>

          <div v-if="submitAttempted && hasErrors" class="form-error-summary">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <span>입력 내용을 다시 확인해주세요.</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <ToastNotification
      v-if="toast.visible"
      :message="toast.message"
      :type="toast.type"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import TechStackSelector from '@/components/projectComponents/TechStackSelector.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'
import { useFormValidation } from '@/composables/useFormValidation.js'

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

// Toast notification state
const toast = reactive({
  visible: false,
  message: '',
  type: 'success'
})

const formData = reactive({
  username: '',
  jobCategory: '',
  jobTitle: '',
  handle: '',
  avatar: '',
  introduction: '',
  educations: [
    {
      school: '',
      major: '',
      degree: '',
      startDate: '',
      endDate: '',
      isCurrentlyEnrolled: false,
      gpa: ''
    }
  ],
  careers: [
    {
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false
    }
  ],
  techStack: [],
  projects: [
    {
      title: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
      image: ''
    }
  ]
})

const validationSchema = {
  username: [
    'required',
    { minLength: 2, message: '이름은 최소 2자 이상이어야 합니다.' }
  ],
  jobCategory: [
    'required'
  ],
  jobTitle: [
    'required'
  ],
  handle: [
    'required',
    { pattern: /^@[\w]+$/, message: '@로 시작하는 유효한 핸들을 입력해주세요.' }
  ],
  introduction: [
    { maxLength: 500, message: '자기소개는 최대 500자까지 가능합니다.' }
  ],
  techStack: []
}

// Methods
const showToast = (message, type = 'success') => {
  toast.visible = true
  toast.message = message
  toast.type = type
}

const hideToast = () => {
  toast.visible = false
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleProjectImageUpload = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.projects[index].image = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Education methods
const addEducation = () => {
  formData.educations.push({
    school: '',
    major: '',
    degree: '',
    startDate: '',
    endDate: '',
    isCurrentlyEnrolled: false,
    gpa: ''
  })
}

const removeEducation = (index) => {
  formData.educations.splice(index, 1)
}

const handleCurrentlyEnrolledToggle = (index) => {
  if (formData.educations[index].isCurrentlyEnrolled) {
    formData.educations[index].endDate = ''
  }
}

// Career methods
const addCareer = () => {
  formData.careers.push({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  })
}

const removeCareer = (index) => {
  formData.careers.splice(index, 1)
}

const handleCurrentToggle = (index) => {
  if (formData.careers[index].isCurrent) {
    formData.careers[index].endDate = ''
  }
}

// Project methods
const addProject = () => {
  formData.projects.push({
    title: '',
    role: '',
    description: '',
    startDate: '',
    endDate: '',
    image: ''
  })
}

const removeProject = (index) => {
  formData.projects.splice(index, 1)
}

const submitForm = async () => {
  if (!validateForm(formData, validationSchema)) {
    return
  }

  isSubmitting.value = true

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    showSuccess.value = true
    clearErrors()

    console.log('Portfolio submitted successfully:', formData)

  } catch (error) {
    console.error('Submission error:', error)
    showToast('저장 중 오류가 발생했습니다. 다시 시도해주세요.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const goToPortfolio = () => {
  // Navigate to portfolio page
  console.log('Navigate to portfolio page')
  showSuccess.value = false
}
</script>

<style scoped>
.portfolio-create-page {
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
  font-weight: 900;
  color: var(--color-grey-15, #262626);
  margin: 0;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #f5b387 0%, #f0a872 100%);
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
  background: #f5b387;
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
  0% { width: 0; }
  100% { width: 80px; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(245, 179, 135, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(245, 179, 135, 0); }
  100% { box-shadow: 0 0 0 0 rgba(245, 179, 135, 0); }
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

.form-container {
  display: flex;
  width: 100%;
  max-width: 800px;
  min-height: auto;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  position: relative;
}

.form-content {
  display: flex;
  width: 100%;
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
  margin-bottom: 50px;
  padding: 30px;
  background: #FFF;
  border-radius: 12px;
  border: 2px solid rgba(245, 179, 135, 0.1);
  box-shadow: 0 4px 12px rgba(245, 179, 135, 0.08);
}

.section-title {
  font-weight: 700;
  font-size: 20px;
  color: #f5b387;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(245, 179, 135, 0.2);
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  position: relative;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #38383A;
  margin-bottom: 4px;
}

.form-input,
.form-select,
.form-textarea {
  display: flex;
  padding: 16px;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px;
  border: 2px solid #E5E5E5;
  background: #FFF;
  font-size: 15px;
  color: #262626;
  transition: all 0.3s ease;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: #f5b387;
  box-shadow: 0 0 0 3px rgba(245, 179, 135, 0.1);
  transform: translateY(-1px);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.file-upload-area {
  border: 2px dashed rgba(245, 179, 135, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.file-upload-area:hover {
  border-color: #f5b387;
  background: rgba(245, 179, 135, 0.05);
}

.file-upload-area.small {
  padding: 15px;
  max-width: 200px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6F6F72;
}

.upload-placeholder i {
  font-size: 24px;
  color: #f5b387;
}

.uploaded-image {
  position: relative;
  display: inline-block;
}

.uploaded-image img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.uploaded-image:hover .image-overlay {
  opacity: 1;
}

.image-overlay i {
  color: white;
  font-size: 20px;
}

.education-list,
.career-list,
.project-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.education-item,
.career-item,
.project-item {
  border: 2px solid rgba(245, 179, 135, 0.2);
  border-radius: 8px;
  padding: 20px;
  background: rgba(245, 179, 135, 0.05);
}

.education-header,
.career-header,
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.education-number,
.career-number,
.project-number {
  font-weight: 700;
  color: #f5b387;
  font-size: 16px;
}

.remove-button {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.remove-button:hover {
  background: rgba(220, 53, 69, 0.1);
}

.education-inputs,
.career-inputs,
.project-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.date-group {
  display: flex;
  gap: 15px;
  align-items: flex-end;
}

.date-group .input-group {
  flex: 1;
}

.current-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 16px;
}

.current-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.current-checkbox label {
  font-size: 14px;
  color: #38383A;
  cursor: pointer;
}

.add-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(245, 179, 135, 0.1);
  border: 2px dashed rgba(245, 179, 135, 0.5);
  border-radius: 8px;
  color: #f5b387;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
}

.add-button:hover {
  background: rgba(245, 179, 135, 0.2);
  border-color: #f5b387;
}

.submit-section {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 40px;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  border-top: 1px solid #E8E8E8;
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
  background: #f5b387;
  border: none;
  color: #FFF;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.5;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(245, 179, 135, 0.2);
}

.submit-button:hover:not(.disabled) {
  background: #f0a872;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(245, 179, 135, 0.3);
}

.submit-button.disabled {
  background: #C0C0C0;
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
  align-self: flex-start;
  padding-left: 5px;
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
  border-top: 6px solid #f5b387;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: #262626;
  font-size: 18px;
  font-weight: 600;
}

.success-icon {
  font-size: 60px;
  color: #28a745;
  margin-bottom: 10px;
}

.success-title {
  color: #262626;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 25px;
}

.success-button {
  padding: 12px 25px;
  background: #f5b387;
  border: none;
  border-radius: 6px;
  color: #FFF;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.success-button:hover {
  background: #f0a872;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 반응형 */
@media (max-width: 768px) {
  .portfolio-create-page {
    padding: 50px 15px;
  }

  .page-header {
    margin-bottom: 40px;
  }

  .header-content {
    padding: 30px 15px;
    gap: 16px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .form-container {
    max-width: 100%;
  }

  .form-section {
    padding: 20px;
    margin-bottom: 30px;
  }

  .section-title {
    font-size: 18px;
  }

  .date-group {
    flex-direction: column;
    gap: 10px;
  }

  .current-checkbox {
    padding-bottom: 0;
  }
}

@media (max-width: 480px) {
  .portfolio-create-page {
    padding: 30px 10px;
  }

  .header-content {
    padding: 20px 10px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .form-section {
    padding: 15px;
    margin-bottom: 20px;
  }

  .section-title {
    font-size: 16px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    padding: 12px;
    font-size: 14px;
  }

  .education-item,
  .career-item,
  .project-item {
    padding: 15px;
  }

  .uploaded-image img {
    width: 80px;
    height: 80px;
  }
}

</style>