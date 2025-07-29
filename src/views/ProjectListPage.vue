<template>
  <div class="project-list-page">
    <!-- 페이지 헤더 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">프로젝트 찾기</h1>
          <div class="title-underline"></div>
        </div>
        <p class="page-subtitle">다양한 프로젝트에 참여하여 새로운 경험을 쌓아보세요</p>
      </div>
    </div>

    <SearchSection />

    <!-- 카테고리 섹션 -->
    <section class="category-icons-section">
      <div class="category-item">
        <div class="category-icon-wrapper">
          <img src="@/assets/icons/backend.png" alt="백엔드 아이콘" class="category-icon" />
        </div>
        <div class="category-title">백엔드</div>
      </div>
      <div class="category-item">
        <div class="category-icon-wrapper">
          <img src="@/assets/icons/frontend.png" alt="프론트엔드 아이콘" class="category-icon" />
        </div>
        <div class="category-title">프론트엔드</div>
      </div>
      <div class="category-item">
        <div class="category-icon-wrapper">
          <img src="@/assets/icons/app_development.png" alt="앱개발 아이콘" class="category-icon" />
        </div>
        <div class="category-title">앱개발</div>
      </div>
      <div class="category-item">
        <div class="category-icon-wrapper">
          <img src="@/assets/icons/design.png" alt="디자인 아이콘" class="category-icon" />
        </div>
        <div class="category-title">디자인</div>
      </div>
      <div class="category-item">
        <div class="category-icon-wrapper">
          <img src="@/assets/icons/infra.png" alt="인프라 아이콘" class="category-icon" />
        </div>
        <div class="category-title">인프라</div>
      </div>
    </section>

    <div class="divider"></div>

    <div class="container">
      <div class="content-wrapper">
        <div class="sort-section">
          <button class="create-project-button" @click="goToCreateProject">
            <i class="bi bi-plus-circle"></i>
            프로젝트 생성하기
          </button>
          <SortOptions />
        </div>
        
        <div class="projects-section">
          <div class="projects-container">
            <div class="project-list">
              <ProjectCard
                v-for="project in projects"
                :key="project.id"
                :project="project"
              />
            </div>
          </div>
          <PaginationComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import SearchSection from '@/components/projectComponents/SearchSection.vue'
import SortOptions from '@/components/projectComponents/SortOptions.vue'
import ProjectCard from '@/components/projectComponents/ProjectCard.vue'
import PaginationComponent from '@/components/projectComponents/PaginationComponent.vue'

export default {
  name: 'ProjectListPage',
  components: {
    SearchSection,
    SortOptions,
    ProjectCard,
    PaginationComponent
  },
  data() {
    return {
      projects: []   // 백에서 받아올거라 빈 배열로 초기화
    }
  },
  mounted() {
    console.log('받은 project:', this.project)
  },
  created() {
    this.fetchProjects();
  },
  watch: {
    '$route'(to, from) {
      if (from.name === 'ProjectDetail') {
        this.fetchProjects();  //상세 페이지에서 돌아올 때 조회수 포함 새로고침
      }
    }
  },
  methods: {
    // 프로젝트 리스트 API 호출
    async fetchProjects() {
      try {
        const response = await axios.get('http://localhost:8080/api/projects'); // 실제 API 주소로 수정!
        console.log('API 응답', response.data);
        // API 응답을 projects에 저장
        this.projects = response.data.map(project => ({
          id: project.projectId,
          title: project.title,
          description: project.description,
          tags: project.techStacks,   // (tags 대신 techStacks 필드 사용)
          status: project.status === 'RECRUITING' ? '모집중' : project.status,
          teamSize: project.recruitCount + '명',     // 인원 표시
          applicants: project.appliedCount + '명',   // 지원자 수
          startDate: project.startDate,
          endDate: project.endDate,
          viewCount: project.viewCount ?? 0,
          deadline: project.recruitDeadline ? this.calcDeadline(project.recruitDeadline) : '', // 디데이 계산
        }))
      } catch (error) {
        alert('프로젝트 목록을 불러오는데 실패했습니다.');
        console.error(error);
      }
    },
    calcDeadline(recruitDeadline) {
      // D-day 계산 (오늘 기준 마감일까지 며칠 남았는지)
      const today = new Date();
      const deadline = new Date(recruitDeadline);
      const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
      return diff > 0 ? `D-${diff}` : '마감';
    },
    goToCreateProject() {
      this.$router.push({ name: 'ProjectCreate' }); // 라우터 이름 정확히 맞춰서!
    }
  }
}
</script>

<style scoped>
.project-list-page {
  min-height: 100vh;
  background: #FFF;
  padding-top: 100px;
}

/* 페이지 헤더 */
.page-header {
  width: 100%;
  text-align: center;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  padding: 0px 20px 40px 20px;
}

.title-section {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.page-title {
  font-size: 42px;
  font-weight: 900;
  color: var(--color-grey-15, #262626);
  margin: 0;
  letter-spacing: -1px;
  position: relative;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.title-underline {
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 2px;
  position: relative;
  animation: expandLine 1s ease-out;
}

.title-underline::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: #4CAF50;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.page-subtitle {
  font-size: 18px;
  color: var(--color-grey-50, #808080);
  margin: 0;
  font-weight: 400;
  max-width: 600px;
  line-height: 1.6;
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 0.3s forwards;
}

@keyframes expandLine {
  0% { width: 0; }
  100% { width: 80px; }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
  100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 카테고리 섹션 */
.category-icons-section {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin: 40px 0;
  padding: 0 20px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 20px 15px;
  border-radius: 12px;
  position: relative;
}

.category-item:hover {
  transform: translateY(-5px);
  background: rgba(76, 175, 80, 0.05);
}

.category-icon-wrapper {
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  background: rgba(76, 175, 80, 0.1);
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.category-item:hover .category-icon-wrapper {
  background: rgba(76, 175, 80, 0.2);
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
}

.category-icon {
  width: 40px;
  height: 40px;
  transition: all 0.3s ease;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  transition: color 0.3s ease;
}

.category-item:hover .category-title {
  color: #4CAF50;
}

.divider {
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(76, 175, 80, 0.3) 50%, transparent 100%);
  margin: 30px 0;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
}

.content-wrapper {
  width: 100%;
  max-width: 1080px;
  padding: 20px 0 90px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sort-section {
  width: 100%;
  max-width: 848px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 10px;
}

.create-project-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
}

.create-project-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.create-project-button:hover::before {
  left: 100%;
}

.create-project-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.create-project-button:active {
  transform: translateY(0);
}

.create-project-button i {
  font-size: 16px;
}

.projects-section {
  width: 100%;
  max-width: 848px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.projects-container {
  width: 100%;
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 15px;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .category-icons-section {
    gap: 30px;
  }

  .content-wrapper {
    max-width: 90%;
  }

  .sort-section {
    max-width: 100%;
  }

  .projects-section {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .project-list-page {
    padding-top: 60px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .category-icons-section {
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .category-icon-wrapper {
    width: 60px;
    height: 60px;
  }

  .category-icon {
    width: 35px;
    height: 35px;
  }

  .category-title {
    font-size: 14px;
  }

  .sort-section {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .create-project-button {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .project-list-page {
    padding-top: 40px;
  }

  .header-content {
    padding: 30px 15px;
  }

  .page-title {
    font-size: 28px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .category-icons-section {
    gap: 15px;
    margin: 30px 0;
  }

  .category-item {
    padding: 15px 10px;
  }

  .category-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .category-icon {
    width: 30px;
    height: 30px;
  }

  .category-title {
    font-size: 13px;
  }

  .container {
    padding: 0 15px;
  }

  .create-project-button {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>