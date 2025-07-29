<template>
  <div class="main-content">
    <div class="project-content">
      <!-- props로 project 내려줌 -->
      <ProjectHeader :project="project" />
      <div class="tab-section">
        <TabNavigation :activeTab="activeTab" @tab-change="handleTabChange" />
      </div>
      <div class="tab-content">
        <ProjectWorkContent :description="project.description" :file-url="project.fileUrl" />
        <ProjectComment :projectId="project.projectId" id="comment-section" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import TabNavigation from '@/components/projectComponents/TabNavigation.vue'
import ProjectHeader from '@/components/projectComponents/ProjectHeader.vue'
import ProjectWorkContent from '@/components/projectComponents/ProjectWorkContent.vue'
import ProjectComment from '@/components/projectComponents/ProjectComment.vue'

export default {
  name: 'ProjectDetailPage',
  components: {
    TabNavigation,
    ProjectHeader,
    ProjectWorkContent,
    ProjectComment
  },
  data() {
    return {
      project: {},
      activeTab: 'content'
    }
  },
  async created() {
    const id = this.$route.params.id
    try {
      const res = await axios.get(`http://localhost:8080/api/projects/${id}`)
      this.project = res.data
    } catch (e) {
      alert('프로젝트 정보를 불러오지 못했습니다.')
      console.error(e)
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab
      let targetId = (tab === 'content') ? 'content-section'
          : (tab === 'comment') ? 'comment-section' : ''
      if (targetId) {
        this.$nextTick(() => {
          const element = document.getElementById(targetId)
          if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      }
    }
  }
}
</script>

<style scoped>
.project-detail-page {
  min-height: 100vh;
  background: #FFF;
}

.page-container {
  display: flex;
  width: 100%;
  min-width: 1080px;
  justify-content: center; /* 이 컨테이너 안의 내용물을 중앙으로 */
  align-items: center;
  background: #FFF;
}

.content-wrapper {
  display: flex;
  width: 100%; /* 너비를 100%로 설정하여 부모의 중앙 정렬을 따르도록 합니다. */
  max-width: 1080px; /* 최대 너비는 유지 */
  padding: 10px 0px 90px 0px;
  flex-direction: column;
  justify-content: center; /* 수평 중앙 정렬 (내부 아이템이 중앙으로 오게 함) */
  align-items: center; /* 수직 중앙 정렬 (내부 아이템이 중앙으로 오게 함) */
  gap: 35px;
}

.main-content {
  display: flex; /* 이미 flex로 설정되어 있음 */
  width: 800px;
  flex-direction: column;
  align-items: flex-start; /* 이 부분은 내부 요소 정렬에 영향을 줍니다. */
  margin: 0 auto; /* 이 속성을 추가하여 main-content 자체를 중앙 정렬합니다. */
}

.tab-section {
  width: 100%;
  background: #FFF;
}

.project-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.tab-content {
  width: 100%;
}

.sidebar-space {
  width: 245px;
  height: 3549.52px;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .content-wrapper {
    width: 90%;
    max-width: 1080px;
  }
  
  .main-content {
    width: 100%;
    max-width: 800px;
  }
  
  .sidebar-space {
    display: none;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 20px;
  }
  
  .tab-section {
    top: 0;
  }
}
</style>
