<template>
  <div class="project-detail-page">
    <div class="page-container">
      <div class="content-wrapper">
        <div class="main-content">
          <!-- Tab Navigation -->
          <div class="tab-section">
            <TabNavigation 
              :activeTab="activeTab" 
              @tab-change="handleTabChange" 
            />
          </div>
          
          <!-- Project Content -->
          <div class="project-content">
            <ProjectHeader />
            
            <!-- Tab Content -->
            <div class="tab-content">
              <ProjectSummary v-if="activeTab === 'summary'" />
              <ProjectWorkContent v-if="activeTab === 'content'" />
              <ProjectFreeTalk v-if="activeTab === 'freetalk'" />
            </div>
          </div>
        </div>
        
        <!-- Sidebar space -->
        <div class="sidebar-space"></div>
      </div>
    </div>
  </div>
</template>

<script>
import TabNavigation from '@/components/projectComponents/TabNavigation.vue'
import ProjectHeader from '@/components/projectComponents/ProjectHeader.vue'
import ProjectSummary from '@/components/projectComponents/ProjectSummary.vue'
import ProjectWorkContent from '@/components/projectComponents/ProjectWorkContent.vue'
import ProjectFreeTalk from '@/components/projectComponents/ProjectFreeTalk.vue'

export default {
  name: 'ProjectDetailPage',
  components: {
    TabNavigation,
    ProjectHeader,
    ProjectSummary,
    ProjectWorkContent,
    ProjectFreeTalk
  },
  data() {
    return {
      activeTab: 'freetalk'
    }
  },
  methods: {
    handleTabChange(tab) {
      this.activeTab = tab;
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
  justify-content: center;
  align-items: center;
  background: #FFF;
}

.content-wrapper {
  display: flex;
  width: 1080px;
  padding: 10px 0px 90px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 35px;
}

.main-content {
  display: flex;
  width: 800px;
  flex-direction: column;
  align-items: flex-start;
}

.tab-section {
  width: 100%;
  position: relative;
  top: 246px;
  background: #FFF;
  z-index: 10;
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
