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
        <div class="view-count-display">
          👀 {{ project.viewCount }}
        </div>
        <button class="favorite-button" @click="toggleFavorite" :class="{ 'favorited': isFavorited }">
          <span v-if="isFavorited">❤️</span>
          <span v-else>🤍</span>
        </button>
      </div>
    </div>

    <div class="description-section" v-if="project.description">
      <p class="project-description">
        {{ project.description }}
      </p>
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
          <div class="info-value">{{ displayDuration  }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-people"></i>
        </div>
        <div class="info-content">
          <div class="info-label">모집 인원</div>
          <div class="info-value">{{ project.recruitCount ?? 0 }}</div>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">
          <i class="bi bi-person-plus"></i>
        </div>
        <div class="info-content">
          <div class="info-label">지원자</div>
          <div class="info-value">{{ project.appliedCount ?? 0  }}</div>
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
      <button class="apply-button" @click="onApplyClick">
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
  mounted() {
    console.log('project props in card:', this.project)
  },
  methods: {
    toggleFavorite() {
      this.isFavorited = !this.isFavorited
    },
    isUrgent(deadline) {
      if (!deadline) return false
      const today = new Date();
      const end = new Date(deadline);
      const diff = (end - today) / (1000 * 60 * 60 * 24);
      return diff <= 7 && diff >= 0;
    },
    formatDeadline(deadline) {
      if (!deadline) return '-';
      const today = new Date();
      const dday = Math.ceil((new Date(deadline) - today) / (1000 * 60 * 60 * 24));
      if (dday >= 0) return `D-${dday}`;
      return '마감';
    },
    goToDetail() {
      console.log('상세보기 클릭됨! project:', this.project)
      if (typeof this.project.viewCount === 'number') {
        this.project.viewCount += 1
      } else {
        this.project.viewCount = 1
      }
      this.$router.push({
        name: 'ProjectDetail',
        params: { id: this.project.projectId || this.project.id }
      })
    },
    onApplyClick() {
      // 부모에게 프로젝트 정보 emit!
      this.$emit('apply', this.project)
    }
  },
  data() {
    return {
      isFavorited: false
    }
  },
  computed: {
    displayDuration() {
      if (!this.project.startDate || !this.project.endDate) return '-';
      const start = new Date(this.project.startDate);
      const end = new Date(this.project.endDate);
      if (isNaN(start) || isNaN(end)) return '-';
      const diff = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (diff < 7) return `${diff}일`;
      if (diff < 30) return `${Math.round(diff / 7)}주`;
      return `${Math.round(diff / 30)}개월`;
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
  border: 2px solid rgba(76, 175, 80, 0.1);
  background: #FFF;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.08);
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
  background: linear-gradient(90deg, #4CAF50 0%, #2E7D32 100%);
  border-radius: 12px 12px 0 0;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(76, 175, 80, 0.3);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
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

.view-count-display {
  font-size: 14px;
  color: #666;
  margin-right: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.favorite-button:hover {
  background: rgba(76, 175, 80, 0.1);
  border-color: #4CAF50;
  color: #4CAF50;
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
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  color: #2E7D32;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.self-tag:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
  color: #1B5E20;
}

.project-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  padding: 20px;
  border-radius: 8px;
  background: rgba(76, 175, 80, 0.05);
  border: 1px solid rgba(76, 175, 80, 0.1);
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
  background: #4CAF50;
  color: #FFF;
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
  justify-content: center;
  width: 100%;
  margin-top: 8px;
}

.detail-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
  color: #FFF;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
  position: relative;
  overflow: hidden;
}

.detail-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.detail-button:hover::before {
  left: 100%;
}

.detail-button:hover {
  background: linear-gradient(135deg, #388E3C 0%, #1B5E20 100%);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
}

.detail-button:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);
}

.detail-button i {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.detail-button:hover i {
  transform: scale(1.1);
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
    margin-top: 10px;
  }

  .detail-button {
    max-width: none;
    padding: 11px 18px;
    font-size: 13px;
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