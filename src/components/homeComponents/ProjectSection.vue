<template>
  <section class="project-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">진행중인 프로젝트</h2>
        <router-link to="/projects" class="more-link">
          <span>더보기</span>
          <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.01" d="M19 0.189941H0V19.1899H19V0.189941Z" fill="white" />
            <path d="M10 6.18799L14 10.188L10 14.188" stroke="#262626" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 10.168H5" stroke="#262626" stroke-linecap="round" />
          </svg>
        </router-link>
      </div>

      <div class="filter-tabs">
        <div class="tab" :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">전체</div>
        <div class="tab" :class="{ active: activeTab === 'frontend' }" @click="activeTab = 'frontend'">프론트엔드</div>
        <div class="tab" :class="{ active: activeTab === 'backend' }" @click="activeTab = 'backend'">백엔드</div>
        <div class="tab" :class="{ active: activeTab === 'app' }" @click="activeTab = 'app'">앱 개발</div>
        <div class="tab" :class="{ active: activeTab === 'design' }" @click="activeTab = 'design'">디자인</div>
        <div class="tab" :class="{ active: activeTab === 'infra' }" @click="activeTab = 'infra'">인프라</div>
      </div>

      <transition name="slide-fade" mode="out-in">
        <div class="projects-grid" :key="activeTab + '-' + filteredProjects.length">
          <template v-if="filteredProjects.length > 0">
            <div v-for="project in filteredProjects.slice(0, 4)" :key="project.id" class="project-card">
              <div class="card-header">
                <div class="header-left">
                  <div class="status-title-container">
                    <div class="status-badge" v-if="project.status">
                      <span>{{ project.status }}</span>
                    </div>
                    <div class="title-container">
                      <h3 class="project-title">{{ project.title }}</h3>
                    </div>
                  </div>
                </div>
                <div class="header-right">
                  <div class="view-count-display">
                    👀 {{ project.viewCount || 0 }}
                  </div>
                  <button class="favorite-button" @click="toggleFavorite(project)" :class="{ 'favorited': project.isFavorite }">
                    <span v-if="project.isFavorite">❤️</span>
                    <span v-else>🤍</span>
                  </button>
                </div>
              </div>

              <div class="description-section" v-if="project.description">
                <p class="project-description">
                  {{ project.description }}
                </p>
              </div>

              <div class="category-tags-section">
                <div class="project-tags">
                  <div class="self-tag" v-for="tag in project.techStacks.slice(0, 4)" :key="tag.techStackName">
                    {{ tag.techStackName }}
                  </div>
                  <div class="self-tag more-tag" v-if="project.techStacks.length > 4">
                    +{{ project.techStacks.length - 4 }}
                  </div>
                </div>
              </div>

              <div class="project-info">
                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-clock"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">진행 기간</div>
                    <div class="info-value">{{ calculateDuration(project.startDate, project.endDate) }}</div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-people"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">모집 인원</div>
                    <div class="info-value">{{ project.recruitCount }}명</div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-person-plus"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">지원자</div>
                    <div class="info-value">{{ project.appliedCount }}명</div>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-icon">
                    <i class="bi bi-calendar-event"></i>
                  </div>
                  <div class="info-content">
                    <div class="info-label">마감일정</div>
                    <div class="info-value" :class="{ 'urgent': isUrgent(project.deadline) }">{{ project.deadline }}</div>
                  </div>
                </div>
              </div>

              <div class="bottom-section">
                <button class="detail-button" @click="goToDetail(project)">
                  상세보기
                </button>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div class="no-projects" key="no-projects">등록된 프로젝트가 없습니다.</div>
          </template>
        </div>
      </transition>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('all')

const projects = ref([
  {
    id: 1,
<<<<<<< HEAD
    title: 'AI 기반 협업툴 백엔드 개발',
    description: 'AI 추천을 기반으로 한 팀 매칭 서비스의 서버 설계와 구현. Spring Boot와 JWT 기반 인증 시스템, 실시간 AI 추천 엔진과 협업 환경을 구축하며 다양한 클라우드 경험을 쌓을 수 있습니다.',
    techStacks: [
      { techStackName: 'Spring Boot' },
      { techStackName: 'JWT' },
      { techStackName: 'PostgreSQL' },
      { techStackName: 'Redis' }
    ],
    status: '모집중',
    startDate: '2024-07-01',
    endDate: '2024-11-01',
    recruitCount: 3,
    appliedCount: 8,
    deadline: 'D-16',
    category: 'backend',
    viewCount: 142,
=======
    category: 'app',
    title: '사용자간 직거래 몰 React Native 앱 개발',
    description: '판매자와 구매자 간 직거래를 진행하는 판매자와 구매자 간 직거래를 진행하는 판매자와 구매자 간 직거래를 진행하는 판매자와 구매자 간 직거래를 진행하는 판매자와 구매자 간 직거래를 진행하는',
    status: '모집중',
    duration: '6개월',
    members: '3명',
    applicants: '25명',
    isFavorite: true
  },
  {
    id: 2,
    category: 'app',
    title: '간단한 병원 지점별 관리 및 정보제공 앱 개발(Android, IOS) 간단한 병원 지점별 관리 및 정보제공 앱 개발(Android, IOS) 간단한 병원 지점별 관리 및 정보제공 앱 개발(Android, IOS)',
    description: '판매자와 구매자 간 직거래를 진행하는 ...',
    status: '마감 D-15',
    duration: '3개월',
    members: '8명',
    applicants: '13명',
>>>>>>> f3cc5e4 (WIP: 로컬 변경사항 저장)
    isFavorite: false
  },
  {
    id: 2,
    title: 'Lock Screen 앱 5종 AOS 최신화 및 마켓 등록',
    description: '안드로이드 앱 개발 및 Google Play 스토어 등록 프로젝트입니다. 기존 락스크린 앱을 최신 Android 버전에 맞게 리팩토링하고, 배포 및 마켓 출시까지 전 과정을 함께합니다.',
    techStacks: [
      { techStackName: 'Android' },
      { techStackName: 'Kotlin' },
      { techStackName: 'Google Play' }
    ],
    status: '모집중',
    startDate: '2024-07-05',
    endDate: '2024-10-05',
    recruitCount: 6,
    appliedCount: 12,
    deadline: 'D-13',
    category: 'app',
    viewCount: 89,
    isFavorite: true
  },
  {
    id: 3,
    title: 'Web 프레임워크 및 UI 시스템 고도화',
    description: '현대적인 웹 프론트엔드 시스템을 구축하는 프로젝트입니다. React, TypeScript, StoryBook을 활용하여 UI 시스템 설계와 성능 최적화까지 실무처럼 경험할 수 있습니다.',
    techStacks: [
      { techStackName: 'React' },
      { techStackName: 'TypeScript' },
      { techStackName: 'Vite' },
      { techStackName: 'StoryBook' },
      { techStackName: 'CSS-in-JS' }
    ],
    status: '모집중',
    startDate: '2024-07-10',
    endDate: '2024-12-31',
    recruitCount: 3,
    appliedCount: 5,
    deadline: 'D-16',
    category: 'frontend',
    viewCount: 203,
    isFavorite: false
  },
  {
    id: 4,
    title: 'E-commerce 플랫폼 디자인 시스템',
    description: '사용자 친화적인 온라인 쇼핑몰 UI/UX 디자인 프로젝트. Figma와 Prototyping을 통한 디자인 시스템 설계, 실무 중심의 UI/UX 프로젝트 경험 제공.',
    techStacks: [
      { techStackName: 'UI/UX' },
      { techStackName: 'Figma' },
      { techStackName: '디자인시스템' },
      { techStackName: 'Prototyping' }
    ],
    status: '모집중',
    startDate: '2024-07-20',
    endDate: '2024-11-30',
    recruitCount: 4,
    appliedCount: 7,
    deadline: 'D-8',
    category: 'design',
    viewCount: 156,
    isFavorite: false
  },
  {
    id: 5,
    title: 'MSA 기반 클라우드 인프라 구축',
    description: '마이크로서비스 아키텍처와 컨테이너 기반 인프라 구축. Docker, Kubernetes, AWS를 활용한 마이크로서비스 배포 및 운영 자동화를 실습합니다.',
    techStacks: [
      { techStackName: 'Docker' },
      { techStackName: 'Kubernetes' },
      { techStackName: 'AWS' },
      { techStackName: 'MSA' }
    ],
    status: '모집중',
    startDate: '2024-07-12',
    endDate: '2024-12-10',
    recruitCount: 5,
    appliedCount: 14,
    deadline: 'D-20',
    category: 'infra',
    viewCount: 321,
    isFavorite: true
  },
  {
    id: 6,
    title: 'AI 챗봇 개발',
    description: '자연어 처리 기반 AI 챗봇 개발 프로젝트. TensorFlow, NLP 기반의 대화형 챗봇을 설계하고 실제 서비스 환경에 배포까지 진행합니다.',
    techStacks: [
      { techStackName: 'Python' },
      { techStackName: 'NLP' },
      { techStackName: 'TensorFlow' }
    ],
    status: '모집중',
    startDate: '2024-07-18',
    endDate: '2024-09-30',
    recruitCount: 2,
    appliedCount: 6,
    deadline: 'D-7',
    category: 'backend',
    viewCount: 98,
    isFavorite: false
  }
])

const filteredProjects = computed(() => {
  if (activeTab.value === 'all') return projects.value
  return projects.value.filter(p => p.category === activeTab.value)
})

const toggleFavorite = (project) => {
  project.isFavorite = !project.isFavorite
}

const calculateDuration = (startDate, endDate) => {
  if (!startDate || !endDate) return '-'
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (isNaN(start) || isNaN(end)) return '-'
  const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1
  if (diff < 7) return `${diff}일`
  if (diff < 30) return `${Math.round(diff / 7)}주`
  return `${Math.round(diff / 30)}개월`
}

const isUrgent = (deadline) => {
  if (!deadline) return false
  const dayMatch = deadline.match(/D-(\d+)/)
  if (dayMatch) {
    const days = parseInt(dayMatch[1])
    return days <= 7
  }
  return false
}

const goToDetail = (project) => {
  project.viewCount = (project.viewCount || 0) + 1
  router.push(`/projects/${project.id}`)
}
</script>

<style scoped>
.project-section {
  display: flex;
  min-height: 849px;
  padding: 90px 0 0 0;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  background: #FFF;
}

.container {
  display: flex;
  width: 1320px;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}

.section-title {
  color: #262626;
  font-size: 24px;
  font-weight: 400;
  line-height: 45px;
  margin: 0;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 27px;
}

.filter-tabs {
  display: flex;
  width: 100%;
  height: 42px;
  padding-bottom: 1px;
  align-items: flex-start;
  gap: 60px;
  border-bottom: 1px solid #E8E8E8;
}

.tab {
  display: flex;
  padding: 0 10px 5px 10px;
  flex-direction: column;
  align-items: center;
  color: #555;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 27px;
  cursor: pointer;
  height: 41px;
  justify-content: center;
  transition: all 0.2s ease;
}

.tab.active {
  color: #4CAF50;
  border-bottom: 5px solid #4CAF50;
  font-weight: 600;
}

.tab:hover {
  color: #4CAF50;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.4s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  width: 100%;
}

.project-card {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: 12px;
  border: 2px solid rgba(76, 175, 80, 0.1);
  background: #FFF;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 12px 12px 0 0;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(76, 175, 80, 0.3);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.status-title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.status-badge {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 20px;
  background: #E8F5E8;
  border: 1px solid #4CAF50;
}

.status-badge span {
  color: #2E7D32;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.title-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.project-title {
  margin: 0;
  color: #262626;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.header-right {
  display: flex;
  align-items: center;
  padding-left: 16px;
  flex-shrink: 0;
}

.view-count-display {
  font-size: 14px;
  color: #666;
  margin-right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #FFF;
  border: 2px solid #E0E0E0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #757575;
  font-size: 16px;
}

.favorite-button:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
  color: #4CAF50;
  transform: scale(1.1);
}

.favorite-button.favorited {
  background: #FF5722;
  border-color: #FF5722;
  color: #FFF;
}

.description-section {
  width: 100%;
  margin-bottom: 16px;
}

.project-description {
  margin: 0;
  color: #424242;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
}

.category-tags-section {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.project-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.self-tag {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 16px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #2E7D32;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.more-tag {
  background: rgba(128, 128, 128, 0.1);
  border-color: rgba(128, 128, 128, 0.2);
  color: #666;
}

.project-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.1);
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #4CAF50;
  color: #FFF;
  font-size: 14px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  color: #6F6F72;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.info-value {
  color: #262626;
  font-size: 14px;
  font-weight: 700;
  line-height: 1;
}

.info-value.urgent {
  color: #dc3545;
  font-weight: 700;
}

.bottom-section {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
}

.detail-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 90%;
  padding: 14px 32px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
}

.detail-button:hover {
  background: linear-gradient(135deg, #388E3C 0%, #1B5E20 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.no-projects {
  grid-column: 1 / -1;
  justify-self: center;
  align-self: center;
  font-size: 16px;
  color: #999;
  padding: 60px 0;
}

</style>