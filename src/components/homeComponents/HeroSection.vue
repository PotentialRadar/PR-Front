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
          <div class="partner-card" v-for="partner in partners" :key="partner.id">
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
            <div class="search-input-container">
              <input 
                type="text" 
                placeholder="어떤 기술의 IT포트폴리오를 찾으시나요?"
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

const rawPartners = [
  {
    id: 1,
    name: '강해림 파트너',
    skill: '로고',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/eeb2b355fb381af1fbaea6ee3fc632bbb247335f?width=86'
  },
  {
    id: 2,
    name: '신정훈 파트너',
    skill: '프로그램',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/521a16cae8539d9b4796dcabbca6126d82c75845?width=86'
  },
  {
    id: 3,
    name: '박지유 파트너',
    skill: '그래픽',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9d476c65fa0a254a078ac29bd846ab2f4b3f6e79?width=86'
  },
  {
    id: 4,
    name: '유영무 파트너',
    skill: '웹',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/80f2d7a3c0765e59d8a4ecd6e1bc7243ad402626?width=86'
  },
  {
    id: 5,
    name: '김지용 파트너',
    skill: '웹',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/27400fd97c40d3e42e2458d9be385ed59b31ec10?width=86'
  },
  {
    id: 6,
    name: '천동광 파트너',
    skill: '웹',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/afcfe210158f434b565b702dd6c9935c646915d9?width=86'
  },
  {
    id: 7,
    name: '이건호 파트너',
    skill: '모바일웹',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/bc3f1e03f0a18168f30c658e116a7da3f61d488e?width=86'
  },
  {
    id: 8,
    name: '정하은 파트너',
    skill: '웹',
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b83fa2b4a046a2e902eca6dff0bb895d0f02b331?width=86'
  }
]

const partners = ref([...rawPartners, ...rawPartners, ...rawPartners])

const techTags = ref(['Java', 'Python', 'React', 'Node.js', 'C++', 'PHP', 'Kotlin'])

const carouselRef = ref(null)
const isHovered = ref(false)

const baseStep = 2
let currentStep = baseStep

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

    // 💡 무한 슬라이드처럼 보이도록 절반쯤 갔을 때 리셋
    const resetThreshold = el.scrollWidth / 3  // 복제된 분량에 따라 조정
    if (el.scrollLeft >= resetThreshold) {
      el.scrollLeft = 0
    }
  }, 35)
})

function handleMouseEnter() {
  isHovered.value = true
  console.log('mouseenter: hover 시작')
}
function handleMouseLeave() {
  isHovered.value = false
  console.log('mouseleave: hover 종료')
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
