<template>
  <section class="projects-section">
    <div class="section-border">
      <div class="section-header">
        <span class="section-title">withPR</span>
        <span class="divider">|</span>
        <span class="projects-count">총 <span class="highlight">{{ projects.length }}개 프로젝트</span></span>
      </div>
      
      <div v-if="projects.length === 0" class="empty-state">
        <p class="empty-message">등록한 프로젝트가 없습니다.</p>
      </div>
      
      <div v-else class="projects-content">
        <div class="projects-grid">
          <div 
            v-for="(project, index) in projects" 
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
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// Projects data
const projects = ref([
  {
    title: '무해한 도전',
    role: 'UI/UX 디자이너',
    description: '일상에서 쉽게 제로웨이스트를 \'발견\'하고\n\'실천\'하도록 도와주고, 제로웨이스트에',
    duration: '2022.02.14 - 2022.05.22',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d0cdae957cc71d34de8f77ab256b0f73c8852b9e?width=560',
    badges: [
      { text: '최고동료', color: '#4CAF50' },
      { text: '박수 3번', color: '#388E3C' }
    ]
  },
  {
    title: 'KEEPON',
    role: 'UI/UX 디자이너',
    description: '기프티콘을 적재적소에 쓰게 도와주는 쿠\n폰 정리 서비스',
    duration: '2021.12.06 - 2022.03.13',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/6efe99920c5ccaffa73edfb850230ed31e81623a?width=560',
    badges: [
      { text: '출시', color: '#0AA592' }
    ]
  },
  {
    title: '글리터',
    role: 'UI/UX 디자이너',
    description: '타인과 글감을 공유하며 익명으로 가볍게\n글을 쓰고 나눌 수 있는 서비스',
    duration: '2021.08.02 - 2021.11.20',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/650424f37bb5f8660d402c7ae3129d748ca9c220?width=560',
    badges: [
      { text: '최고동료', color: '#4CAF50' },
      { text: '박수 3번', color: '#388E3C' }
    ]
  }
])
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
  width: 100%;
  max-width: 1000px;
  padding: 0 24px;
  justify-content: center;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  min-height: 120px;
}

.empty-message {
  color: #6F6F72;
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.2px;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
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