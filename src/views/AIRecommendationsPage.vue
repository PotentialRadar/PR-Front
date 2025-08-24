<template>
  <div class="ai-recommendations-page">
    <!-- 페이지 헤더 -->
    <PageHeader 
      title="AI 추천"
      subtitle="AI가 당신의 기술스택과 관심사를 분석하여 맞춤형 프로젝트를 추천해드립니다"
    />

    <!-- 기술스택 설정 상태 -->
    <div class="container">
      <div class="tech-stack-status" v-if="userTechStacks.length > 0">
        <div class="status-header">
          <h3>현재 설정된 기술스택</h3>
          <button @click="showTechStackModal = true" class="edit-button">
            편집
          </button>
        </div>
        <div class="tech-stack-list">
          <div 
            v-for="tech in userTechStacks" 
            :key="tech.name"
            class="tech-item"
          >
            <span class="tech-name">{{ tech.name }}</span>
            <span class="tech-level">Lv.{{ tech.level }}</span>
          </div>
        </div>
      </div>

      <!-- 추천 섹션 -->
      <div class="recommendations-section">
        <div class="section-header">
          <h2>🎯 AI 맞춤 추천</h2>
          <div class="stats" v-if="activeTab === 'projects' && recommendations.length > 0">
            <span class="stat-item">
              📊 총 {{ recommendations.length }}개 프로젝트 발견
            </span>
          </div>
          <div class="stats" v-if="activeTab === 'members' && memberRecommendations.length > 0">
            <span class="stat-item">
              👥 총 {{ memberRecommendations.length }}명 발견
            </span>
          </div>
        </div>

        <!-- 탭 네비게이션 (팀장에게만 표시) -->
        <div class="tab-navigation" v-if="userStore.isLoggedIn && userTechStacks.length > 0 && isTeamLeader">
          <button 
            class="tab-button"
            :class="{ active: activeTab === 'projects' }"
            @click="activeTab = 'projects'"
          >
            프로젝트
          </button>
          <button 
            v-if="isTeamLeader"
            class="tab-button"
            :class="{ active: activeTab === 'members' }"
            @click="switchToMembersTab"
          >
            👥 팀원 추천
          </button>
        </div>


        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>AI가 당신에게 맞는 프로젝트를 분석하고 있습니다...</p>
        </div>

        <!-- 로그인 안된 상태 -->
        <div v-else-if="!userStore.isLoggedIn" class="empty-state">
          <div class="empty-icon">🔐</div>
          <h3>AI 추천을 위해 로그인이 필요합니다</h3>
          <p>개인 맞춤형 프로젝트 추천을 받으려면 먼저 로그인해주세요.</p>
          <div class="popular-preview">
            <h4>🔥 지금은 인기 프로젝트를 확인해보세요!</h4>
            <div class="popular-projects-grid">
              <div 
                v-for="project in popularProjects.slice(0, 6)" 
                :key="project.id"
                class="popular-project-card"
                @click="goToProject(project.id)"
              >
                <h4 class="popular-project-title">{{ project.title }}</h4>
                <p class="popular-project-description">{{ project.description?.slice(0, 80) }}...</p>
                <div class="popular-project-stats">
                  <span class="popular-stat">👀 {{ project.viewCount || 0 }}</span>
                  <span class="popular-stat">❤️ {{ project.appliedCount || 0 }}</span>
                </div>
                <div class="popular-tech-stacks">
                  <span 
                    v-for="tech in project.techStacks?.slice(0, 3)" 
                    :key="tech.techStackName"
                    class="popular-tech-tag"
                  >
                    {{ tech.techStackName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="router.push('/login')" class="primary-button">
            로그인하기
          </button>
        </div>

        <!-- 기술스택 미설정 상태 -->
        <div v-else-if="userTechStacks.length === 0" class="empty-state">
          <div class="empty-icon">🔧</div>
          <h3>기술스택을 설정해주세요</h3>
          <p>포트폴리오 페이지에서 기술스택과 경험 수준을 설정하시면 AI가 맞춤형 프로젝트를 추천해드립니다.</p>
          <div class="popular-preview">
            <h4>🔥 지금은 인기 프로젝트를 확인해보세요!</h4>
            <div class="popular-projects-grid">
              <div 
                v-for="project in popularProjects.slice(0, 6)" 
                :key="project.id"
                class="popular-project-card"
                @click="goToProject(project.id)"
              >
                <h4 class="popular-project-title">{{ project.title }}</h4>
                <p class="popular-project-description">{{ project.description?.slice(0, 80) }}...</p>
                <div class="popular-project-stats">
                  <span class="popular-stat">👀 {{ project.viewCount || 0 }}</span>
                  <span class="popular-stat">❤️ {{ project.appliedCount || 0 }}</span>
                </div>
                <div class="popular-tech-stacks">
                  <span 
                    v-for="tech in project.techStacks?.slice(0, 3)" 
                    :key="tech.techStackName"
                    class="popular-tech-tag"
                  >
                    {{ tech.techStackName }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button @click="router.push('/myPage/portfolio')" class="primary-button">
            기술스택 설정하기
          </button>
        </div>

        <!-- 추천 결과 없음 (로그인 되어 있고 기술스택도 설정됨) -->
        <div v-else-if="userStore.isLoggedIn && userTechStacks.length > 0 && !isLoading && recommendations.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>추천 가능한 프로젝트가 없습니다</h3>
          <p>다른 기술스택이나 경험 수준으로 다시 시도해보세요.</p>
          <button @click="loadRecommendations" class="primary-button">
            다시 검색
          </button>
        </div>

        <!-- 프로젝트 추천 탭 -->
        <div v-if="activeTab === 'projects' && userStore.isLoggedIn && userTechStacks.length > 0 && recommendations.length > 0" class="projects-grid">
          <div 
            v-for="project in recommendations" 
            :key="project.projectId"
            class="project-card"
            @click="goToProject(project.projectId)"
          >
            <!-- 프로젝트 헤더 -->
            <div class="project-header">
              <div class="project-title-row">
                <h3 class="project-title">{{ project.title }}</h3>
                <div class="match-score">
                  <span class="score-label">매칭도</span>
                  <span class="score-value">{{ (project.matchScore * 100).toFixed(0) }}%</span>
                </div>
              </div>
              <p class="project-description">{{ project.description }}</p>
            </div>

            <!-- 프로젝트 정보 -->
            <div class="project-info">
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">진행기간</span>
                  <span class="info-value">{{ formatDateRange(project.startDate, project.endDate) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">모집인원</span>
                  <span class="info-value">{{ project.recruitCount }}명</span>
                </div>
                <div class="info-item">
                  <span class="info-label">지원자</span>
                  <span class="info-value">{{ project.appliedCount }}명</span>
                </div>
                <div class="info-item">
                  <span class="info-label">마감일정</span>
                  <span class="info-value" :class="{ 'urgent': isUrgent(project.recruitDeadline) }">
                    {{ formatDate(project.recruitDeadline) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 기술스택 -->
            <div class="tech-stacks">
              <div class="tech-stacks-header">
                <span class="tech-label">기술스택</span>
              </div>
              <div class="tech-tags">
                <span 
                  v-for="tech in project.projectTechStacks" 
                  :key="tech"
                  class="tech-tag"
                  :class="{ 'matched': isUserTech(tech) }"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <!-- AI 추천 이유 -->
            <div v-if="project.explanation" class="ai-explanation">
              <div class="explanation-header">
                <span class="ai-badge">🤖 AI 추천 이유</span>
              </div>
              <div class="explanation-content">
                <p class="main-reason">{{ project.explanation.simple_explanation || project.explanation.main_reason }}</p>
                
                <div v-if="project.explanation.matched_skills?.length > 0" class="skill-section">
                  <span class="section-label">✅ 보유 기술:</span>
                  <span class="skill-list">{{ project.explanation.matched_skills.join(', ') }}</span>
                </div>
                
                <div v-if="project.explanation.growth_opportunities?.length > 0" class="skill-section">
                  <span class="section-label">🌱 성장 기회:</span>
                  <span class="skill-list">{{ project.explanation.growth_opportunities.join(', ') }}</span>
                </div>
              </div>
            </div>


            <!-- 프로젝트 상태 -->
            <div class="project-footer">
              <div class="project-status">
                <span class="status-badge recruiting">모집중</span>
              </div>
              <div class="project-actions">
                <button class="view-button" @click.stop="goToProject(project.projectId)">
                  자세히 보기
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 팀원 추천 탭 -->
        <div v-if="activeTab === 'members'" class="members-tab">
          <!-- 로딩 상태 -->
          <div v-if="membersLoading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>AI가 당신과 잘 맞는 팀원을 찾고 있습니다...</p>
          </div>

          <!-- 팀원 추천 결과 없음 -->
          <div v-else-if="!membersLoading && memberRecommendations.length === 0" class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>추천 가능한 팀원이 없습니다</h3>
            <p>다른 기술스택이나 경험 수준으로 다시 시도해보세요.</p>
            <button @click="loadMemberRecommendations" class="primary-button">
              다시 검색
            </button>
          </div>

          <!-- 팀원 추천 리스트 -->
          <div v-else-if="memberRecommendations.length > 0" class="members-grid">
            <div 
              v-for="member in memberRecommendations" 
              :key="member.userId"
              class="member-card"
              @click="goToMemberProfile(member.userId)"
            >
              <!-- 멤버 헤더 -->
              <div class="member-header">
                <div class="member-profile">
                  <img 
                    :src="member.profileImage || '/default-avatar.png'" 
                    :alt="member.name || member.nickname"
                    class="member-avatar"
                  />
                  <div class="member-basic-info">
                    <h3 class="member-name">{{ member.name || member.nickname }}</h3>
                    <p class="member-role">{{ member.techPart || '개발자' }}</p>
                  </div>
                </div>
                <div class="match-score">
                  <span class="score-label">매칭도</span>
                  <span class="score-value">{{ (member.matchScore * 100).toFixed(0) }}%</span>
                </div>
              </div>

              <!-- 멤버 정보 -->
              <div class="member-info">
                <div class="member-bio" v-if="member.bio">
                  <p>{{ member.bio }}</p>
                </div>
                <div class="member-stats">
                  <div class="stat-item">
                    <span class="stat-label">경력</span>
                    <span class="stat-value">{{ member.experience || member.experienceRange || 'N/A' }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">평점</span>
                    <span class="stat-value">⭐ {{ member.averageRating || member.reputationScore || 'N/A' }}</span>
                  </div>
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
                  <!-- 디버깅: 기술스택이 안 보이면 원본 데이터 확인 -->
                  <div v-if="getMemberTechStacks(member).length === 0" class="debug-info">
                    기술스택 없음: {{ JSON.stringify(member.userTechStacks) }}
                  </div>
                </div>
              </div>

              <!-- AI 추천 이유 -->
              <div v-if="member.explanation" class="ai-explanation">
                <div class="explanation-header">
                  <span class="ai-badge">🤖 AI 추천 이유</span>
                </div>
                <div class="explanation-content">
                  <p class="main-reason">{{ member.explanation.simple_explanation || member.explanation.main_reason }}</p>
                </div>
              </div>

              <!-- 연락 버튼 -->
              <div class="member-footer">
                <div class="member-links">
                  <a v-if="member.githubUrl" :href="member.githubUrl" target="_blank" class="link-button github">
                    GitHub
                  </a>
                  <a v-if="member.linkedinUrl" :href="member.linkedinUrl" target="_blank" class="link-button linkedin">
                    LinkedIn
                  </a>
                </div>
                <button class="contact-button" @click.stop="contactMember(member)">
                  초대하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 기술스택 설정 모달 -->
    <TechStackModal 
      v-if="showTechStackModal && userTechStacks"
      :initialTechStacks="userTechStacks || []"
      @close="showTechStackModal = false"
      @save="handleTechStackSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'vue-toastification'
import PageHeader from '@/components/common/PageHeader.vue'
import TechStackModal from '@/components/common/TechStackModal.vue'
import api from '@/api/axios'

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

// 반응형 데이터
const isLoading = ref(false)
const membersLoading = ref(false)
const showTechStackModal = ref(false)
const userTechStacks = ref([])
const recommendations = ref([])
const memberRecommendations = ref([])
const popularProjects = ref([])
const activeTab = ref('projects') // 'projects' 또는 'members'
const userProjects = ref([]) // 사용자가 팀장인 프로젝트들
const isTeamLeader = ref(false) // 팀장 여부

// 계산된 속성
const userTechNames = computed(() => userTechStacks.value.map(tech => tech.name?.toLowerCase()).filter(Boolean))


// 메서드
const loadRecommendations = async () => {
  if (userTechStacks.value.length === 0) {
    return
  }

  isLoading.value = true
  
  try {
    const requestData = {
      userId: userStore.userId, // 실제 로그인한 사용자 ID 사용
      techStacks: userTechStacks.value,
      includeLikes: true // 좋아요 기반 추천 포함
    }

    console.log('🎯 AI 추천 요청:', requestData)

    const response = await api.post('/recommend/projects', requestData)
    const data = response.data
    console.log('📦 AI 추천 응답:', data)
    
    recommendations.value = data || []
    
    if (recommendations.value.length > 0) {
      console.log(`✅ ${recommendations.value.length}개의 프로젝트 추천 완료`)
    } else {
      console.log('⚠️ 추천 가능한 프로젝트가 없음')
      toast.info('현재 추천 가능한 프로젝트가 없습니다. 기술스택을 조정해보세요.', {
        position: 'top-center',
        timeout: 3000
      })
    }
    
  } catch (error) {
    console.error('❌ AI 추천 오류:', error)
    toast.error('추천 서비스에 일시적인 문제가 발생했습니다.', {
      position: 'top-center',
      timeout: 3000
    })
  } finally {
    isLoading.value = false
  }
}

// 사용자가 팀장인 프로젝트 확인
const checkTeamLeaderStatus = async () => {

  if (!userStore.isLoggedIn) {
    isTeamLeader.value = false
    return
  }

  try {
    // 사용자가 작성한 프로젝트 조회
    const response = await api.get(`/projects/users/${userStore.userId}/created`)
    userProjects.value = response.data || []
    
    // 모집중인 프로젝트가 있는지 확인
    const recruitingProjects = userProjects.value.filter(project => 
      project.status === 'RECRUITING'
    )
    isTeamLeader.value = recruitingProjects.length > 0
    
    console.log('👑 팀장 상태 확인:', {
      isTeamLeader: isTeamLeader.value,
      totalProjects: userProjects.value.length,
      recruitingProjects: recruitingProjects.length,
      recruitingProjectTitles: recruitingProjects.map(p => p.title)
    })
    
  } catch (error) {
    console.error('❌ 팀장 상태 확인 실패:', error)
    // API가 없는 경우 일단 false로 설정
    isTeamLeader.value = false
    userProjects.value = []
  }
}

// 팀원 추천 로드
const loadMemberRecommendations = async () => {
  if (userTechStacks.value.length === 0) {
    return
  }

  membersLoading.value = true
  
  try {
    console.log('🔍 사용자 프로젝트 데이터:', userProjects.value)
    
    // 모집중인 첫 번째 프로젝트 찾기
    const recruitingProject = userProjects.value.find(project => 
      project.status === 'RECRUITING' || project.status === '모집중'
    ) || userProjects.value[0]
    
    console.log('📋 선택된 프로젝트:', recruitingProject)
    
    const requestData = {
      projectId: recruitingProject?.projectId || recruitingProject?.id || null,
      requiredSkills: recruitingProject?.techStacks?.map(tech => 
        tech.techStackName || tech.name
      ).filter(Boolean) || [],
      teamSize: 4,
      experienceLevel: "any"
    }

    console.log('👥 팀원 추천 요청:', requestData)

    // TODO: 실제 팀원 추천 API 엔드포인트로 변경
    const response = await api.post('/recommend/members', requestData)
    const data = response.data
    console.log('📦 팀원 추천 응답:', data)
    
    memberRecommendations.value = data || []
    
    if (memberRecommendations.value.length > 0) {
      console.log(`✅ ${memberRecommendations.value.length}명의 팀원 추천 완료`)
      // 첫 번째 팀원의 기술스택 구조 확인
      console.log('🔍 첫 번째 팀원 기술스택:', memberRecommendations.value[0].userTechStacks)
    } else {
      console.log('⚠️ 추천 가능한 팀원이 없음')
      toast.info('현재 추천 가능한 팀원이 없습니다.', {
        position: 'top-center',
        timeout: 3000
      })
    }
    
  } catch (error) {
    console.error('❌ 팀원 추천 오류:', error)
    // 일단 목 데이터로 대체
    memberRecommendations.value = getMockMemberRecommendations()
    toast.warning('팀원 추천 API가 준비 중입니다. 목 데이터를 표시합니다.', {
      position: 'top-center',
      timeout: 3000
    })
  } finally {
    membersLoading.value = false
  }
}

// 임시 목 데이터 생성
const getMockMemberRecommendations = () => {
  return [
    {
      userId: 1,
      nickname: "김개발",
      techPart: "풀스택 개발자",
      bio: "React와 Node.js를 주로 사용하는 5년차 개발자입니다. 팀워크를 중시하며 새로운 기술 학습을 좋아합니다.",
      experienceRange: "3-5년",
      reputationScore: "4.8",
      techStacks: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      matchScore: 0.85,
      githubUrl: "https://github.com/kimdev",
      linkedinUrl: "https://linkedin.com/in/kimdev",
      profileImage: null,
      explanation: {
        simple_explanation: "React와 TypeScript 경험이 풍부하여 프로젝트에 큰 도움이 될 것 같습니다."
      }
    },
    {
      userId: 2,
      nickname: "박프론트",
      techPart: "프론트엔드 개발자",
      bio: "사용자 경험을 중시하는 프론트엔드 개발자입니다. Vue.js와 React 모두 능숙하게 다룹니다.",
      experienceRange: "2-3년",
      reputationScore: "4.5",
      techStacks: ["Vue.js", "React", "JavaScript", "CSS", "Figma"],
      matchScore: 0.72,
      githubUrl: "https://github.com/parkfront",
      profileImage: null,
      explanation: {
        simple_explanation: "프론트엔드 전문성과 UI/UX 감각이 뛰어나 프로젝트 품질 향상에 기여할 수 있습니다."
      }
    }
  ]
}

// 팀원 추천 탭 전환
const switchToMembersTab = () => {
  activeTab.value = 'members'
  if (memberRecommendations.value.length === 0) {
    loadMemberRecommendations()
  }
}

// 멤버 프로필 페이지로 이동
const goToMemberProfile = (userId) => {
  // TODO: 실제 멤버 프로필 페이지 경로로 변경
  router.push(`/profile/${userId}`)
}

// 멤버에게 팀원 초대 보내기
const contactMember = async (member) => {
  if (userProjects.value.length === 0) {
    toast.error('초대할 프로젝트가 없습니다.', {
      position: 'top-center',
      timeout: 3000
    })
    return
  }

  try {
    // 프로젝트가 여러 개인 경우 선택 모달 표시 (일단 첫 번째 프로젝트로)
    const project = userProjects.value[0]
    
    const inviteData = {
      projectId: project.projectId,
      inviteeUserId: member.userId,
      message: `${project.title} 프로젝트에 참여해보시겠어요? AI가 당신과 잘 맞는 팀원으로 추천했습니다! 🚀`
    }

    console.log('📧 팀원 초대 요청:', inviteData)
    
    // 서비스 내 알림으로 초대 발송
    const response = await api.post('/team-invitations', inviteData)
    
    toast.success(`${member.name || member.nickname}님에게 팀원 초대를 보냈습니다! 🎉`, {
      position: 'top-center',
      timeout: 3000
    })
    
    console.log('✅ 팀원 초대 성공:', response.data)
    
  } catch (error) {
    console.error('❌ 팀원 초대 실패:', error)
    
    if (error.response?.status === 409) {
      toast.warning('이미 초대된 사용자입니다.', {
        position: 'top-center',
        timeout: 3000
      })
    } else {
      toast.error('팀원 초대에 실패했습니다.', {
        position: 'top-center',
        timeout: 3000
      })
    }
  }
}

const handleTechStackSave = (techStacks) => {
  userTechStacks.value = techStacks
  showTechStackModal.value = false
  
  // 로컬 스토리지에 저장
  localStorage.setItem('userTechStacks', JSON.stringify(techStacks))
  
  toast.success('기술스택이 저장되었습니다!', {
    position: 'top-center',
    timeout: 2000
  })
  
  // 추천 다시 로드
  loadRecommendations()
}

const isUserTech = (techName) => {
  return techName && userTechNames.value.includes(techName.toLowerCase())
}

// 팀원 기술스택 추출 (Proxy 객체 문제 해결)
const getMemberTechStacks = (member) => {
  try {
    if (member.userTechStacks && Array.isArray(member.userTechStacks)) {
      // Proxy 객체를 일반 배열로 변환하고 name 속성 추출
      const techStacks = [...member.userTechStacks].map(tech => tech.name).filter(Boolean)
      console.log('🔍 기술스택 추출 결과:', techStacks)
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return `${start} ~ ${end}`
}

const isUrgent = (deadline) => {
  const deadlineDate = new Date(deadline)
  const today = new Date()
  const diffTime = deadlineDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 3
}

const goToProject = (projectId) => {
  router.push(`/projects/${projectId}`)
}

// 포트폴리오에서 기술스택 불러오기
const loadTechStacksFromPortfolio = async () => {
  try {
    const response = await api.get(`/users/${userStore.userId}/portfolio`)
    const portfolioData = response.data
      if (portfolioData.skills && portfolioData.skills.length > 0) {
        // 포트폴리오 기술스택을 AI 추천용 형태로 변환 (기본 레벨 3)
        const techStacks = portfolioData.skills.map(skill => ({
          name: skill,
          level: 3
        }))
        
        userTechStacks.value = techStacks
        localStorage.setItem('userTechStacks', JSON.stringify(techStacks))
        
        console.log('📦 포트폴리오에서 기술스택 불러옴:', techStacks)
        loadRecommendations()
      }
  } catch (error) {
    console.error('포트폴리오 기술스택 로드 실패:', error)
  }
}

// 인기 프로젝트 조회 함수
const loadPopularProjects = async () => {
  try {
    const response = await api.get('/projects')
    const data = response.data
    console.log('📊 전체 프로젝트 데이터:', data)
    
    // viewCount 기준으로 정렬하여 인기 프로젝트 선별
    const sortedProjects = [...data]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    
    popularProjects.value = sortedProjects.slice(0, 12) // 상위 12개
    console.log('🔥 인기 프로젝트:', popularProjects.value.length, '개')
    
  } catch (error) {
    console.error('❌ 인기 프로젝트 로드 실패:', error)
    toast.error('인기 프로젝트를 불러오는 중 오류가 발생했습니다.', {
      position: 'top-center',
      timeout: 3000
    })
  }
}


// 라이프사이클
onMounted(async () => {
  try {
    console.log('🔄 AI 추천 페이지 마운트 시작')
    
    // 로그인 상태 체크 (이미 로그인된 경우 스킵)
    if (!userStore.isLoggedIn) {
      await userStore.checkLogin()
    }
    
    // 인기 프로젝트 로드 (로그인 안된 상태에서 표시용)
    loadPopularProjects()
    
    // 팀장 상태 확인 (로그인된 경우)
    if (userStore.isLoggedIn) {
      await checkTeamLeaderStatus()
    }
    
    // 저장된 기술스택 불러오기 (로그인 상태에서만)
    if (userStore.isLoggedIn) {
      // 먼저 실제 DB에서 기술스택 조회
      try {
        console.log('🔧 DB에서 기술스택 조회 시도')
        const dbTechStacks = await userStore.fetchTechStacks()
        if (dbTechStacks && dbTechStacks.length > 0) {
          // DB에서 가져온 기술스택을 AI 추천용 형태로 변환
          userTechStacks.value = dbTechStacks.map(tech => ({
            name: tech.stackName || tech.techStackName || tech.name,
            level: tech.skillLevel || tech.level || 3
          }))
          console.log('✅ DB에서 기술스택 로드 성공:', userTechStacks.value)
          loadRecommendations()
        } else {
          // DB에 기술스택이 없으면 localStorage 확인
          const savedTechStacks = localStorage.getItem('userTechStacks')
          if (savedTechStacks) {
            try {
              userTechStacks.value = JSON.parse(savedTechStacks)
              loadRecommendations()
            } catch (error) {
              console.error('기술스택 데이터 파싱 오류:', error)
              localStorage.removeItem('userTechStacks')
              userTechStacks.value = []
            }
          } else {
            console.log('⚠️ DB와 localStorage 모두에 기술스택 없음')
            userTechStacks.value = []
          }
        }
      } catch (error) {
        console.error('❌ DB 기술스택 조회 실패:', error)
        // DB 조회 실패 시 localStorage fallback
        const savedTechStacks = localStorage.getItem('userTechStacks')
        if (savedTechStacks) {
          try {
            userTechStacks.value = JSON.parse(savedTechStacks)
            loadRecommendations()
          } catch (parseError) {
            console.error('기술스택 데이터 파싱 오류:', parseError)
            localStorage.removeItem('userTechStacks')
            userTechStacks.value = []
          }
        } else {
          userTechStacks.value = []
        }
      }
    } else {
      // 로그인되지 않은 상태에서는 기술스택 정리
      localStorage.removeItem('userTechStacks')
      localStorage.removeItem('projectFeedbacks')
      userTechStacks.value = []
    }
    
    
    console.log('📋 AI 추천 페이지 로드 완료:', {
      isLoggedIn: userStore.isLoggedIn,
      userId: userStore.userId,
      techStacksCount: userTechStacks.value.length
    })
    
  } catch (error) {
    console.error('❌ AI 추천 페이지 초기화 실패:', error)
  }
})

// 로그인 상태 변화 감지
watch(() => userStore.isLoggedIn, (newValue, oldValue) => {
  try {
    console.log('🔄 로그인 상태 변화 감지:', { newValue, oldValue })
    if (!newValue && oldValue !== undefined) {
      // 로그아웃 시 기술스택 데이터 초기화
      userTechStacks.value = []
      recommendations.value = []
      localStorage.removeItem('userTechStacks')
      localStorage.removeItem('projectFeedbacks')
      console.log('🧹 로그아웃으로 인한 데이터 초기화 완료')
    }
  } catch (error) {
    console.error('🚨 로그인 상태 변화 처리 중 오류:', error)
  }
}, { immediate: false })

// 페이지 포커스 시 기술스택 재확인 (포트폴리오에서 돌아왔을 때)
const handleVisibilityChange = async () => {
  if (!document.hidden && userStore.isLoggedIn && userTechStacks.value.length === 0) {
    await loadTechStacksFromPortfolio()
  }
}

// 브라우저 탭 포커스 이벤트 리스너 추가
onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.ai-recommendations-page {
  min-height: 100vh;
  background: #FFF;
  padding: 68px 0 60px 0; /* 헤더 높이만큼 패딩 */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.tech-stack-status {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.status-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.edit-button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #e9ecef;
}

.tech-stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-item {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tech-level {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}

.recommendations-section {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f8f9fa;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  font-weight: 700;
}

.stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  background: #f8f9fa;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.loading-state {
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

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.project-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e9ecef;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.project-header {
  margin-bottom: 20px;
}

.project-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 12px;
}

.project-title {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
  flex: 1;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 60px;
}

.score-label {
  font-size: 0.7rem;
  opacity: 0.9;
}

.score-value {
  font-size: 1.1rem;
  font-weight: 700;
}

.project-description {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.project-info {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.info-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}

.info-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
}

.info-value.urgent {
  color: #dc3545;
  font-weight: 700;
}

.tech-stacks {
  margin-bottom: 20px;
}

.tech-stacks-header {
  margin-bottom: 8px;
}

.tech-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.tech-tag.matched {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  font-weight: 600;
}

.ai-explanation {
  background: linear-gradient(135deg, rgba(40, 167, 69, 0.05) 0%, rgba(32, 201, 151, 0.05) 100%);
  border: 1px solid rgba(40, 167, 69, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.explanation-header {
  margin-bottom: 12px;
}

.ai-badge {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.explanation-content {
  line-height: 1.6;
}

.main-reason {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
}

.skill-section {
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.section-label {
  color: #666;
  font-weight: 600;
  margin-right: 8px;
}

.skill-list {
  color: #333;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-badge {
  background: #28a745;
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
}

.view-button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

/* 인기 프로젝트 그리드 스타일 */
.popular-preview {
  width: 100%;
  margin: 32px 0;
}

.popular-preview h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
}

.popular-projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.popular-project-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.popular-project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border-radius: 12px 12px 0 0;
}

.popular-project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.popular-project-title {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.4;
}

.popular-project-description {
  margin: 0 0 16px 0;
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
}

.popular-project-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.popular-stat {
  font-size: 0.85rem;
  color: #666;
}

.popular-tech-stacks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.popular-tech-tag {
  background: #f8f9fa;
  color: #495057;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
}


/* 반응형 디자인 */
@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }
  
  .page-subtitle {
    font-size: 16px;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .project-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .match-score {
    align-self: flex-end;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .popular-projects-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 28px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
}

/* 탭 네비게이션 스타일 */
.tab-navigation {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  border-bottom: 2px solid #f1f3f4;
  padding-bottom: 16px;
}

.tab-button {
  background: transparent;
  border: none;
  color: #666;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.tab-button:hover {
  background: #f8f9fa;
  color: #333;
}

.tab-button.active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}


/* 팀원 추천 스타일 */
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
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.member-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.member-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #f8f9fa;
}

.member-basic-info {
  flex: 1;
}

.member-name {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 700;
}

.member-role {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.member-info {
  margin-bottom: 20px;
}

.member-bio {
  margin-bottom: 16px;
}

.member-bio p {
  margin: 0;
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
}

.member-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  flex: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 0.9rem;
  color: #333;
  font-weight: 600;
}

.member-tech-stacks {
  margin-bottom: 20px;
}

.member-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.member-links {
  display: flex;
  gap: 8px;
}

.link-button {
  background: #f8f9fa;
  color: #495057;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.link-button:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.link-button.github {
  background: #24292e;
  color: white;
}

.link-button.github:hover {
  background: #1e2124;
}

.link-button.linkedin {
  background: #0077b5;
  color: white;
}

.link-button.linkedin:hover {
  background: #005885;
}

.contact-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* 반응형 디자인 - 팀원 추천 */
@media (max-width: 768px) {
  .tab-navigation {
    flex-direction: column;
    gap: 8px;
  }
  
  .tab-button {
    text-align: center;
  }
  
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
}

/* 더보기 버튼 스타일 */
.show-more-section {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  margin-bottom: 20px;
}

.show-more-button {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 2px solid #dee2e6;
  color: #495057;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 200px;
  justify-content: center;
}

.show-more-button:hover {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: #20c997;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.3);
}

.show-more-button svg {
  transition: transform 0.3s ease;
}

.show-more-button:hover svg {
  transform: rotate(90deg);
}
</style>