<template>
  <section class="skills-section">
    <div class="section-border">
      <div class="section-header">
        <h5 class="section-title">기술 스택</h5>
      </div>
      
      <div v-if="skills && skills.length > 0" class="skills-container">
        <div class="skills-grid">
          <div 
            v-for="(skill, index) in skills" 
            :key="index"
            class="skill-item"
          >
            <div class="skill-content">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
            <div v-if="skill.proficiency" class="skill-level">
              <span class="level-indicator">{{ getProficiencyLevel(skill.proficiency) }}</span>
            </div>
            <div v-if="skill.proficiency" class="skill-rating">
              <div class="stars">
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
      </div>
      
      <div v-else class="empty-state">
        <p class="empty-message">기술 스택 정보가 없습니다.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
// Props
const props = defineProps({
  skills: {
    type: Array,
    default: () => []
  }
})

// 숙련도 레벨을 문자로 변환
const getProficiencyLevel = (proficiency) => {
  if (proficiency >= 5) return 'S'
  if (proficiency >= 4) return 'A'
  if (proficiency >= 3) return 'B'
  if (proficiency >= 2) return 'C'
  return 'D'
}
</script>

<style scoped>
.skills-section {
  width: 100%;
  max-width: 1060px;
  align-self: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.section-border {
  display: flex;
  min-height: 104px;
  padding: 4px 0 36px 0;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-top: 4px solid #4CAF50;
  position: relative;
  width: 100%;
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.section-title {
  display: flex;
  width: auto;
  height: 17px;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 17px;
  letter-spacing: 0.6px;
  margin: 16px 0 0 4px;
  color: #38383A;
}

.skills-container {
  display: flex;
  width: 100%;
  max-width: 1000px;
  padding: 0 24px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}

.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 120px;
  padding: 20px 0;
}

.skill-item {
  display: inline-flex;
  align-items: center;
  gap: 0;
  border-radius: 25px;
  border: 2px solid rgba(76, 175, 80, 0.3);
  background: #FFF;
  height: 40px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.15);
  flex-shrink: 0;
}

.skill-item:hover {
  border-color: #4CAF50;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.25);
}

.skill-content {
  display: flex;
  padding: 8px 16px;
  align-items: center;
  justify-content: center;
  min-width: 0;
}

.skill-name {
  color: #38383A;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.skill-level {
  display: flex;
  padding: 0;
  align-items: center;
  justify-content: center;
  border-left: 2px solid rgba(76, 175, 80, 0.3);
  background: rgba(76, 175, 80, 0.1);
  border-radius: 0 23px 23px 0;
  width: 40px;
  height: 100%;
  flex-shrink: 0;
}

.level-indicator {
  color: #4CAF50;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 1;
  text-align: center;
}

.skill-rating {
  display: flex;
  align-items: center;
  padding: 0 8px;
  flex-shrink: 0;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  color: #e0e0e0;
  transition: color 0.2s ease;
}

.star.filled {
  color: #ffc107;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 40px 20px;
  position: relative;
  box-sizing: border-box;
}

.empty-message {
  color: #6F6F72;
  text-align: center;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.2px;
  margin: 0;
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .skills-container {
    padding: 0 16px;
  }
  
  .skills-grid {
    gap: 10px;
    padding: 15px 0;
  }
  
  .skill-item {
    height: 36px;
  }
  
  .skill-content {
    padding: 6px 12px;
  }
  
  .skill-level {
    width: 36px;
  }
  
  .skill-name {
    font-size: 13px;
  }
  
  .level-indicator {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .skills-container {
    padding: 0 12px;
  }
  
  .skills-grid {
    gap: 8px;
    padding: 12px 0;
  }
  
  .skill-item {
    height: 32px;
  }
  
  .skill-content {
    padding: 4px 10px;
  }
  
  .skill-level {
    width: 32px;
  }
  
  .skill-name {
    font-size: 12px;
  }
  
  .level-indicator {
    font-size: 12px;
  }
}
</style>