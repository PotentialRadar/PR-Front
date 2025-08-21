<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>🔧 기술스택 설정</h3>
        <button @click="$emit('close')" class="close-button">✕</button>
      </div>
      
      <div class="modal-body">
        <div class="instruction">
          <p>현재 보유하고 있는 기술스택과 숙련도를 설정해주세요. AI가 이를 바탕으로 맞춤형 프로젝트를 추천해드립니다.</p>
        </div>

        <!-- 기술스택 검색 -->
        <div class="search-section">
          <div class="search-input-container">
            <input 
              v-model="searchTerm"
              @input="handleSearch"
              type="text" 
              placeholder="기술스택을 검색하세요 (예: React, Java, Python...)"
              class="search-input"
            />
            <span class="search-icon">🔍</span>
          </div>
          
          <!-- 검색 결과 -->
          <div v-if="searchResults.length > 0" class="search-results">
            <div 
              v-for="tech in searchResults" 
              :key="tech"
              @click="addTechStack(tech)"
              class="search-result-item"
            >
              {{ tech }}
            </div>
          </div>
        </div>

        <!-- 카테고리별 추천 기술스택 -->
        <div class="categories-section">
          <div class="category-tabs">
            <button 
              v-for="category in techCategories" 
              :key="category.name"
              @click="selectedCategory = category.name"
              class="category-tab"
              :class="{ active: selectedCategory === category.name }"
            >
              {{ category.icon }} {{ category.name }}
            </button>
          </div>
          
          <div class="category-techs">
            <button
              v-for="tech in getCurrentCategoryTechs()"
              :key="tech"
              @click="addTechStack(tech)"
              class="tech-option"
              :disabled="isAlreadyAdded(tech)"
            >
              {{ tech }}
              <span v-if="isAlreadyAdded(tech)" class="added-mark">✓</span>
            </button>
          </div>
        </div>

        <!-- 선택된 기술스택 -->
        <div class="selected-section">
          <h4>선택된 기술스택 ({{ selectedTechStacks.length }}개)</h4>
          
          <div v-if="selectedTechStacks.length === 0" class="empty-selection">
            <p>아직 기술스택이 선택되지 않았습니다.</p>
          </div>
          
          <div v-else class="selected-techs">
            <div 
              v-for="(tech, index) in selectedTechStacks" 
              :key="index"
              class="selected-tech-item"
            >
              <div class="tech-info">
                <span class="tech-name">{{ tech.name }}</span>
                <div class="level-selector">
                  <label class="level-label">숙련도:</label>
                  <select v-model="tech.level" class="level-select">
                    <option value="1">1 (초급)</option>
                    <option value="2">2 (초중급)</option>
                    <option value="3">3 (중급)</option>
                    <option value="4">4 (중고급)</option>
                    <option value="5">5 (고급)</option>
                  </select>
                </div>
              </div>
              <button @click="removeTechStack(index)" class="remove-button">
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('close')" class="cancel-button">
          취소
        </button>
        <button 
          @click="handleSave" 
          class="save-button"
          :disabled="selectedTechStacks.length === 0"
        >
          저장하기 ({{ selectedTechStacks.length }}개)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  initialTechStacks: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'save'])

// 반응형 데이터
const searchTerm = ref('')
const searchResults = ref([])
const selectedCategory = ref('Frontend')
const selectedTechStacks = reactive([])

// 기술스택 데이터
const allTechStacks = [
  // Frontend
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 
  'Svelte', 'Next.js', 'Nuxt.js', 'Tailwind CSS', 'Bootstrap', 'SCSS',
  
  // Backend
  'Java', 'Spring Boot', 'Python', 'Django', 'FastAPI', 'Node.js', 'Express',
  'Go', 'Rust', 'C#', '.NET Core', 'PHP', 'Laravel', 'Ruby', 'Rails',
  
  // Mobile
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS', 'Xamarin',
  
  // Database
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'MariaDB',
  
  // DevOps/Infra
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins',
  'GitLab CI', 'GitHub Actions', 'Nginx', 'Apache',
  
  // AI/ML
  'TensorFlow', 'PyTorch', 'scikit-learn', 'NLP', 'OpenCV', 'Pandas', 'NumPy'
]

const techCategories = [
  {
    name: 'Frontend',
    icon: '🎨',
    techs: ['React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Svelte', 'Next.js', 'Nuxt.js', 'Tailwind CSS', 'Bootstrap', 'SCSS']
  },
  {
    name: 'Backend',
    icon: '⚙️',
    techs: ['Java', 'Spring Boot', 'Python', 'Django', 'FastAPI', 'Node.js', 'Express', 'Go', 'Rust', 'C#', '.NET Core', 'PHP', 'Laravel', 'Ruby', 'Rails']
  },
  {
    name: 'Mobile',
    icon: '📱',
    techs: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Android', 'iOS', 'Xamarin']
  },
  {
    name: 'Database',
    icon: '🗄️',
    techs: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'MariaDB']
  },
  {
    name: 'DevOps',
    icon: '🚀',
    techs: ['Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Terraform', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'Nginx', 'Apache']
  },
  {
    name: 'AI/ML',
    icon: '🤖',
    techs: ['TensorFlow', 'PyTorch', 'scikit-learn', 'NLP', 'OpenCV', 'Pandas', 'NumPy']
  }
]

// 메서드
const handleSearch = () => {
  if (searchTerm.value.trim() === '') {
    searchResults.value = []
    return
  }
  
  const term = searchTerm.value.toLowerCase()
  searchResults.value = allTechStacks.filter(tech => 
    tech.toLowerCase().includes(term) && !isAlreadyAdded(tech)
  ).slice(0, 8)
}

const getCurrentCategoryTechs = () => {
  const category = techCategories.find(cat => cat.name === selectedCategory.value)
  return category ? category.techs : []
}

const addTechStack = (techName) => {
  if (isAlreadyAdded(techName)) return
  
  selectedTechStacks.push({
    name: techName,
    level: 3 // 기본값은 중급
  })
  
  // 검색 결과 초기화
  searchTerm.value = ''
  searchResults.value = []
}

const removeTechStack = (index) => {
  selectedTechStacks.splice(index, 1)
}

const isAlreadyAdded = (techName) => {
  return selectedTechStacks.some(tech => tech.name === techName)
}

const handleSave = () => {
  if (selectedTechStacks.length === 0) return
  
  emit('save', [...selectedTechStacks])
}

// 라이프사이클
onMounted(() => {
  // 초기 기술스택이 있으면 설정
  if (props.initialTechStacks && props.initialTechStacks.length > 0) {
    selectedTechStacks.splice(0, selectedTechStacks.length, ...props.initialTechStacks)
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: modalSlide 0.3s ease-out;
}

@keyframes modalSlide {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.instruction {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.instruction p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.search-section {
  margin-bottom: 24px;
  position: relative;
}

.search-input-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #28a745;
}

.search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e9ecef;
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
}

.search-result-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-bottom: 1px solid #f8f9fa;
}

.search-result-item:hover {
  background: #f8f9fa;
}

.search-result-item:last-child {
  border-bottom: none;
}

.categories-section {
  margin-bottom: 24px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.category-tab {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-tab:hover {
  background: #e9ecef;
}

.category-tab.active {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border-color: transparent;
}

.category-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-option {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tech-option:hover:not(:disabled) {
  background: #e9ecef;
  transform: translateY(-1px);
}

.tech-option:disabled {
  background: #28a745;
  color: white;
  cursor: not-allowed;
}

.added-mark {
  margin-left: 4px;
  font-weight: bold;
}

.selected-section {
  margin-bottom: 24px;
}

.selected-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

.empty-selection {
  text-align: center;
  padding: 40px 20px;
  color: #666;
  background: #f8f9fa;
  border-radius: 8px;
}

.empty-selection p {
  margin: 0;
}

.selected-techs {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.selected-tech-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  transition: background 0.2s ease;
}

.selected-tech-item:hover {
  background: #e9ecef;
}

.tech-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.tech-name {
  font-weight: 600;
  color: #333;
  min-width: 100px;
}

.level-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.level-select {
  padding: 4px 8px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
}

.level-select:focus {
  outline: none;
  border-color: #28a745;
}

.remove-button {
  background: #dc3545;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: #c82333;
  transform: scale(1.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.cancel-button {
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.cancel-button:hover {
  background: #5a6268;
}

.save-button {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
}

.save-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 20px;
  }
  
  .tech-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .level-selector {
    width: 100%;
    justify-content: space-between;
  }
  
  .category-tabs {
    justify-content: center;
  }
  
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .modal-footer button {
    width: 100%;
  }
}
</style>