<template>
  <section class="freelancer-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">프리랜서</h2>
        <a href="#" class="more-link">
          <span>더보기</span>
          <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.01" d="M19 0.689941H0V19.6899H19V0.689941Z" fill="white" />
            <path d="M10 6.68799L14 10.688L10 14.688" stroke="#262626" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M14 10.668H5" stroke="#262626" stroke-linecap="round" />
          </svg>
        </a>
      </div>

      <div class="freelancers-grid">
        <div class="freelancer-card" v-for="freelancer in freelancers" :key="freelancer.id">
          <div class="card-background">
            <div class="freelancer-avatar">
              <img :src="freelancer.image" :alt="freelancer.name" />
              <div class="play-button">
                <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 25.1899C19.4036 25.1899 25 19.5935 25 12.6899C25 5.78638 19.4036 0.189941 12.5 0.189941C5.59644 0.189941 0 5.78638 0 12.6899C0 19.5935 5.59644 25.1899 12.5 25.1899Z" fill="#4CAF50" />
                  <path d="M17.3639 12.3627C17.5101 12.452 17.631 12.5774 17.7149 12.7269C17.7987 12.8763 17.8428 13.0448 17.8428 13.2162C17.8428 13.3876 17.7987 13.5561 17.7149 13.7055C17.631 13.855 17.5101 13.9804 17.3639 14.0697L11.7809 17.4837C11.6294 17.5752 11.4564 17.6248 11.2794 17.6276C11.1025 17.6304 10.928 17.5861 10.7737 17.4994C10.6195 17.4126 10.491 17.2865 10.4014 17.1339C10.3119 16.9813 10.2644 16.8077 10.2639 16.6307V9.8017C10.2644 9.62475 10.3119 9.4511 10.4014 9.29849C10.491 9.14588 10.6195 9.01977 10.7737 8.93304C10.928 8.8463 11.1025 8.80206 11.2794 8.80481C11.4564 8.80756 11.6294 8.85722 11.7809 8.9487L17.3639 12.3627Z" fill="white" />
                </svg>
              </div>
            </div>
            <div class="freelancer-info">
              <div class="freelancer-name">{{ freelancer.name }}</div>
              <div class="freelancer-type">{{ freelancer.type }}</div>
            </div>
            <div class="freelancer-tags">
              <span class="tag" v-for="tag in freelancer.tags" :key="tag" :class="getTagClass(tag)">{{ tag }}</span>
            </div>
            <div class="freelancer-skills">{{ freelancer.skills }}</div>
            <div class="freelancer-stats">
              <div class="rating-container">
                <div class="stars">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/29ec28f3b700830abd094f2da20a6835e51fae09?width=192"
                    alt="별점" class="star-rating" />
                </div>
                <span class="rating">{{ freelancer.rating }}</span>
              </div>
              <div class="contracts">계약 : {{ freelancer.contracts }}건</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const freelancers = ref([
  {
    id: 1,
    name: 's*****0',
    type: '개인프리랜서',
    skills: 'JavaScript,CSS,JAVA,HTML…',
    rating: '4.6',
    contracts: '22',
    tags: ['개발'],
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/c582bb66630c07045b7e1750f713fe782af3aa2e?width=156'
  },
  {
    id: 2,
    name: 's****c',
    type: '개인프리랜서',
    skills: 'JSP,JavaScript,Node.js,MyS…',
    rating: '4.6',
    contracts: '11',
    tags: ['개발'],
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/91ab4e3d22ea92daab8e4beab03568383046ad7b?width=156'
  },
  {
    id: 3,
    name: 'y*****g',
    type: '개인프리랜서',
    skills: 'JavaScript,CSS,Node.js,jQu…',
    rating: '5',
    contracts: '15',
    tags: ['개발', '디자인'],
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d6f2a7700301be1fbf5f80b8f3accec3cd9d6176?width=156'
  },
  {
    id: 4,
    name: 'x*****g',
    type: '개인프리랜서',
    skills: 'Swift,PHP,JSP,ASP.NET',
    rating: '5',
    contracts: '15',
    tags: ['개발'],
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/3b3dd706db410a68c6f6e4067f1b091bf7300fff?width=156'
  }
])

const getTagClass = (tag) => {
  return {
    'tag-dev': tag === '개발',
    'tag-design': tag === '디자인'
  }
}
</script>

<style scoped>
.freelancer-section {
  display: flex;
  height: 556px;
  padding: 90px 0;
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

.freelancers-grid {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  gap: 20px;
}

.freelancer-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1 0 0;
  align-self: stretch;
}

.card-background {
  width: 258px;
  height: 301px;
  border-radius: 10px;
  background: #FFF;
  position: relative;
  padding: 25px;
}

.freelancer-avatar {
  display: flex;
  width: 80px;
  height: 80px;
  padding: 1px;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  border: 1px solid #E8E8E8;
  position: absolute;
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
}

.freelancer-avatar img {
  height: 78px;
  flex: 1 0 0;
  border-radius: 100px;
}

.play-button {
  position: absolute;
  bottom: -5px;
  right: -5px;
}

.freelancer-info {
  display: flex;
  width: 208px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  position: absolute;
  top: 125px;
  left: 25px;
}

.freelancer-name {
  color: #262626;
  font-size: 15px;
  font-weight: 600;
  line-height: 24px;
}

.freelancer-type {
  color: #AAA;
  font-size: 13px;
  font-weight: 400;
  line-height: 24px;
}

.freelancer-tags {
  display: flex;
  width: 208px;
  justify-content: center;
  align-items: flex-start;
  gap: 5px;
  position: absolute;
  top: 159px;
  left: 25px;
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

.freelancer-skills {
  display: flex;
  width: 208px;
  flex-direction: column;
  align-items: center;
  color: #AAA;
  text-align: center;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  position: absolute;
  top: 202px;
  left: 25px;
}

.freelancer-stats {
  display: flex;
  width: 208px;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 252px;
  left: 25px;
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
</style>
