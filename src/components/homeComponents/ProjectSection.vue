<template>
  <section class="project-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">진행중인 프로젝트</h2>
        <a href="#" class="more-link">
          <span>더보기</span>
          <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.01" d="M19 0.189941H0V19.1899H19V0.189941Z" fill="white"/>
            <path d="M10 6.18799L14 10.188L10 14.188" stroke="#262626" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 10.168H5" stroke="#262626" stroke-linecap="round"/>
          </svg>
        </a>
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
      
      <div class="projects-grid">
        <div class="project-card" v-for="project in filteredProjects" :key="project.id">
          <div class="project-category">개발>앱</div>
          <div class="project-favorite" @click="toggleFavorite(project)">
            <i :class="['bi', project.isFavorite ? 'bi-heart-fill' : 'bi-heart']" style="font-size: 20px; color: #FF7D12;"></i>
          </div>
          <a href="#" class="project-link">
            <h3 class="project-title">{{ project.title }}</h3>
          </a>
          <div class="project-meta">
            <p class="project-description">{{ project.description }}</p>
            <div class="project-status">{{ project.status }}</div>
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const activeTab = ref('app')

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
    status: '마감 15일전',
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
  project.isFavorite = !project.isFavorite;
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
  color: #FF7D12;
  border-bottom: 5px solid #FF7D12;
}

.tab:hover {
  color: #FF7D12;
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
  padding: 9px 13px 8px 13px;
  align-items: flex-start;
  border-radius: 100px;
  border: 1px solid #FF7D12;
  position: absolute;
  left: 17px;
  top: 21px;
  color: #FF7D12;
  font-size: 13px;
  font-weight: 400;
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

.project-details {
  display: flex;
  width: 648px;
  padding: 20px 0;
  justify-content: center;
  align-items: flex-start;
  background: #F9F9F9;
  position: absolute;
  left: 1px;
  top: 168px;
  height: 54px;
}

.detail-item {
  display: flex;
  padding: 0 20px;
  align-items: center;
  gap: 64px;
  flex-shrink: 0;
  border-left: 1px solid #AAA;
}

.detail-item:first-child {
  border-left: none;
}

.detail-label {
  color: #555;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
}

.detail-value {
  color: #262626;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
}
</style>
