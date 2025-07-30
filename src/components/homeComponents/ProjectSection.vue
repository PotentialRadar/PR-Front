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
        <div class="tab" :class="{ active: activeTab === 'ai' }" @click="activeTab = 'ai'">AI 추천</div>
        <div class="tab" :class="{ active: activeTab === 'app' }" @click="activeTab = 'app'">어플리케이션 개발</div>
        <div class="tab" :class="{ active: activeTab === 'web' }" @click="activeTab = 'web'">웹 개발</div>
        <div class="tab" :class="{ active: activeTab === 'software' }" @click="activeTab = 'software'">소프트웨어 개발</div>
        <div class="tab" :class="{ active: activeTab === 'game' }" @click="activeTab = 'game'">게임 개발</div>
        <div class="tab" :class="{ active: activeTab === 'design' }" @click="activeTab = 'design'">기획&디자인</div>
        <div class="tab" :class="{ active: activeTab === 'publishing' }" @click="activeTab = 'publishing'">퍼블리싱</div>
        <div class="tab" :class="{ active: activeTab === 'etc' }" @click="activeTab = 'etc'">기타</div>
      </div>

      <transition name="slide-fade" mode="out-in">
        <div class="projects-grid" :key="activeTab + '-' + filteredProjects.length">
          <template v-if="filteredProjects.length > 0">
            <!-- [API 연결 지점] 프로젝트 목록 받아오기 -->
            <div v-for="project in filteredProjects.slice(0, 4)" :key="project.id" class="project-card">
              <div class="project-category">개발>앱</div>
              <div class="project-favorite" @click="toggleFavorite(project)">
                <i :class="['bi', project.isFavorite ? 'bi-heart-fill' : 'bi-heart']"
                  style="font-size: 20px; color: #4CAF50;"></i>
              </div>
              <a href="#" class="project-link">
                <h3 class="project-title">{{ project.title }}</h3>
              </a>
              <div class="project-meta">
                <p class="project-description">{{ project.description }}</p>
                <div class="project-status" :class="getStatusClass(project.status)">{{ project.status }}</div>
              </div>
              <div class="project-details">
                <div class="detail-item">
                  <span class="detail-label">진행 기간</span>
                  <span class="detail-value">{{ project.duration }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">모집 인원</span>
                  <span class="detail-value">{{ project.members }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">지원자수</span>
                  <span class="detail-value">{{ project.applicants }}</span>
                </div>
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

// 백엔드 연동 시 여기를 API 호출로 대체
// ex) const projects = ref(await fetchProjectsFromAPI());
const activeTab = ref('app')

// [API 연결 지점] 초기 더미 데이터 → 실제 API 연동 시 제거
const projects = ref([
  {
    id: 1,
    category: 'app',
    title: '사용자간 직거래 몰 React Native 앱 개발',
    description: '판매자와 구매자 간 직거래를 진행하는 ...',
    status: '모집중',
    duration: '6개월',
    members: '3명',
    applicants: '25명',
    isFavorite: true
  },
  {
    id: 2,
    category: 'app',
    title: '간단한 병원 지점별 관리 및 정보제공 앱 개발(Android, IOS)',
    description: '판매자와 구매자 간 직거래를 진행하는 ...',
    status: '마감 D-15',
    duration: '3개월',
    members: '8명',
    applicants: '13명',
    isFavorite: false
  },
  {
    id: 3,
    category: 'app',
    title: '요트투어 중개 플랫폼 Hybrid 앱개발',
    description: '판매자와 구매자 간 직거래를 진행하는 ...',
    status: '마감 D-10',
    duration: '4개월',
    members: '4명',
    applicants: '15명',
    isFavorite: false
  },
  {
    id: 4,
    category: 'app',
    title: '홍채 등록/인식 Android 앱개발',
    description: '판매자와 구매자 간 직거래를 진행하는 ...',
    status: '모집중',
    duration: '6개월',
    members: '5명',
    applicants: '9명',
    isFavorite: false
  },
  {
    id: 5,
    category: 'web',
    title: 'Vue + SpringBoot 기반 팀 협업 플랫폼 개발',
    description: 'Vue와 SpringBoot를 활용하여 실시간 협업 도구 개발...',
    status: '모집중',
    duration: '5개월',
    members: '4명',
    applicants: '10명',
    isFavorite: false
  },
  {
    id: 6,
    category: 'web',
    title: '기업용 쇼핑몰 백오피스 웹 개발',
    description: 'å, 주문, 회원 관리 기능 중심의 관리자 웹페이지 개발...',
    status: '마감 D-3',
    duration: '2개월',
    members: '6명',
    applicants: '17명',
    isFavorite: true
  }
])

const filteredProjects = computed(() => {
  if (activeTab.value === 'ai') return projects.value
  if (activeTab.value === 'app') return projects.value.filter(p => p.category === 'app')
  if (activeTab.value === 'web') return projects.value.filter(p => p.category === 'web')
  if (activeTab.value === 'software') return projects.value.filter(p => p.category === 'software')
  if (activeTab.value === 'game') return projects.value.filter(p => p.category === 'game')
  if (activeTab.value === 'design') return projects.value.filter(p => p.category === 'design')
  if (activeTab.value === 'publishing') return projects.value.filter(p => p.category === 'publishing')
  if (activeTab.value === 'etc') return projects.value.filter(p => p.category === 'etc')
  return []
})

const toggleFavorite = (project) => {
  // [API 연결 지점] 즐겨찾기 상태 변경
  project.isFavorite = !project.isFavorite;
}

// 프로젝트 상태(status) 문자열에 따라 스타일을 지정하는 함수
function getStatusClass(status) {
  if (status.includes('모집')) return 'status-open';

  if (status.includes('마감 D-')) {
    const days = parseInt(status.replace('마감 D-', ''), 10);
    if (days <= 7) return 'status-close'; // D-7 이하 빨강
    else return 'status-open';            // 그 외는 모집중 스타일
  }

  return ''; // 예외 케이스 처리
}
</script>

<style scoped>
.project-section {
  display: flex;
  height: 849px;
  padding: 90px 0;
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
  width: 1320px;
  height: 42px;
  padding-bottom: 1px;
  align-items: flex-start;
  gap: 90.8px;
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
}

.tab.active {
  color: #4CAF50;
  border-bottom: 5px solid #4CAF50;
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
  width: 650px;
  height: 223px;
  border-radius: 10px;
  border: 1px solid #E8E8E8;
  position: relative;
  background: #FFF;
}

.project-category {
  display: inline-flex;
  padding: 8px 14px;
  align-items: flex-start;
  border-radius: 20px;
  border: 1px solid #4CAF50;
  position: absolute;
  left: 17px;
  top: 21px;
  color: #4CAF50;
  font-size: 13px;
  font-weight: 600;
  line-height: 22.5px;
}

.project-favorite {
  position: absolute;
  right: 22px;
  top: 22px;
  cursor: pointer;
}

.project-link {
  display: flex;
  width: 608px;
  align-items: flex-start;
  position: absolute;
  left: 21px;
  top: 75px;
  height: 30px;
  text-decoration: none;
}

.project-title {
  color: #262626;
  font-size: 17px;
  font-weight: 400;
  line-height: 30px;
  margin: 0;
}

.project-meta {
  display: flex;
  width: 608px;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  left: 21px;
  top: 117px;
  height: 32px;
}

.project-description {
  color: #262626;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
  margin: 0;
}

.project-status {
  color: #262626;
  font-size: 18px;
  font-weight: 600;
  line-height: 31.5px;
}

.status-open {
  color: #388e3c;
  background-color: #e8f5e9;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.status-close {
  color: #d32f2f;
  background-color: #fce8e6;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.project-details {
  display: flex;
  width: 648px;
  padding: 20px 0;
  justify-content: center;
  align-items: center;
  background: #F9F9F9;
  position: absolute;
  left: 1px;
  top: 168px;
  height: 54px;
}

.detail-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  border-left: 1px solid #AAA;
  gap: 10px;
}

.detail-item:first-child {
  border-left: none;
}

.detail-label {
  color: #555;
  font-size: 13px;
  font-weight: 400;
}

.detail-value {
  color: #262626;
  font-size: 14px;
  font-weight: 600;
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
