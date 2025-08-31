<template>
  <div class="project-recommendation-tab">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>AI가 당신에게 맞는 프로젝트를 분석하고 있습니다...</p>
    </div>

    <!-- 추천 결과 없음 -->
    <div v-else-if="!isLoading && recommendations.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3>추천 가능한 프로젝트가 없습니다</h3>
      <p>다른 기술스택이나 경험 수준으로 다시 시도해보세요.</p>
      <button @click="$emit('reload')" class="primary-button">
        다시 검색
      </button>
    </div>

    <!-- 프로젝트 추천 리스트 -->
    <div v-else class="projects-grid">
      <ProjectCard
        v-for="project in recommendations" 
        :key="project.projectId"
        :project="transformProjectForCard(project)"
        @apply="$emit('apply', $event)"
        @click="$emit('project-click', project)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProjectCard from '@/components/projectComponents/ProjectCard.vue'

const props = defineProps({
  recommendations: {
    type: Array,
    default: () => []
  },
  isLoading: {
    type: Boolean,
    default: false
  },
  userTechStacks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['reload', 'apply', 'project-click'])

// 계산된 속성
const userTechNames = computed(() => 
  props.userTechStacks.map(tech => tech.name?.toLowerCase()).filter(Boolean)
)

const isUserTech = (techName) => {
  return techName && userTechNames.value.includes(techName.toLowerCase())
}

// AI 추천 프로젝트를 ProjectCard 컴포넌트용으로 변환
const transformProjectForCard = (aiProject) => {
  return {
    id: aiProject.projectId,
    title: aiProject.title,
    description: aiProject.description,
    status: aiProject.status || 'RECRUITING',
    startDate: aiProject.startDate,
    endDate: aiProject.endDate,
    recruitCount: aiProject.recruitCount,
    appliedCount: aiProject.appliedCount,
    recruitDeadline: aiProject.recruitDeadline,
    viewCount: aiProject.viewCount || 0,
    likeCount: aiProject.likeCount || 0,
    techStacks: aiProject.projectTechStacks?.map(tech => ({
      techStackName: tech,
      isMatched: isUserTech(tech)
    })) || [],
    // AI 추천 정보 추가
    matchScore: aiProject.matchScore,
    isAIRecommendation: true,
    aiExplanation: aiProject.explanation?.simple_explanation || aiProject.explanation?.main_reason
  }
}
</script>

<style scoped>
.project-recommendation-tab {
  width: 100%;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #28a745;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 24px;
  opacity: 0.6;
}

.empty-state h3 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0 0 32px 0;
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
}

.primary-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  color: white;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>