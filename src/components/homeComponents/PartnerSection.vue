0<template>
  <section class="partner-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">개발/디자인 업체</h2>
        <a href="#" class="more-link">
          <span>더보기</span>
          <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.01" d="M19 0.189941H0V19.1899H19V0.189941Z" fill="white"/>
            <path d="M10 6.18799L14 10.188L10 14.188" stroke="#262626" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 10.168H5" stroke="#262626" stroke-linecap="round"/>
          </svg>
        </a>
      </div>
      
      <div class="partners-grid">
        <div class="partner-card" v-for="partner in partners" :key="partner.id">
          <div class="partner-content">
            <div class="card-background">
              <div class="partner-tags">
                <span class="tag" v-for="tag in partner.tags" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
              </div>
              <div class="partner-info">
                <div class="partner-name">{{ partner.name }}</div>
                <div class="partner-type">{{ partner.type }}</div>
              </div>
              <div class="partner-description">{{ partner.description }}</div>
              <div class="partner-skills">{{ partner.skills }}</div>
              <div class="partner-stats">
                <div class="rating-container">
                  <div class="stars">
                    <img src="https://api.builder.io/api/v1/image/assets/TEMP/29ec28f3b700830abd094f2da20a6835e51fae09?width=192" alt="별점" class="star-rating" />
                  </div>
                  <span class="rating">{{ partner.rating }}</span>
                </div>
                <div class="contracts">계약 : {{ partner.contracts }}건</div>
              </div>
            </div>
            <div class="partner-avatar">
              <img :src="partner.image" :alt="partner.name" />
              <div class="play-button">
                <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 25.1899C19.4036 25.1899 25 19.5935 25 12.6899C25 5.78638 19.4036 0.189941 12.5 0.189941C5.59644 0.189941 0 5.78638 0 12.6899C0 19.5935 5.59644 25.1899 12.5 25.1899Z" fill="#4CAF50"/>
                  <path d="M17.3639 11.8627C17.5101 11.952 17.631 12.0774 17.7149 12.2269C17.7987 12.3763 17.8428 12.5448 17.8428 12.7162C17.8428 12.8876 17.7987 13.0561 17.7149 13.2055C17.631 13.355 17.5101 13.4804 17.3639 13.5697L11.7809 16.9837C11.6294 17.0752 11.4564 17.1248 11.2794 17.1276C11.1025 17.1304 10.928 17.0861 10.7737 16.9994C10.6195 16.9126 10.491 16.7865 10.4014 16.6339C10.3119 16.4813 10.2644 16.3077 10.2639 16.1307V9.3017C10.2644 9.12475 10.3119 8.9511 10.4014 8.79849C10.491 8.64588 10.6195 8.51977 10.7737 8.43304C10.928 8.3463 11.1025 8.30206 11.2794 8.30481C11.4564 8.30756 11.6294 8.35722 11.7809 8.4487L17.3639 11.8627Z" fill="white"/>
                </svg>
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

const partners = ref([
  {
    id: 1,
    name: 'w****o',
    type: '개인사업자',
    description: '하나를 만들더라도 제대로 만들어보자',
    skills: 'PHP,ASP,JSP,ASP.NET,JavaScript,CSS,C',
    rating: '4.5',
    contracts: '29',
    tags: ['개발', '디자인', '기획'],
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/1edef3d6cf54b5c3de17a58af494d4781cea2ca3?width=156'
  },
  {
    id: 2,
    name: 'z*****7',
    type: '개인사업자',
    description: '안녕하세요 저는 판교에 위치한 웹디자인 스튜디오',
    skills: 'PHP,워드프레스,illustrator,photoshop,Flash,premiere',
    rating: '4.9',
    contracts: '26',
    tags: ['디자인'],
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/54015dbf7d272d77fea8c6d1c8fffaca42719ee7?width=156'
  },
  {
    id: 3,
    name: 'o****0',
    type: '법인사업자',
    description: 'IT 소프트웨어 기획/설계/개발/유지보수/공급 전문 법인',
    skills: 'PHP,ASP,JSP,ASP.NET,JavaScript,CSS,C++',
    rating: '4.6',
    contracts: '21',
    tags: ['개발'],
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/0a993909c6251e35456664fab88217edab66ba53?width=156'
  }
])

const getTagClass = (tag) => {
  return {
    'tag-dev': tag === '개발',
    'tag-design': tag === '디자인',
    'tag-planning': tag === '기획'
  }
}
</script>

<style scoped>
.partner-section {
  display: flex;
  height: 447.5px;
  padding-top: 90px;
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

.tag-dev {
  background: #EDFAFD;
}

.tag-design {
  background: #F2F2F2;
}

.tag-planning {
  background: #EDFAFD;
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
  display: flex;
  width: 372px;
  flex-direction: column;
  align-items: flex-start;
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 28.5px;
  margin-bottom: 12px;
}

.partner-skills {
  display: flex;
  width: 372px;
  flex-direction: column;
  align-items: flex-start;
  color: #AAA;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 25px;
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
  flex: 1 0 0;
  border-radius: 100px;
}

.play-button {
  position: absolute;
  bottom: -5px;
  right: -5px;
}
</style>
