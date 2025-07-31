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
import PortfolioHeader from '@/components/portfolioComponents/PortfolioHeader.vue'
import CareerTimeline from '@/components/portfolioComponents/CareerTimeline.vue'
import SkillsSection from '@/components/portfolioComponents/SkillsSection.vue'
import ProjectsSection from '@/components/portfolioComponents/ProjectsSection.vue'
import ReviewSection from '@/components/portfolioComponents/ReviewSection.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const portfolioNotFound = ref(false)

// 샘플 포트폴리오 데이터베이스 (실제로는 API에서 가져와야 함)
const portfolioDatabase = {
  1: {
    userId: 1,
    userInfo: {
      name: '김프론트',
      jobTitle: 'Frontend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      category: 'Frontend'
    },
    introduction: '안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자 김프론트입니다. React와 TypeScript를 주력으로 사용하며, 깔끔하고 직관적인 UI/UX 구현에 열정을 가지고 있습니다.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    educations: [
      {
        institution: '서울대학교',
        program: '컴퓨터공학과 학사',
        startDate: '2019-03',
        endDate: '2023-02',
        isOngoing: false
      },
      {
        institution: '패스트캠퍼스',
        program: 'React 심화 과정',
        startDate: '2023-06',
        endDate: '2023-08',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Tech Startup A',
        position: 'Frontend Developer',
        startDate: '2023-09',
        endDate: null,
        isCurrent: true
      }
    ],
    projects: [],
    reviews: []
  },
  2: {
    userId: 2,
    userInfo: {
      name: '박디자이너',
      jobTitle: 'UI/UX Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
      category: 'Design'
    },
    introduction: 'UI/UX 디자이너 박디자이너입니다. 사용자 중심의 디자인 사고를 바탕으로 직관적이고 아름다운 인터페이스를 만들어갑니다. 데이터 기반의 디자인 결정을 중요하게 생각합니다.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'User Research'],
    educations: [
      {
        institution: '홍익대학교',
        program: '시각디자인학과 학사',
        startDate: '2018-03',
        endDate: '2022-02',
        isOngoing: false
      },
      {
        institution: 'Google UX Design',
        program: 'UX Design Professional Certificate',
        startDate: '2022-03',
        endDate: '2022-08',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Design Agency B',
        position: 'Senior UI/UX Designer',
        startDate: '2022-09',
        endDate: null,
        isCurrent: true
      }
    ],
    projects: [],
    reviews: []
  },
  3: {
    userId: 3,
    userInfo: {
      name: '이백엔드',
      jobTitle: 'Backend Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      category: 'Backend'
    },
    introduction: '안정적이고 확장 가능한 서버 아키텍처 구축을 전문으로 하는 백엔드 개발자입니다. 클라우드 환경과 마이크로서비스 아키텍처에 관심이 많습니다.',
    skills: ['Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL'],
    educations: [
      {
        institution: 'KAIST',
        program: '전산학부 학사',
        startDate: '2017-03',
        endDate: '2021-02',
        isOngoing: false
      },
      {
        institution: 'AWS',
        program: 'Solutions Architect Associate',
        startDate: '2021-06',
        endDate: '2021-08',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Enterprise Corp C',
        position: 'Backend Developer',
        startDate: '2021-03',
        endDate: null,
        isCurrent: true
      }
    ],
    projects: [],
    reviews: []
  },
  4: {
    userId: 4,
    userInfo: {
      name: '정모바일',
      jobTitle: 'Mobile Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      category: 'Mobile'
    },
    introduction: '크로스 플랫폼 모바일 앱 개발을 전문으로 하는 개발자입니다. Flutter와 React Native를 활용하여 효율적인 앱 개발을 추구합니다.',
    skills: ['Flutter', 'React Native', 'iOS', 'Android', 'Firebase'],
    educations: [
      {
        institution: '연세대학교',
        program: '컴퓨터과학과 학사',
        startDate: '2018-03',
        endDate: '2022-02',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Mobile Startup D',
        position: 'Mobile App Developer',
        startDate: '2022-03',
        endDate: null,
        isCurrent: true
      }
    ],
    projects: [],
    reviews: []
  },
  5: {
    userId: 5,
    userInfo: {
      name: '최AI',
      jobTitle: 'AI/ML Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
      category: 'AI/ML'
    },
    introduction: '머신러닝과 딥러닝을 활용한 지능형 시스템 개발을 전문으로 합니다. 컴퓨터 비전과 자연어 처리 분야에서 다양한 프로젝트 경험을 보유하고 있습니다.',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'OpenCV', 'NLP'],
    educations: [
      {
        institution: '서울대학교',
        program: '전기정보공학부 석사',
        startDate: '2020-03',
        endDate: '2022-02',
        isOngoing: false
      },
      {
        institution: 'Coursera',
        program: 'Deep Learning Specialization',
        startDate: '2022-03',
        endDate: '2022-06',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'AI Research Lab E',
        position: 'ML Engineer',
        startDate: '2022-07',
        endDate: null,
        isCurrent: true
      }
    ],
    projects: [],
    reviews: []
  },
  6: {
    userId: 6,
    userInfo: {
      name: '강데브옵스',
      jobTitle: 'DevOps Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
      category: 'DevOps'
    },
    introduction: 'CI/CD 파이프라인 구축과 인프라 자동화를 통해 개발팀의 생산성 향상에 기여하는 데브옵스 엔지니어입니다. 클라우드 네이티브 기술에 특화되어 있습니다.',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    educations: [
      {
        institution: '부산대학교',
        program: '정보컴퓨터공학부 학사',
        startDate: '2016-03',
        endDate: '2020-02',
        isOngoing: false
      },
      {
        institution: 'Linux Foundation',
        program: 'Kubernetes Administrator (CKA)',
        startDate: '2020-09',
        endDate: '2020-11',
        isOngoing: false
      }
    ],
    careers: [
      {
        company: 'Cloud Solutions F',
        position: 'Senior DevOps Engineer',
        startDate: '2020-03',
        endDate: null,
        isCurrent: true
      }
    ],
    projects: [],
    reviews: []
  }
}

const portfolioData = ref({
  userId: null,
  isOwnProfile: false,
  userInfo: null,
  introduction: '',
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
    // 진행중인 교육이 가장 위에 오도록
    if (a.isOngoing && !b.isOngoing) return -1
    if (!a.isOngoing && b.isOngoing) return 1
    
    // 시작일 기준으로 최신순 정렬
    const aDate = new Date(a.startDate)
    const bDate = new Date(b.startDate)
    return bDate - aDate
  })
})

// 포트폴리오 데이터 로드 함수
const loadPortfolioData = async (userId) => {
  loading.value = true
  portfolioNotFound.value = false

  try {
    // 실제로는 여기서 API 호출
    // const response = await fetch(`/api/portfolio/${userId}`)
    // const data = await response.json()
    
    // 시뮬레이션을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const userData = portfolioDatabase[userId]
    
    if (!userData) {
      portfolioNotFound.value = true
      return
    }

    // 현재 사용자인지 확인 (실제로는 인증 시스템에서 확인)
    const currentUserId = 1 // 임시로 현재 사용자 ID를 1로 설정
    
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

const goBack = () => {
  router.go(-1) // 이전 페이지로 돌아가기
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

  .education-content, .introduction-content {
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

  .empty-state, .introduction-content {
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

  .empty-state, .introduction-content {
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

  .education-content, .introduction-content {
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