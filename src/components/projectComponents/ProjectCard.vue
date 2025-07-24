<template>
  <div class="project-card">
    <div class="card-header">
      <div class="header-left">
        <div class="status-title-container">
          <div class="status-badge" v-if="project.status">
            <span>{{ project.status }}</span>
          </div>
          <div class="title-container">
            <h3 class="project-title">{{ project.title }}</h3>
          </div>
        </div>
      </div>
      <div class="header-right">
        <button class="favorite-button">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.99781 18.0011C9.71284 18.001 9.43786 17.8964 9.22486 17.7071C8.41686 16.9921 7.63794 16.3211 6.95094 15.7281C5.17182 14.2925 3.51135 12.7157 1.98585 11.013C0.751241 9.66337 0.0466618 7.91269 0.00196339 6.08408C-0.0259603 4.49739 0.539591 2.95735 1.5879 1.76596C2.09303 1.20724 2.71037 0.761493 3.39967 0.457856C4.08897 0.154219 4.8347 -0.000428548 5.5879 0.00399869C6.73022 0.000525574 7.83929 0.388872 8.72999 1.1041C9.21582 1.48816 9.64387 1.94017 10.001 2.44614C10.3582 1.94021 10.7862 1.48821 11.272 1.1041C12.1627 0.388872 13.2715 0.000525574 14.4138 0.00399869C15.167 -0.000428548 15.9128 0.154219 16.6021 0.457856C17.2914 0.761493 17.9087 1.20724 18.4138 1.76596C19.4621 2.95735 20.0279 4.49739 20 6.08408C19.9552 7.91268 19.2504 9.66332 18.0159 11.013C16.4903 12.7156 14.8298 14.2924 13.0508 15.7281C12.3618 16.3211 11.582 16.9941 10.772 17.7101C10.5581 17.8983 10.2827 18.0018 9.99781 18.0011ZM5.58497 1.18613C4.99395 1.18227 4.40877 1.30306 3.86769 1.54086C3.3266 1.77867 2.84166 2.128 2.44483 2.56601C1.59659 3.53788 1.14169 4.79146 1.16896 6.08115C1.21266 7.63454 1.82204 9.11835 2.88282 10.254C4.36667 11.9026 5.97943 13.4305 7.70582 14.8231C8.39482 15.4171 9.17798 16.0921 9.99098 16.8121C10.81 16.0911 11.5909 15.4122 12.2849 14.8192C14.0112 13.4269 15.624 11.8993 17.1079 10.2511C18.1687 9.11542 18.7783 7.63137 18.822 6.07797C18.8492 4.7883 18.3941 3.535 17.5459 2.56308C17.1491 2.12507 16.6644 1.77574 16.1233 1.53793C15.5822 1.30013 14.997 1.17909 14.406 1.18295C13.5239 1.18038 12.6676 1.4805 11.98 2.03305C11.4364 2.47369 10.9781 3.01023 10.6279 3.61606C10.5634 3.72724 10.4708 3.81957 10.3594 3.88364C10.2479 3.9477 10.1215 3.98124 9.99293 3.98105C9.86435 3.98134 9.73795 3.94771 9.62648 3.88364C9.515 3.81956 9.42238 3.72731 9.35792 3.61606C9.00769 3.01027 8.54941 2.47374 8.00587 2.03305C7.3192 1.48266 6.46499 1.18385 5.58497 1.18613Z" fill="#AAAAAA"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="description-section" v-if="project.description">
      <p class="project-description">{{ project.description }}</p>
    </div>

    <div class="category-tags-section">
      <div class="project-tags">
        <div class="self-tag" v-for="tag in project.tags" :key="tag">
          {{ tag }}
        </div>
      </div>
    </div>

    <div class="project-info">
      <div class="info-item">
        <div class="info-label">진행 기간</div>
        <div class="info-value">{{ project.duration }}</div>
      </div>
      <div class="info-divider"></div>
      <div class="info-item">
        <div class="info-label">모집 인원</div>
        <div class="info-value">{{ project.teamSize }}</div>
      </div>
      <div class="info-divider"></div>
      <div class="info-item">
        <div class="info-label">지원자</div>
        <div class="info-value">{{ project.applicants }}</div>
      </div>
      <div class="info-divider"></div>
      <div class="info-item">
        <div class="info-label">마감일정</div>
        <div class="info-value">{{ project.deadline }}</div>
      </div>
    </div>

    <div class="bottom-section">
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectCard',
  props: {
    project: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.project-card {
  display: flex;
  padding: 26px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ECECEC;
  background: #FFF;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.10);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.status-title-container {
  display: flex;
  height: 32px;
  align-items: center;
  flex: 1;
}

.status-badge {
  display: flex;
  padding: 8px 10px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 100px;
  background: #D6F6FD;
  margin-right: 10px;
}

.status-badge span {
  color: #262626;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
}

.title-container {
  display: flex;
  height: 28px;
  padding: 0 5px;
  flex-direction: column;
  align-items: flex-start;
}

.project-title {
  margin: 0;
  color: #000;
  font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 22px;
  font-weight: 400;
  line-height: 28px;
}

.header-right {
  display: flex;
  align-items: center;
  padding-left: 10px;
}

.favorite-button {
  display: flex;
  padding-bottom: 2px;
  flex-direction: column;
  align-items: flex-start;
  background: none;
  border: none;
  cursor: pointer;
}

.description-section {
  display: flex;
  height: 32px;
  padding: 5px;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 10px;
}

.project-description {
  margin: 0;
  width: 384px;
  height: 27px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #000;
  font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 28px;
}

.category-tags-section {
  display: flex;
  padding-bottom: 15px;
  align-items: center;
  align-content: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 5px;
}

.category {
  display: flex;
  padding-right: 5px;
  flex-direction: column;
  align-items: flex-start;
}

.category span {
  color: #FF7D12;
  font-size: 17px;
  font-weight: 400;
  line-height: 17px;
}

.project-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
}

.self-tag {
  display: flex;
  height: 30px;
  padding: 6px 12px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 15px;
  border: 1px solid #E5E5E5;
  font-size: 13px;
}


.project-info {
  display: flex;
  padding: 16px 0;
  align-items: center;
  width: 100%;
  border-radius: 3px;
  background: #F7F7F8;
  margin-bottom: 22px;
}

.info-item {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  gap: 8px;
}

.info-label {
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 15px;
}

.info-value {
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 15px;
}

.info-divider {
  width: 1px;
  height: 100%;
  background: #262626;
  margin: 0 1px;
}

.bottom-section {
  display: flex;
  align-items: center;
  width: 100%;
}

.description-panel {
  display: flex;
  height: 100px;
  padding-right: 20px;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.description-text {
  display: flex;
  padding: 9.5px 15px 0 15px;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100px;
  border-right: 1px solid #E8E8E8;
  background: #FFF;
  color: #262626;
  font-size: 16px;
  font-weight: 400;
  line-height: 28px;
  white-space: pre-line;
  overflow: hidden;
}

.company-info {
  width: 230px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 19px;
}

.company-details {
  display: flex;
  align-items: center;
  width: 100%;
}

.avatar-container {
  width: 52px;
  height: 40px;
  padding-right: 12px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.company-avatar {
  width: 40px;
  height: 40px;
  border-radius: 100px;
  border: 1px solid #E8E8E8;
}

.company-text {
  display: flex;
  height: 41px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.company-header {
  display: flex;
  height: 16px;
  padding-bottom: 1px;
  align-items: center;
  gap: 9.41px;
  width: 100%;
}

.company-name {
  color: #262626;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
}

.location-divider {
  display: flex;
  padding: 1.5px 0 1.5px 8px;
  align-items: flex-start;
  border-left: 1px solid #AAA;
}

.company-location {
  color: #AAA;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
  padding-left: 8px;
}

.verification-info {
  display: flex;
  align-items: center;
  width: 100%;
}

.phone-icon {
  display: flex;
  width: 15px;
  height: 12px;
  padding-right: 3px;
  flex-direction: column;
  align-items: flex-start;
}

.verification-text {
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 15px;
}

.company-description {
  width: 242px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #AAA;
  font-size: 16px;
  font-weight: 400;
  line-height: 16px;
}
</style>
