<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">팀원 초대</h3>
        <button class="close-button" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="modal-body">
        <div class="project-info">
          <h4>{{ projectTitle }}</h4>
          <p>프로젝트에 참여할 팀원을 초대해보세요.</p>
        </div>

        <!-- 이메일/닉네임으로 검색 -->
        <div class="search-section">
          <h5>팀원 검색 및 초대</h5>
          <div class="search-input-group">
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="이메일 주소 또는 닉네임을 입력하세요"
              @keyup.enter="searchUser"
            />
            <button class="search-button" @click="searchUser" :disabled="!searchQuery.trim() || isLoading">
              <i class="bi bi-search" v-if="!isLoading"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="isLoading"></i>
              {{ isLoading ? '검색 중...' : '검색' }}
            </button>
          </div>

          <!-- 검색 결과 -->
          <div v-if="searchResults.length > 0" class="search-results">
            <h6>검색 결과</h6>
            <div class="user-list">
              <div
                v-for="user in searchResults"
                :key="user.id"
                class="user-item"
              >
                <div class="user-info">
                  <img :src="user.avatar || getDefaultAvatar(user.id)" :alt="user.name" class="user-avatar" />
                  <div class="user-details">
                    <div class="user-name">{{ user.name }}</div>
                    <div class="user-email">{{ user.email }}</div>
                    <div class="user-skills">{{ user.techStacks?.join(', ') || '기술스택 미설정' }}</div>
                  </div>
                </div>
                <button
                  class="invite-button"
                  @click="inviteUser(user)"
                  :disabled="isAlreadyInvited(user.id) || isLoading"
                >
                  <i class="bi bi-person-plus" v-if="!isLoading"></i>
                  <i class="bi bi-arrow-clockwise spin" v-if="isLoading"></i>
                  {{ isAlreadyInvited(user.id) ? '초대됨' : (isLoading ? '초대 중...' : '초대') }}
                </button>
              </div>
            </div>
          </div>

          <!-- 검색 결과 없음 -->
          <div v-else-if="hasSearched && searchResults.length === 0" class="no-results">
            <i class="bi bi-person-x"></i>
            <p>검색 결과가 없습니다.</p>
          </div>
        </div>

        <!-- 직접 이메일 초대 -->
        <div class="direct-invite-section">
          <h5>이메일로 직접 초대</h5>
          <div class="email-input-group">
            <input
              v-model="inviteEmail"
              type="email"
              class="email-input"
              placeholder="초대할 이메일 주소를 입력하세요"
            />
            <button class="invite-email-button" @click="inviteByEmail" :disabled="!isValidEmail(inviteEmail) || isLoading">
              <i class="bi bi-envelope" v-if="!isLoading"></i>
              <i class="bi bi-arrow-clockwise spin" v-if="isLoading"></i>
              {{ isLoading ? '전송 중...' : '초대 발송' }}
            </button>
          </div>
        </div>

        <!-- 초대 목록 -->
        <div v-if="inviteList.length > 0" class="invite-list-section">
          <h5>초대한 팀원 ({{ inviteList.length }})</h5>
          <div class="invite-list">
            <div
              v-for="invite in inviteList"
              :key="invite.id"
              class="invite-item"
            >
              <div class="invite-info">
                <img :src="invite.avatar || getDefaultAvatar(invite.id)" :alt="invite.name" class="invite-avatar" />
                <div class="invite-details">
                  <div class="invite-name">{{ invite.name || invite.email }}</div>
                  <div class="invite-status" :class="getStatusClass(invite.status)">
                    {{ getStatusText(invite.status) }}
                  </div>
                </div>
              </div>
              <button class="remove-invite-button" @click="removeInvite(invite.id)">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="$emit('close')">취소</button>
        <button 
          class="confirm-button" 
          @click="confirmInvites" 
          :disabled="inviteList.length === 0"
        >
          <i class="bi bi-send"></i>
          초대 완료 ({{ inviteList.length }})
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useUserStore } from '@/stores/userStore'
import api from '@/api/axios'

const props = defineProps({
  projectId: {
    type: Number,
    required: true
  },
  projectTitle: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'invites-sent'])

const toast = useToast()
const userStore = useUserStore()

// 반응형 데이터
const searchQuery = ref('')
const searchResults = ref([])
const hasSearched = ref(false)
const inviteEmail = ref('')
const inviteList = ref([])
const isLoading = ref(false)

// API 호출 함수들

// 계산된 속성
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// 메서드
const searchUser = async () => {
  if (!searchQuery.value.trim()) return

  isLoading.value = true
  hasSearched.value = true
  
  try {
    // 사용자 검색 API 호출 (기존 사용자 검색 API 활용)
    const response = await api.get(`/users/search?query=${encodeURIComponent(searchQuery.value)}`, {
      headers: {
        'User-Id': userStore.userId.toString()
      }
    })
    
    const users = response.data
    searchResults.value = users.map(user => ({
      id: user.userId,
      name: user.nickname,
      email: user.email,
      avatar: user.profileImage,
      techStacks: user.techStacks || []
    }))
    
    console.log(`🔍 "${searchQuery.value}" 검색 결과:`, searchResults.value.length, '명')
    
  } catch (error) {
    console.error('사용자 검색 오류:', error)
    toast.error('사용자 검색에 실패했습니다.')
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

const inviteUser = async (user) => {
  if (isAlreadyInvited(user.id)) return
  
  isLoading.value = true
  
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const response = await api.post('/invitations/send', {
      projectId: props.projectId,
      inviteeId: user.id,
      message: `${props.projectTitle} 프로젝트에 함께 참여해주세요!`
    }, {
      headers: {
        'User-Id': userStore.userId.toString()
      }
    })
    
    const result = response.data
    
    if (result.success) {
      // 초대 목록에 추가
      const invite = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        status: 'pending',
        invitedAt: new Date().toISOString()
      }
      
      inviteList.value.push(invite)
      
      toast.success(`${user.name}님에게 초대를 보냈습니다!`, {
        position: 'top-center',
        timeout: 2000
      })
      emit('invites-sent')
    } else {
      toast.error(result.message || '초대 전송에 실패했습니다.')
    }
    
  } catch (error) {
    console.error('초대 전송 오류:', error)
    toast.error('초대 전송에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const inviteByEmail = async () => {
  if (!isValidEmail(inviteEmail.value)) return
  
  // 이미 초대된 이메일인지 확인
  if (inviteList.value.some(invite => invite.email === inviteEmail.value)) {
    toast.warning('이미 초대된 이메일입니다.')
    return
  }
  
  isLoading.value = true
  
  try {
    // 이메일로 사용자 검색 후 초대
    const searchResponse = await api.get(`/users/search?query=${encodeURIComponent(inviteEmail.value)}`, {
      headers: {
        'User-Id': userStore.userId.toString()
      }
    })
    
    const users = searchResponse.data
    const user = users.find(u => u.email === inviteEmail.value)
    
    if (!user) {
      toast.error('해당 이메일의 사용자를 찾을 수 없습니다.')
      return
    }
    
    // 사용자를 찾았으면 초대 보내기
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    
    const inviteResponse = await api.post('/invitations/send', {
      projectId: props.projectId,
      inviteeId: user.userId,
      message: `${props.projectTitle} 프로젝트에 함께 참여해주세요!`
    }, {
      headers: {
        'User-Id': userStore.userId.toString()
      }
    })
    
    const result = inviteResponse.data
    
    if (result.success) {
      const invite = {
        id: user.userId,
        name: user.nickname,
        email: user.email,
        avatar: user.profileImage,
        status: 'pending',
        invitedAt: new Date().toISOString()
      }
      
      inviteList.value.push(invite)
      inviteEmail.value = ''
      
      toast.success(`${user.nickname}님에게 초대를 보냈습니다!`, {
        position: 'top-center',
        timeout: 2000
      })
      emit('invites-sent')
    } else {
      toast.error(result.message || '초대 전송에 실패했습니다.')
    }
    
  } catch (error) {
    console.error('이메일 초대 오류:', error)
    toast.error('이메일 초대에 실패했습니다.')
  } finally {
    isLoading.value = false
  }
}

const isAlreadyInvited = (userId) => {
  return inviteList.value.some(invite => invite.id === userId)
}

const removeInvite = (inviteId) => {
  const index = inviteList.value.findIndex(invite => invite.id === inviteId)
  if (index !== -1) {
    const removedInvite = inviteList.value.splice(index, 1)[0]
    toast.info(`${removedInvite.name || removedInvite.email} 초대를 취소했습니다.`, {
      position: 'top-center',
      timeout: 2000
    })
  }
}

const confirmInvites = () => {
  if (inviteList.value.length === 0) return
  
  // 초대 데이터를 LocalStorage에 저장 (실제로는 API 전송)
  const existingInvites = JSON.parse(localStorage.getItem('projectInvites') || '{}')
  existingInvites[props.projectId] = inviteList.value
  localStorage.setItem('projectInvites', JSON.stringify(existingInvites))
  
  console.log(`📧 프로젝트 ${props.projectId}에 ${inviteList.value.length}명 초대:`, inviteList.value)
  
  toast.success(`${inviteList.value.length}명에게 초대장을 발송했습니다! 🎉`, {
    position: 'top-center',
    timeout: 3000
  })
  
  emit('invites-sent', inviteList.value)
  emit('close')
}

const getDefaultAvatar = (userId) => {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'status-pending'
    case 'accepted': return 'status-accepted'
    case 'rejected': return 'status-rejected'
    default: return 'status-pending'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return '대기 중'
    case 'accepted': return '수락됨'
    case 'rejected': return '거절됨'
    default: return '대기 중'
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
}

.modal-title {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.project-info {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.project-info h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.project-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.search-section,
.direct-invite-section,
.invite-list-section {
  margin-bottom: 24px;
}

.search-section h5,
.direct-invite-section h5,
.invite-list-section h5 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.search-input-group,
.email-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-input,
.email-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus,
.email-input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.search-button,
.invite-email-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.search-button:hover:not(:disabled),
.invite-email-button:hover:not(:disabled) {
  background: #66bb6a;
}

.search-button:disabled,
.invite-email-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.search-results {
  margin-top: 16px;
}

.search-results h6 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.user-list,
.invite-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-item,
.invite-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.user-info,
.invite-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.user-avatar,
.invite-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details,
.invite-details {
  flex: 1;
}

.user-name,
.invite-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.user-email {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 2px;
}

.user-skills {
  font-size: 0.8rem;
  color: #888;
}

.invite-status {
  font-size: 0.85rem;
  font-weight: 500;
}

.status-pending {
  color: #ffc107;
}

.status-accepted {
  color: #28a745;
}

.status-rejected {
  color: #dc3545;
}

.invite-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.invite-button:hover:not(:disabled) {
  background: #0056b3;
}

.invite-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.remove-invite-button {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-invite-button:hover {
  background: #c82333;
}

.no-results {
  text-align: center;
  padding: 24px;
  color: #666;
}

.no-results i {
  font-size: 2rem;
  margin-bottom: 8px;
  display: block;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.cancel-button,
.confirm-button {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background: #f8f9fa;
  border-color: #999;
}

.confirm-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #28a745;
  color: white;
}

.confirm-button:hover:not(:disabled) {
  background: #218838;
}

.confirm-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* 반응형 */
@media (max-width: 768px) {
  .modal-container {
    max-width: 95%;
    margin: 10px;
  }
  
  .search-input-group,
  .email-input-group {
    flex-direction: column;
  }
  
  .user-item,
  .invite-item {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .user-info,
  .invite-info {
    justify-content: flex-start;
  }
}

/* 로딩 스피너 */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>