<template>
  <section class="hero-section">
    <div class="background">
      <div class="container">
        <div class="hero-heading">
          <div class="heading-center">
            <div class="heading-line">
              <span class="text-gray">같이 할 팀원이</span>
            </div>
            <div class="heading-line">
              <span class="text-gray">필요한 당신을 위해</span>
            </div>
            <div class="heading-line">
              <span class="text-highlight">RADAR</span>
              <span class="text-gray">가 찾아드립니다</span>
            </div>
          </div>
        </div>
        
        <div
          class="partners-carousel"
          ref="carouselRef"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        >
          <div class="partner-card" v-for="partner in partners" :key="partner.id" @click="goToPortfolio(partner.id)">
            <div class="partner-link">
              <div class="partner-avatar">
                <img :src="partner.image" :alt="partner.name" />
              </div>
              <div class="partner-info">
                <div class="partner-name">{{ partner.name }}</div>
                <div class="partner-skill">{{ partner.skill }}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="search-container">
          <div class="search-form">
            <!-- 필터 탭 추가 -->
            <div class="filter-tabs">
              <div 
                class="filter-tab" 
                :class="{ active: activeFilter === 'portfolio' }"
                @click="activeFilter = 'portfolio'"
              >
                포트폴리오
              </div>
              <div 
                class="filter-tab" 
                :class="{ active: activeFilter === 'project' }"
                @click="activeFilter = 'project'"
              >
                프로젝트
              </div>
            </div>

            <div class="search-input-container">
              <input 
                type="text" 
                :placeholder="activeFilter === 'portfolio' ? '어떤 기술의 IT포트폴리오를 찾으시나요?' : '어떤 프로젝트를 찾으시나요?'"
                class="search-input"
              />
              <div class="search-icon">
                <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 31.1899C24.6274 31.1899 30 25.8174 30 19.1899C30 12.5625 24.6274 7.18994 18 7.18994C11.3726 7.18994 6 12.5625 6 19.1899C6 25.8174 11.3726 31.1899 18 31.1899Z" fill="white"/>
                  <path d="M18 30.1899C24.0751 30.1899 29 25.2651 29 19.1899C29 13.1148 24.0751 8.18994 18 8.18994C11.9249 8.18994 7 13.1148 7 19.1899C7 25.2651 11.9249 30.1899 18 30.1899Z" stroke="#81C784" stroke-width="2"/>
                  <path d="M25.7061 27.4448L34.7081 36.4468" stroke="#81C784" stroke-width="2"/>
                </svg>
              </div>
            </div>
            <div class="tech-tags">
              <div class="tech-tag" v-for="tech in techTags" :key="tech">{{ tech }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const rawPartners = [
  {
    id: 1,
    name: '김프론트',
    skill: 'Frontend',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
  },
  {
    id: 2,
    name: '박디자이너',
    skill: 'Design',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
  },
  {
    id: 3,
    name: '이백엔드',
    skill: 'Backend',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
  },
  {
    id: 4,
    name: '정모바일',
    skill: 'Mobile',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
  },
  {
    id: 5,
    name: '최AI',
    skill: 'AI/ML',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
  },
  {
    id: 6,
    name: '강데브옵스',
    skill: 'DevOps',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6'
  }
]

const partners = ref([...rawPartners, ...rawPartners, ...rawPartners])
const activeFilter = ref('portfolio') // 기본값은 포트폴리오

// 실제 검색량 기반 기술스택 순서 API 연결 필요
// 연결 후 onMounted에서 API 호출하여 techTags.value 업데이트
const techTags = ref(['JavaScript', 'React', 'Python', 'Java', 'TypeScript', 'Node.js', 'AWS', 'Docker']) // 임시 하드코딩

const carouselRef = ref(null)
const isHovered = ref(false)

const baseStep = 2
let currentStep = baseStep

// 포트폴리오 페이지로 이동하는 함수
const goToPortfolio = (partnerId) => {
  // 복제된 데이터로 인해 실제 ID로 변환 (1-6 범위로 제한)
  const actualId = ((partnerId - 1) % 6) + 1
  router.push(`/portfolio/${actualId}`)
}

onMounted(() => {
  
  setInterval(() => {
    const el = carouselRef.value
    if (!el) return

    // 슬로우 다운
    if (isHovered.value && currentStep > 0) {
      currentStep = Math.max(0, currentStep - 0.05)
    }
    if (!isHovered.value && currentStep < baseStep) {
      currentStep = Math.min(baseStep, currentStep + 0.05)
    }

    el.scrollLeft += currentStep

    // 무한 슬라이드처럼 보이도록 절반쯤 갔을 때 리셋
    const resetThreshold = el.scrollWidth / 3  // 복제된 분량에 따라 조정
    if (el.scrollLeft >= resetThreshold) {
      el.scrollLeft = 0
    }
  }, 35)
})

function handleMouseEnter() {
  isHovered.value = true
}
function handleMouseLeave() {
  isHovered.value = false
}
</script>

<style scoped>
.hero-section {
  width: 100%;
  height: 921px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.background {
  display: flex;
  height: 921px;
  padding: 70px 0 50px 0;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.00) 85%, #FFF 100%),
              linear-gradient(90deg, #F1FBF3 0%, #F1FBF3 33%, #F1FBF3 100%);
  position: relative;
}

.container {
  display: flex;
  padding-top: 115px;
  flex-direction: column;
  align-items: center;
  gap: 130px;
  flex: 1 0 0;
  align-self: stretch;
  position: relative;
}

.hero-heading {
  height: 160px;
  align-self: stretch;
  position: relative;
}

.heading-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.heading-line {
  display: flex;
  justify-content: center;
  align-items: center;
}

.text-gray {
  color: #262626;
  text-align: center;
  font-size: 47px;
  font-weight: 300;
  line-height: 60px;
  margin-right: 20px;
}

.project-container {
  display: inline-flex;
  padding: 0 276px 1px 0;
  align-items: center;
  position: relative;
}

.project-text {
  color: #262626;
  font-size: 47px;
  font-weight: 400;
  line-height: 57px;
  border-bottom: 2px solid #000;
  padding-bottom: 2px;
}

.text-highlight {
  color: #81C784;
  font-size: 47px;
  font-weight: 400;
  line-height: 60px;
}

.partners-carousel {
  display: flex;
  align-items: center;
  position: relative;
  overflow-x: auto;
  scroll-behavior: auto;
  gap: 20px;
  scrollbar-width: none; /* Firefox */
  
  width: 100vw;           /* 💡 화면 전체 너비 */
  max-width: none;        /* 💡 최대 너비 제한 제거 */
  min-height: 80px;       /* 최소 높이 추가 */
  padding: 20px 0;        /* 상하 패딩 추가 */
  background: none; /* 디버깅용 배경색 */
}

.partners-carousel::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.partner-card {
  display: flex;
  flex: 0 0 auto;
  width: 180px;
  justify-content: center;
  align-items: flex-start;
  border-radius: 47px;
  background: #FFF;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.partner-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.partner-link {
  display: flex;
  padding: 6px 10px;
  align-items: center;
  flex: 1 0 0;
}

.partner-avatar {
  display: flex;
  width: 53px;
  height: 43px;
  padding-right: 10px;
  flex-direction: column;
  align-items: flex-start;
}

.partner-avatar img {
  width: 43px;
  height: 43px;
  border-radius: 21.5px;
}

.partner-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.partner-name {
  color: #262626;
  font-size: 13px;
  font-weight: 700;
  line-height: 24px;
}

.partner-skill {
  color: #262626;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
}

.search-container {
  display: flex;
  width: 1120px;
  padding: 29px 40px 30px 40px;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}

.search-form {
  display: flex;
  width: 740px;
  flex-direction: column;
  align-items: flex-start;
  gap: 25px;
  flex-shrink: 0;
  align-self: stretch;
}

/* 필터 탭 스타일 */
.filter-tabs {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: 0;
  border-radius: 100px;
  border: 1px solid #E3E3E3;
  background: #FFF;
  overflow: hidden;
}

.filter-tab {
  display: flex;
  padding: 12px 30px;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 48px;
  background: #FFF;
  color: #555;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  box-sizing: border-box;
}

.filter-tab:first-child {
  border-right: 1px solid #E3E3E3;
}

.filter-tab.active {
  background: #81C784;
  color: #FFF;
  font-weight: 500;
}

.filter-tab:hover:not(.active) {
  background: #F8F8F8;
  color: #81C784;
}

.search-input-container {
  display: flex;
  height: 82px;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  position: relative;
}

.search-input {
  display: flex;
  padding: 28.5px 71px 22.5px 35px;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 5px;
  border: 1px solid #81C784;
  background: #FFF;
  color: #AAA;
  font-size: 22px;
  font-weight: 400;
  outline: none;
}

.search-input::placeholder {
  color: #AAA;
}

.search-icon {
  position: absolute;
  right: 20px;
  top: 19px;
}

.tech-tags {
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  gap: 10px;
  flex-wrap: wrap;
}

.tech-tag {
  display: flex;
  padding: 0 17px;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 100px;
  border: 1px solid #E3E3E3;
  background: #FFF;
  color: #555;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 41px;
  cursor: pointer;
}

.tech-tag:hover {
  border-color: #81C784;
  color: #81C784;
}
</style>