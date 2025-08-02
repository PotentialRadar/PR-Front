</div>
              </div>
            </div>
          </div>

          <!-- 알림 설정 -->
          <div v-if="activeTab === 'notifications'" class="settings-section">
            <div class="section-header">
              <h2>알림 설정</h2>
              <p>받고 싶은 알림의 종류를 선택하세요</p>
            </div>

            <div class="settings-form">
              <div class="notification-groups">
                <div v-for="group in notificationGroups" :key="group.id" class="notification-group">
                  <h3>{{ group.title }}</h3>
                  <p class="group-description">{{ group.description }}</p>
                  
                  <div class="notification-items">
                    <div v-for="item in group.items" :key="item.id" class="notification-item">
                      <div class="notification-info">
                        <h4>{{ item.title }}</h4>
                        <p>{{ item.description }}</p>
                      </div>
                      <div class="notification-controls">
                        <label class="toggle-switch">
                          <input 
                            type="checkbox" 
                            v-model="notificationSettings[item.id]"
                            @change="updateNotificationSetting(item.id)"
                          />
                          <span class="toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 개인정보 -->
          <div v-if="activeTab === 'privacy'" class="settings-section">
            <div class="section-header">
              <h2>개인정보 설정</h2>
              <p>개인정보 공개 범위 및 계정 관리 옵션을 설정하세요</p>
            </div>

            <div class="settings-form">
              <!-- 프로필 공개 설정 -->
              <div class="privacy-group">
                <h3>프로필 공개 설정</h3>
                
                <div class="privacy-item">
                  <div class="privacy-info">
                    <h4>포트폴리오 공개</h4>
                    <p>다른 사용자들이 내 포트폴리오를 볼 수 있습니다</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      v-model="privacySettings.portfolioPublic"
                      @change="updatePrivacySetting('portfolioPublic')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <div class="privacy-item">
                  <div class="privacy-info">
                    <h4>연락처 공개</h4>
                    <p>다른 사용자들이 나에게 메시지를 보낼 수 있습니다</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      v-model="privacySettings.contactVisible"
                      @change="updatePrivacySetting('contactVisible')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>

                <div class="privacy-item">
                  <div class="privacy-info">
                    <h4>온라인 상태 표시</h4>
                    <p>다른 사용자들이 내 온라인 상태를 볼 수 있습니다</p>
                  </div>
                  <label class="toggle-switch">
                    <input 
                      type="checkbox" 
                      v-model="privacySettings.onlineStatus"
                      @change="updatePrivacySetting('onlineStatus')"
                    />
                    <span class="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <!-- 데이터 관리 -->
              <div class="data-management">
                <h3>데이터 관리</h3>
                
                <div class="data-actions">
                  <div class="data-action-item">
                    <div class="action-info">
                      <h4>데이터 내보내기</h4>
                      <p>내 계정의 모든 데이터를 다운로드받을 수 있습니다</p>
                    </div>
                    <button @click="exportData" class="action-btn secondary">
                      <i class="bi bi-download"></i>
                      데이터 내보내기
                    </button>
                  </div>

                  <div class="data-action-item danger-zone">
                    <div class="action-info">
                      <h4>계정 삭제</h4>
                      <p>계정을 영구적으로 삭제합니다. 이 작업은 되돌릴 수 없습니다</p>
                    </div>
                    <button @click="showDeleteModal = true" class="action-btn danger">
                      <i class="bi bi-trash"></i>
                      계정 삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 계정 삭제 확인 모달 -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h3>계정 삭제 확인</h3>
          <button @click="showDeleteModal = false" class="modal-close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="warning-icon">
            <i class="bi bi-exclamation-triangle"></i>
          </div>
          <p><strong>정말로 계정을 삭제하시겠습니까?</strong></p>
          <p>계정을 삭제하면 다음 데이터가 영구적으로 삭제됩니다:</p>
          <ul>
            <li>프로필 정보 및 포트폴리오</li>
            <li>등록한 모든 프로젝트</li>
            <li>메시지 및 활동 기록</li>
            <li>즐겨찾기 및 설정</li>
          </ul>
          <p class="warning-text">이 작업은 되돌릴 수 없습니다.</p>
          
          <div class="confirmation-input">
            <label>계속하려면 "<strong>계정삭제</strong>"를 입력하세요:</label>
            <input 
              v-model="deleteConfirmation" 
              type="text" 
              class="form-input"
              placeholder="계정삭제"
            />
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="showDeleteModal = false" class="cancel-btn">취소</button>
          <button 
            @click="deleteAccount" 
            :disabled="deleteConfirmation !== '계정삭제' || isDeletingAccount"
            class="delete-btn"
          >
            <i v-if="isDeletingAccount" class="bi bi-arrow-clockwise spinning"></i>
            <i v-else class="bi bi-trash"></i>
            {{ isDeletingAccount ? '삭제 중...' : '계정 삭제' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 성공 토스트 -->
    <Transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        <i :class="toastIcon"></i>
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 탭 설정
const tabs = [
  { id: 'profile', title: '프로필', icon: 'bi bi-person' },
  { id: 'security', title: '보안', icon: 'bi bi-shield-lock' },
  { id: 'notifications', title: '알림', icon: 'bi bi-bell' },
  { id: 'privacy', title: '개인정보', icon: 'bi bi-lock' }
]

const activeTab = ref('profile')

// 상태 관리
const isSaving = ref(false)
const isChangingPassword = ref(false)
const isDeletingAccount = ref(false)
const showDeleteModal = ref(false)
const deleteConfirmation = ref('')

// 토스트 알림
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// 프로필 데이터
const profileData = reactive({
  name: '김개발자',
  nickname: 'frontend_dev',
  jobCategory: 'Frontend Developer',
  bio: '사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
})

// 보안 데이터
const securityData = reactive({
  email: 'user@example.com',
  twoFactorEnabled: false
})

// 비밀번호 데이터
const passwordData = reactive({
  current: '',
  new: '',
  confirm: ''
})

const showPasswords = reactive({
  current: false,
  new: false,
  confirm: false
})

// 닉네임 확인
const nicknameCheck = reactive({
  checking: false,
  available: null
})

// 알림 설정
const notificationGroups = [
  {
    id: 'projects',
    title: '프로젝트 관련',
    description: '프로젝트 참여, 신청, 업데이트 관련 알림',
    items: [
      { id: 'project_applications', title: '프로젝트 지원', description: '내가 등록한 프로젝트에 지원이 들어왔을 때' },
      { id: 'project_updates', title: '프로젝트 업데이트', description: '참여 중인 프로젝트의 상태가 변경되었을 때' },
      { id: 'project_messages', title: '프로젝트 메시지', description: '프로젝트 관련 메시지를 받았을 때' }
    ]
  },
  {
    id: 'portfolio',
    title: '포트폴리오 관련',
    description: '포트폴리오 조회, 좋아요, 연락 관련 알림',
    items: [
      { id: 'portfolio_views', title: '포트폴리오 조회', description: '다른 사용자가 내 포트폴리오를 조회했을 때' },
      { id: 'portfolio_likes', title: '포트폴리오 좋아요', description: '내 포트폴리오에 좋아요를 받았을 때' },
      { id: 'contact_requests', title: '연락 요청', description: '다른 사용자가 연락을 요청했을 때' }
    ]
  },
  {
    id: 'system',
    title: '시스템 알림',
    description: '서비스 업데이트, 보안 관련 알림',
    items: [
      { id: 'system_updates', title: '서비스 업데이트', description: '새로운 기능이나 중요한 업데이트가 있을 때' },
      { id: 'security_alerts', title: '보안 알림', description: '로그인, 비밀번호 변경 등 보안 관련 활동' },
      { id: 'marketing', title: '마케팅 정보', description: '이벤트, 프로모션 등 마케팅 정보' }
    ]
  }
]

const notificationSettings = reactive({
  project_applications: true,
  project_updates: true,
  project_messages: true,
  portfolio_views: false,
  portfolio_likes: true,
  contact_requests: true,
  system_updates: true,
  security_alerts: true,
  marketing: false
})

// 개인정보 설정
const privacySettings = reactive({
  portfolioPublic: true,
  contactVisible: true,
  onlineStatus: false
})

// Computed
const passwordStrength = computed(() => {
  const password = passwordData.new
  if (!password) return { level: '', width: 0, text: '' }
  
  let score = 0
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  ]
  
  score = checks.filter(Boolean).length
  
  if (score < 2) return { level: 'weak', width: 20, text: '약함' }
  if (score < 4) return { level: 'medium', width: 60, text: '보통' }
  return { level: 'strong', width: 100, text: '강함' }
})

const canChangePassword = computed(() => {
  return passwordData.current && 
         passwordData.new && 
         passwordData.confirm && 
         passwordData.new === passwordData.confirm &&
         passwordStrength.value.level !== 'weak'
})

const toastIcon = computed(() => {
  return toastType.value === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-circle'
})

// Methods
const setActiveTab = (tab) => {
  activeTab.value = tab
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileData.avatar = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  profileData.avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
}

const checkNickname = async () => {
  if (!profileData.nickname || profileData.nickname === 'frontend_dev') {
    nicknameCheck.available = null
    return
  }
  
  nicknameCheck.checking = true
  nicknameCheck.available = null
  
  // API 호출 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 임시 로직 (실제로는 API에서 확인)
  const unavailableNicknames = ['admin', 'test', 'user', 'developer']
  nicknameCheck.available = !unavailableNicknames.includes(profileData.nickname.toLowerCase())
  nicknameCheck.checking = false
}

const saveProfile = async () => {
  isSaving.value = true
  
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    showToastMessage('프로필이 성공적으로 저장되었습니다!', 'success')
  } catch (error) {
    showToastMessage('프로필 저장에 실패했습니다.', 'error')
  } finally {
    isSaving.value = false
  }
}

const togglePassword = (field) => {
  showPasswords[field] = !showPasswords[field]
}

const checkPasswordStrength = () => {
  // 패스워드 강도는 computed에서 자동 계산됨
}

const changePassword = async () => {
  if (!canChangePassword.value) return
  
  isChangingPassword.value = true
  
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 비밀번호 필드 초기화
    passwordData.current = ''
    passwordData.new = ''
    passwordData.confirm = ''
    
    showToastMessage('비밀번호가 성공적으로 변경되었습니다!', 'success')
  } catch (error) {
    showToastMessage('비밀번호 변경에 실패했습니다.', 'error')
  } finally {
    isChangingPassword.value = false
  }
}

const toggleTwoFactor = () => {
  // 2단계 인증 토글 로직
  securityData.twoFactorEnabled = !securityData.twoFactorEnabled
  const message = securityData.twoFactorEnabled ? 
    '2단계 인증이 활성화되었습니다.' : 
    '2단계 인증이 비활성화되었습니다.'
  showToastMessage(message, 'success')
}

const updateNotificationSetting = (settingId) => {
  // 알림 설정 업데이트 API 호출
  console.log(`알림 설정 업데이트: ${settingId} = ${notificationSettings[settingId]}`)
}

const updatePrivacySetting = (settingId) => {
  // 개인정보 설정 업데이트 API 호출
  console.log(`개인정보 설정 업데이트: ${settingId} = ${privacySettings[settingId]}`)
}

const exportData = async () => {
  try {
    // 데이터 내보내기 API 호출
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToastMessage('데이터 내보내기가 시작되었습니다. 이메일로 다운로드 링크를 보내드립니다.', 'success')
  } catch (error) {
    showToastMessage('데이터 내보내기에 실패했습니다.', 'error')
  }
}

const deleteAccount = async () => {
  if (deleteConfirmation.value !== '계정삭제') return
  
  isDeletingAccount.value = true
  
  try {
    // 계정 삭제 API 호출
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 로그아웃 및 홈으로 리다이렉트
    router.push('/')
    showToastMessage('계정이 성공적으로 삭제되었습니다.', 'success')
  } catch (error) {
    showToastMessage('계정 삭제에 실패했습니다.', 'error')
  } finally {
    isDeletingAccount.value = false
    showDeleteModal.value = false
    deleteConfirmation.value = ''
  }
}

const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => showToast.value = false, 4000)
}

onMounted(() => {
  // 초기 데이터 로드
})
</script>

<style scoped>
.account-settings-page {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 페이지 헤더 */
.page-header {
  margin-bottom: 30px;
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

/* Settings Container */
.settings-container {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  align-items: start;
}

/* Settings Sidebar */
.settings-sidebar {
  background: white;
  border-radius: 12px;
  padding: 20px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
}

.tab-nav {
  display: flex;
  flex-direction: column;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border: none;
  background: none;
  color: #666;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.tab-button:hover {
  background: rgba(76, 175, 80, 0.05);
  color: #4CAF50;
}

.tab-button.active {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border-left-color: #4CAF50;
  font-weight: 600;
}

.tab-button i {
  font-size: 16px;
}

/* Settings Content */
.settings-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.settings-section {
  padding: 30px;
}

.section-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
}

.section-header p {
  color: #666;
  margin: 0;
}

/* Form Styles */
.settings-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-input, .form-select, .form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  outline: none;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.char-count {
  text-align: right;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

/* Profile Photo Section */
.profile-photo-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.current-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #e5e5e5;
}

.current-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-actions {
  display: flex;
  gap: 12px;
}

.upload-btn, .remove-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn {
  background: #4CAF50;
  color: white;
  border: none;
}

.upload-btn:hover {
  background: #66BB6A;
}

.remove-btn {
  background: #f8f9fa;
  color: #dc3545;
  border: 2px solid #e5e5e5;
}

.remove-btn:hover {
  background: #ffe6e6;
  border-color: #dc3545;
}

/* Nickname Validation */
.input-with-validation {
  position: relative;
}

.validation-status {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.validation-status.checking {
  color: #666;
}

.validation-status.available {
  color: #28a745;
}

.validation-status.unavailable {
  color: #dc3545;
}

.validation-status i {
  font-size: 14px;
}

/* Password Section */
.password-section, .two-factor-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.password-section h3, .two-factor-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 20px 0;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  font-size: 16px;
}

.password-toggle:hover {
  color: #4CAF50;
}

/* Password Strength */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e5e5e5;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.weak {
  background: #dc3545;
}

.strength-fill.medium {
  background: #ffc107;
}

.strength-fill.strong {
  background: #28a745;
}

.strength-text {
  font-size: 12px;
  font-weight: 500;
}

.strength-text.weak {
  color: #dc3545;
}

.strength-text.medium {
  color: #ffc107;
}

.strength-text.strong {
  color: #28a745;
}

.error-message {
  color: #dc3545;
  font-size: 12px;
  margin-top: 4px;
}

/* Two Factor */
.two-factor-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.two-factor-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.two-factor-info i {
  font-size: 24px;
  color: #4CAF50;
}

.two-factor-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
}

.two-factor-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.toggle-btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #e5e5e5;
  background: white;
  color: #666;
}

.toggle-btn:hover {
  border-color: #4CAF50;
  color: #4CAF50;
}

.toggle-btn.enabled {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

/* Form Actions */
.form-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.save-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 140px;
  justify-content: center;
}

.save-btn:hover:not(:disabled) {
  background: #66BB6A;
}

.save-btn:disabled {
  background: #c0c0c0;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Notification Settings */
.notification-groups {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.notification-group h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.group-description {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
}

.notification-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.notification-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
}

.notification-info p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
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
  transform: translateX(20px);
}

/* Privacy Settings */
.privacy-group {
  margin-bottom: 40px;
}

.privacy-group h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 20px 0;
}

.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #e9ecef;
}

.privacy-item:last-child {
  border-bottom: none;
}

.privacy-info h4 {
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
}

.privacy-info p {
  font-size: 13px;
  color: #666;
  margin: 0;
}

/* Data Management */
.data-management {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.data-management h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 20px 0;
}

.data-actions {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.data-action-item.danger-zone {
  background: #fff5f5;
  border-color: #fecaca;
}

.action-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
}

.action-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;
}

.action-btn.secondary {
  background: white;
  color: #666;
  border-color: #e5e5e5;
}

.action-btn.secondary:hover {
  background: #f8f9fa;
  border-color: #4CAF50;
  color: #4CAF50;
}

.action-btn.danger {
  background: white;
  color: #dc3545;
  border-color: #dc3545;
}

.action-btn.danger:hover {
  background: #dc3545;
  color: white;
}

/* Modal */
.modal-overlay {
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

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  font-size: 20px;
}

.modal-close:hover {
  color: #dc3545;
}

.modal-body {
  padding: 24px;
  text-align: center;
}

.warning-icon {
  width: 60px;
  height: 60px;
  background: rgba(220, 53, 69, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.warning-icon i {
  font-size: 24px;
  color: #dc3545;
}

.modal-body p {
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.modal-body ul {
  text-align: left;
  margin: 16px 0;
  padding-left: 20px;
}

.modal-body li {
  margin: 8px 0;
}

.warning-text {
  color: #dc3545;
  font-weight: 600;
}

.confirmation-input {
  margin-top: 20px;
  text-align: left;
}

.confirmation-input label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.cancel-btn, .delete-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid;
  display: flex;
  align-items: center;
  gap: 6px;
}

.cancel-btn {
  background: white;
  color: #666;
  border-color: #e5e5e5;
}

.cancel-btn:hover {
  background: #f8f9fa;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border-color: #dc3545;
  min-width: 120px;
  justify-content: center;
}

.delete-btn:hover:not(:disabled) {
  background: #c82333;
}

.delete-btn:disabled {
  background: #c0c0c0;
  border-color: #c0c0c0;
  cursor: not-allowed;
}

/* Toast */
.toast {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 16px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 300px;
}

.toast.success {
  background: #28a745;
}

.toast.error {
  background: #dc3545;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Email Field */
.email-field {
  position: relative;
  display: flex;
  align-items: center;
}

.verified-badge {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #28a745;
  font-weight: 500;
}

.verified-badge i {
  font-size: 14px;
}

/* Responsive */
@media (max-width: 768px) {
  .account-settings-page {
    padding: 15px;
  }

  .settings-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .settings-sidebar {
    position: static;
  }

  .tab-nav {
    flex-direction: row;
    overflow-x: auto;
    padding: 0 10px;
  }

  .tab-button {
    white-space: nowrap;
    border-left: none;
    border-bottom: 3px solid transparent;
  }

  .tab-button.active {
    border-left: none;
    border-bottom-color: #4CAF50;
  }

  .settings-section {
    padding: 20px;
  }

  .profile-photo-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 16px;
  }

  .notification-item, .privacy-item, .data-action-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .notification-controls, .toggle-switch {
    align-self: flex-end;
  }

  .modal-container {
    width: 95%;
    margin: 20px;
  }

  .modal-footer {
    flex-direction: column-reverse;
  }

  .cancel-btn, .delete-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }

  .settings-section {
    padding: 15px;
  }

  .section-header {
    margin-bottom: 20px;
  }

  .section-header h2 {
    font-size: 20px;
  }

  .toast {
    right: 10px;
    left: 10px;
    min-width: auto;
  }
}
</style>