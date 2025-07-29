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
        <button class="favorite-button" @click="toggleFavorite" :class="{ 'favorited': isFavorited }">
          <i class="bi bi-heart-fill" v-if="isFavorited"></i>
          <i class="bi bi-heart" v-else></i>
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
        <div class="info-icon">
          <i class="bi bi-clock"></i>
        </div>
        <div class="info-content">
          <div class="info-label">진행 기간</div>
          <div class="info-value">{{ project.duration }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-people"></i>
        </div>
        <div class="info-content">
          <div class="info-label">모집 인원</div>
          <div class="info-value">{{ project.teamSize }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-person-plus"></i>
        </div>
        <div class="info-content">
          <div class="info-label">지원자</div>
          <div class="info-value">{{ project.applicants }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-calendar-event"></i>
        </div>
        <div class="info-content">
          <div class="info-label">마감일정</div>
          <div class="info-value" :class="{ 'urgent': isUrgent(project.deadline) }">{{ project.deadline }}</div>
        </div>
      </div>
    </div>

    <div class="bottom-section">
      <button class="apply-button">
        <i class="bi bi-send"></i>
        지원하기
      </button>
      <button class="detail-button" @click="goToDetail">
        상세보기
      </button>
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
  },
  data() {
    return {
      isFavorited: false
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorited = !this.isFavorited
    },
    isUrgent(deadline) {
      if (deadline && deadline.includes('D-')) {
        const days = parseInt(deadline.replace('D-', ''))
        return days <= 7
      }
      return false
    },
    goToDetail() {
      // 실제로 id or projectId로 맞춰서 써야 함!
      this.$router.push({
        name: 'ProjectDetail',
        params: { id: this.project.projectId || this.project.id }
      })
    }
  }
}
</script>

<style scoped>
.project-card {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  border-radius: 12px;
  border: 2px solid rgba(245, 179, 135, 0.1);
  background: #FFF;
  box-shadow: 0 4px 12px rgba(245, 179, 135, 0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.project-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: #f8c08b;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(243, 152, 33, 0.3);
  box-shadow: 0 8px 25px rgba(243, 156, 33, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.status-title-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.status-badge {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 20px;
  background: #E8F5E8;
  border: 1px solid #4CAF50;
}

.status-badge span {
  color: #2E7D32;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.title-container {
  display: flex;
  align-items: center;
  width: 100%;
}

.project-title {
  margin: 0;
  color: #262626;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.header-right {
  display: flex;
  align-items: center;
  padding-left: 16px;
  flex-shrink: 0;
}

.favorite-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #FFF;
  border: 2px solid #E0E0E0;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #757575;
  font-size: 16px;
}

.favorite-button:hover {
  background: #F5F5F5;
  border-color: #BDBDBD;
  color: #424242;
  transform: scale(1.1);
}

.favorite-button.favorited {
  background: #FF5722;
  border-color: #FF5722;
  color: #FFF;
}

.favorite-button.favorited:hover {
  background: #E64A19;
}

.description-section {
  width: 100%;
  margin-bottom: 16px;
}

.project-description {
  margin: 0;
  color: #424242;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.category-tags-section {
  display: flex;
  width: 100%;
  margin-bottom: 20px;
}

.project-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.self-tag {
  display: inline-flex;
  padding: 6px 12px;
  align-items: center;
  border-radius: 16px;
  background: #F3F4F6;
  border: 1px solid #D1D5DB;
  color: #374151;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.self-tag:hover {
  background: #E5E7EB;
  border-color: #9CA3AF;
  color: #1F2937;
}

.project-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: #FAFAFA;
  border: 1px solid #E5E5E5;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #E3F2FD;
  color: #1976D2;
  font-size: 14px;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  color: #6F6F72;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.info-value {
  color: #262626;
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
}

.info-value.urgent {
  color: #dc3545;
  font-weight: 700;
}

.bottom-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 12px;
}

.apply-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex: 1;
  padding: 12px 20px;
  background: #ed9d3a;
  color: #FFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.apply-button:hover {
  background: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.detail-button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 12px 20px;
  background: #FFF;
  color: #424242;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.detail-button:hover {
  background: #F5F5F5;
  border-color: #BDBDBD;
  color: #212121;
  transform: translateY(-2px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .project-card {
    padding: 20px;
  }

  .project-title {
    font-size: 18px;
  }

  .project-info {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .bottom-section {
    flex-direction: column;
    gap: 10px;
  }

  .apply-button,
  .detail-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .project-card {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-right {
    padding-left: 0;
    align-self: flex-end;
  }

  .project-title {
    font-size: 16px;
  }

  .project-tags {
    gap: 6px;
  }

  .self-tag {
    font-size: 11px;
    padding: 4px 8px;
  }

  .favorite-button {
    width: 36px;
    height: 36px;
    font-size: 14px;
  }
}
</style>