<template>
  <div class="portfolio-page">
    <div class="portfolio-container">
      <div class="portfolio-content">
        <!-- Header Section -->
        <PortfolioHeader :userId="portfolioData.userId" :isOwnProfile="portfolioData.isOwnProfile" />

        <!-- Self Introduction Section -->
        <section class="portfolio-section">
          <div class="section-border">
            <div class="section-header">
              <h5 class="section-title">자기소개</h5>
              <button class="info-button">
                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <clipPath id="clip0_156_977">
                      <rect width="15" height="15" fill="white" transform="translate(0 0.75)"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
            <div class="empty-state">
              <p class="empty-message">자기소개가 없습니다.</p>
            </div>
          </div>
        </section>

        <!-- Education Section -->
        <section class="portfolio-section">
          <div class="section-border">
            <div class="section-header">
              <h5 class="section-title">교육 이력</h5>
              <button class="info-button">
                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <clipPath id="clip0_156_977">
                      <rect width="15" height="15" fill="white" transform="translate(0 0.75)"/>
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
            
            <div v-if="educationData.length > 0" class="education-content">
              <div 
                v-for="(education, index) in educationData" 
                :key="index"
                class="education-item"
              >
                <div class="education-main">
                  <div class="education-info">
                    <h6 class="education-institution">{{ education.institution }}</h6>
                    <p class="education-program">{{ education.program }}</p>
                  </div>
                  <div class="education-period">
                    <span class="period-text">{{ formatEducationPeriod(education) }}</span>
                    <span v-if="education.isOngoing" class="ongoing-badge">진행중</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <p class="empty-message">교육 이력이 없습니다.</p>
            </div>
          </div>
        </section>

        <CareerTimeline />
        <SkillsSection />
        <ProjectsSection />
        <ReviewSection />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import PortfolioHeader from '@/components/portfolioComponents/PortfolioHeader.vue'
import CareerTimeline from '@/components/portfolioComponents/CareerTimeline.vue'
import SkillsSection from '@/components/portfolioComponents/SkillsSection.vue'
import ProjectsSection from '@/components/portfolioComponents/ProjectsSection.vue'
import ReviewSection from '@/components/portfolioComponents/ReviewSection.vue'

const route = useRoute()

const portfolioData = ref({
  userId: route.params.userId || 'jamie',
  isOwnProfile: false,
})

// 교육 이력 샘플 데이터 (실제로는 API에서 가져와야 함)
const educationDataRaw = ref([
  {
    institution: '서울대학교',
    program: '컴퓨터공학과 학사',
    startDate: '2019-03',
    endDate: '2023-02',
    isOngoing: false
  },
  {
    institution: '코드스테이츠',
    program: '프론트엔드 개발 부트캠프',
    startDate: '2023-03',
    endDate: '2023-08',
    isOngoing: false
  },
  {
    institution: '구글 클라우드',
    program: 'Google Cloud Professional 인증',
    startDate: '2024-01',
    endDate: null,
    isOngoing: true
  }
])

// 교육 이력을 최신순으로 정렬
const educationData = computed(() => {
  return [...educationDataRaw.value].sort((a, b) => {
    // 진행중인 교육이 가장 위에 오도록
    if (a.isOngoing && !b.isOngoing) return -1
    if (!a.isOngoing && b.isOngoing) return 1
    
    // 시작일 기준으로 최신순 정렬
    const aDate = new Date(a.startDate)
    const bDate = new Date(b.startDate)
    return bDate - aDate
  })
})

// 교육 기간 포맷팅 함수
const formatEducationPeriod = (education) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    return `${year}.${month}`
  }

  const startFormatted = formatDate(education.startDate)
  
  if (education.isOngoing) {
    return `${startFormatted} ~`
  }
  
  const endFormatted = formatDate(education.endDate)
  return `${startFormatted} ~ ${endFormatted}`
}
</script>

<style scoped>
.portfolio-page {
  display: flex;
  width: 100%;
  min-width: 360px;
  padding: 0 120px;
  flex-direction: column;
  align-items: flex-start;
  background: #FFF;
  min-height: 100vh;
}

.portfolio-container {
  display: flex;
  max-width: 1200px;
  width: 100%;
  min-height: 3500px;
  padding-top: 70px;
  flex-direction: column;
  align-items: flex-start;
  margin: 0 auto;
  position: relative;
}

.portfolio-content {
  display: flex;
  min-height: 2989px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background: #FFF;
  position: relative;
  gap: 26px;
}

.portfolio-section {
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
  align-items: flex-start;
  border-top: 4px solid #4CAF50;
  position: relative;
  width: 100%;
}

.section-header {
  display: flex;
  padding: 15.75px 20px 16.25px 4px;
  align-items: center;
  gap: 8px;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  flex-wrap: nowrap;
  justify-content: flex-start;
}

.section-title {
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.6px;
  margin: 0;
  color: #38383A;
  white-space: nowrap;
  flex-shrink: 0;
}

.info-button {
  display: flex;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.info-button svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  opacity: 0.6;
}

.empty-state {
  display: flex;
  padding: 20px 24px;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
  box-sizing: border-box;
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

/* 교육 이력 스타일 */
.education-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 24px;
  width: 100%;
  box-sizing: border-box;
}

.education-item {
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #E8E8E8;
  background: #FAFAFA;
  transition: all 0.3s ease;
  position: relative;
}

.education-item:hover {
  border-color: #4CAF50;
  background: #FFF;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
  transform: translateY(-2px);
}

.education-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

.education-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.education-institution {
  font-size: 16px;
  font-weight: 700;
  color: #262626;
  margin: 0;
  line-height: 1.4;
}

.education-program {
  font-size: 14px;
  font-weight: 500;
  color: #6F6F72;
  margin: 0;
  line-height: 1.5;
}

.education-period {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
}

.period-text {
  font-size: 13px;
  font-weight: 500;
  color: #808080;
  white-space: nowrap;
}

.ongoing-badge {
  display: inline-flex;
  padding: 4px 10px;
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  white-space: nowrap;
  letter-spacing: 0.2px;
}

@media (max-width: 1024px) {
  .portfolio-page {
    padding: 0 40px;
  }

  .portfolio-section {
    padding: 0 15px;
  }

  .education-content {
    padding: 15px 20px;
  }

  .education-item {
    padding: 16px;
  }

  .education-main {
    gap: 15px;
  }
}

@media (max-width: 768px) {
  .portfolio-page {
    padding: 0 20px;
  }

  .portfolio-container {
    padding-top: 30px;
  }

  .portfolio-section {
    padding: 0 10px;
  }

  .section-header {
    padding: 15.75px 15px 16.25px 4px;
    gap: 6px;
  }

  .section-title {
    font-size: 16px;
  }

  .empty-state {
    padding: 15px 20px;
  }

  .empty-message {
    font-size: 14px;
    line-height: 22px;
  }

  .education-content {
    padding: 15px 16px;
    gap: 16px;
  }

  .education-item {
    padding: 16px;
  }

  .education-main {
    flex-direction: column;
    gap: 12px;
  }

  .education-period {
    align-items: flex-start;
    flex-direction: row;
    gap: 12px;
  }

  .education-institution {
    font-size: 15px;
  }

  .education-program {
    font-size: 13px;
  }

  .period-text {
    font-size: 12px;
  }

  .ongoing-badge {
    font-size: 10px;
    padding: 3px 8px;
  }
}

@media (max-width: 480px) {
  .portfolio-page {
    padding: 0 15px;
  }

  .portfolio-section {
    padding: 0 5px;
  }

  .section-header {
    padding: 12px 10px 12px 4px;
    gap: 4px;
  }

  .section-title {
    font-size: 16px;
  }

  .empty-state {
    padding: 12px 16px;
  }

  .empty-message {
    font-size: 13px;
    line-height: 20px;
  }

  .info-button {
    padding: 2px;
  }

  .info-button svg {
    width: 12px;
    height: 12px;
  }

  .education-content {
    padding: 12px;
    gap: 12px;
  }

  .education-item {
    padding: 12px;
  }

  .education-main {
    gap: 10px;
  }

  .education-period {
    gap: 10px;
  }

  .education-institution {
    font-size: 14px;
  }

  .education-program {
    font-size: 12px;
  }

  .period-text {
    font-size: 11px;
  }

  .ongoing-badge {
    font-size: 9px;
    padding: 2px 6px;
  }
}

@media (max-width: 360px) {
  .portfolio-page {
    padding: 0 10px;
  }

  .section-header {
    padding: 10px 8px 10px 4px;
  }

  .section-title {
    font-size: 14px;
  }

  .empty-message {
    font-size: 12px;
    line-height: 18px;
  }

  .education-content {
    padding: 10px;
  }

  .education-item {
    padding: 10px;
  }

  .education-institution {
    font-size: 13px;
  }

  .education-program {
    font-size: 11px;
  }
}
</style>