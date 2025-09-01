<template>
  <div class="my-portfolio-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>포트폴리오를 불러오는 중...</p>
    </div>

    <div v-else class="portfolio-container">
      <div class="portfolio-header">
        <div class="header-content">
          <div class="profile-section">
            <div class="profile-image">
              <img 
                :src="portfolioData.userInfo.avatar" 
                :alt="portfolioData.userInfo.name" 
                @error="handleImageError"
                :onerror="`this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolioData.userInfo.userId || 'default'}'`"
              />
            </div>
            
            <div class="profile-info">
              <h1 class="profile-name">
                {{ portfolioData.userInfo.name }}
              </h1>

              <p class="profile-job">
                {{ portfolioData.userInfo.jobTitle }}
              </p>

              <div class="profile-category">
                <span class="category-badge">{{ portfolioData.userInfo.category }}</span>
              </div>
            </div>
          </div>
          
          <div class="header-actions">
            <button @click="viewPublicPortfolio" class="view-button">
              <i class="bi bi-eye"></i>
              공개 페이지 보기
            </button>
          </div>
        </div>
      </div>

      <div class="portfolio-content">
        <section class="portfolio-section">
          <div class="section-header">
            <h5 class="section-title">자기소개</h5>
            <button 
              v-if="editMode !== 'introduction'" 
              @click="startEdit('introduction')" 
              class="section-edit-btn"
            >
              <i class="bi bi-pencil"></i>
            </button>
          </div>
          
          <div v-if="editMode === 'introduction'" class="edit-field full-width">
            <textarea
              ref="introductionInput"
              v-model="editData.introduction"
              class="edit-textarea"
              rows="4"
              @keyup.escape="cancelEdit"
            ></textarea>
            <div class="edit-actions">
              <button @click="saveEdit('introduction')" class="save-btn" :disabled="saveLoading">
                <i class="bi bi-check" v-if="!saveLoading"></i>
                <div class="loading-spinner-small" v-if="saveLoading"></div>
                {{ saveLoading ? '저장 중...' : '저장' }}
              </button>
              <button @click="cancelEdit" class="cancel-btn">
                <i class="bi bi-x"></i>
                취소
              </button>
            </div>
          </div>
          
          <div v-else-if="portfolioData.introduction" class="section-content" @click="startEdit('introduction')">
            <p class="introduction-text">{{ portfolioData.introduction }}</p>
            <div class="edit-hint">클릭하여 편집</div>
          </div>
          
          <div v-else class="empty-section" @click="startEdit('introduction')">
            <p class="empty-message">자기소개를 작성해보세요.</p>
            <button class="add-content-btn">
              <i class="bi bi-plus"></i>
              자기소개 추가
            </button>
          </div>
        </section>

        <section class="portfolio-section">
          <div class="section-header">
            <h5 class="section-title">교육 이력</h5>
            <div class="section-actions">
              <button @click="addEducation" class="add-btn">
                <i class="bi bi-plus"></i>
              </button>
              <button 
                v-if="editMode !== 'education'"
                @click="startEdit('education')" 
                class="section-edit-btn"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </div>
          </div>
          
          <div v-if="editMode === 'education'" class="edit-mode">
            <div class="education-edit-list">
              <div 
                v-for="(education, index) in editData.educations" 
                :key="`edit-education-${index}`"
                class="education-edit-item"
              >
                <div class="edit-item-header">
                  <span class="item-number">{{ index + 1 }}</span>
                  <button @click="removeEducation(index)" class="remove-btn">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                
                <div class="edit-form-grid">
                  <div class="input-group">
                    <input 
                      v-model="education.institution" 
                      placeholder="기관명"
                      class="edit-input"
                    />
                  </div>
                  
                  <div class="input-group">
                    <input 
                      v-model="education.program" 
                      placeholder="전공/과정"
                      class="edit-input"
                    />
                  </div>
                  
                  <div class="input-group">
                    <input 
                      v-model="education.startDate" 
                      placeholder="시작일 (예: 202403, 2024.03, 2024년 3월)"
                      class="edit-input"
                      :class="{ 'error': educationErrors[index]?.startDate }"
                      @blur="validateEducationDate(index, 'startDate')"
                      @input="handleDateInput($event, index, 'startDate', 'education'); clearEducationError(index, 'startDate')"
                    />
                    <div v-if="educationErrors[index]?.startDate" class="error-message">
                      {{ educationErrors[index].startDate }}
                    </div>
                  </div>
                  
                  <div class="input-group">
                    <input 
                      v-model="education.endDate" 
                      placeholder="종료일 (예: 202412, 2024.12, 2024년 12월)"
                      class="edit-input"
                      :class="{ 'error': educationErrors[index]?.endDate || educationErrors[index]?.dateOrder }"
                      :disabled="education.isOngoing"
                      @blur="validateEducationDate(index, 'endDate')"
                      @input="handleDateInput($event, index, 'endDate', 'education'); clearEducationError(index, 'endDate')"
                    />
                    <div v-if="educationErrors[index]?.endDate" class="error-message">
                      {{ educationErrors[index].endDate }}
                    </div>
                    <div v-if="educationErrors[index]?.dateOrder" class="error-message">
                      {{ educationErrors[index].dateOrder }}
                    </div>
                  </div>
                </div>
                
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="education.isOngoing"
                    @change="handleOngoingToggle(index, 'education')"
                  />
                  진행중
                </label>
              </div>
            </div>
            
            <div class="edit-actions">
              <button @click="addEducation" class="add-item-btn">
                <i class="bi bi-plus"></i>
                교육 이력 추가
              </button>
              <div class="action-buttons">
                <button @click="saveEdit('education')" class="save-btn">
                  <i class="bi bi-check"></i>
                  저장
                </button>
                <button @click="cancelEdit" class="cancel-btn">
                  <i class="bi bi-x"></i>
                  취소
                </button>
              </div>
            </div>
          </div>
          
          <div v-else-if="educationData.length > 0" class="section-content">
            <div class="education-list">
              <div 
                v-for="(education, index) in educationData" 
                :key="index"
                class="education-item"
              >
                <div class="education-info">
                  <h6 class="education-institution">{{ education.institution }}</h6>
                  <p class="education-program">{{ education.program }}</p>
                </div>
                <div class="education-period">
                  <span class="period-text">{{ formatEducationPeriod(education) }}</span>
                  <span v-if="education.isOngoing" class="ongoing-badge">진행중</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-section">
            <p class="empty-message">교육 이력이 없습니다.</p>
            <button @click="addEducation" class="add-content-btn">
              <i class="bi bi-plus"></i>
              교육 이력 추가
            </button>
          </div>
        </section>

        <section class="portfolio-section">
          <div class="section-header">
            <h5 class="section-title">경력</h5>
            <div class="section-actions">
              <button @click="addCareer" class="add-btn">
                <i class="bi bi-plus"></i>
              </button>
              <button 
                v-if="editMode !== 'career'"
                @click="startEdit('career')" 
                class="section-edit-btn"
              >
                <i class="bi bi-pencil"></i>
              </button>
            </div>
          </div>
          
          <div v-if="editMode === 'career'" class="edit-mode">
            <div class="career-edit-list">
              <div 
                v-for="(career, index) in editData.careers" 
                :key="`edit-career-${index}`"
                class="career-edit-item"
              >
                <div class="edit-item-header">
                  <span class="item-number">{{ index + 1 }}</span>
                  <button @click="removeCareer(index)" class="remove-btn">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                
                <div class="edit-form-grid">
                  <div class="input-group">
                    <input 
                      v-model="career.company" 
                      placeholder="회사명"
                      class="edit-input"
                    />
                  </div>
                  
                  <div class="input-group">
                    <input 
                      v-model="career.position" 
                      placeholder="직책/부서"
                      class="edit-input"
                    />
                  </div>
                  
                  <div class="input-group">
                    <input 
                      v-model="career.startDate" 
                      placeholder="시작일 (예: 202201, 2022.01, 2022년 1월)"
                      class="edit-input"
                      :class="{ 'error': careerErrors[index]?.startDate }"
                      @blur="validateCareerDate(index, 'startDate')"
                      @input="handleDateInput($event, index, 'startDate', 'career'); clearCareerError(index, 'startDate')"
                    />
                    <div v-if="careerErrors[index]?.startDate" class="error-message">
                      {{ careerErrors[index].startDate }}
                    </div>
                  </div>
                  
                  <div class="input-group">
                    <input 
                      v-model="career.endDate" 
                      placeholder="종료일 (예: 202412, 2024.12, 2024년 12월)"
                      class="edit-input"
                      :class="{ 'error': careerErrors[index]?.endDate || careerErrors[index]?.dateOrder }"
                      :disabled="career.isCurrent"
                      @blur="validateCareerDate(index, 'endDate')"
                      @input="handleDateInput($event, index, 'endDate', 'career'); clearCareerError(index, 'endDate')"
                    />
                    <div v-if="careerErrors[index]?.endDate" class="error-message">
                      {{ careerErrors[index].endDate }}
                    </div>
                    <div v-if="careerErrors[index]?.dateOrder" class="error-message">
                      {{ careerErrors[index].dateOrder }}
                    </div>
                  </div>
                </div>
                
                <label class="checkbox-label">
                  <input 
                    type="checkbox" 
                    v-model="career.isCurrent"
                    @change="handleCurrentToggle(index)"
                  />
                  현재 재직중
                </label>
                
                <div class="description-section">
                  <label class="description-label">업무 설명</label>
                  <textarea
                    v-model="career.description"
                    placeholder="담당 업무나 성과를 간략히 설명해주세요"
                    class="edit-textarea career-description"
                    rows="3"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div class="edit-actions">
              <button @click="addCareer" class="add-item-btn">
                <i class="bi bi-plus"></i>
                경력 추가
              </button>
              <div class="action-buttons">
                <button @click="saveEdit('career')" class="save-btn">
                  <i class="bi bi-check"></i>
                  저장
                </button>
                <button @click="cancelEdit" class="cancel-btn">
                  <i class="bi bi-x"></i>
                  취소
                </button>
              </div>
            </div>
          </div>
          
          <div v-else-if="careerData.length > 0" class="section-content">
            <div class="career-list">
              <div 
                v-for="(career, index) in careerData" 
                :key="index"
                class="career-item"
              >
                <div class="career-info">
                  <h6 class="career-company">{{ career.company }}</h6>
                  <p class="career-position">{{ career.position }}</p>
                  <p v-if="career.description" class="career-description-text">{{ career.description }}</p>
                </div>
                <div class="career-period">
                  <span class="period-text">{{ formatCareerPeriod(career) }}</span>
                  <span v-if="career.isCurrent" class="ongoing-badge">재직중</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-section">
            <p class="empty-message">경력이 없습니다.</p>
            <button @click="addCareer" class="add-content-btn">
              <i class="bi bi-plus"></i>
              경력 추가
            </button>
          </div>
        </section>

        <section class="portfolio-section">
          <div class="section-header">
            <h5 class="section-title">기술 스택</h5>
            <button 
              v-if="editMode !== 'skills'"
              @click="startEdit('skills')" 
              class="section-edit-btn"
            >
              <i class="bi bi-pencil"></i>
            </button>
          </div>
          
          <div v-if="editMode === 'skills'" class="edit-mode">
            <div class="skills-edit">
              <div class="skill-input-group">
                <div class="skill-search-container">
                  <input
                    v-model="newSkill"
                    @input="searchSkills"
                    @keyup.enter="addSkill"
                    @focus="showSuggestions = true"
                    @blur="hideSuggestions"
                    class="edit-input"
                    placeholder="기술 스택을 검색하거나 입력하세요"
                    autocomplete="off"
                  />
                  <div v-if="showSuggestions && skillSuggestions.length > 0" class="suggestions-dropdown">
                    <div 
                      v-for="suggestion in skillSuggestions" 
                      :key="suggestion.name"
                      @mousedown="selectSkill(suggestion)"
                      class="suggestion-item"
                    >
                      <span class="suggestion-name">{{ suggestion.name }}</span>
                    </div>
                  </div>
                </div>
                <div class="proficiency-input">
                  <label class="proficiency-label">숙련도:</label>
                  <div class="star-rating">
                    <button 
                      v-for="star in 5" 
                      :key="star"
                      @click="newSkillProficiency = star"
                      class="star-btn"
                      :class="{ active: star <= newSkillProficiency }"
                    >
                      ★
                    </button>
                  </div>
                  <span class="rating-text">{{ newSkillProficiency }}점</span>
                </div>
                <button @click="addSkill" class="add-skill-btn">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              
              <div class="skills-edit-list">
                <div 
                  v-for="(skill, index) in editData.skills" 
                  :key="`skill-${index}`"
                  class="skill-edit-item"
                >
                  <div class="skill-edit-content">
                    <input 
                      v-model="skill.name" 
                      class="skill-name-input"
                      placeholder="기술명"
                    />
                    <div class="skill-proficiency-edit">
                      <label class="proficiency-label">숙련도:</label>
                      <div class="star-rating">
                        <button 
                          v-for="star in 5" 
                          :key="star"
                          @click="skill.proficiency = star"
                          class="star-btn"
                          :class="{ active: star <= skill.proficiency }"
                        >
                          ★
                        </button>
                      </div>
                      <span class="rating-text">{{ skill.proficiency }}점</span>
                    </div>
                  </div>
                  <button @click="removeSkill(index)" class="skill-remove">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="edit-actions">
              <button @click="saveEdit('skills')" class="save-btn" :disabled="saveLoading">
                <i class="bi bi-check" v-if="!saveLoading"></i>
                <div class="loading-spinner-small" v-if="saveLoading"></div>
                {{ saveLoading ? '저장 중...' : '저장' }}
              </button>
              <button @click="cancelEdit" class="cancel-btn" :disabled="saveLoading">
                <i class="bi bi-x"></i>
                취소
              </button>
            </div>
          </div>
          
          <div v-else-if="portfolioData.skills.length > 0" class="section-content">
            <div class="skills-list">
              <div 
                v-for="skill in portfolioData.skills" 
                :key="skill.name" 
                class="skill-tag"
              >
                <span class="skill-name">{{ skill.name }}</span>
                <div class="skill-rating">
                  <span 
                    v-for="star in 5" 
                    :key="star"
                    class="star"
                    :class="{ filled: star <= skill.proficiency }"
                  >
                    ★
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-section">
            <p class="empty-message">기술 스택이 없습니다.</p>
            <button @click="startEdit('skills')" class="add-content-btn">
              <i class="bi bi-plus"></i>
              기술 스택 추가
            </button>
          </div>
        </section>

        <section class="portfolio-section">
          <div class="section-header">
            <h5 class="section-title">프로젝트</h5>
            <div class="section-actions">
              <button @click="goToProjectManagement" class="section-edit-btn">
                <i class="bi bi-gear"></i>
                관리
              </button>
            </div>
          </div>
          
          <div v-if="portfolioData.projects && portfolioData.projects.length > 0" class="section-content">
            <div class="projects-grid">
              <div 
                v-for="project in portfolioData.projects.slice(0, 6)" 
                :key="project.id"
                class="project-card"
              >
                <div class="project-header">
                  <h6 class="project-title">{{ project.title }}</h6>
                  <span class="project-role-badge">{{ project.role }}</span>
                </div>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-tech" v-if="project.techStacks.length > 0">
                  <span 
                    v-for="tech in project.techStacks.slice(0, 3)" 
                    :key="tech" 
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                  <span v-if="project.techStacks.length > 3" class="tech-more">
                    +{{ project.techStacks.length - 3 }}
                  </span>
                </div>
              </div>
              
              <div v-if="portfolioData.projects && portfolioData.projects.length > 6" class="more-projects-card">
                <span>+{{ portfolioData.projects.length - 6 }}개 더</span>
                <button @click="goToProjectManagement" class="view-all-btn">전체 보기</button>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-section">
            <p class="empty-message">프로젝트가 없습니다.</p>
            <button @click="goToProjectManagement" class="add-content-btn">
              <i class="bi bi-plus"></i>
              프로젝트 추가
            </button>
          </div>
        </section>

        <section class="portfolio-section">
          <div class="section-header">
            <h5 class="section-title">받은 리뷰</h5>
            <span class="review-count" v-if="portfolioData.reviews.length > 0">
              {{ portfolioData.reviews.length }}개
            </span>
          </div>
          
          <div v-if="portfolioData.reviews.length > 0" class="section-content">
            <div class="reviews-list">
              <div 
                v-for="review in portfolioData.reviews" 
                :key="review.reviewId"
                class="review-card"
              >
                <div class="review-header">
                  <div class="reviewer-info">
                    <div class="reviewer-avatar">
                      <img 
                        :src="review.reviewerProfileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewerId}`" 
                        :alt="review.reviewerName"
                      />
                    </div>
                    <div class="reviewer-details">
                      <h6 class="reviewer-name">{{ review.reviewerName || '익명' }}</h6>
                      <p class="project-context">{{ review.projectTitle }}</p>
                    </div>
                  </div>
                  <div class="review-rating">
                    <div class="stars">
                      <i 
                        v-for="star in 5" 
                        :key="star"
                        :class="['bi', star <= review.rating ? 'bi-star-fill' : 'bi-star']"
                        class="star"
                      ></i>
                    </div>
                    <span class="rating-text">{{ review.rating.toFixed(1) }}</span>
                  </div>
                </div>
                
                <div class="review-content">
                  <p class="review-comment">{{ review.comment }}</p>
                </div>
                
                <div class="review-footer">
                  <span class="review-date">{{ formatReviewDate(review.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="empty-section">
            <div class="empty-icon">
              <i class="bi bi-chat-heart"></i>
            </div>
            <p class="empty-message">아직 받은 리뷰가 없습니다.</p>
            <p class="empty-description">프로젝트에 참여하여 동료들과 함께 작업해보세요!</p>
          </div>
        </section>
      </div>
    </div>

    <Transition name="toast">
      <div v-if="showSaveToast" class="save-toast success">
        <i class="bi bi-check-circle-fill"></i>
        저장되었습니다!
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="errorMessage" class="save-toast error">
        <i class="bi bi-exclamation-circle-fill"></i>
        {{ errorMessage }}
      </div>
    </Transition>

    <!-- 프로젝트 선택 모달 -->
    <ProjectSelectionModal 
      :show="showProjectSelectionModal"
      @close="closeProjectSelectionModal"
      @saved="onProjectsUpdated"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { portfolioApi, techStackApi } from '@/api/portfolio.js'
import api from '@/api/axios.js'
import ProjectSelectionModal from '@/components/portfolio/ProjectSelectionModal.vue'

const router = useRouter()

// 백업용 기술 스택 데이터베이스 (API 실패 시에만 사용)
const fallbackSkillDatabase = [
  { stackId: 1, name: 'JavaScript', category: '언어' },
  { stackId: 2, name: 'TypeScript', category: '언어' },
  { stackId: 3, name: 'Python', category: '언어' },
  { stackId: 4, name: 'Java', category: '언어' },
  { stackId: 5, name: 'React', category: '프론트엔드' },
  { stackId: 6, name: 'Vue.js', category: '프론트엔드' },
  { stackId: 7, name: 'Node.js', category: '백엔드' },
  { stackId: 8, name: 'Spring Boot', category: '백엔드' },
  { stackId: 9, name: 'MySQL', category: '데이터베이스' },
  { stackId: 10, name: 'PostgreSQL', category: '데이터베이스' },
  { stackId: 11, name: 'MongoDB', category: '데이터베이스' },
  { stackId: 12, name: 'AWS', category: '클라우드' },
  { stackId: 13, name: 'Docker', category: '데브옵스' }
]

const loading = ref(true)
const editMode = ref(null) // null, 'introduction', 'education', 'career', 'skills'
const showSaveToast = ref(false)
const showProjectSelectionModal = ref(false)
const saveLoading = ref(false)
const errorMessage = ref('')
const newSkill = ref('')
const newSkillProficiency = ref(3)
const showSuggestions = ref(false)
const skillSuggestions = ref([])
const searchTimeout = ref(null)
const allTechStacks = ref([])

// 원본 포트폴리오 데이터 (빈 초기값)
const portfolioData = reactive({
  userId: null,
  userInfo: null,
  introduction: '',
  skills: [],
  educations: [],
  careers: [],
  projects: [],
  reviews: []
})

// 편집용 데이터
const editData = reactive({})

// 에러 상태 관리
const educationErrors = reactive({})
const careerErrors = reactive({})

// 이미지 로드 에러 처리
const handleImageError = (event) => {
  console.error('포트폴리오 프로필 이미지 로드 실패:', portfolioData.userInfo.avatar);
  // 이미 dicebear URL이 아닌 경우에만 변경
  if (!event.target.src.includes('dicebear.com')) {
    event.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolioData.userInfo.userId || 'default'}`;
  }
}

// 리뷰 데이터를 가져오는 API 함수
const getUserReviews = async (userId) => {
  try {
    const response = await api.get(`/reviews/users/${userId}`)
    return response.data || []
  } catch (error) {
    console.error('리뷰 데이터 로드 실패:', error)
    if (error.response) {
      console.error('응답 상태:', error.response.status)
      console.error('응답 데이터:', error.response.data)
    }
    return []
  }
}

// 포트폴리오 컨텐츠가 있는지 확인 (사용자 정보는 항상 있으므로 다른 데이터로 판단)
const hasPortfolioContent = computed(() => {
  return portfolioData.introduction ||
    portfolioData.skills.length > 0 ||
    portfolioData.educations.length > 0 ||
    portfolioData.careers.length > 0 ||
    portfolioData.projects.length > 0
})

// 교육 이력을 최신순으로 정렬
const educationData = computed(() => {
  if (!portfolioData.educations) return []
  
  return [...portfolioData.educations].sort((a, b) => {
    if (a.isOngoing && !b.isOngoing) return -1
    if (!a.isOngoing && b.isOngoing) return 1
    
    const aDate = new Date(a.startDate)
    const bDate = new Date(b.startDate)
    return bDate - aDate
  })
})

// 경력을 최신순으로 정렬
const careerData = computed(() => {
  if (!portfolioData.careers) return []
  
  return [...portfolioData.careers].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    
    const aDate = new Date(a.startDate)
    const bDate = new Date(b.startDate)
    return bDate - aDate
  })
})

// 메서드
const loadPortfolioData = async () => {
  loading.value = true
  try {
    
    // httpOnly 쿠키 방식에서는 토큰 확인을 하지 않음
    // 서버에서 쿠키를 통해 자동으로 인증 처리됨
    
    // 포트폴리오 데이터와 전체 기술 스택 목록을 병렬로 로드
    const [portfolioResponse, allTechStacksResponse] = await Promise.all([
      portfolioApi.getPortfolio(),
      techStackApi.getAllTechStacks()
    ])
    
    
    
    const portfolio = portfolioResponse.data
    
    // 사용자 기본 정보 설정
    portfolioData.userId = portfolio.userId
    portfolioData.userInfo = {
      name: portfolio.nickname || '사용자',
      jobTitle: portfolio.jobTitle || '',
      avatar: portfolio.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.userId}`,
      category: (portfolio.techPartName || portfolio.techPart || '')
    }
    
    // 기본 값 설정
    portfolioData.introduction = portfolio.bio || ''
    // 공통 매퍼로 프로젝트 통일
    portfolioData.projects = portfolio.projects?.map(project => {
      // 지연 로딩을 피하기 위해 인라인 매핑 유지
      const role = (project?.role || '').toUpperCase() === 'LEADER' || (project?.role || '').toUpperCase() === 'PM' || (project?.role || '').toUpperCase() === 'PROJECT_MANAGER' ? '팀장' : '팀원'
      return {
        id: project.projectId,
        title: project.title,
        description: project.description,
        role,
        status: project.status,
        techPart: project.techPart,
        startDate: project.startDate,
        endDate: project.endDate,
        techStacks: project.techStacks || []
      }
    }) || []
    
    // 기술 스택 데이터 설정
    portfolioData.skills = portfolio.techStacks?.map(ts => ({
      userTechStackId: ts.userTechStackId,
      stackId: ts.stackId,
      name: ts.stackName,
      proficiency: ts.skillLevel
    })) || []
    
    // 교육 정보 설정 (LocalDate -> YYYY-MM 형식)
    portfolioData.educations = portfolio.educations?.map(edu => ({
      educationId: edu.educationId,
      institution: edu.institution,
      program: edu.program,
      startDate: edu.startDate ? edu.startDate.substring(0, 7) : '',
      endDate: edu.endDate ? edu.endDate.substring(0, 7) : '',
      isOngoing: edu.isCurrent || false
    })) || []
    
    // 경력 정보 설정
    portfolioData.careers = portfolio.experiences?.map(exp => ({
      experienceId: exp.experienceId,
      company: exp.companyName,
      position: exp.department,
      startDate: exp.startDate ? exp.startDate.substring(0, 7) : '',
      endDate: exp.endDate ? exp.endDate.substring(0, 7) : '',
      isCurrent: exp.isCurrent || false,
      description: exp.summary || ''
    })) || []
    
    // 리뷰 정보 설정
    try {
      portfolioData.reviews = await getUserReviews(portfolio.userId)
    } catch (reviewError) {
      console.error('리뷰 로드 중 오류:', reviewError)
      portfolioData.reviews = []
    }
    
    // 전체 기술 스택 목록 설정 (검색용) - ID와 이름 모두 포함
    allTechStacks.value = allTechStacksResponse.data?.map(ts => ({
      stackId: ts.techStackId, // 실제 기술 스택 ID 사용
      name: ts.name,
      category: '기타' // 카테고리 정보가 없으므로 기본값 설정
    })) || []
    
  } catch (error) {
    console.error('포트폴리오 데이터 로드 실패:', error)
    
    // 상세한 에러 정보 출력
    if (error.response) {
      console.error('HTTP 오류 상태:', error.response.status)
      console.error('HTTP 오류 메시지:', error.response.data)
    } else if (error.request) {
      console.error('네트워크 오류:', error.request)
    } else {
      console.error('요청 설정 오류:', error.message)
    }
    
    // 인증 오류인 경우 로그인 페이지로 리다이렉트
    if (error.response?.status === 401 || error.message.includes('로그인이 필요')) {
      console.error('인증 오류 - 로그인 페이지로 이동')
      // router.push('/login') // 필요시 활성화
    }
    
    // 백엔드 연결 실패 시 기본값 설정 (목업 데이터 대신)
    portfolioData.userId = 1
    portfolioData.userInfo = {
      name: '사용자',
      jobTitle: '',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      category: ''
    }
    
    // 백업 기술 스택 데이터를 allTechStacks에 설정 (검색용)
    allTechStacks.value = fallbackSkillDatabase
    
  } finally {
    loading.value = false
  }
}

const startEdit = async (field) => {
  editMode.value = field
  
  // 편집 데이터 초기화
  switch (field) {
    case 'introduction':
      editData.introduction = portfolioData.introduction
      break
    case 'education':
      editData.educations = JSON.parse(JSON.stringify(portfolioData.educations))
      break
    case 'career':
      editData.careers = JSON.parse(JSON.stringify(portfolioData.careers))
      break
    case 'skills':
      editData.skills = JSON.parse(JSON.stringify(portfolioData.skills))
      break
  }
  
  // 포커스 설정
  await nextTick()
  if (field === 'introduction') {
    this.$refs.introductionInput?.focus()
  }
}

const saveEdit = async (field) => {
  saveLoading.value = true
  errorMessage.value = ''
  
  try {
    // 기술 스택 저장의 경우 개별 API 호출
    if (field === 'skills') {
      // 현재 기술 스택과 편집된 기술 스택을 비교하여 변경사항만 처리
      const currentSkills = portfolioData.skills || []
      const newSkills = editData.skills || []
      
      // 삭제된 기술 스택 찾기
      for (const currentSkill of currentSkills) {
        const stillExists = newSkills.find(ns => ns.userTechStackId === currentSkill.userTechStackId)
        if (!stillExists && currentSkill.userTechStackId) {
          await portfolioApi.deleteTechStack(currentSkill.userTechStackId)
        }
      }
      
      // 추가되거나 수정된 기술 스택 처리
      for (const newSkill of newSkills) {
        if (newSkill.userTechStackId) {
          // 기존 기술 스택 수정
          const currentSkill = currentSkills.find(cs => cs.userTechStackId === newSkill.userTechStackId)
          if (currentSkill && (currentSkill.proficiency !== newSkill.proficiency)) {
            const response = await portfolioApi.updateTechStack(newSkill.userTechStackId, {
              stackId: newSkill.stackId,
              skillLevel: newSkill.proficiency
            })
            // 응답 데이터로 업데이트
            newSkill.userTechStackId = response.data.userTechStackId
            newSkill.stackId = response.data.stackId
            newSkill.proficiency = response.data.skillLevel
          }
        } else {
          // 새 기술 스택 추가
          if (newSkill.stackId) {
            const response = await portfolioApi.addTechStack({
              stackId: newSkill.stackId,
              skillLevel: newSkill.proficiency
            })
            // 응답 데이터로 업데이트
            newSkill.userTechStackId = response.data.userTechStackId
            newSkill.stackId = response.data.stackId
            newSkill.name = response.data.stackName
            newSkill.proficiency = response.data.skillLevel
          } else {
            console.warn('기술 스택 ID가 없어 추가할 수 없습니다:', newSkill.name)
          }
        }
      }
      
      portfolioData.skills = JSON.parse(JSON.stringify(editData.skills))
    } else {
      // 다른 필드들은 개별 API 사용
      switch (field) {
        case 'introduction':
          await portfolioApi.updateBio(editData.introduction)
          portfolioData.introduction = editData.introduction
          break
        case 'education':
          await saveEducations()
          break
        case 'career':
          await saveExperiences()
          break
      }
    }
    
    editMode.value = null
    showSaveToast.value = true
    setTimeout(() => showSaveToast.value = false, 3000)
    
  } catch (error) {
    console.error('저장 실패:', error)
    errorMessage.value = error.response?.data?.message || '저장 중 오류가 발생했습니다.'
    setTimeout(() => errorMessage.value = '', 5000)
  } finally {
    saveLoading.value = false
  }
}

const cancelEdit = () => {
  editMode.value = null
  // 편집 데이터 초기화
  Object.keys(editData).forEach(key => {
    delete editData[key]
  })
}

const formatEducationPeriod = (education) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    return `${year}.${month}`
  }

  const startFormatted = formatDate(education.startDate)
  
  if (education.isOngoing) {
    return `${startFormatted} ~`
  }
  
  const endFormatted = formatDate(education.endDate)
  return `${startFormatted} ~ ${endFormatted}`
}

const formatCareerPeriod = (career) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const [year, month] = dateString.split('-')
    return `${year}.${month}`
  }

  const startFormatted = formatDate(career.startDate)
  
  if (career.isCurrent) {
    return `${startFormatted} ~`
  }
  
  const endFormatted = formatDate(career.endDate)
  return `${startFormatted} ~ ${endFormatted}`
}

const formatReviewDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) {
    return '어제'
  } else if (diffDays < 7) {
    return `${diffDays}일 전`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks}주 전`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months}개월 전`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years}년 전`
  }
}

// 교육 이력 관련 메서드
// 연도/월 입력 검증 함수
const validateDateInput = (dateString, fieldName, itemIndex, type) => {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth() + 1
  const currentDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}`
  
  if (!dateString) {
    return '날짜를 입력해주세요.'
  }
  
  // 다양한 형식 지원 (YYYY-MM, YYYY.MM, YYYY/MM, YYYY년 MM월, YYYY년, YYYYMM, YYYYM)
  let normalizedDate = dateString
  
  // "YYYY년 MM월" 형식 처리
  if (/^\d{4}년\s*\d{1,2}월$/.test(dateString)) {
    const matches = dateString.match(/^(\d{4})년\s*(\d{1,2})월$/)
    normalizedDate = `${matches[1]}-${String(matches[2]).padStart(2, '0')}`
  }
  // "YYYY년" 형식 처리 (1월로 설정)
  else if (/^\d{4}년$/.test(dateString)) {
    const year = dateString.match(/^(\d{4})년$/)[1]
    normalizedDate = `${year}-01`
  }
  // 점(.) 구분자 처리
  else if (/^\d{4}\.\d{1,2}$/.test(dateString)) {
    const [year, month] = dateString.split('.')
    normalizedDate = `${year}-${String(month).padStart(2, '0')}`
  }
  // 슬래시(/) 구분자 처리
  else if (/^\d{4}\/\d{1,2}$/.test(dateString)) {
    const [year, month] = dateString.split('/')
    normalizedDate = `${year}-${String(month).padStart(2, '0')}`
  }
  // YYYYMM 형식 처리 (6자리 숫자)
  else if (/^\d{6}$/.test(dateString)) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    normalizedDate = `${year}-${month}`
  }
  // YYYYM 형식 처리 (5자리 숫자)
  else if (/^\d{5}$/.test(dateString)) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 5)
    normalizedDate = `${year}-${String(month).padStart(2, '0')}`
  }
  
  // YYYY-MM 형식 검증
  if (!/^\d{4}-\d{2}$/.test(normalizedDate)) {
    return '올바른 날짜 형식이 아닙니다. (예: 202403, 2024.03, 2024년 3월)'
  }
  
  const [year, month] = normalizedDate.split('-').map(Number)
  
  // 연도 검증 (1900년 이후, 현재 연도 이전)
  if (year < 1900) {
    return '1900년 이후의 연도를 입력해주세요.'
  }
  
  if (year > currentYear) {
    return '현재 연도보다 이후의 날짜는 입력할 수 없습니다.'
  }
  
  // 월 검증 (1-12)
  if (month < 1 || month > 12) {
    return '월은 1~12 사이의 값을 입력해주세요.'
  }
  
  // 현재 연도이고 현재 월보다 이후인지 검증
  if (year === currentYear && normalizedDate > currentDate) {
    return '현재 날짜보다 이후의 날짜는 입력할 수 없습니다.'
  }
  
  return null
}

// 시작일과 종료일 순서 검증
const validateDateOrder = (startDate, endDate, isOngoing) => {
  if (isOngoing || !startDate || !endDate) return null
  
  if (startDate >= endDate) {
    return '종료일은 시작일보다 이후여야 합니다.'
  }
  
  return null
}

// 입력된 날짜를 정규화하는 함수 (내부 저장용 YYYY-MM 형식)
const normalizeDateInput = (dateString) => {
  if (!dateString) return ''
  
  let normalizedDate = dateString
  
  // "YYYY년 MM월" 형식 처리
  if (/^\d{4}년\s*\d{1,2}월$/.test(dateString)) {
    const matches = dateString.match(/^(\d{4})년\s*(\d{1,2})월$/)
    normalizedDate = `${matches[1]}-${String(matches[2]).padStart(2, '0')}`
  }
  // "YYYY년" 형식 처리 (1월로 설정)
  else if (/^\d{4}년$/.test(dateString)) {
    const year = dateString.match(/^(\d{4})년$/)[1]
    normalizedDate = `${year}-01`
  }
  // 점(.) 구분자 처리
  else if (/^\d{4}\.\d{1,2}$/.test(dateString)) {
    const [year, month] = dateString.split('.')
    normalizedDate = `${year}-${String(month).padStart(2, '0')}`
  }
  // 슬래시(/) 구분자 처리
  else if (/^\d{4}\/\d{1,2}$/.test(dateString)) {
    const [year, month] = dateString.split('/')
    normalizedDate = `${year}-${String(month).padStart(2, '0')}`
  }
  // YYYYMM 형식 처리 (6자리 숫자)
  else if (/^\d{6}$/.test(dateString)) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 6)
    normalizedDate = `${year}-${month}`
  }
  // YYYYM 형식 처리 (5자리 숫자)
  else if (/^\d{5}$/.test(dateString)) {
    const year = dateString.substring(0, 4)
    const month = dateString.substring(4, 5)
    normalizedDate = `${year}-${String(month).padStart(2, '0')}`
  }
  
  return normalizedDate
}

// 표시용 날짜 포맷팅 함수 (YYYY-MM -> YYYY년 M월)
const formatDateForDisplay = (dateString) => {
  if (!dateString) return ''
  
  // YYYY-MM 형식이면 YYYY년 M월로 변환
  if (/^\d{4}-\d{2}$/.test(dateString)) {
    const [year, month] = dateString.split('-')
    return `${year}년 ${parseInt(month)}월`
  }
  
  return dateString
}

// 입력 필드에서 자동 포맷팅을 처리하는 함수
const handleDateInput = (event, index, field, type) => {
  const value = event.target.value
  
  // 숫자만 입력된 경우 자동 포맷팅
  if (/^\d{5,6}$/.test(value)) {
    let year, month
    
    if (value.length === 6) {
      // YYYYMM
      year = value.substring(0, 4)
      month = value.substring(4, 6)
    } else if (value.length === 5) {
      // YYYYM
      year = value.substring(0, 4)
      month = value.substring(4, 5)
    }
    
    // 유효한 월인지 확인
    const monthNum = parseInt(month)
    if (monthNum >= 1 && monthNum <= 12) {
      const formattedDate = `${year}년 ${monthNum}월`
      
      // 해당 필드에 포맷된 값 설정
      if (type === 'education') {
        editData.educations[index][field] = formattedDate
      } else if (type === 'career') {
        editData.careers[index][field] = formattedDate
      }
      
      // 포커스 해제하여 검증 트리거
      event.target.blur()
      setTimeout(() => {
        event.target.focus()
      }, 10)
    }
  }
}

const addEducation = () => {
  if (!editMode.value) {
    startEdit('education')
  }
  
  if (!editData.educations) {
    editData.educations = []
  }
  
  const newIndex = editData.educations.length
  editData.educations.push({
    educationId: null, // 새로 추가하는 교육 정보
    institution: '',
    program: '',
    startDate: '',
    endDate: '',
    isOngoing: false
  })
  
  // 에러 상태 초기화
  if (!educationErrors[newIndex]) {
    educationErrors[newIndex] = {}
  }
}

const removeEducation = (index) => {
  editData.educations.splice(index, 1)
  // 에러 상태도 함께 제거
  delete educationErrors[index]
  
  // 인덱스 재정렬
  const newErrors = {}
  Object.keys(educationErrors).forEach((key) => {
    const keyIndex = parseInt(key)
    if (keyIndex > index) {
      newErrors[keyIndex - 1] = educationErrors[key]
    } else if (keyIndex < index) {
      newErrors[keyIndex] = educationErrors[key]
    }
  })
  Object.keys(educationErrors).forEach(key => delete educationErrors[key])
  Object.assign(educationErrors, newErrors)
}

const handleOngoingToggle = (index, type) => {
  if (type === 'education') {
    if (editData.educations[index].isOngoing) {
      editData.educations[index].endDate = ''
      // 종료일 에러 클리어
      if (educationErrors[index]) {
        delete educationErrors[index].endDate
        delete educationErrors[index].dateOrder
      }
    }
  }
}

// 경력 관련 메서드
const addCareer = () => {
  if (!editMode.value) {
    startEdit('career')
  }
  
  if (!editData.careers) {
    editData.careers = []
  }
  
  const newIndex = editData.careers.length
  editData.careers.push({
    experienceId: null, // 새로 추가하는 경력 정보
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  })
  
  // 에러 상태 초기화
  if (!careerErrors[newIndex]) {
    careerErrors[newIndex] = {}
  }
}

const removeCareer = (index) => {
  editData.careers.splice(index, 1)
  // 에러 상태도 함께 제거
  delete careerErrors[index]
  
  // 인덱스 재정렬
  const newErrors = {}
  Object.keys(careerErrors).forEach((key) => {
    const keyIndex = parseInt(key)
    if (keyIndex > index) {
      newErrors[keyIndex - 1] = careerErrors[key]
    } else if (keyIndex < index) {
      newErrors[keyIndex] = careerErrors[key]
    }
  })
  Object.keys(careerErrors).forEach(key => delete careerErrors[key])
  Object.assign(careerErrors, newErrors)
}

const handleCurrentToggle = (index) => {
  if (editData.careers[index].isCurrent) {
    editData.careers[index].endDate = ''
    // 종료일 에러 클리어
    if (careerErrors[index]) {
      delete careerErrors[index].endDate
      delete careerErrors[index].dateOrder
    }
  }
}

// 기술 스택 관련 메서드
const addSkill = () => {
  const skillName = newSkill.value.trim()
  if (skillName && !editData.skills.some(s => s.name === skillName)) {
    // 검색 결과에서 stackId 찾기
    const searchResults = allTechStacks.value.length > 0 ? allTechStacks.value : fallbackSkillDatabase
    const foundSkill = searchResults.find(s => s.name === skillName)
    
    editData.skills.push({
      userTechStackId: null, // 새로 추가하는 기술 스택
      stackId: foundSkill?.stackId || null,
      name: skillName,
      proficiency: newSkillProficiency.value
    })
    newSkill.value = ''
    newSkillProficiency.value = 3
  }
}

const removeSkill = (index) => {
  editData.skills.splice(index, 1)
}

// 날짜 입력 검증
const validateEducationDates = () => {
  let hasErrors = false
  
  // 기존 에러 초기화
  Object.keys(educationErrors).forEach(key => {
    educationErrors[key] = {}
  })
  
  editData.educations?.forEach((education, index) => {
    if (!educationErrors[index]) {
      educationErrors[index] = {}
    }
    
    // 시작일 검증
    if (education.startDate) {
      const startDateError = validateDateInput(education.startDate, 'startDate', index, 'education')
      if (startDateError) {
        educationErrors[index].startDate = startDateError
        hasErrors = true
      } else {
        // 정규화된 날짜로 업데이트
        education.startDate = normalizeDateInput(education.startDate)
      }
    }
    
    // 종료일 검증 (진행 중이 아닌 경우만)
    if (!education.isOngoing && education.endDate) {
      const endDateError = validateDateInput(education.endDate, 'endDate', index, 'education')
      if (endDateError) {
        educationErrors[index].endDate = endDateError
        hasErrors = true
      } else {
        // 정규화된 날짜로 업데이트
        education.endDate = normalizeDateInput(education.endDate)
        
        // 날짜 순서 검증
        const dateOrderError = validateDateOrder(education.startDate, education.endDate, education.isOngoing)
        if (dateOrderError) {
          educationErrors[index].dateOrder = dateOrderError
          hasErrors = true
        }
      }
    }
  })
  
  return !hasErrors
}

// 교육 정보 저장 함수
const saveEducations = async () => {
  // 날짜 검증
  if (!validateEducationDates()) {
    throw new Error('입력된 날짜를 확인해주세요.')
  }
  
  const currentEducations = portfolioData.educations || []
  const newEducations = editData.educations || []
  
  // 삭제된 교육 정보 찾기
  for (const current of currentEducations) {
    const stillExists = newEducations.find(ne => ne.educationId === current.educationId)
    if (!stillExists && current.educationId) {
      await portfolioApi.deleteEducation(current.educationId)
    }
  }
  
  // 추가되거나 수정된 교육 정보 처리
  for (const newEdu of newEducations) {
    const eduData = {
      institution: newEdu.institution,
      program: newEdu.program,
      startDate: newEdu.startDate ? `${newEdu.startDate}-01` : null, // YYYY-MM -> YYYY-MM-01
      endDate: newEdu.endDate && !newEdu.isOngoing ? `${newEdu.endDate}-01` : null,
      isCurrent: newEdu.isOngoing
    }
    
    if (newEdu.educationId) {
      // 기존 교육 정보 수정
      const response = await portfolioApi.updateEducation(newEdu.educationId, eduData)
      Object.assign(newEdu, {
        educationId: response.data.educationId,
        startDate: response.data.startDate ? response.data.startDate.substring(0, 7) : '',
        endDate: response.data.endDate ? response.data.endDate.substring(0, 7) : '',
        isOngoing: response.data.isCurrent
      })
    } else {
      // 새 교육 정보 추가
      const response = await portfolioApi.addEducation(eduData)
      newEdu.educationId = response.data.educationId
      newEdu.startDate = response.data.startDate ? response.data.startDate.substring(0, 7) : ''
      newEdu.endDate = response.data.endDate ? response.data.endDate.substring(0, 7) : ''
      newEdu.isOngoing = response.data.isCurrent
    }
  }
  
  portfolioData.educations = JSON.parse(JSON.stringify(editData.educations))
}

// 경력 날짜 입력 검증
const validateCareerDates = () => {
  let hasErrors = false
  
  // 기존 에러 초기화
  Object.keys(careerErrors).forEach(key => {
    careerErrors[key] = {}
  })
  
  editData.careers?.forEach((career, index) => {
    if (!careerErrors[index]) {
      careerErrors[index] = {}
    }
    
    // 시작일 검증
    if (career.startDate) {
      const startDateError = validateDateInput(career.startDate, 'startDate', index, 'career')
      if (startDateError) {
        careerErrors[index].startDate = startDateError
        hasErrors = true
      } else {
        // 정규화된 날짜로 업데이트
        career.startDate = normalizeDateInput(career.startDate)
      }
    }
    
    // 종료일 검증 (현재 재직중이 아닌 경우만)
    if (!career.isCurrent && career.endDate) {
      const endDateError = validateDateInput(career.endDate, 'endDate', index, 'career')
      if (endDateError) {
        careerErrors[index].endDate = endDateError
        hasErrors = true
      } else {
        // 정규화된 날짜로 업데이트
        career.endDate = normalizeDateInput(career.endDate)
        
        // 날짜 순서 검증
        const dateOrderError = validateDateOrder(career.startDate, career.endDate, career.isCurrent)
        if (dateOrderError) {
          careerErrors[index].dateOrder = dateOrderError
          hasErrors = true
        }
      }
    }
  })
  
  return !hasErrors
}

// 경력 정보 저장 함수
const saveExperiences = async () => {
  // 날짜 검증
  if (!validateCareerDates()) {
    throw new Error('입력된 날짜를 확인해주세요.')
  }
  
  const currentExperiences = portfolioData.careers || []
  const newExperiences = editData.careers || []
  
  // 삭제된 경력 정보 찾기
  for (const current of currentExperiences) {
    const stillExists = newExperiences.find(ne => ne.experienceId === current.experienceId)
    if (!stillExists && current.experienceId) {
      await portfolioApi.deleteExperience(current.experienceId)
    }
  }
  
  // 추가되거나 수정된 경력 정보 처리
  for (const newExp of newExperiences) {
    const expData = {
      companyName: newExp.company, // company -> companyName
      department: newExp.position, // position -> department
      startDate: newExp.startDate ? `${newExp.startDate}-01` : null, // YYYY-MM -> YYYY-MM-01
      endDate: newExp.endDate && !newExp.isCurrent ? `${newExp.endDate}-01` : null,
      isCurrent: newExp.isCurrent,
      summary: newExp.description || '' // description -> summary
    }
    
    if (newExp.experienceId) {
      // 기존 경력 정보 수정
      const response = await portfolioApi.updateExperience(newExp.experienceId, expData)
      Object.assign(newExp, {
        experienceId: response.data.experienceId,
        company: response.data.companyName,
        position: response.data.department,
        startDate: response.data.startDate ? response.data.startDate.substring(0, 7) : '',
        endDate: response.data.endDate ? response.data.endDate.substring(0, 7) : '',
        isCurrent: response.data.isCurrent,
        description: response.data.summary || ''
      })
    } else {
      // 새 경력 정보 추가
      const response = await portfolioApi.addExperience(expData)
      newExp.experienceId = response.data.experienceId
      newExp.company = response.data.companyName
      newExp.position = response.data.department
      newExp.startDate = response.data.startDate ? response.data.startDate.substring(0, 7) : ''
      newExp.endDate = response.data.endDate ? response.data.endDate.substring(0, 7) : ''
      newExp.isCurrent = response.data.isCurrent
      newExp.description = response.data.summary || ''
    }
  }
  
  portfolioData.careers = JSON.parse(JSON.stringify(editData.careers))
}

// 기술 스택 검색 관련 메서드
const searchSkills = () => {
  const query = newSkill.value.trim()
  
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    if (query.length >= 1) {
      // 전체 기술 스택에서 검색
      const searchResults = allTechStacks.value.length > 0 
        ? allTechStacks.value
        : fallbackSkillDatabase // 백엔드 연동 실패 시 백업 데이터 사용
      
      skillSuggestions.value = searchResults
        .filter(skill => 
          skill.name.toLowerCase().includes(query.toLowerCase()) &&
          !editData.skills.some(existingSkill => existingSkill.name === skill.name)
        )
        .slice(0, 8) // 최대 8개만 표시
      showSuggestions.value = skillSuggestions.value.length > 0
    } else {
      skillSuggestions.value = []
      showSuggestions.value = false
    }
  }, 200) // 200ms 디바운싱
}

const selectSkill = (skill) => {
  // 선택된 기술 스택을 직접 추가
  if (!editData.skills.some(s => s.name === skill.name)) {
    editData.skills.push({
      userTechStackId: null, // 새로 추가하는 기술 스택
      stackId: skill.stackId || null,
      name: skill.name,
      proficiency: newSkillProficiency.value
    })
  }
  
  newSkill.value = ''
  newSkillProficiency.value = 3
  showSuggestions.value = false
  skillSuggestions.value = []
}

const hideSuggestions = () => {
  // 약간의 지연을 주어 클릭 이벤트가 실행될 시간을 줌
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

// 실시간 에러 처리 함수
const validateEducationDate = (index, field) => {
  const education = editData.educations[index]
  if (!education || !education[field]) return
  
  if (!educationErrors[index]) {
    educationErrors[index] = {}
  }
  
  const error = validateDateInput(education[field], field, index, 'education')
  if (error) {
    educationErrors[index][field] = error
  } else {
    delete educationErrors[index][field]
    const normalizedDate = normalizeDateInput(education[field])
    // 사용자에게는 친화적인 형식으로 표시
    education[field] = formatDateForDisplay(normalizedDate)
    
    // 날짜 순서 검증 (종료일일 때만)
    if (field === 'endDate' && !education.isOngoing) {
      const dateOrderError = validateDateOrder(education.startDate, education.endDate, education.isOngoing)
      if (dateOrderError) {
        educationErrors[index].dateOrder = dateOrderError
      } else {
        delete educationErrors[index].dateOrder
      }
    }
  }
}

const validateCareerDate = (index, field) => {
  const career = editData.careers[index]
  if (!career || !career[field]) return
  
  if (!careerErrors[index]) {
    careerErrors[index] = {}
  }
  
  const error = validateDateInput(career[field], field, index, 'career')
  if (error) {
    careerErrors[index][field] = error
  } else {
    delete careerErrors[index][field]
    const normalizedDate = normalizeDateInput(career[field])
    // 사용자에게는 친화적인 형식으로 표시
    career[field] = formatDateForDisplay(normalizedDate)
    
    // 날짜 순서 검증 (종료일일 때만)
    if (field === 'endDate' && !career.isCurrent) {
      const dateOrderError = validateDateOrder(career.startDate, career.endDate, career.isCurrent)
      if (dateOrderError) {
        careerErrors[index].dateOrder = dateOrderError
      } else {
        delete careerErrors[index].dateOrder
      }
    }
  }
}

const clearEducationError = (index, field) => {
  if (educationErrors[index]) {
    delete educationErrors[index][field]
    if (field === 'endDate') {
      delete educationErrors[index].dateOrder
    }
  }
}

const clearCareerError = (index, field) => {
  if (careerErrors[index]) {
    delete careerErrors[index][field]
    if (field === 'endDate') {
      delete careerErrors[index].dateOrder
    }
  }
}

const viewPublicPortfolio = () => {
  router.push(`/portfolio/${portfolioData.userId}`)
}

const goToProjectManagement = () => {
  showProjectSelectionModal.value = true
}

const closeProjectSelectionModal = () => {
  showProjectSelectionModal.value = false
}

const onProjectsUpdated = async () => {
  showProjectSelectionModal.value = false
  showSaveToast.value = true
  setTimeout(() => {
    showSaveToast.value = false
  }, 3000)
  
  // 프로젝트 데이터만 다시 로드 (더 효율적)
  try {
    const portfolioResponse = await portfolioApi.getPortfolio()
    const portfolio = portfolioResponse.data
    
    
    // 프로젝트 데이터만 업데이트
    portfolioData.projects = portfolio.projects?.map(project => {
      const role = (project?.role || '').toUpperCase() === 'LEADER' || (project?.role || '').toUpperCase() === 'PM' || (project?.role || '').toUpperCase() === 'PROJECT_MANAGER' ? '팀장' : '팀원'
      return {
        id: project.projectId,
        title: project.title,
        description: project.description,
        role,
        status: project.status,
        techPart: project.techPart,
        startDate: project.startDate,
        endDate: project.endDate,
        techStacks: project.techStacks || []
      }
    }) || []
    
    
  } catch (error) {
    console.error('프로젝트 업데이트 실패:', error)
    // 실패 시 전체 로드로 폴백
    await loadPortfolioData()
  }
}

onMounted(() => {
  loadPortfolioData()
})
</script>

<style scoped>
/* 기존 스타일들... */
.my-portfolio-page {
  padding: 20px;
  background: #f8f9fa;
  min-height: calc(100vh - 60px);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  gap: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.portfolio-container {
  max-width: 1200px;
  margin: 0 auto;
}

.portfolio-header {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.profile-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.profile-image {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #E0E0E0;
}

.profile-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
}

.profile-job {
  font-size: 18px;
  color: #666;
  margin: 0 0 12px 0;
}

.category-badge {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.view-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: 2px solid #E0E0E0;
  background: white;
  color: #666;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-button:hover {
  border-color: #2196F3;
  color: #2196F3;
}

.edit-field {
  display: flex;
  align-items: center;
  gap: 8px;
}

.edit-field.full-width {
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.edit-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
}

.edit-input:focus {
  border-color: #4CAF50;
}

.edit-textarea {
  padding: 12px;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  font-size: 15px;
  line-height: 1.6;
  resize: vertical;
  min-height: 100px;
  outline: none;
  font-family: inherit;
}

.career-description {
  margin-top: 12px;
  border-color: #ddd;
}

.career-description:focus {
  border-color: #4CAF50;
}

.edit-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.save-btn, .cancel-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.save-btn {
  background: #4CAF50;
  color: white;
  min-width: 80px;
  justify-content: center;
}

.save-btn:hover:not(:disabled) {
  background: #66BB6A;
}

.save-btn:disabled {
  background: #a5d6a7;
  cursor: not-allowed;
}

.cancel-btn {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background: #e9ecef;
}

.portfolio-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.portfolio-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(76, 175, 80, 0.1);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #4CAF50;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.section-edit-btn, .add-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-size: 14px;
}

.section-edit-btn:hover, .add-btn:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.section-content {
  color: #333;
  position: relative;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.section-content:hover {
  background: rgba(76, 175, 80, 0.02);
}

.edit-hint {
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 11px;
  color: #999;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.section-content:hover .edit-hint {
  opacity: 1;
}

.empty-section {
  text-align: center;
  padding: 40px 20px;
  color: #999;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-section:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.02);
}

.empty-message {
  margin: 0 0 15px 0;
  font-size: 14px;
}

.add-content-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 2px dashed rgba(76, 175, 80, 0.3);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.add-content-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.introduction-text {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 0;
}

.education-list, .career-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.education-item, .career-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
}

.education-institution, .career-company {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
}

.education-program, .career-position {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.career-description-text {
  font-size: 13px;
  color: #777;
  margin: 8px 0 0 0;
  line-height: 1.4;
}

.period-text {
  font-size: 13px;
  color: #666;
}

.ongoing-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  background: #4CAF50;
  color: white;
  font-size: 11px;
  font-weight: 600;
  border-radius: 12px;
}

.edit-mode {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid rgba(76, 175, 80, 0.2);
}

.education-edit-list, .career-edit-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

.education-edit-item, .career-edit-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.edit-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.item-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: #4CAF50;
  color: white;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 600;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.remove-btn:hover {
  background: rgba(220, 53, 69, 0.1);
}

.edit-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.edit-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.1);
}

.edit-input.error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.2);
}

.error-message {
  font-size: 12px;
  color: #dc3545;
  font-weight: 500;
  margin-top: 2px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.error-message:before {
  content: '⚠';
  font-size: 11px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
}

.description-section {
  margin-top: 16px;
}

.description-label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.add-item-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 2px dashed rgba(76, 175, 80, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.add-item-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.skill-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  min-width: 80px;
}

.skill-name {
  font-weight: 600;
  margin-bottom: 2px;
}

.skill-rating {
  display: flex;
  gap: 1px;
}

.star {
  color: #ddd;
  font-size: 12px;
  transition: color 0.2s ease;
}

.star.filled {
  color: #FFD700;
}

.skills-edit {
  margin-bottom: 20px;
}

.skill-input-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.skill-search-container {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.skill-search-container .edit-input {
  width: 100%;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:hover {
  background: rgba(76, 175, 80, 0.05);
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-name {
  font-weight: 500;
  color: #333;
}

.proficiency-input {
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.proficiency-label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
}

.star-rating {
  display: flex;
  gap: 2px;
}

.star-btn {
  background: none;
  border: none;
  color: #ddd;
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  transition: all 0.2s ease;
}

.star-btn:hover {
  color: #FFD700;
  transform: scale(1.1);
}

.star-btn.active {
  color: #FFD700;
}

.rating-text {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.add-skill-btn {
  padding: 8px 12px;
  background: #4CAF50;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.add-skill-btn:hover {
  background: #66BB6A;
}

.skills-edit-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-edit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.skill-edit-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.skill-name-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;
  min-width: 150px;
}

.skill-name-input:focus {
  border-color: #4CAF50;
}

.skill-proficiency-edit {
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-remove {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  padding: 8px;
  font-size: 16px;
  border-radius: 50%;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.skill-remove:hover {
  background: rgba(220, 53, 69, 0.1);
  transform: scale(1.1);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.project-card {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #4CAF50;
  transition: all 0.2s ease;
}

.project-card:hover {
  background: #e8f5e8;
  transform: translateY(-2px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.project-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  flex: 1;
  margin-right: 8px;
}

.project-role-badge {
  padding: 3px 8px;
  background: #e8f5e8;
  color: #2e7d32;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
}

.project-description {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.tech-tag {
  padding: 2px 6px;
  background: #f1f5f9;
  color: #475569;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 500;
}

.tech-more {
  padding: 2px 6px;
  background: #e2e8f0;
  color: #64748b;
  border-radius: 3px;
  font-size: 10px;
}

.more-projects-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  border: 2px dashed #ccc;
  text-align: center;
  gap: 8px;
}

.view-all-btn {
  padding: 4px 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.view-all-btn:hover {
  background: #66BB6A;
}

/* 리뷰 섹션 스타일 */
.review-count {
  padding: 4px 12px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #4CAF50;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.1);
  background: rgba(76, 175, 80, 0.02);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 16px;
}

.reviewer-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid rgba(76, 175, 80, 0.2);
  flex-shrink: 0;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-details {
  flex: 1;
  min-width: 0;
}

.reviewer-name {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.project-context {
  font-size: 13px;
  color: #4CAF50;
  margin: 0;
  font-weight: 500;
  line-height: 1.3;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.stars {
  display: flex;
  gap: 2px;
}

.stars .star {
  font-size: 14px;
  color: #ddd;
}

.stars .bi-star-fill {
  color: #FFD700;
}

.rating-text {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  min-width: 28px;
}

.review-content {
  margin: 12px 0;
}

.review-comment {
  font-size: 15px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  word-break: break-word;
}

.review-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.review-date {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  padding: 4px 10px;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 12px;
}

.empty-section .empty-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 50%;
  font-size: 24px;
  color: #4CAF50;
}

.empty-description {
  font-size: 14px;
  color: #999;
  margin: 8px 0 0 0;
  line-height: 1.4;
}

.save-toast {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  z-index: 1000;
  color: white;
}

.save-toast.success {
  background: #4CAF50;
}

.save-toast.error {
  background: #f44336;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .my-portfolio-page {
    padding: 15px;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .profile-section {
    width: 100%;
  }

  .edit-form-grid {
    grid-template-columns: 1fr;
  }

  .input-group {
    margin-bottom: 8px;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .skill-input-group {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .skill-search-container {
    min-width: auto;
  }

  .skill-edit-content {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .skill-proficiency-edit {
    justify-content: center;
  }

  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .review-rating {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .my-portfolio-page {
    padding: 10px;
  }

  .portfolio-header {
    padding: 20px;
  }

  .profile-section {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .reviewer-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
  }

  .reviewer-avatar {
    width: 36px;
    height: 36px;
  }

  .review-card {
    padding: 16px;
  }
}
</style>
