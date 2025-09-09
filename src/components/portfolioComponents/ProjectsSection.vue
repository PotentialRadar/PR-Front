<template>
  <section class="projects-section">
    <div class="section-border">
      <div class="section-header">
        <span class="section-title">withPR</span>
        <span class="divider">|</span>
        <span class="projects-count">총 <span class="highlight">{{ processedProjects.length }}개 프로젝트</span></span>
      </div>
      
      <div v-if="processedProjects.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="bi bi-folder-x"></i>
        </div>
        <h3 class="empty-title">공개한 프로젝트가 없습니다</h3>
        <p class="empty-description">
          마이페이지 > 내 포트폴리오 > 프로젝트 선택에서 공개할 프로젝트를 선택하세요.
        </p>
        <router-link v-if="props.isOwnProfile" to="/myPage/projects" class="go-select-btn">
          프로젝트 선택하러 가기
        </router-link>
      </div>
      
      <div v-else class="projects-content">
        <div class="projects-grid">
          <div 
            v-for="(project, index) in paginatedProjects" 
            :key="index"
            class="project-card-wrapper"
          >
            <div class="project-card">
              <div class="project-image-container">
                <img 
                  :src="project.image" 
                  :alt="project.title"
                  class="project-image"
                />
                <div class="project-badges">
                  <span 
                    v-for="(badge, badgeIndex) in project.badges" 
                    :key="badgeIndex"
                    class="project-badge"
                    :style="{ backgroundColor: badge.color }"
                  >
                    {{ badge.text }}
                  </span>
                </div>
              </div>
              
              <div class="project-details">
                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-role">{{ project.role }}</p>
                <p class="project-description">{{ project.description }}</p>
                <p class="project-duration">{{ project.duration }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 페이지네이션 (3개 이상일 때만 표시) -->
        <PaginationComponent 
          v-if="processedProjects.length > 3"
          :current-page="currentProjectPage" 
          :total-pages="totalProjectPages" 
          :page-group-size="3" 
          @page-change="handleProjectPageChange" 
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import PaginationComponent from '@/components/common/PaginationComponent.vue'

// Props
const props = defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  isOwnProfile: {
    type: Boolean,
    default: false
  }
})

// 프로젝트 기간 포맷팅 함수
const formatProjectPeriod = (startDate, endDate) => {
  if (!startDate) return ''
  
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\. /g, '.').replace(/\.$/, '')
  }

  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : '진행중'
  
  return `${start} - ${end}`
}

// 프로젝트 상태에 따른 뱃지 색상
const getStatusBadgeColor = (status) => {
  switch(status?.toLowerCase()) {
    case 'completed': return '#4CAF50'
    case 'in_progress': return '#2196F3'
    case 'planning': return '#FF9800'
    case 'cancelled': return '#f44336'
    default: return '#757575'
  }
}

// 역할에 따른 뱃지 색상
const getRoleBadgeColor = (role) => {
  if (!role) return '#9C27B0'
  const lower = role.toLowerCase()
  switch(lower) {
    case 'frontend developer':
    case 'front-end developer': return '#61DAFB'
    case 'backend developer':
    case 'back-end developer': return '#68217A'
    case 'full-stack developer':
    case 'fullstack developer': return '#4CAF50'
    case 'ui/ux designer':
    case 'designer': return '#FF6B6B'
    case 'project manager':
    case 'pm': return '#FF9800'
    // 한국어 역할 라벨 매핑
    case '팀장': return '#FF9800'
    case '팀원': return '#4CAF50'
    default: return '#9C27B0'
  }
}

// 페이지네이션 상태
const currentProjectPage = ref(1)
const projectsPerPage = 3

// 처리된 프로젝트 데이터
const processedProjects = computed(() => {
  return props.projects.map(project => ({
    ...project,
    duration: formatProjectPeriod(project.startDate, project.endDate),
    image: project.image || 'https://api.dicebear.com/7.x/shapes/svg?seed=' + project.title,
    badges: [
      {
        text: project.status || 'Unknown',
        color: getStatusBadgeColor(project.status)
      },
      {
        text: project.role || 'Member',
        color: getRoleBadgeColor(project.role)
      }
    ]
  }))
})

// 페이지네이션 계산
const totalProjectPages = computed(() => {
  return Math.ceil(processedProjects.value.length / projectsPerPage)
})

const paginatedProjects = computed(() => {
  const start = (currentProjectPage.value - 1) * projectsPerPage
  const end = start + projectsPerPage
  return processedProjects.value.slice(start, end)
})

// 페이지 변경 핸들러
const handleProjectPageChange = (page) => {
  currentProjectPage.value = page
}
</script>

<style scoped>
.projects-section {
  width: 100%;
  max-width: 1060px;
  align-self: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.section-border {
  display: flex;
  min-height: 104px;
  padding: 4px 0 36px 0;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-top: 4px solid #4CAF50;
  position: relative;
  width: 100%;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  margin: 16px 0 0 4px;
}

.section-title {
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.6px;
  white-space: nowrap;
}

.divider {
  color: #D0D1D4;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.6px;
}

.projects-count {
  color: #6F6F72;
  font-size: 15px;
  font-style: normal;
  font-weight: 500;
  line-height: 17px;
  letter-spacing: 0.6px;
  white-space: nowrap;
}

.highlight {
  color: #4CAF50;
  font-weight: 700;
}

.empty-state {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1000px;
  padding: 40px 24px;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  min-height: 200px;
  text-align: center;
  gap: 16px;
}

.empty-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #4CAF50;
  margin-bottom: 8px;
}

.empty-title {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.empty-description {
  color: #6F6F72;
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.2px;
  margin: 0;
  max-width: 300px;
}

.go-select-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  padding: 8px 14px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 2px dashed rgba(76, 175, 80, 0.3);
  border-radius: 6px;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.go-select-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.projects-content {
  width: 100%;
  max-width: 1000px;
  padding: 0 24px;
  box-sizing: border-box;
}

.projects-grid {
  display: flex;
  width: 100%;
  min-height: 200px;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.project-card-wrapper {
  display: flex;
  width: 280px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
}

.project-card {
  display: flex;
  width: 280px;
  height: 450px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 12px;
  background: #FFF;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.15);
  border: 2px solid rgba(76, 175, 80, 0.1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(76, 175, 80, 0.25);
  border-color: rgba(76, 175, 80, 0.3);
}

.project-image-container {
  display: flex;
  width: 280px;
  height: 280px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 12px 12px 0 0;
  position: relative;
  overflow: hidden;
}

.project-image {
  flex: 1 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: relative;
}

.project-badges {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  position: absolute;
  right: 12px;
  bottom: 12px;
  flex-wrap: wrap;
}

.project-badge {
  display: flex;
  padding: 4px 10px;
  align-items: center;
  border-radius: 12px;
  color: #FFF;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 11px;
  font-style: normal;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.project-details {
  height: 170px;
  flex-shrink: 0;
  width: 100%;
  position: relative;
  padding: 20px 16px;
  box-sizing: border-box;
}

.project-title {
  color: #38383A;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 900;
  line-height: 23px;
  margin: 0 0 8px 0;
}

.project-role {
  color: #4CAF50;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  margin: 0 0 12px 0;
}

.project-description {
  color: #6F6F72;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  letter-spacing: 0.3px;
  margin: 0 0 12px 0;
  white-space: pre-line;
}

.project-duration {
  color: #ACACAE;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.3px;
  margin: 0;
}

@media (max-width: 768px) {
  .projects-content {
    padding: 0 16px;
  }
  
  .projects-grid {
    gap: 20px;
  }
  
  .project-card-wrapper {
    width: 100%;
    max-width: 300px;
  }
  
  .project-card {
    width: 100%;
    max-width: 300px;
  }
  
  .project-image-container {
    width: 100%;
  }
  
  .section-header {
    gap: 6px;
    margin: 12px 0 0 4px;
  }
  
  .section-title {
    font-size: 16px;
  }
  
  .projects-count {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .projects-content {
    padding: 0 12px;
  }
  
  .projects-grid {
    gap: 16px;
  }
  
  .project-title {
    font-size: 16px;
    line-height: 20px;
  }
  
  .project-role {
    font-size: 13px;
    line-height: 18px;
  }
  
  .project-description {
    font-size: 12px;
    line-height: 16px;
  }
  
  .project-duration {
    font-size: 11px;
    line-height: 14px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .section-title {
    font-size: 15px;
  }
  
  .projects-count {
    font-size: 13px;
  }
}
</style>
