<template>
  <section class="stats-section">
    <div class="container">
      
      <div class="stats-card portfolio-card">
        <div class="card-content">
          <div class="card-header">
            <div class="indicator-bar portfolio-indicator"></div>
            <h2 class="card-title">포트폴리오 수</h2>
          </div>
          <div class="card-stats">
            <div class="main-number portfolio-number">{{ portfolioCount.toLocaleString() }}</div>
            <div class="unit">건</div>
          </div>
          <div class="card-description">
            <span class="highlight">실제 프로젝트에 참여한 결과물</span> 위주로 구성되어 있습니다.
          </div>
          <div class="card-action">
            <router-link to="/portfolios" class="action-button">
              <span>포트폴리오 보러가기</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.01" d="M19.3604 0.689941H0.360352V19.6899H19.3604V0.689941Z" fill="white"/>
                <path d="M10.3604 6.68799L14.3604 10.688L10.3604 14.688" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.3604 10.668H5.36035" stroke="#4CAF50" stroke-linecap="round"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="stats-card project-card">
        <div class="card-content">
          <div class="card-header">
            <div class="indicator-bar project-indicator"></div>
            <h2 class="card-title">진행중 프로젝트 수</h2>
          </div>
          <div class="card-stats">
            <div class="main-number project-number">{{ projectCount.toLocaleString() }}</div>
            <div class="unit">건</div>
          </div>
          <div class="card-description">
            현재 <span class="highlight">프리모아를 통해 진행중인</span>
            기획, 디자인, 개발을 포함한 IT 프로젝트입니다.
          </div>
          <div class="card-action">
            <router-link to="/projects" class="action-button">
              <span>프로젝트 보러가기</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path opacity="0.01" d="M19.3604 0.689941H0.360352V19.6899H19.3604V0.689941Z" fill="white"/>
                <path d="M10.3604 6.68799L14.3604 10.688L10.3604 14.688" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14.3604 10.668H5.36035" stroke="#4CAF50" stroke-linecap="round"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const portfolioCount = ref(0)
const projectCount = ref(0)

onMounted(() => {
  // [API 연동] 백엔드에서 포트폴리오 및 프로젝트 수를 불러와서 countUp에 전달
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('portfolio-number') && portfolioCount.value === 0) {
          countUp(portfolioCount, 89297) // → 여기에 API에서 받은 숫자 사용
        }
        if (entry.target.classList.contains('project-number') && projectCount.value === 0) {
          countUp(projectCount, 110)     // → 여기에 API에서 받은 숫자 사용
        }
      }
    })
  }, { threshold: 0.5 })

  document.querySelectorAll('.main-number').forEach(el => observer.observe(el))
})

function countUp(refVar, target) {
  let current = 0
  const step = Math.ceil(target / 40)
  const interval = setInterval(() => {
    current += step
    if (current >= target) {
      refVar.value = target
      clearInterval(interval)
    } else {
      refVar.value = current
    }
  }, 20)
}
</script>

<style scoped>
.stats-section {
  display: flex;
  width: 1320px;
  height: 462px;
  padding-top: 90px;
  justify-content: center;
  align-items: flex-start;
  background: #FFF;
  margin: 0 auto;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
}

.stats-card {
  display: flex;
  height: 372px;
  padding: 30px 40px;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  border-radius: 10px;
  position: relative;
}

.portfolio-card {
  width: 649px;
  background-color: #E0F3E8;
}

.project-card {
  width: 649px;
  background-color: #F0FAF5;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
}

.indicator-bar {
  width: 16px;
  height: 3px;
}

.portfolio-indicator {
  background: #4CAF50;
}

.project-indicator {
  background: #81C784;
}

.card-title {
  align-self: stretch;
  color: #262626;
  font-size: 17px;
  font-weight: 600;
  line-height: 31.5px;
  margin: 0;
}

.card-stats {
  display: flex;
  align-items: flex-end;
  align-self: stretch;
  gap: 5px;
}

.main-number {
  color: #262626;
  font-size: 41px;
  font-weight: 700;
  line-height: 69px;
}

.project-card .main-number {
  font-size: 46px;
}

.unit {
  color: #262626;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  padding: 0 0 15px 5px;
}

.card-description {
  align-self: stretch;
  color: #262626;
  font-size: 16px;
  font-weight: 400;
  line-height: 28.5px;
  padding-top: 15px;
}

.highlight {
  font-weight: 700;
}

.card-action {
  display: flex;
  margin-top: auto;
  padding-top: 15px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

.action-button {
  display: flex;
  width: 180px;
  height: 46px;
  padding: 1px 16px 1px 21px;
  justify-content: space-between;
  align-items: center;
  border-radius: 100px;
  border: 1px solid #4CAF50;
  text-decoration: none;
  color: #4CAF50;
  font-size: 15px;
  font-weight: 400;
  line-height: 27px;
}

.action-button:hover {
  background: #4CAF50;
  color: #fff;
}
</style>
