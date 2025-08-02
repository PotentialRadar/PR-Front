<template>
  <div class="portfolio-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>포트폴리오를 불러오는 중...</p>
    </div>

    <div v-else-if="portfolioNotFound" class="not-found-state">
      <div class="not-found-icon">
        <i class="bi bi-person-x"></i>
      </div>
      <h3>포트폴리오를 찾을 수 없습니다</h3>
      <p>존재하지 않는 사용자이거나 포트폴리오가 비공개 상태입니다.</p>
      <button @click="goBack" class="back-button">
        <i class="bi bi-arrow-left"></i>
        목록으로 돌아가기
      </button>
    </div>

    <div v-else class="portfolio-container">
      <div class="portfolio-content">
        <!-- Header Section -->
        <PortfolioHeader 
          :userId="portfolioData.userId" 
          :isOwnProfile="portfolioData.isOwnProfile"
          :userInfo="portfolioData.userInfo"
        />

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
            
            <div v-if="portfolioData.introduction" class="introduction-content">
              <p class="introduction-text">{{ portfolioData.introduction }}</p>
            </div>
            
            <div v-else class="empty-state">
              <p class="empty-message">자기소개가 없습니다.</p>
            </div>
          </div>
        </section>

        <!-- Contact Information Section -->
        <section class="portfolio-section" v-if="portfolioData.contactInfo && portfolioData.contactInfo.showContact">
          <div class="section-border">
            <div class="section-header">
              <h5 class="section-title">연락처 정보</h5>
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
            
            <div v-if="hasContactInfo" class="contact-content">
              <div class="contact-grid">
                <!-- 이메일 -->
                <div v-if="portfolioData.contactInfo.email" class="contact-item">
                  <div class="contact-icon">
                    <i class="bi bi-envelope-fill"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">이메일</span>
                    <a :href="`mailto:${portfolioData.contactInfo.email}`" class="contact-value">
                      {{ portfolioData.contactInfo.email }}
                    </a>
                  </div>
                </div>

                <!-- 전화번호 -->
                <div v-if="portfolioData.contactInfo.phone" class="contact-item">
                  <div class="contact-icon">
                    <i class="bi bi-telephone-fill"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">전화번호</span>
                    <a :href="`tel:${portfolioData.contactInfo.phone}`" class="contact-value">
                      {{ portfolioData.contactInfo.phone }}
                    </a>
                  </div>
                </div>

                <!-- GitHub -->
                <div v-if="portfolioData.contactInfo.github" class="contact-item">
                  <div class="contact-icon">
                    <i class="bi bi-github"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">GitHub</span>
                    <a :href="portfolioData.contactInfo.github" target="_blank" class="contact-value">
                      {{ getDisplayUrl(portfolioData.contactInfo.github) }}
                    </a>
                  </div>
                </div>

                <!-- LinkedIn -->
                <div v-if="portfolioData.contactInfo.linkedin" class="contact-item">
                  <div class="contact-icon">
                    <i class="bi bi-linkedin"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">LinkedIn</span>
                    <a :href="portfolioData.contactInfo.linkedin" target="_blank" class="contact-value">
                      {{ getDisplayUrl(portfolioData.contactInfo.linkedin) }}
                    </a>
                  </div>
                </div>

                <!-- 개인 웹사이트 -->
                <div v-if="portfolioData.contactInfo.website" class="contact-item">
                  <div class="contact-icon">
                    <i class="bi bi-globe"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">웹사이트</span>
                    <a :href="portfolioData.contactInfo.website" target="_blank" class="contact-value">
                      {{ getDisplayUrl(portfolioData.contactInfo.website) }}
                    </a>
                  </div>
                </div>

                <!-- 지역 -->
                <div v-if="portfolioData.contactInfo.location" class="contact-item">
                  <div class="contact-icon">
                    <i class="bi bi-geo-alt-fill"></i>
                  </div>
                  <div class="contact-details">
                    <span class="contact-label">지역</span>
                    <span class="contact-value">
                      {{ portfolioData.contactInfo.location }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <p class="empty-message">연락처 정보가 없습니다.</p>
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

        <CareerTimeline :careers="portfolioData.careers" />
        <SkillsSection :skills="portfolioData.skills" />
        <ProjectsSection :projects="portfolioData.projects" />
        <ReviewSection :reviews="portfolioData.reviews" />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPortfolioById } from '@/components/data/portfolioData.js'
import PortfolioHeader from '@/components/portfolioComponents/PortfolioHeader.vue'
import CareerTimeline from '@/components/portfolioComponents/CareerTimeline.vue'
import SkillsSection from '@/components/portfolioComponents/SkillsSection.vue'
import ProjectsSection from '@/components/portfolioComponents/ProjectsSection.vue'
import ReviewSection from '@/components/portfolioComponents/ReviewSection.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const portfolioNotFound = ref(false)

const portfolioData = ref({
  userId: null,
  isOwnProfile: false,
  userInfo: null,
  introduction: '',
  contactInfo: null,
  skills: [],
  educations: [],
  careers: [],
  projects: [],
  reviews: []
})

// 교육 이력을 최신순으로 정렬
const educationData = computed(() => {
  if (!portfolioData.value.educations) return []
  
  return [...portfolioData.value.educations].sort((a, b) => {
    if (a.isOngoing && !b.isOngoing) return -1
    if (!a.isOngoing && b.isOngoing) return 1
    
    const aDate = new Date(a.startDate)
    const bDate = new Date(b.startDate)
    return bDate - aDate
  })
})

// 연락처 정보가 있는지 확인
const hasContactInfo = computed(() => {
  const contact = portfolioData.value.contactInfo
  if (!contact) return false
  
  return !!(contact.email || contact.phone || contact.github || 
           contact.linkedin || contact.website || contact.location)
})

// 포트폴리오 데이터 로드 함수
const loadPortfolioData = async (userId) => {
  loading.value = true
  portfolioNotFound.value = false

  try {
    // await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = getPortfolioById(parseInt(userId))
    
    if (!userData) {
      portfolioNotFound.value = true
      return
    }

    const currentUserId = 1
    
    portfolioData.value = {
      ...userData,
      isOwnProfile: parseInt(userId) === currentUserId
    }

  } catch (error) {
    console.error('포트폴리오 데이터 로드 실패:', error)
    portfolioNotFound.value = true
  } finally {
    loading.value = false
  }
}

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

// URL 표시용 포맷팅 (도메인만 표시)
const getDisplayUrl = (url) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}

const goBack = () => {
  router.go(-1)
}

// 컴포넌트 마운트 시 데이터 로드
onMounted(() => {
  const userId = route.params.userId
  if (userId) {
    loadPortfolioData(userId)
  } else {
    portfolioNotFound.value = true
    loading.value = false
  }
})
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

/* 로딩 상태 */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  width: 100%;
  text-align: center;
  gap: 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 404 상태 */
.not-found-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  width: 100%;
  text-align: center;
  gap: 20px;
  color: #666;
}

.not-found-icon {
  width: 80px;
  height: 80px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  color: #4CAF50;
  margin-bottom: 20px;
}

.not-found-state h3 {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin: 0;
}

.not-found-state p {
  font-size: 16px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #66BB6A;
  transform: translateY(-2px);
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

/* 자기소개 스타일 */
.introduction-content {
  display: flex;
  padding: 20px 24px;
  width: 100%;
  box-sizing: border-box;
}

.introduction-text {
  font-size: 15px;
  color: #262626;
  line-height: 1.6;
  margin: 0;
}

/* 연락처 정보 스타일 */
.contact-content {
  display: flex;
  padding: 20px 24px;
  width: 100%;
  box-sizing: border-box;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid #E8E8E8;
  background: #FAFAFA;
  transition: all 0.3s ease;
  position: relative;
}

.contact-item:hover {
  border-color: #4CAF50;
  background: #FFF;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.1);
  transform: translateY(-2px);
}

.contact-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  color: #4CAF50;
  font-size: 18px;
  flex-shrink: 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.contact-label {
  font-size: 12px;
  font-weight: 600;
  color: #808080;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.contact-value {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  text-decoration: none;
  transition: color 0.2s ease;
  word-break: break-all;
}

.contact-value:hover {
  color: #4CAF50;
}

a.contact-value {
  cursor: pointer;
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

  .contact-content, .education-content, .introduction-content {
    padding: 15px 20px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .contact-item {
    padding: 14px 16px;
  }

  .contact-icon {
    width: 36px;
    height: 36px;
    font-size: 16px;
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

  .empty-state, .introduction-content, .contact-content {
    padding: 15px 20px;
  }

  .empty-message {
    font-size: 14px;
    line-height: 22px;
  }

  .contact-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .contact-item {
    padding: 12px 16px;
    gap: 12px;
  }

  .contact-icon {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .contact-label {
    font-size: 11px;
  }

  .contact-value {
    font-size: 13px;
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

  .not-found-state h3 {
    font-size: 20px;
  }

  .not-found-state p {
    font-size: 14px;
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

  .empty-state, .introduction-content, .contact-content {
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

  .contact-grid {
    gap: 10px;
  }

  .contact-item {
    padding: 10px 12px;
    gap: 10px;
  }

  .contact-icon {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .contact-label {
    font-size: 10px;
  }

  .contact-value {
    font-size: 12px;
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

  .contact-content, .education-content, .introduction-content {
    padding: 10px;
  }

  .contact-item {
    padding: 8px 10px;
    gap: 8px;
  }

  .contact-icon {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }

  .contact-label {
    font-size: 9px;
  }

  .contact-value {
    font-size: 11px;
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