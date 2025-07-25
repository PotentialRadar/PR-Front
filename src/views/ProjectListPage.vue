<template>
  <div class="project-list-page">
    <SearchSection />

    <section class="category-icons-section">
      <div class="category-item">
        <img src="@/assets/icons/backend.png" alt="백엔드 아이콘" class="category-icon" />
        <div class="category-title">백엔드</div>
      </div>
      <div class="category-item">
        <img src="@/assets/icons/frontend.png" alt="프론트엔드 아이콘" class="category-icon" />
        <div class="category-title">프론트엔드</div>
      </div>
      <div class="category-item">
        <img src="@/assets/icons/app_development.png" alt="앱개발 아이콘" class="category-icon" />
        <div class="category-title">앱개발</div>
      </div>
      <div class="category-item">
        <img src="@/assets/icons/design.png" alt="디자인 아이콘" class="category-icon" />
        <div class="category-title">디자인</div>
      </div>
      <div class="category-item">
        <img src="@/assets/icons/infra.png" alt="인프라 아이콘" class="category-icon" />
        <div class="category-title">인프라</div>
      </div>
    </section>

     <hr style="background: #eee; height:1px; border:0; margin: 20px 0 30px;">
    

    <div class="container">
      <div class="content-wrapper">
        <div class="sort-section">
          <button class="create-project-button" @click="goToCreateProject">
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
      projects: [
        {
          id: 1,
          title: 'JAVA Spring, Vue 기반 프로젝트',
          description: '스터디 하면서 프로젝트 진행할 분들 구합니다',
          tags: ['JAVA', 'Spring', 'Vue', '웹개발'],
          status: '모집중',
          duration: '3개월',
          teamSize: '3명',
          applicants: '0명',
          deadline: 'D-16',
        },
        {
          id: 2,
          title: 'Lock Screen 앱 5종 AOS 최신화 및 마켓 등록',
          description: '',
          tags: ['Android', '모바일', '어플'],
          status: '모집중',
          duration: '3개월',
          teamSize: '6명',
          applicants: '2명',
          deadline: 'D-13',
        },
        {
          id: 3,
          title: 'Web 프레임워크 및 UI 시스템 고도화',
          description: '',
          tags: ['React', 'TypeScript', 'vite', 'StoryBook', 'CSS-in-JS'],
          status: '모집중',
          duration: '6개월',
          teamSize: '3명',
          applicants: '0명',
          deadline: 'D-16',
        }
      ]
    }
  },
  methods: {
    // 프로젝트 생성 페이지로 이동하는 메서드 추가
    goToCreateProject() {
      // 'CreateProject'는 이동하려는 라우트의 name 속성입니다.
      // 실제 프로젝트 라우트 설정에 맞게 변경해주세요.
      this.$router.push({ name: 'CreateProject' }); 
    }
  }
}
</script>

<style scoped>
.project-list-page {
  min-height: 100vh;
  background: #fff;
}

.category-icons-section {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  margin-bottom: 50px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.category-icon {
  width: 60px;
  height: 60px;
  margin-bottom: 10px;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.category-item:hover .category-icon {
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out;
}
.category-item:hover .category-title {
  color: #31D0F4;
}


.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 1080px;
  padding: 10px 0 90px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sort-section {
  width: 848px;
  display: flex;
  justify-content: space-between; /* 버튼과 정렬 드롭다운을 양 끝으로 정렬 */
  align-items: center;
  height: 45px;
  margin-left: 0;
  margin-bottom: 20px;
}

/* 새로 추가된 프로젝트 생성하기 버튼 스타일 */
.create-project-button {
  background-color: #31D0F4; /* 버튼 배경색 */
  color: #fff; /* 텍스트 색상 */
  border: none;
  border-radius: 5px; /* 약간 둥근 모서리 */
  padding: 10px 15px; /* 내부 여백 */
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 그림자 */
}

.create-project-button:hover {
  background-color: #24b5d8; /* 호버 시 배경색 변경 */
  transform: translateY(-1px); /* 살짝 올라오는 효과 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.projects-section {
  width: 848px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 21px;
}

.projects-container {
  width: 100%;
  padding: 0 3px 10px 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.project-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}
</style>