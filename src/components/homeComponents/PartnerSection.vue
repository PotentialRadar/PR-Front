<template>
  <section class="partner-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">개발/디자인 전문가</h2>
        <router-link to="/portfolios" class="more-link">
          <span>더보기</span>
          <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.01" d="M19 0.189941H0V19.1899H19V0.189941Z" fill="white"/>
            <path d="M10 6.18799L14 10.188L10 14.188" stroke="#262626" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 10.168H5" stroke="#262626" stroke-linecap="round"/>
          </svg>
        </router-link>
      </div>
      
      <div class="partners-grid">
        <div class="partner-card" v-for="partner in partners" :key="partner.id" @click="goToPortfolio(partner.id)">
          <div class="partner-content">
            <div class="card-background">
              <div class="partner-tags">
                <span class="tag" :class="getTagClass(partner.category)">{{ partner.category }}</span>
              </div>
              <div class="partner-info">
                <div class="partner-name">{{ partner.name }}</div>
                <div class="partner-type">{{ partner.jobTitle }}</div>
              </div>
              <div class="partner-description">{{ partner.introduction }}</div>
              <div class="partner-skills">{{ partner.skills.join(', ') }}</div>
              <div class="partner-stats">
                <div class="rating-container">
                  <div class="stars">
                    <img src="https://api.builder.io/api/v1/image/assets/TEMP/29ec28f3b700830abd094f2da20a6835e51fae09?width=192" alt="별점" class="star-rating" />
                  </div>
                  <span class="rating">{{ partner.rating }}</span>
                </div>
                <div class="contracts">프로젝트 : {{ partner.projects }}건</div>
              </div>
            </div>
            <div class="partner-avatar">
              <img :src="partner.avatar" :alt="partner.name" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const partners = ref([
  {
    id: 1,
    name: '김프론트',
    jobTitle: 'Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    category: 'Frontend',
    introduction: '사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
    rating: '4.8',
    projects: '12'
  },
  {
    id: 2,
    name: '박디자이너',
    jobTitle: 'UI/UX Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    category: 'Design',
    introduction: '사용자 중심의 디자인 사고를 바탕으로 직관적인 인터페이스를 만듭니다.',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
    rating: '4.9',
    projects: '18'
  },
  {
    id: 3,
    name: '이백엔드',
    jobTitle: 'Backend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    category: 'Backend',
    introduction: '안정적이고 확장 가능한 서버 아키텍처 구축을 전문으로 합니다.',
    skills: ['Node.js', 'Python', 'Docker', 'AWS', 'PostgreSQL'],
    rating: '4.7',
    projects: '15'
  }
])

const getTagClass = (category) => {
  return {
    'tag-frontend': category === 'Frontend',
    'tag-design': category === 'Design',
    'tag-backend': category === 'Backend',
    'tag-mobile': category === 'Mobile',
    'tag-ai': category === 'AI/ML',
    'tag-devops': category === 'DevOps'
  }
}

const goToPortfolio = (partnerId) => {
  router.push(`/portfolio/${partnerId}`)
}
</script>

<style scoped>
.partner-section {
  display: flex;
  height: auto;
  padding: 50px 0 120px;
  justify-content: center;
  align-items: flex-start;
  align-self: stretch;
  background: #F9F9F9;
}

.container {
  display: flex;
  width: 1320px;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  align-self: stretch;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
}

.section-title {
  color: #262626;
  font-size: 24px;
  font-weight: 400;
  line-height: 45px;
  margin: 0;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 27px;
}

.partners-grid {
  display: flex;
  padding-right: 0.02px;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  gap: 20px;
}

.partner-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.partner-card:hover {
  transform: translateY(-2px);
}

.partner-content {
  display: flex;
  width: 422px;
  padding-top: 40px;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
}

.card-background {
  height: 242.5px;
  align-self: stretch;
  border-radius: 10px;
  background: #FFF;
  position: relative;
  padding: 25px;
  padding-right: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease;
  overflow: hidden;
}

.partner-card:hover .card-background {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.partner-tags {
  display: flex;
  width: 372px;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 5px;
  margin-bottom: 24px;
}

.tag {
  display: flex;
  height: 28px;
  padding: 0 10px;
  flex-direction: column;
  align-items: center;
  border-radius: 100px;
  color: #262626;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 29px;
}

.tag-frontend {
  background: #E3F2FD;
  color: #1565C0;
}

.tag-design {
  background: #F3E5F5;
  color: #7B1FA2;
}

.tag-backend {
  background: #E8F5E8;
  color: #2E7D32;
}

.tag-mobile {
  background: #FFF3E0;
  color: #EF6C00;
}

.tag-ai {
  background: #FCE4EC;
  color: #C2185B;
}

.tag-devops {
  background: #F1F8E9;
  color: #558B2F;
}

.partner-info {
  display: flex;
  width: 372px;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.partner-name {
  color: #262626;
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
}

.partner-type {
  color: #AAA;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
}

.partner-description {
  width: 100%;
  max-width: 320px;
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 22px;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  word-wrap: break-word;
}

.partner-skills {
  width: 100%;
  max-width: 320px;
  color: #AAA;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  margin-bottom: 25px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  word-wrap: break-word;
}

.partner-stats {
  display: flex;
  width: 372px;
  justify-content: space-between;
  align-items: center;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.star-rating {
  width: 96px;
  height: 15px;
}

.rating {
  color: #262626;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
}

.contracts {
  color: #262626;
  font-size: 13px;
  font-weight: 400;
  line-height: 22.5px;
}

.partner-avatar {
  display: flex;
  width: 80px;
  height: 80px;
  padding: 1px;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 20px;
  top: 8px;
  border-radius: 100px;
  border: 1px solid #E8E8E8;
}

.partner-avatar img {
  height: 78px;
  width: 78px;
  flex: 1 0 0;
  border-radius: 100px;
}
</style>