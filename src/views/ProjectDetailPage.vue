<template>
  <div class="project-detail-page">
    <div class="background-gradient"></div>
    <div class="floating-shapes">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>

    <div class="page-container">
      <div class="content-wrapper">
        <div class="main-content">
          <div class="header-section">
            <ProjectHeader />
          </div>

          <div class="integrated-content-card">
            <div class="tab-section">
              <TabNavigation
                :activeTab="activeTab"
                @tab-change="handleTabChange"
              />
            </div>

            <div class="tab-content">
              <ProjectWorkContent id="content-section" />
              <ProjectComment id="comment-section" />
            </div>
          </div>
        </div>
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
  background: linear-gradient(135deg, #f8fffa 0%, #f0fff4 50%, #ecfdf5 100%);
  position: relative;
  overflow-x: hidden;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100vh;
  background:
    radial-gradient(circle at 20% 20%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 60%, rgba(76, 175, 80, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(76, 175, 80, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: -2;
}

.floating-shapes {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  left: 85%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  left: 5%;
  animation-delay: 2s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 30%;
  left: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.1;
  }
}

.page-container {
  display: flex;
  width: 100%;
  justify-content: center;
  position: relative;
  z-index: 1;
}

.content-wrapper {
  display: flex;
  width: 100%;
  max-width: 1080px;
  padding: 60px 20px 90px;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.main-content {
  display: flex;
  width: 100%;
  max-width: 900px;
  flex-direction: column;
  gap: 40px;
}

.header-section {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow:
    0 20px 40px rgba(76, 175, 80, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.1);
  transition: all 0.3s ease;
}

.header-section:hover {
  transform: translateY(-2px);
  box-shadow:
    0 25px 50px rgba(76, 175, 80, 0.15),
    0 2px 10px rgba(0, 0, 0, 0.08);
}

.integrated-content-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow:
    0 20px 40px rgba(76, 175, 80, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.08);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.integrated-content-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4CAF50, #66BB6A, #81C784);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.integrated-content-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 30px 60px rgba(76, 175, 80, 0.12),
    0 4px 20px rgba(0, 0, 0, 0.08);
}

.integrated-content-card:hover::before {
  opacity: 1;
}

.tab-section {
  width: 100%;
  padding: 20px 20px 0 20px;
  border-bottom: 1px solid rgba(76, 175, 80, 0.1);
  margin-bottom: 30px;
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  z-index: 10;
  border-radius: 24px 24px 0 0;
}

.tab-content {
  width: 100%;
  padding: 0 40px 40px 40px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .content-wrapper {
    max-width: 95%;
    padding: 40px 15px 70px;
  }

  .main-content {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 10px 60px;
  }
  
  .main-content {
    gap: 25px;
  }

  .integrated-content-card {
    border-radius: 16px;
  }

  .tab-section {
    padding: 15px 20px 0 20px;
    margin-bottom: 20px;
    border-radius: 16px 16px 0 0;
  }
  
  .tab-content {
    padding: 0 25px 25px 25px;
    gap: 25px;
  }

  .shape-1, .shape-2, .shape-3 {
    display: none;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 20px 5px 50px;
  }

  .main-content {
    gap: 20px;
  }

  .integrated-content-card {
    border-radius: 12px;
  }
  
  .tab-section {
    padding: 12px 15px 0 15px;
    margin-bottom: 15px;
    border-radius: 12px 12px 0 0;
  }

  .tab-content {
    padding: 0 20px 20px 20px;
    gap: 20px;
  }
}

/* Smooth animations */
.integrated-content-card {
  animation: fadeInUp 0.6s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
  animation-delay: 0.1s;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Enhanced focus states */
.header-section:focus-within,
.integrated-content-card:focus-within {
  outline: none;
  box-shadow:
    0 0 0 3px rgba(76, 175, 80, 0.2),
    0 20px 40px rgba(76, 175, 80, 0.15);
}

/* Loading animation */
.main-content {
  animation: contentLoad 0.8s ease-out;
}

@keyframes contentLoad {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
