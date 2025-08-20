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
            :src="member.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.userId}`" 
            :alt="member.name"
            class="profile-image"
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
          <button class="profile-btn" @click="viewProfile(member)">
            👤 프로필 보기
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

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

// 목업 데이터 (portfolioData.js와 동일한 사용자들을 사용)
const mockMembers = [
  {
    userId: 1,
    name: "김개발자",
    email: "kim.developer@example.com",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
    matchScore: 0.87,
    userTechStacks: [
      {name: "React", level: 4},
      {name: "TypeScript", level: 3},
      {name: "JavaScript", level: 5}
    ],
    explanation: {
      main_reason: "React와 TypeScript 경험이 프로젝트와 87% 일치합니다",
      detailed_reasons: [
        "React 4년 경험으로 프론트엔드 개발에 적합",
        "TypeScript 활용 경험으로 안정적인 코드 작성 가능"
      ],
      matched_skills: ["React", "TypeScript"],
      growth_opportunities: ["Node.js"],
      simple_explanation: "React + TypeScript 전문가로 프론트엔드 리드 가능",
      experience_match: "중급 이상의 숙련된 개발자입니다"
    },
    experience: "4년",
    portfolioCount: 8,
    completedProjects: 4,
    averageRating: 4.6,
    lastActiveDate: "2025-08-15",
    isAvailable: true,
    currentProjectCount: 1
  },
  {
    userId: 3,
    name: "이백엔드",
    email: "lee.backend@example.com", 
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=3",
    matchScore: 0.73,
    userTechStacks: [
      {name: "Node.js", level: 5},
      {name: "Python", level: 4},
      {name: "PostgreSQL", level: 3}
    ],
    explanation: {
      main_reason: "Node.js 전문가로 백엔드 API 개발에 최적화",
      detailed_reasons: [
        "Node.js 5년 경험으로 서버 개발 전문",
        "PostgreSQL 데이터베이스 설계 및 최적화 경험"
      ],
      matched_skills: ["Node.js"],
      growth_opportunities: ["TypeScript", "React"],
      simple_explanation: "Node.js 전문가로 안정적인 백엔드 구축 가능",
      experience_match: "고급 개발자로 팀 리드 경험 보유"
    },
    experience: "5년",
    portfolioCount: 15,
    completedProjects: 2,
    averageRating: 4.8,
    lastActiveDate: "2025-08-14",
    isAvailable: true,
    currentProjectCount: 0
  },
  {
    userId: 4,
    name: "정모바일",
    email: "jung.mobile@example.com",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=4", 
    matchScore: 0.65,
    userTechStacks: [
      {name: "Flutter", level: 4},
      {name: "React Native", level: 3},
      {name: "Firebase", level: 4}
    ],
    explanation: {
      main_reason: "모바일 개발 전문가로 크로스플랫폼 경험 풍부",
      detailed_reasons: [
        "Flutter로 안드로이드/iOS 동시 개발 가능",
        "Firebase 연동으로 실시간 기능 구현 경험"
      ],
      matched_skills: ["React Native"],
      growth_opportunities: ["React", "TypeScript"],
      simple_explanation: "모바일 전문가로 앱 확장 시 핵심 역할 가능",
      experience_match: "중급 개발자로 모바일 앱 개발 리드 경험"
    },
    experience: "3년",
    portfolioCount: 6,
    completedProjects: 2,
    averageRating: 4.2,
    lastActiveDate: "2025-08-16",
    isAvailable: true,
    currentProjectCount: 0
  },
  {
    userId: 5,
    name: "최AI",
    email: "choi.ai@example.com",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=5",
    matchScore: 0.78,
    userTechStacks: [
      {name: "Python", level: 5},
      {name: "TensorFlow", level: 4},
      {name: "PyTorch", level: 3}
    ],
    explanation: {
      main_reason: "AI/ML 전문가로 프로젝트에 차별화된 기능 추가 가능",
      detailed_reasons: [
        "Python 5년 경험으로 백엔드 및 데이터 처리 가능",
        "TensorFlow를 활용한 AI 기능 구현 경험",
        "머신러닝 모델 개발 및 배포 경험"
      ],
      matched_skills: ["Python"],
      growth_opportunities: ["Node.js", "FastAPI"],
      simple_explanation: "AI 전문가로 프로젝트에 차별화된 기능 추가 가능",
      experience_match: "고급 개발자로 혁신적 기능 개발 리드 가능"
    },
    experience: "4년",
    portfolioCount: 12,
    completedProjects: 2,
    averageRating: 4.7,
    lastActiveDate: "2025-08-17",
    isAvailable: true,
    currentProjectCount: 1
  }
]

// Methods
const fetchRecommendations = async () => {
  isLoading.value = true
  
  // 최소 로딩 시간 보장 (1.5초)
  const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500))
  
  try {
    console.log('🚀 AI 추천 API 호출 시작 - 프로젝트 ID:', props.projectId)
    
    // 실제 API 호출과 최소 로딩 시간을 병렬로 실행
    const [apiResponse] = await Promise.all([
      fetch(`http://localhost:${import.meta.env.VITE_BACK_PORT || 8080}/api/recommend/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: props.projectId,
          requiredSkills: props.requiredSkills,
          teamSize: RECOMMENDATION_COUNT,
          experienceLevel: "any"
        })
      }),
      minLoadingTime
    ])
    
    if (!apiResponse.ok) {
      throw new Error(`API 호출 실패: ${apiResponse.status}`)
    }
    
    const apiData = await apiResponse.json()
    console.log('✅ API 응답 받음:', apiData)
    recommendedMembers.value = apiData
    
  } catch (error) {
    console.error('❌ API 호출 실패, 목업 데이터 사용:', error)
    
    // Fallback: 목업 데이터 사용 (최소 로딩 시간 보장)
    await minLoadingTime
    const availableMembers = mockMembers.filter(member => member.isAvailable)
    recommendedMembers.value = availableMembers.slice(0, RECOMMENDATION_COUNT)
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

const inviteMember = (member) => {
  // TODO: 팀 초대 기능 구현
  alert(`${member.name}님에게 팀 초대를 보냅니다.`)
}

const viewProfile = (member) => {
  // 포트폴리오 페이지로 이동
  router.push(`/portfolio/${member.userId}`)
}


// Lifecycle
onMounted(() => {
  fetchRecommendations()
})
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
}

.profile-image {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
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

.profile-btn:hover {
  background: #4CAF50;
  color: white;
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