<template>
  <div class="my-portfolio-page">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>포트폴리오를 불러오는 중...</p>
    </div>

    <div v-else-if="!portfolioData.userInfo" class="empty-portfolio-state">
      <div class="empty-icon">
        <i class="bi bi-person-plus"></i>
      </div>
      <h3>포트폴리오를 작성해보세요</h3>
      <p>나만의 포트폴리오를 만들어 더 많은 기회를 얻어보세요.</p>
      <button @click="createPortfolio" class="create-button">
        <i class="bi bi-plus-circle"></i>
        포트폴리오 작성하기
      </button>
    </div>

    <div v-else class="portfolio-container">
      <div class="portfolio-header">
        <div class="header-content">
          <div class="profile-section">
            <div class="profile-image">
              <img :src="portfolioData.userInfo.avatar" :alt="portfolioData.userInfo.name" />
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
                  <input 
                    v-model="education.institution" 
                    placeholder="기관명"
                    class="edit-input"
                  />
                  <input 
                    v-model="education.program" 
                    placeholder="전공/과정"
                    class="edit-input"
                  />
                  <input 
                    v-model="education.startDate" 
                    type="month"
                    class="edit-input"
                  />
                  <input 
                    v-model="education.endDate" 
                    type="month"
                    class="edit-input"
                    :disabled="education.isOngoing"
                  />
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
                  <input 
                    v-model="career.company" 
                    placeholder="회사명"
                    class="edit-input"
                  />
                  <input 
                    v-model="career.position" 
                    placeholder="직책/부서"
                    class="edit-input"
                  />
                  <input 
                    v-model="career.startDate" 
                    type="month"
                    class="edit-input"
                    placeholder="시작일"
                  />
                  <input 
                    v-model="career.endDate" 
                    type="month"
                    class="edit-input"
                    placeholder="종료일"
                    :disabled="career.isCurrent"
                  />
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
            <button @click="goToProjectManagement" class="section-edit-btn">
              <i class="bi bi-gear"></i>
              관리
            </button>
          </div>
          
          <div v-if="portfolioData.projects.length > 0" class="section-content">
            <div class="projects-grid">
              <div 
                v-for="project in portfolioData.projects.slice(0, 6)" 
                :key="project.id"
                class="project-card"
              >
                <h6 class="project-title">{{ project.title }}</h6>
                <p class="project-role">{{ project.role }}</p>
              </div>
              
              <div v-if="portfolioData.projects.length > 6" class="more-projects-card">
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { portfolioApi, techStackApi } from '@/api/portfolio.js'

const router = useRouter()

// 목업 기술 스택 데이터베이스 (실제로는 API에서 가져올 데이터)
const mockSkillDatabase = [
  { name: 'JavaScript', category: '언어' },
  { name: 'TypeScript', category: '언어' },
  { name: 'Python', category: '언어' },
  { name: 'Java', category: '언어' },
  { name: 'C++', category: '언어' },
  { name: 'Go', category: '언어' },
  { name: 'Rust', category: '언어' },
  { name: 'Swift', category: '언어' },
  { name: 'Kotlin', category: '언어' },
  { name: 'C#', category: '언어' },
  { name: 'React', category: '프론트엔드' },
  { name: 'Vue.js', category: '프론트엔드' },
  { name: 'Angular', category: '프론트엔드' },
  { name: 'Svelte', category: '프론트엔드' },
  { name: 'Next.js', category: '프론트엔드' },
  { name: 'Nuxt.js', category: '프론트엔드' },
  { name: 'Node.js', category: '백엔드' },
  { name: 'Express.js', category: '백엔드' },
  { name: 'Nest.js', category: '백엔드' },
  { name: 'Django', category: '백엔드' },
  { name: 'FastAPI', category: '백엔드' },
  { name: 'Spring Boot', category: '백엔드' },
  { name: 'Laravel', category: '백엔드' },
  { name: 'Ruby on Rails', category: '백엔드' },
  { name: 'MySQL', category: '데이터베이스' },
  { name: 'PostgreSQL', category: '데이터베이스' },
  { name: 'MongoDB', category: '데이터베이스' },
  { name: 'Redis', category: '데이터베이스' },
  { name: 'AWS', category: '클라우드' },
  { name: 'Azure', category: '클라우드' },
  { name: 'GCP', category: '클라우드' },
  { name: 'Docker', category: '데브옵스' },
  { name: 'Kubernetes', category: '데브옵스' },
  { name: 'Jenkins', category: '데브옵스' },
  { name: 'GitHub Actions', category: '데브옵스' },
  { name: 'Terraform', category: '데브옵스' },
  { name: 'Tailwind CSS', category: 'CSS' },
  { name: 'Styled Components', category: 'CSS' },
  { name: 'Material UI', category: 'CSS' },
  { name: 'Bootstrap', category: 'CSS' },
  { name: 'SASS', category: 'CSS' },
  { name: 'GraphQL', category: 'API' },
  { name: 'REST API', category: 'API' },
  { name: 'gRPC', category: 'API' },
  { name: 'Figma', category: '디자인' },
  { name: 'Adobe XD', category: '디자인' },
  { name: 'Sketch', category: '디자인' },
  { name: 'Git', category: '버전관리' },
  { name: 'GitHub', category: '버전관리' },
  { name: 'GitLab', category: '버전관리' }
]

const loading = ref(true)
const editMode = ref(null) // null, 'introduction', 'education', 'career', 'skills'
const showSaveToast = ref(false)
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

// 포트폴리오 통계
const portfolioStats = reactive({
  views: 1247,
  likes: 89,
  contacts: 23
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
    // 포트폴리오 데이터와 전체 기술 스택 목록을 병렬로 로드
    const [portfolioResponse, techStacksResponse] = await Promise.all([
      portfolioApi.getPortfolio(),
      techStackApi.getAllTechStacks()
    ])
    
    // 포트폴리오 데이터 설정
    const portfolio = portfolioResponse.data
    if (portfolio && portfolio.userInfo) {
      // 사용자 기본 정보 설정
      portfolioData.userId = portfolio.userId
      portfolioData.userInfo = {
        name: portfolio.userInfo.name || '사용자',
        jobTitle: portfolio.userInfo.jobTitle || '',
        avatar: portfolio.userInfo.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${portfolio.userId}`,
        category: portfolio.userInfo.category || ''
      }
      portfolioData.introduction = portfolio.introduction || ''
      portfolioData.projects = portfolio.projects || []
      
      // 기술 스택 데이터를 프론트엔드 형식으로 변환
      portfolioData.skills = portfolio.techStacks?.map(ts => ({
        userTechStackId: ts.userTechStackId,
        stackId: ts.stackId,
        name: ts.stackName,
        proficiency: ts.skillLevel
      })) || []
      
      // 교육 정보 변환 (LocalDate -> YYYY-MM 형식)
      portfolioData.educations = portfolio.educations?.map(edu => ({
        educationId: edu.educationId,
        institution: edu.institution,
        program: edu.program,
        startDate: edu.startDate ? edu.startDate.substring(0, 7) : '', // YYYY-MM-DD -> YYYY-MM
        endDate: edu.endDate ? edu.endDate.substring(0, 7) : '',
        isOngoing: edu.isCurrent || false
      })) || []
      
      // 경력 정보 변환 (백엔드 필드명과 매핑)
      portfolioData.careers = portfolio.experiences?.map(exp => ({
        experienceId: exp.experienceId,
        company: exp.companyName, // companyName -> company
        position: exp.department, // department -> position
        startDate: exp.startDate ? exp.startDate.substring(0, 7) : '', // YYYY-MM-DD -> YYYY-MM
        endDate: exp.endDate ? exp.endDate.substring(0, 7) : '',
        isCurrent: exp.isCurrent || false,
        description: exp.summary || '' // summary -> description
      })) || []
    }
    
    // 전체 기술 스택 목록 설정 (검색용)
    allTechStacks.value = techStacksResponse.data?.map(ts => ({
      stackId: ts.stackId,
      name: ts.name,
      category: ts.category || '기타'
    })) || []
    
  } catch (error) {
    console.error('포트폴리오 데이터 로드 실패:', error)
    
    // 백엔드 연결 실패 시 기본값 설정 (목업 데이터 대신)
    portfolioData.userId = 1
    portfolioData.userInfo = {
      name: '사용자',
      jobTitle: '',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      category: ''
    }
    
    // 목업 기술 스택 데이터를 allTechStacks에 설정 (검색용)
    allTechStacks.value = mockSkillDatabase
    
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
            await portfolioApi.updateTechStack(newSkill.userTechStackId, {
              stackId: newSkill.stackId,
              skillLevel: newSkill.proficiency
            })
          }
        } else {
          // 새 기술 스택 추가
          const response = await portfolioApi.addTechStack({
            stackId: newSkill.stackId,
            skillLevel: newSkill.proficiency
          })
          newSkill.userTechStackId = response.data.userTechStackId
        }
      }
      
      portfolioData.skills = JSON.parse(JSON.stringify(editData.skills))
    } else {
      // 다른 필드들은 통합 포트폴리오 업데이트 API 사용
      const updateData = {}
      
      switch (field) {
        case 'introduction':
          updateData.introduction = editData.introduction
          await portfolioApi.updatePortfolio(updateData)
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

// 교육 이력 관련 메서드
const addEducation = () => {
  if (!editMode.value) {
    startEdit('education')
  }
  
  if (!editData.educations) {
    editData.educations = []
  }
  
  editData.educations.push({
    educationId: null, // 새로 추가하는 교육 정보
    institution: '',
    program: '',
    startDate: '',
    endDate: '',
    isOngoing: false
  })
}

const removeEducation = (index) => {
  editData.educations.splice(index, 1)
}

const handleOngoingToggle = (index, type) => {
  if (type === 'education') {
    if (editData.educations[index].isOngoing) {
      editData.educations[index].endDate = ''
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
  
  editData.careers.push({
    experienceId: null, // 새로 추가하는 경력 정보
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  })
}

const removeCareer = (index) => {
  editData.careers.splice(index, 1)
}

const handleCurrentToggle = (index) => {
  if (editData.careers[index].isCurrent) {
    editData.careers[index].endDate = ''
  }
}

// 기술 스택 관련 메서드
const addSkill = () => {
  const skillName = newSkill.value.trim()
  if (skillName && !editData.skills.some(s => s.name === skillName)) {
    // 검색 결과에서 stackId 찾기
    const searchResults = allTechStacks.value.length > 0 ? allTechStacks.value : mockSkillDatabase
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

// 교육 정보 저장 함수
const saveEducations = async () => {
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
        endDate: response.data.endDate ? response.data.endDate.substring(0, 7) : ''
      })
    } else {
      // 새 교육 정보 추가
      const response = await portfolioApi.addEducation(eduData)
      newEdu.educationId = response.data.educationId
      newEdu.startDate = response.data.startDate ? response.data.startDate.substring(0, 7) : ''
      newEdu.endDate = response.data.endDate ? response.data.endDate.substring(0, 7) : ''
    }
  }
  
  portfolioData.educations = JSON.parse(JSON.stringify(editData.educations))
}

// 경력 정보 저장 함수
const saveExperiences = async () => {
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
        : mockSkillDatabase // 백엔드 연동 실패 시 목업 데이터 사용
      
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

const createPortfolio = () => {
  // 포트폴리오 생성 로직
  portfolioData.userInfo = {
    name: '새 사용자',
    jobTitle: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=new',
    category: ''
  }
  portfolioData.introduction = ''
  portfolioData.skills = []
  portfolioData.educations = []
  portfolioData.careers = []
  portfolioData.projects = []
}

const viewPublicPortfolio = () => {
  router.push(`/portfolio/${portfolioData.userId}`)
}

const goToProjectManagement = () => {
  router.push('/myPage/projects')
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

.project-title {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
}

.project-role {
  font-size: 12px;
  color: #666;
  margin: 0;
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
}
</style>