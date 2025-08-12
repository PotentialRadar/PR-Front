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
              <button @click="saveEdit('introduction')" class="save-btn">
                <i class="bi bi-check"></i>
                저장
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
                <input
                  v-model="newSkill"
                  @keyup.enter="addSkill"
                  class="edit-input"
                  placeholder="기술 스택을 입력하고 Enter를 누르세요"
                />
                <button @click="addSkill" class="add-skill-btn">
                  <i class="bi bi-plus"></i>
                </button>
              </div>
              
              <div class="skills-edit-list">
                <div 
                  v-for="(skill, index) in editData.skills" 
                  :key="`skill-${index}`"
                  class="skill-edit-tag"
                >
                  <span>{{ skill }}</span>
                  <button @click="removeSkill(index)" class="skill-remove">
                    <i class="bi bi-x"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <div class="edit-actions">
              <button @click="saveEdit('skills')" class="save-btn">
                <i class="bi bi-check"></i>
                저장
              </button>
              <button @click="cancelEdit" class="cancel-btn">
                <i class="bi bi-x"></i>
                취소
              </button>
            </div>
          </div>
          
          <div v-else-if="portfolioData.skills.length > 0" class="section-content">
            <div class="skills-list">
              <span 
                v-for="skill in portfolioData.skills" 
                :key="skill" 
                class="skill-tag"
              >
                {{ skill }}
              </span>
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
      <div v-if="showSaveToast" class="save-toast">
        <i class="bi bi-check-circle-fill"></i>
        저장되었습니다!
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const loading = ref(true)
const editMode = ref(null) // null, 'introduction', 'education', 'career', 'skills'
const showSaveToast = ref(false)
const newSkill = ref('')

// 원본 포트폴리오 데이터
const portfolioData = reactive({
  userId: 1,
  userInfo: {
    name: '김개발자',
    jobTitle: 'Senior Frontend Developer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    category: 'Frontend'
  },
  introduction: '안녕하세요! 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다. React와 Vue.js를 주력으로 사용하며, 깔끔하고 직관적인 UI/UX 구현에 열정을 가지고 있습니다.',
  skills: ['React', 'Vue.js', 'TypeScript', 'JavaScript', 'Tailwind CSS', 'Node.js', 'GraphQL', 'Figma'],
  educations: [
    {
      institution: '서울대학교',
      program: '컴퓨터공학과 학사',
      startDate: '2019-03',
      endDate: '2023-02',
      isOngoing: false
    },
    {
      institution: '패스트캠퍼스',
      program: 'React 심화 과정',
      startDate: '2023-06',
      endDate: '2023-08',
      isOngoing: false
    }
  ],
  careers: [
    {
      company: 'Tech Startup A',
      position: 'Frontend Developer',
      startDate: '2023-09',
      endDate: null,
      isCurrent: true,
      description: 'React 기반 웹 애플리케이션 개발 및 사용자 인터페이스 설계를 담당했습니다.'
    },
    {
      company: '네이버',
      position: 'Junior Frontend Developer',
      startDate: '2023-03',
      endDate: '2023-08',
      isCurrent: false,
      description: 'Vue.js를 활용한 사내 관리 시스템 개발 및 유지보수를 담당했습니다.'
    }
  ],
  projects: [
    { id: 1, title: 'E-commerce 플랫폼', role: 'Frontend Developer' },
    { id: 2, title: '관리자 대시보드', role: 'Full-stack Developer' },
    { id: 3, title: '모바일 앱 UI', role: 'UI/UX Designer' },
    { id: 4, title: 'AI 챗봇 서비스', role: 'Frontend Developer' }
  ],
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
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('포트폴리오 데이터 로드 실패:', error)
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
      editData.skills = [...portfolioData.skills]
      break
  }
  
  // 포커스 설정
  await nextTick()
  if (field === 'introduction') {
    this.$refs.introductionInput?.focus()
  }
}

const saveEdit = async (field) => {
  try {
    // API 호출 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 데이터 저장
    switch (field) {
      case 'introduction':
        portfolioData.introduction = editData.introduction
        break
      case 'education':
        portfolioData.educations = [...editData.educations]
        break
      case 'career':
        portfolioData.careers = [...editData.careers]
        break
      case 'skills':
        portfolioData.skills = [...editData.skills]
        break
    }
    
    editMode.value = null
    showSaveToast.value = true
    setTimeout(() => showSaveToast.value = false, 3000)
    
  } catch (error) {
    console.error('저장 실패:', error)
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
  const skill = newSkill.value.trim()
  if (skill && !editData.skills.includes(skill)) {
    editData.skills.push(skill)
    newSkill.value = ''
  }
}

const removeSkill = (index) => {
  editData.skills.splice(index, 1)
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
}

.save-btn:hover {
  background: #66BB6A;
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
  gap: 8px;
}

.skill-tag {
  padding: 6px 12px;
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.skills-edit {
  margin-bottom: 20px;
}

.skill-input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.skill-input-group .edit-input {
  flex: 1;
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
  flex-wrap: wrap;
  gap: 8px;
}

.skill-edit-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
  border-radius: 16px;
  color: #4CAF50;
  font-size: 13px;
  font-weight: 500;
}

.skill-remove {
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  padding: 2px;
  font-size: 12px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.skill-remove:hover {
  background: rgba(76, 175, 80, 0.2);
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
  background: #4CAF50;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  z-index: 1000;
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