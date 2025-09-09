<template>
  <div class="portfolio-update-page">
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

        <!-- 자기소개 섹션 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title-group">
              <i class="bi bi-chat-quote section-icon"></i>
              <h2 class="section-title">자기소개</h2>
            </div>
            <div class="section-status" :class="{ 'completed': formData.introduction }">
              <i class="bi bi-check-circle-fill" v-if="formData.introduction"></i>
              <i class="bi bi-circle" v-else></i>
            </div>
          </div>

          <div class="section-content">
            <div class="input-group">
              <textarea
                v-model="formData.introduction"
                class="form-textarea"
                placeholder="자신을 소개하는 글을 작성해주세요"
                rows="6"
              ></textarea>
              <div class="textarea-info">
                <span class="char-count">{{ formData.introduction.length }}/500</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 교육 이력 섹션 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title-group">
              <i class="bi bi-mortarboard section-icon"></i>
              <h2 class="section-title">교육 이력</h2>
            </div>
            <div class="section-status" :class="{ 'completed': formData.educations.some(e => e.institution) }">
              <i class="bi bi-check-circle-fill" v-if="formData.educations.some(e => e.institution)"></i>
              <i class="bi bi-circle" v-else></i>
            </div>
          </div>

          <div class="section-content">
            <div class="education-list">
              <TransitionGroup name="list" tag="div">
                <div 
                  v-for="(education, index) in formData.educations" 
                  :key="`education-${index}`"
                  class="education-item"
                >
                  <div class="item-header">
                    <span class="item-number">{{ index + 1 }}</span>
                    <button 
                      v-if="formData.educations.length > 1" 
                      @click="removeEducation(index)" 
                      class="remove-btn"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  
                  <div class="item-content">
                    <div class="form-grid">
                      <div class="input-group">
                        <label class="input-label">기관명</label>
                        <input
                          type="text"
                          v-model="education.institution"
                          class="form-input"
                          placeholder="기관명을 입력해주세요"
                        />
                      </div>
                      
                      <div class="input-group">
                        <label class="input-label">전공/과정</label>
                        <input
                          type="text"
                          v-model="education.program"
                          class="form-input"
                          placeholder="전공 또는 과정명을 입력해주세요"
                        />
                      </div>
                      
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
                          :disabled="education.isOngoing"
                        />
                      </div>
                    </div>
                    
                    <div class="checkbox-group">
                      <input
                        type="checkbox"
                        :id="`ongoing-${index}`"
                        v-model="education.isOngoing"
                        @change="handleOngoingToggle(index)"
                      />
                      <label :for="`ongoing-${index}`">진행중</label>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
            
            <button @click="addEducation" class="add-item-btn">
              <i class="bi bi-plus-circle"></i>
              교육 이력 추가
            </button>
          </div>
        </div>

        <!-- 경력 섹션 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title-group">
              <i class="bi bi-briefcase section-icon"></i>
              <h2 class="section-title">경력</h2>
            </div>
            <div class="section-status" :class="{ 'completed': formData.careers.some(c => c.company) }">
              <i class="bi bi-check-circle-fill" v-if="formData.careers.some(c => c.company)"></i>
              <i class="bi bi-circle" v-else></i>
            </div>
          </div>

          <div class="section-content">
            <div class="career-list">
              <TransitionGroup name="list" tag="div">
                <div 
                  v-for="(career, index) in formData.careers" 
                  :key="`career-${index}`"
                  class="career-item"
                >
                  <div class="item-header">
                    <span class="item-number">{{ index + 1 }}</span>
                    <button 
                      v-if="formData.careers.length > 1" 
                      @click="removeCareer(index)" 
                      class="remove-btn"
                    >
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                  
                  <div class="item-content">
                    <div class="form-grid">
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
                    </div>
                    
                    <div class="checkbox-group">
                      <input
                        type="checkbox"
                        :id="`current-${index}`"
                        v-model="career.isCurrent"
                        @change="handleCurrentToggle(index)"
                      />
                      <label :for="`current-${index}`">현재 재직중</label>
                    </div>
                  </div>
                </div>
              </TransitionGroup>
            </div>
            
            <button @click="addCareer" class="add-item-btn">
              <i class="bi bi-plus-circle"></i>
              경력 추가
            </button>
          </div>
        </div>

        <!-- 기술 스택 섹션 -->
        <div class="form-section">
          <div class="section-header">
            <div class="section-title-group">
              <i class="bi bi-tools section-icon"></i>
              <h2 class="section-title">기술 스택</h2>
            </div>
            <div class="section-status" :class="{ 'completed': formData.skills.length > 0 }">
              <i class="bi bi-check-circle-fill" v-if="formData.skills.length > 0"></i>
              <i class="bi bi-circle" v-else></i>
            </div>
          </div>

          <div class="section-content">
            <TechStackSelector
              v-model="formData.skills"
              @change="handleSkillsChange"
            />
          </div>
        </div>

        <!-- 저장 섹션 -->
        <div class="save-section">
          <div class="save-card">
            <div class="save-info">
              <h3>포트폴리오 저장</h3>
              <p>모든 정보를 검토한 후 저장해주세요.</p>
            </div>
            <div class="save-actions">
              <button @click="resetForm" class="reset-btn">
                <i class="bi bi-arrow-clockwise"></i>
                초기화
              </button>
              <button 
                @click="savePortfolio" 
                :disabled="isSubmitting || !canSave"
                class="submit-btn"
                :class="{ 'loading': isSubmitting }"
              >
                <span v-if="!isSubmitting">
                  <i class="bi bi-check-lg"></i>
                  저장하기
                </span>
                <span v-else class="submit-loading">
                  <div class="mini-spinner"></div>
                  저장 중...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import TechStackSelector from '@/components/common/TechStackSelector.vue'

const router = useRouter()

const isSubmitting = ref(false)
const showSuccess = ref(false)

// 폼 데이터
const formData = reactive({
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  name: '김개발자',
  jobCategory: 'Frontend Developer',
  jobTitle: 'Senior Frontend Developer',
  introduction: '안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.',
  educations: [
    {
      institution: '서울대학교',
      program: '컴퓨터공학과',
      startDate: '2019-03',
      endDate: '2023-02',
      isOngoing: false
    }
  ],
  careers: [
    {
      company: 'Tech Startup A',
      position: 'Frontend Developer',
      startDate: '2023-09',
      endDate: '',
      isCurrent: true
    }
  ],
  skills: []
})

// Computed
const canSave = computed(() => {
  return formData.name && formData.jobCategory && formData.jobTitle
})

// Methods
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

const addEducation = () => {
  formData.educations.push({
    institution: '',
    program: '',
    startDate: '',
    endDate: '',
    isOngoing: false
  })
}

const removeEducation = (index) => {
  formData.educations.splice(index, 1)
}

const handleOngoingToggle = (index) => {
  if (formData.educations[index].isOngoing) {
    formData.educations[index].endDate = ''
  }
}

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

// 기술 스택 변경 처리
const handleSkillsChange = (skills) => {
  formData.skills = skills
  console.log('기술 스택 업데이트:', skills)
}

const previewPortfolio = () => {
  // 미리보기 모달 또는 새 탭에서 열기
  console.log('미리보기 열기')
}

const savePortfolio = async () => {
  if (!canSave.value) return

  isSubmitting.value = true

  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))
    showSuccess.value = true
    console.log('포트폴리오 저장 완료:', formData)
  } catch (error) {
    console.error('저장 실패:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  if (confirm('모든 입력 내용이 초기화됩니다. 계속하시겠습니까?')) {
    // 폼 초기화 로직
    console.log('폼 초기화')
  }
}

const goToPortfolio = () => {
  showSuccess.value = false
  router.push('/myPage/portfolio/1')
}

const continueEditing = () => {
  showSuccess.value = false
}
</script>

<style scoped>
.portfolio-update-page {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* 페이지 헤더 */
.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.preview-btn, .save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-btn {
  background: white;
  border: 2px solid #E0E0E0;
  color: #666;
}

.preview-btn:hover {
  border-color: #2196F3;
  color: #2196F3;
}

.save-btn {
  background: #4CAF50;
  border: none;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #66BB6A;
}

.save-btn:disabled {
  background: #C0C0C0;
  cursor: not-allowed;
}

/* 폼 컨테이너 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 폼 섹션 */
.form-section {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
}

.section-title-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 20px;
  color: #4CAF50;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.section-status {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.section-status.completed {
  color: #4CAF50;
}

.section-status:not(.completed) {
  color: #dee2e6;
}

.section-content {
  padding: 24px;
}

/* 폼 요소 */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.form-input, .form-select, .form-textarea {
  padding: 12px 16px;
  border: 2px solid #E5E5E5;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.textarea-info {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.char-count {
  font-size: 12px;
  color: #666;
}

/* 프로필 업로드 */
.profile-upload {
  display: flex;
  justify-content: flex-start;
}

.current-avatar {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid #E0E0E0;
  transition: border-color 0.3s ease;
}

.current-avatar:hover {
  border-color: #4CAF50;
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-avatar {
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #666;
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  font-size: 12px;
  gap: 4px;
}

.current-avatar:hover .avatar-overlay {
  opacity: 1;
}

/* 리스트 아이템 */
.education-list, .career-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

.education-item, .career-item {
  border: 2px solid rgba(76, 175, 80, 0.1);
  border-radius: 8px;
  padding: 20px;
  background: rgba(76, 175, 80, 0.02);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.item-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.checkbox-group label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

/* 기술 스택 */
.skills-input-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skill-input-group {
  display: flex;
  gap: 12px;
}

.skill-input-group .form-input {
  flex: 1;
}

.add-skill-btn {
  padding: 12px 16px;
  background: #4CAF50;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-skill-btn:hover:not(:disabled) {
  background: #66BB6A;
}

.add-skill-btn:disabled {
  background: #C0C0C0;
  cursor: not-allowed;
}

.skills-display {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed rgba(76, 175, 80, 0.3);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  color: #4CAF50;
  font-size: 13px;
  font-weight: 500;
}

.skill-remove {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  padding: 2px;
  font-size: 12px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.skill-remove:hover {
  background: rgba(76, 175, 80, 0.2);
}

/* 추가 버튼 */
.add-item-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background: rgba(76, 175, 80, 0.1);
  border: 2px dashed rgba(76, 175, 80, 0.3);
  border-radius: 8px;
  color: #4CAF50;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-item-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

/* 저장 섹션 */
.save-section {
  position: sticky;
  bottom: 20px;
  z-index: 10;
}

.save-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.save-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 4px 0;
}

.save-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.save-actions {
  display: flex;
  gap: 12px;
}

.reset-btn, .submit-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background: white;
  border: 2px solid #E0E0E0;
  color: #666;
}

.reset-btn:hover {
  border-color: #FFA726;
  color: #FFA726;
}

.submit-btn {
  background: #4CAF50;
  border: none;
  color: white;
  min-width: 120px;
}

.submit-btn:hover:not(:disabled) {
  background: #66BB6A;
}

.submit-btn:disabled {
  background: #C0C0C0;
  cursor: not-allowed;
}

.submit-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mini-spinner {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

/* 오버레이 */
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
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

.success-icon {
  font-size: 48px;
  color: #4CAF50;
}

.success-title {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.success-actions {
  display: flex;
  gap: 12px;
}

.success-button {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.success-button.primary {
  background: #4CAF50;
  border: none;
  color: white;
}

.success-button.primary:hover {
  background: #66BB6A;
}

.success-button.secondary {
  background: white;
  border: 2px solid #E0E0E0;
  color: #666;
}

.success-button.secondary:hover {
  border-color: #4CAF50;
  color: #4CAF50;
}

/* 애니메이션 */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 리스트 트랜지션 */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
  width: 100%;
}

/* 스킬 트랜지션 */
.skill-move,
.skill-enter-active,
.skill-leave-active {
  transition: all 0.2s ease;
}

.skill-enter-from,
.skill-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .portfolio-update-page {
    padding: 15px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .save-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .save-actions {
    width: 100%;
    justify-content: stretch;
  }

  .reset-btn, .submit-btn {
    flex: 1;
  }

  .skill-input-group {
    flex-direction: column;
  }

  .skills-list {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .portfolio-update-page {
    padding: 10px;
  }

  .page-header {
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .section-content {
    padding: 20px;
  }

  .education-item, .career-item {
    padding: 16px;
  }

  .form-grid {
    gap: 12px;
  }

  .header-actions {
    flex-direction: column;
    gap: 8px;
  }

  .preview-btn, .save-btn {
    width: 100%;
    justify-content: center;
  }

  .success-actions {
    flex-direction: column;
    width: 100%;
  }

  .success-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
        