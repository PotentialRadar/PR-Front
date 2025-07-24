<template>
  <div class="main-content">
    <div class="project-content">
      <ProjectHeader />
      
      <div class="tab-section">
        <TabNavigation 
          :activeTab="activeTab" 
          @tab-change="handleTabChange" 
        />
      </div>
      
      <div class="tab-content">
        <ProjectSummary id="summary-section" />
        <ProjectWorkContent id="content-section" />
        <ProjectComment id="comment-section" />
      </div>
    </div>
  </div>
</template>

<script>
import TabNavigation from '@/components/projectComponents/TabNavigation.vue'
import ProjectHeader from '@/components/projectComponents/ProjectHeader.vue'
import ProjectSummary from '@/components/projectComponents/ProjectSummary.vue'
import ProjectWorkContent from '@/components/projectComponents/ProjectWorkContent.vue'
import ProjectComment from '@/components/projectComponents/ProjectComment.vue'

export default {
  name: 'ProjectDetailPage',
  components: {
    TabNavigation,
    ProjectHeader,
    ProjectSummary,
    ProjectWorkContent,
    ProjectComment
  },
  data() {
    return {
      activeTab: 'summary'
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab; // 현재 활성 탭 상태 업데이트 (시각적 표시용)
      
      let targetId = '';
      if (tab === 'summary') {
        targetId = 'summary-section';
      } else if (tab === 'content') {
        targetId = 'content-section';
      } else if (tab === 'comment') {
        targetId = 'comment-section';
      }

      if (targetId) {
        // 다음 틱에 DOM이 업데이트된 후 스크롤을 실행하기 위해 nextTick 사용
        this.$nextTick(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', // 부드러운 스크롤 효과
              block: 'start'     // 요소의 상단이 뷰포트 상단에 오도록
            });
          }
        });
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
