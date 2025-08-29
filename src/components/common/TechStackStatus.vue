<template>
  <div class="tech-stack-status" v-if="techStacks.length > 0">
    <div class="status-header">
      <h3>현재 설정된 기술스택</h3>
      <button @click="$emit('edit')" class="edit-button">
        편집
      </button>
    </div>
    <div class="tech-stack-list">
      <div 
        v-for="tech in techStacks" 
        :key="tech.name"
        class="tech-item"
      >
        <span class="tech-name">{{ tech.name }}</span>
        <span class="tech-level">Lv.{{ tech.level }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  techStacks: {
    type: Array,
    default: () => []
  }
})

defineEmits(['edit'])
</script>

<style scoped>
.tech-stack-status {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.status-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
}

.edit-button {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #495057;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button:hover {
  background: #e9ecef;
}

.tech-stack-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.tech-item {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tech-level {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.8rem;
}
</style>