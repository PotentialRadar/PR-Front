<template>
  <div class="team-recommendation">
    <!-- 헤더 -->
    <div class="recommendation-header">
      <h3>🤖 AI 팀원 추천</h3>
      <p class="description">프로젝트에 적합한 팀원을 AI가 추천해드립니다</p>
      
      <!-- 새로고침 버튼 -->
      <div class="action-header">
        <button class="refresh-btn" @click="fetchRecommendations" :disabled="isLoading">
          🔄 새로고침
        </button>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-section">
      <div class="loading-spinner"></div>
      <h3>🤖 AI가 최적의 팀원을 찾고 있습니다...</h3>
      <p>프로젝트 요구사항과 개발자들의 스킬을 분석 중입니다.</p>
    </div>

    <!-- 추천 결과 -->
    <div v-else-if="recommendedMembers.length > 0" class="members-grid">
      <div 
        v-for="member in recommendedMembers" 
        :key="member.userId" 
        class="member-card"
      >
        <!-- 프로필 헤더 -->
        <div class="member-header">
          <img 
            :src="getProfileImage(member)" 
            :alt="member.name"
            class="profile-image"
            @error="handleImageError($event, member.userId)"
            loading="lazy"
          />
          <div class="member-info">
            <h4 class="member-name">{{ member.name }}</h4>
            <div class="match-score">
              <span class="score-badge" :class="getScoreClass(member.matchScore)">
                {{ Math.round(member.matchScore * 100) }}% 매칭
              </span>
            </div>
          </div>
          <div class="availability-status">
            <span 
              class="status-badge" 
              :class="member.isAvailable ? 'available' : 'busy'"
            >
              {{ member.isAvailable ? '참여가능' : '참여중' }}
            </span>
          </div>
        </div>

        <!-- AI 추천 이유 -->
        <div class="explanation-section">
          <div class="explanation-header">
            <span class="ai-badge">🤖 추천 이유</span>
          </div>
          <p class="main-explanation">{{ member.explanation.simple_explanation }}</p>
        </div>

        <!-- 기술스택 매칭 -->
        <div class="skills-section">
          <div class="skill-group">
            <span class="skill-label">✅ 매칭 기술:</span>
            <div class="skill-tags">
              <span 
                v-for="skill in member.explanation.matched_skills" 
                :key="skill"
                class="skill-tag matched"
              >
                {{ skill }}
              </span>
            </div>
          </div>
          
          <div v-if="member.explanation.growth_opportunities.length > 0" class="skill-group">
            <span class="skill-label">🌱 성장 기회:</span>
            <div class="skill-tags">
              <span 
                v-for="skill in member.explanation.growth_opportunities" 
                :key="skill"
                class="skill-tag growth"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- 통계 정보 -->
        <div class="stats-section">
          <div class="stat-item">
            <span class="stat-label">경력:</span>
            <span class="stat-value">{{ member.experience }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">완료 프로젝트:</span>
            <span class="stat-value">{{ member.completedProjects }}개</span>
          </div>
          <div v-if="member.averageRating" class="stat-item">
            <span class="stat-label">평점:</span>
            <span class="stat-value">⭐ {{ member.averageRating }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">마지막 활동:</span>
            <span class="stat-value">{{ formatDate(member.lastActiveDate) }}</span>
          </div>
        </div>

        <!-- 액션 버튼 -->
        <div class="action-section">
          <button 
            class="invite-btn"
            @click="inviteMember(member)"
          >
            📧 팀 초대
          </button>
          <button 
            class="profile-btn" 
            :class="{ 'disabled': !member.isPortfolioOpen }"
            @click="viewProfile(member)"
            :disabled="!member.isPortfolioOpen"
            :title="member.isPortfolioOpen ? '포트폴리오 보기' : '비공개 포트폴리오'"
          >
            👤 {{ member.isPortfolioOpen ? '프로필 보기' : '비공개 프로필' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 추천 결과 없음 -->
    <div v-else class="no-results">
      <div class="no-results-icon">🔍</div>
      <h3>추천할 수 있는 팀원이 없습니다</h3>
      <p>필터 조건을 조정하거나 나중에 다시 시도해보세요.</p>
      <button class="retry-btn" @click="fetchRecommendations">다시 시도</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import api from '@/api/axios'

// Router and stores
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// Props
const props = defineProps({
  projectId: {
    type: Number,
    required: true
  },
  requiredSkills: {
    type: Array,
    default: () => []
  }
})

// Reactive data
const isLoading = ref(false)
const recommendedMembers = ref([])

// 추천 설정 (고정값)
const RECOMMENDATION_COUNT = 4

// Methods
const fetchRecommendations = async () => {
  isLoading.value = true
  
  // 최소 로딩 시간 보장 (1.5초)
  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500))
  
  try {
    console.log('🚀 AI 추천 API 호출 시작 - 프로젝트 ID:', props.projectId)
    
    // 실제 API 호출과 최소 로딩 시간을 병렬로 실행
    const [apiResponse] = await Promise.all([
      api.post('/recommend/members', {
        projectId: props.projectId,
        requiredSkills: props.requiredSkills,
        teamSize: RECOMMENDATION_COUNT,
        experienceLevel: "any",
        excludeUserId: userStore.userId  // 팀장 본인을 백엔드에서 제외
      }),
      minLoadingTime
    ])
    
    const apiData = apiResponse.data
    console.log('✅ API 응답 받음 (팀장 제외됨):', apiData)
    
    // 백엔드에서 이미 팀장을 제외했으므로 별도 필터링 불필요
    const filteredData = Array.isArray(apiData) ? apiData : []
    
    console.log(`🔍 최종 추천 멤버:`, filteredData.length, '명')
    
    // 매칭률 로그 출력
    if (filteredData.length > 0) {
      console.log('📊 팀원 추천 매칭률 결과:')
      filteredData.forEach((member, index) => {
        const matchPercentage = Math.round((member.matchScore || 0) * 100)
        console.log(`  ${index + 1}. ${member.name || member.nickname} - ${matchPercentage}% 매칭`)
      })
    }
    
    recommendedMembers.value = filteredData
    
  } catch (error) {
    console.error('❌ API 호출 실패:', error)
    
    // 최소 로딩 시간 보장 후 빈 배열
    await minLoadingTime
    recommendedMembers.value = []
  } finally {
    isLoading.value = false
  }
}

const getScoreClass = (score) => {
  if (score >= 0.8) return 'excellent'
  if (score >= 0.6) return 'good' 
  if (score >= 0.4) return 'fair'
  return 'poor'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`
  return date.toLocaleDateString('ko-KR')
}

const inviteMember = async (member) => {
  try {
    // JWT 토큰 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('로그인이 필요합니다.');
    }
    
    // API 호출 (TeamInviteModal에서 사용하는 것과 동일한 API)
    const response = await api.post('/invitations/send', {
      projectId: props.projectId,
      inviteeId: member.userId,
      message: `AI 추천을 통해 ${member.name}님을 팀에 초대합니다!`
    }, {
      headers: {
        'User-Id': userStore.userId.toString()
      }
    });

    const result = response.data;
    
    if (result.success) {
      toast.success(`${member.name}님에게 팀 초대를 보냈습니다! 📧`, {
        position: 'top-center',
        timeout: 3000
      });
    } else {
      toast.error(result.message || '초대 전송에 실패했습니다.', {
        position: 'top-center',
        timeout: 3000
      });
    }
  } catch (error) {
    console.error('초대 전송 오류:', error);
    toast.error('초대 전송에 실패했습니다. 다시 시도해주세요.', {
      position: 'top-center',
      timeout: 3000
    });
  }
}

const viewProfile = (member) => {
  // 포트폴리오 페이지로 이동
  router.push(`/portfolio/${member.userId}`)
}

// 프로필 이미지 처리 함수들
const getProfileImage = (member) => {
  // 1순위: member.profileImage가 있고 실제 이미지 URL인 경우 (더미 URL 제외)
  if (member.profileImage && 
      member.profileImage.startsWith('http') && 
      !member.profileImage.includes('example.com') &&
      !member.profileImage.includes('placeholder')) {
    return member.profileImage
  }
  
  // 2순위: dicebear API 사용 (항상 안전함)
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.userId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
}

const handleImageError = (event, userId) => {
  console.warn(`프로필 이미지 로드 실패 (사용자 ${userId}):`, event.target.src)
  
  // Fallback 1: 더미 URL이나 기타 실패한 경우 dicebear avataaars로
  if (!event.target.src.includes('dicebear.com')) {
    console.log(`Fallback 1: dicebear avataaars 시도 (사용자 ${userId})`)
    event.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`
    return
  }
  
  // Fallback 2: avataaars 실패시 initials 시도
  if (event.target.src.includes('avataaars')) {
    console.log(`Fallback 2: dicebear initials 시도 (사용자 ${userId})`)
    event.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=User${userId}&backgroundColor=4f46e5,7c3aed,db2777,dc2626,ea580c`
    return
  }
  
  // Fallback 3: initials 실패시 shapes 시도
  if (event.target.src.includes('initials')) {
    console.log(`Fallback 3: dicebear shapes 시도 (사용자 ${userId})`)
    event.target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${userId}&backgroundColor=22c55e,3b82f6,8b5cf6,f59e0b,ef4444`
    return
  }
  
  // Fallback 4: shapes 실패시 최종 대안
  if (event.target.src.includes('shapes')) {
    console.log(`Fallback 4: 최종 대안 시도 (사용자 ${userId})`)
    event.target.src = `https://ui-avatars.com/api/?name=User${userId}&background=4CAF50&color=fff&size=48`
    return
  }
  
  // 모든 API 실패 시
  console.error(`모든 이미지 fallback 실패 (사용자 ${userId}) - 최종 처리`)
  
  // 이미지를 숨기는 대신 CSS 배경으로 처리
  event.target.style.opacity = '0'
  event.target.style.background = 'linear-gradient(135deg, #4CAF50, #81C784)'
  event.target.alt = 'U'
}

// Lifecycle
onMounted(() => {
  fetchRecommendations()
})

// Props 변경 감지하여 새로운 추천 로드
watch([() => props.projectId, () => props.requiredSkills], ([newProjectId, newSkills], [oldProjectId, oldSkills]) => {
  console.log('🔄 TeamMemberRecommendation props 변경 감지:', {
    projectId: { old: oldProjectId, new: newProjectId },
    skillsChanged: JSON.stringify(oldSkills) !== JSON.stringify(newSkills)
  })
  
  if (newProjectId && (newProjectId !== oldProjectId || JSON.stringify(newSkills) !== JSON.stringify(oldSkills))) {
    console.log('🚀 프로젝트/기술스택 변경으로 인한 팀원 추천 새로고침')
    fetchRecommendations()
  }
}, { deep: true })
</script>

<style scoped>
.team-recommendation {
  padding: 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recommendation-header {
  margin-bottom: 32px;
}

.recommendation-header h3 {
  margin: 0 0 8px 0;
  color: #262626;
  font-size: 24px;
  font-weight: 600;
}

.description {
  margin: 0 0 20px 0;
  color: #666;
  font-size: 14px;
}

.action-header {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.refresh-btn {
  padding: 8px 16px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: #45a049;
}

.refresh-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading-section {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.member-card {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  background: white;
  transition: all 0.3s ease;
  position: relative;
}

.member-card:hover {
  border-color: #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  transform: translateY(-2px);
}


.member-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  position: relative; /* fallback 아바타 위치를 위해 추가 */
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
  background: linear-gradient(135deg, #4CAF50, #81C784);
  transition: all 0.2s ease;
}

.profile-image:hover {
  transform: scale(1.05);
  border-color: #4CAF50;
}

/* 이제 dicebear API만 사용하므로 fallback CSS는 불필요 */

.member-info {
  flex: 1;
}

.member-name {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.score-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.score-badge.excellent { background: #4CAF50; }
.score-badge.good { background: #2196F3; }
.score-badge.fair { background: #ff9800; }
.score-badge.poor { background: #f44336; }

.availability-status {
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.status-badge.available { background: #4CAF50; }
.status-badge.busy { background: #ff9800; }

.explanation-section {
  margin-bottom: 16px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(129, 199, 132, 0.1) 100%);
  border-radius: 8px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.ai-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
  color: white;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  margin-bottom: 8px;
}

.main-explanation {
  margin: 0;
  color: #2E7D32;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.skills-section {
  margin-bottom: 16px;
}

.skill-group {
  margin-bottom: 12px;
}

.skill-label {
  display: block;
  color: #388E3C;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.skill-tag.matched {
  background: rgba(76, 175, 80, 0.1);
  color: #2E7D32;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.skill-tag.growth {
  background: rgba(255, 193, 7, 0.1);
  color: #F57F17;
  border: 1px solid rgba(255, 193, 7, 0.3);
}

.stats-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.stat-value {
  font-size: 12px;
  font-weight: 600;
  color: #333;
}

.action-section {
  display: flex;
  gap: 8px;
}

.invite-btn, .profile-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.invite-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: white;
}

.invite-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #388E3C 0%, #1B5E20 100%);
  transform: translateY(-1px);
}


.profile-btn {
  background: #fff;
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.profile-btn:hover:not(:disabled) {
  background: #4CAF50;
  color: white;
}

.profile-btn.disabled,
.profile-btn:disabled {
  background: #f8f9fa;
  color: #6c757d;
  border-color: #dee2e6;
  cursor: not-allowed;
  opacity: 0.6;
}

.profile-btn.disabled:hover,
.profile-btn:disabled:hover {
  background: #f8f9fa;
  color: #6c757d;
  transform: none;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 16px;
}
</style>