<template>
  <div class="profile-edit-page">
    <div class="page-header">
      <div class="header-content">
        <button @click="goBack" class="back-button">
          <i class="bi bi-arrow-left"></i>
          돌아가기
        </button>
        <h1 class="page-title">내 정보 수정</h1>
      </div>
    </div>

    <div class="edit-container">
      <form @submit.prevent="saveProfile" class="profile-form">
        <!-- 프로필 이미지 섹션 -->
        <div class="form-section">
          <h3 class="section-title">프로필 이미지</h3>
          <div class="profile-image-section">
            <div class="current-avatar">
              <img :src="formData.avatar" :alt="formData.name" />
              <div class="avatar-overlay">
                <i class="bi bi-camera"></i>
              </div>
            </div>
            
            <div class="avatar-options">
              <p class="avatar-description">프로필 이미지를 선택하세요</p>
              <div class="avatar-grid">
                <div 
                  v-for="(avatarUrl, index) in avatarOptions" 
                  :key="index"
                  @click="selectAvatar(avatarUrl)"
                  :class="['avatar-option', { active: formData.avatar === avatarUrl }]"
                >
                  <img :src="avatarUrl" :alt="`아바타 ${index + 1}`" />
                  <div v-if="formData.avatar === avatarUrl" class="selected-indicator">
                    <i class="bi bi-check-circle-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 기본 정보 섹션 -->
        <div class="form-section">
          <h3 class="section-title">기본 정보</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="name">
                이름 <span class="required">*</span>
              </label>
              <input
                id="name"
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="이름을 입력하세요"
                required
                maxlength="20"
              />
              <div class="input-helper">{{ formData.name.length }}/20</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="jobTitle">
                직책 <span class="required">*</span>
              </label>
              <input
                id="jobTitle"
                v-model="formData.jobTitle"
                type="text"
                class="form-input"
                placeholder="예: Senior Frontend Developer"
                required
                maxlength="50"
              />
              <div class="input-helper">{{ formData.jobTitle.length }}/50</div>
            </div>

            <div class="form-group">
              <label class="form-label" for="category">
                분야 <span class="required">*</span>
              </label>
              <select
                id="category"
                v-model="formData.category"
                class="form-select"
                required
              >
                <option value="">분야를 선택하세요</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="Mobile">Mobile</option>
                <option value="DevOps">DevOps</option>
                <option value="Data">Data</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Design">Design</option>
                <option value="PM">PM</option>
                <option value="QA">QA</option>
                <option value="Other">기타</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="experience">
                경력
              </label>
              <select
                id="experience"
                v-model="formData.experience"
                class="form-select"
              >
                <option value="">경력을 선택하세요</option>
                <option value="신입">신입</option>
                <option value="1년 미만">1년 미만</option>
                <option value="1-3년">1-3년</option>
                <option value="3-5년">3-5년</option>
                <option value="5-10년">5-10년</option>
                <option value="10년 이상">10년 이상</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 연락처 정보 섹션 -->
        <div class="form-section">
          <h3 class="section-title">연락처 정보</h3>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label" for="email">
                이메일
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-input"
                placeholder="example@email.com"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="phone">
                전화번호
              </label>
              <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                class="form-input"
                placeholder="010-1234-5678"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="github">
                GitHub
              </label>
              <input
                id="github"
                v-model="formData.github"
                type="url"
                class="form-input"
                placeholder="https://github.com/username"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="linkedin">
                LinkedIn
              </label>
              <input
                id="linkedin"
                v-model="formData.linkedin"
                type="url"
                class="form-input"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="website">
                개인 웹사이트
              </label>
              <input
                id="website"
                v-model="formData.website"
                type="url"
                class="form-input"
                placeholder="https://mywebsite.com"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="location">
                지역
              </label>
              <input
                id="location"
                v-model="formData.location"
                type="text"
                class="form-input"
                placeholder="서울, 대한민국"
              />
            </div>
          </div>
        </div>

        <!-- 소개 섹션 -->
        <div class="form-section">
          <h3 class="section-title">한줄 소개</h3>
          <div class="form-group">
            <label class="form-label" for="bio">
              간단한 소개
            </label>
            <textarea
              id="bio"
              v-model="formData.bio"
              class="form-textarea"
              placeholder="간단한 자기소개를 작성해보세요"
              rows="3"
              maxlength="200"
            ></textarea>
            <div class="input-helper">{{ formData.bio.length }}/200</div>
          </div>
        </div>

        <!-- 공개 설정 섹션 -->
        <div class="form-section">
          <h3 class="section-title">공개 설정</h3>
          <div class="privacy-settings">
            <div class="privacy-item">
              <div class="privacy-info">
                <h4>포트폴리오 공개</h4>
                <p>다른 사용자가 내 포트폴리오를 볼 수 있습니다</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.isPublic" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="privacy-item">
              <div class="privacy-info">
                <h4>연락처 공개</h4>
                <p>포트폴리오에서 연락처 정보를 표시합니다</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.showContact" />
                <span class="toggle-slider"></span>
              </label>
            </div>

            <div class="privacy-item">
              <div class="privacy-info">
                <h4>검색 허용</h4>
                <p>검색 결과에 내 프로필이 나타날 수 있습니다</p>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" v-model="formData.allowSearch" />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- 저장 버튼 -->
        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-button">
            <i class="bi bi-arrow-clockwise"></i>
            초기화
          </button>
          <button type="submit" :disabled="saving" class="save-button">
            <i v-if="saving" class="bi bi-hourglass-split spinning"></i>
            <i v-else class="bi bi-check"></i>
            {{ saving ? '저장 중...' : '저장하기' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 저장 완료 토스트 -->
    <Transition name="toast">
      <div v-if="showSaveToast" class="save-toast">
        <i class="bi bi-check-circle-fill"></i>
        프로필이 저장되었습니다!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const saving = ref(false)
const showSaveToast = ref(false)

// 아바타 옵션들
const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=9',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=10',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=11',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=12'
]

// 기본 데이터 (현재 사용자 정보)
const originalData = {
  name: '김개발자',
  jobTitle: 'Senior Frontend Developer',
  category: 'Frontend',
  experience: '3-5년',
  email: 'kim.developer@example.com',
  phone: '010-1234-5678',
  github: 'https://github.com/kimdev',
  linkedin: 'https://linkedin.com/in/kimdev',
  website: 'https://kimdev.portfolio.com',
  location: '서울, 대한민국',
  bio: '사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
  isPublic: true,
  showContact: true,
  allowSearch: true
}

// 폼 데이터
const formData = reactive({
  ...originalData
})

// 메서드
const selectAvatar = (avatarUrl) => {
  formData.avatar = avatarUrl
}

const saveProfile = async () => {
  saving.value = true
  
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 실제로는 API 호출
    console.log('저장할 데이터:', formData)
    
    showSaveToast.value = true
    setTimeout(() => showSaveToast.value = false, 3000)
    
  } catch (error) {
    console.error('프로필 저장 실패:', error)
    alert('프로필 저장에 실패했습니다. 다시 시도해주세요.')
  } finally {
    saving.value = false
  }
}

const resetForm = () => {
  if (confirm('모든 변경사항이 초기화됩니다. 계속하시겠습니까?')) {
    Object.assign(formData, originalData)
  }
}

const goBack = () => {
  if (hasChanges()) {
    if (confirm('저장하지 않은 변경사항이 있습니다. 정말 나가시겠습니까?')) {
      router.back()
    }
  } else {
    router.back()
  }
}

const hasChanges = () => {
  return JSON.stringify(formData) !== JSON.stringify(originalData)
}

// 페이지를 떠날 때 확인
const handleBeforeUnload = (event) => {
  if (hasChanges()) {
    event.preventDefault()
    event.returnValue = ''
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
</script>

<style scoped>
.profile-edit-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;
}

.page-header {
  max-width: 800px;
  margin: 0 auto 30px auto;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.back-button:hover {
  background: #f8f9fa;
  border-color: #4CAF50;
  color: #4CAF50;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.edit-container {
  max-width: 800px;
  margin: 0 auto;
}

.profile-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.form-section {
  padding: 30px;
  border-bottom: 1px solid #f0f0f0;
}

.form-section:last-child {
  border-bottom: none;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #4CAF50;
  margin: 0 0 24px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(76, 175, 80, 0.1);
}

.profile-image-section {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.current-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #E0E0E0;
  flex-shrink: 0;
}

.current-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  color: white;
  font-size: 24px;
}

.current-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-options {
  flex: 1;
}

.avatar-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 14px;
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 12px;
}

.avatar-option {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.avatar-option:hover {
  border-color: #4CAF50;
  transform: scale(1.05);
}

.avatar-option.active {
  border-color: #4CAF50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.avatar-option img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.selected-indicator {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #dc3545;
}

.form-input, .form-select, .form-textarea {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s ease;
  outline: none;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
}

.input-helper {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.privacy-settings {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.privacy-info h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.privacy-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4CAF50;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.form-actions {
  padding: 30px;
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.reset-button, .save-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reset-button {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.reset-button:hover {
  background: #f8f9fa;
  border-color: #999;
}

.save-button {
  background: #4CAF50;
  color: white;
  min-width: 140px;
}

.save-button:hover:not(:disabled) {
  background: #66BB6A;
}

.save-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.save-toast {
  position: fixed;
  top: 80px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  z-index: 1000;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .profile-edit-page {
    padding: 15px;
  }

  .profile-image-section {
    flex-direction: column;
    gap: 20px;
  }

  .current-avatar {
    align-self: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .privacy-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}

@media (max-width: 480px) {
  .profile-edit-page {
    padding: 10px;
  }

  .form-section {
    padding: 20px;
  }

  .avatar-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>