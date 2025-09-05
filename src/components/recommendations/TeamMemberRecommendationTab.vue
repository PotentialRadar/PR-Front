<template>
  <div class="team-member-recommendation-tab">
    <!-- 프로젝트 선택 -->
    <div v-if="userProjects.length > 1" class="project-selector">
      <label for="project-select">추천받을 프로젝트 선택:</label>
      <select 
        id="project-select" 
        :value="selectedProjectId" 
        @change="$emit('project-change', $event.target.value)"
        class="project-select"
      >
        <option v-for="project in userProjects" :key="project.projectId" :value="project.projectId">
          {{ project.title }} ({{ project.status === 'RECRUITING' ? '모집중' : project.status }})
        </option>
      </select>
    </div>

    <!-- 선택된 프로젝트 기술스택 정보 -->
    <div v-if="selectedProject" class="selected-project-info">
      <div class="project-info-header">
        <div class="project-title-section">
          <h4 class="project-info-title">{{ selectedProject.title }}</h4>
          <span class="recommendation-basis">👆 이 프로젝트 기준으로 팀원 추천</span>
        </div>
      </div>
      
      <div class="project-tech-stacks">
        <div class="tech-stacks-label">
          <span class="tech-icon">🛠️</span>
          <span class="tech-text">필요한 기술스택</span>
        </div>
        <div class="tech-tags-container">
          <span 
            v-for="tech in getProjectTechStacks(selectedProject)" 
            :key="tech"
            class="project-tech-tag"
          >
            {{ tech }}
          </span>
          <div v-if="getProjectTechStacks(selectedProject).length === 0" class="no-tech-stacks">
            기술스택 정보 없음
          </div>
        </div>
      </div>
      
      <div class="recommendation-note">
        <span class="note-icon">💡</span>
        <span class="note-text">위 기술스택과 매칭도가 높은 팀원을 추천해드립니다</span>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>AI가 당신과 잘 맞는 팀원을 찾고 있습니다...</p>
    </div>

    <!-- 팀원 추천 결과 없음 -->
    <div v-else-if="!isLoading && memberRecommendations.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>추천 가능한 팀원이 없습니다</h3>
      <p>다른 기술스택이나 경험 수준으로 다시 시도해보세요.</p>
      <button @click="$emit('reload')" class="primary-button">
        다시 검색
      </button>
    </div>

    <!-- 팀원 추천 리스트 -->
    <div v-else class="members-grid">
      <div 
        v-for="member in memberRecommendations" 
        :key="member.userId"
        class="member-card"
        @click="$emit('member-click', member.userId)"
      >
        <!-- 프로필 헤더 -->
        <div class="member-header">
          <ProfileImage 
            :src="member.profileImage"
            :user-id="member.userId"
            :name="member.name || member.nickname"
            size="md"
            :circular="true"
          />
          <div class="member-info">
            <h4 class="member-name">{{ member.name || member.nickname }}</h4>
            <div class="match-score">
              <span class="score-badge" :class="getScoreClass(member.matchScore)">
                {{ Math.round((member.matchScore || 0) * 100) }}% 매칭
              </span>
            </div>
          </div>
          <div class="availability-status">
            <span 
              class="status-badge" 
              :class="getAvailabilityClass(member)"
            >
              {{ getAvailabilityText(member) }}
            </span>
          </div>
        </div>

        <!-- 기술스택 -->
        <div class="member-tech-stacks">
          <div class="tech-stacks-header">
            <span class="tech-label">주요 기술스택</span>
          </div>
          <div class="tech-tags">
            <span 
              v-for="tech in getMemberTechStacks(member)" 
              :key="tech || ''"
              class="tech-tag"
              :class="{ 'matched': isUserTech(tech) }"
            >
              {{ tech }}
            </span>
            <!-- 기술스택이 없는 경우 디버깅 -->
            <div v-if="getMemberTechStacks(member).length === 0" class="debug-info">
              기술스택 없음
            </div>
          </div>
        </div>

        <!-- AI 추천 이유 -->
        <div v-if="member.explanation" class="explanation-section">
          <div class="explanation-header">
            <span class="ai-badge">🤖 추천 이유</span>
          </div>
          <p class="main-explanation">{{ member.explanation.simple_explanation || member.explanation.main_reason }}</p>
        </div>

        <!-- 기술스택 매칭 -->
        <div v-if="member.explanation && (member.explanation.matched_skills || member.explanation.growth_opportunities)" class="skills-section">
          <div v-if="member.explanation.matched_skills && member.explanation.matched_skills.length > 0" class="skill-group">
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
          
          <div v-if="member.explanation.growth_opportunities && member.explanation.growth_opportunities.length > 0" class="skill-group">
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
            <span class="stat-value">{{ member.experience || '정보 없음' }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">완료 프로젝트:</span>
            <span class="stat-value">{{ member.completedProjects || 0 }}개</span>
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
            :class="{ 'invited': invitedMembers.has(member.userId) }"
            @click.stop="$emit('invite-member', member)"
            :disabled="invitedMembers.has(member.userId)"
          >
            {{ invitedMembers.has(member.userId) ? '초대됨' : '📧 팀 초대' }}
          </button>
          <button class="profile-btn" @click="$emit('member-click', member.userId)">
            👤 프로필 보기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProfileImage from '@/components/common/ProfileImage.vue'

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '정보 없음'
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '오늘'
  if (diffDays === 1) return '어제'
  if (diffDays < 7) return `${diffDays}일 전`
  return date.toLocaleDateString('ko-KR')
}

const props = defineProps({
  memberRecommendations: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  userProjects: {
    type: Array,
    default: () => []
  },
  selectedProjectId: {
    type: [String, Number],
    default: null
  },
  invitedMembers: {
    type: Set,
    default: () => new Set()
  },
  userTechStacks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['project-change', 'reload', 'member-click', 'invite-member'])

// 계산된 속성
const userTechNames = computed(() => 
  props.userTechStacks.map(tech => tech.name?.toLowerCase()).filter(Boolean)
)

const selectedProject = computed(() => {
  return props.userProjects.find(project => 
    project.projectId === props.selectedProjectId
  ) || props.userProjects[0] || null
})

const isUserTech = (techName) => {
  return techName && userTechNames.value.includes(techName.toLowerCase())
}

// 프로젝트 기술스택 추출
const getProjectTechStacks = (project) => {
  try {
    if (!project) return []
    
    if (project.techStacks && Array.isArray(project.techStacks)) {
      return project.techStacks.map(tech => 
        tech.techStackName || tech.name || tech
      ).filter(Boolean)
    }
    
    return []
  } catch (error) {
    console.error('프로젝트 기술스택 추출 오류:', error, project)
    return []
  }
}

// 멤버 기술스택 추출
const getMemberTechStacks = (member) => {
  try {
    if (member.userTechStacks && Array.isArray(member.userTechStacks)) {
      const techStacks = [...member.userTechStacks].map(tech => tech.name).filter(Boolean)
      return techStacks.slice(0, 6)
    }
    if (member.techStacks && Array.isArray(member.techStacks)) {
      return member.techStacks.slice(0, 6)
    }
    return []
  } catch (error) {
    console.error('기술스택 추출 오류:', error, member)
    return []
  }
}


// 매칭도 점수에 따른 클래스 분류
const getScoreClass = (score) => {
  if (score >= 0.8) return 'excellent'
  if (score >= 0.6) return 'good' 
  if (score >= 0.4) return 'fair'
  return 'poor'
}

// 가용성 상태 텍스트 반환
const getAvailabilityText = (member) => {
  if (member.isAvailable === false) return '참여중'
  if (member.availabilityStatus === 'BUSY') return '참여중'
  if (member.availabilityStatus === 'AVAILABLE') return '참여가능'
  return '참여가능' // 기본값
}

// 가용성 상태 클래스 반환
const getAvailabilityClass = (member) => {
  if (member.isAvailable === false) return 'busy'
  if (member.availabilityStatus === 'BUSY') return 'busy'
  if (member.availabilityStatus === 'AVAILABLE') return 'available'
  return 'available' // 기본값
}

</script>

<style scoped>
.team-member-recommendation-tab {
  width: 100%;
}

/* 프로젝트 선택 스타일 */
.project-selector {
  background: #f8f9fa;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
}

.project-selector label {
  display: block;
  font-size: 0.9rem;
  color: #495057;
  font-weight: 600;
  margin-bottom: 8px;
}

.project-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  color: #495057;
  cursor: pointer;
  transition: all 0.2s ease;
}

.project-select:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
}

.project-select:hover {
  border-color: #adb5bd;
}

/* 선택된 프로젝트 정보 */
.selected-project-info {
  background: linear-gradient(135deg, #f8fff9 0%, #e8f5e8 100%);
  border: 1px solid rgba(40, 167, 69, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.1);
}

.project-info-header {
  margin-bottom: 16px;
}

.project-title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-info-title {
  margin: 0;
  color: #155724;
  font-size: 1.2rem;
  font-weight: 700;
}

.recommendation-basis {
  background: rgba(40, 167, 69, 0.1);
  color: #155724;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  border: 1px solid rgba(40, 167, 69, 0.2);
}

.project-tech-stacks {
  margin-bottom: 16px;
}

.tech-stacks-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tech-icon {
  font-size: 1.2rem;
}

.tech-text {
  font-size: 1rem;
  font-weight: 600;
  color: #155724;
}

.tech-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.project-tech-tag {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
  transition: all 0.2s ease;
}

.project-tech-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.no-tech-stacks {
  color: #6c757d;
  font-style: italic;
  padding: 8px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
}

.recommendation-note {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 8px;
  padding: 12px 16px;
}

.note-icon {
  font-size: 1.1rem;
}

.note-text {
  color: #856404;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 로딩 및 빈 상태 */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0 0 32px 0;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.primary-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

/* 팀원 그리드 */
.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.member-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.member-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.member-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.member-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;
}


.member-info {
  flex: 1;
}

.member-name {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.match-score {
  margin-bottom: 8px;
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


.member-tech-stacks {
  margin-bottom: 20px;
}

.tech-stacks-header {
  margin-bottom: 12px;
}

.tech-label {
  font-size: 0.9rem;
  color: #495057;
  font-weight: 600;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.tech-tag.matched {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #28a745;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.2);
}

.tech-tag.matched::after {
  content: ' ✓';
  font-weight: 700;
}


/* AI 추천 이유 */
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

/* 기술스택 매칭 */
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

/* 통계 정보 */
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

/* 액션 버튼 */
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

.invite-btn.invited {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.invite-btn.invited:hover {
  transform: none;
  background: #6c757d;
}

.invite-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.profile-btn {
  background: #fff;
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.profile-btn:hover {
  background: #4CAF50;
  color: white;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .members-grid {
    grid-template-columns: 1fr;
  }
  
  .member-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .member-footer {
    flex-direction: column;
    gap: 12px;
  }
  
  .member-links {
    justify-content: center;
  }
  
  .selected-project-info {
    padding: 16px;
  }
  
  .project-title-section {
    text-align: center;
  }
  
  .tech-tags-container {
    justify-content: center;
  }
  
  .recommendation-note {
    flex-direction: column;
    text-align: center;
    gap: 4px;
  }
}
</style>