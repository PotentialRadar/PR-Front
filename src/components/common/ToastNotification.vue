<template>
  <transition name="toast" appear>
    <div v-if="visible" class="toast-notification" :class="type">
      <div class="toast-content">
        <i class="toast-icon" :class="iconClass"></i>
        <span class="toast-message">{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Props
const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success', // success, info, warning, error
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

// Emits
const emit = defineEmits(['close'])

// Reactive data
const visible = ref(false)

// Computed
const iconClass = computed(() => {
  const icons = {
    success: 'bi bi-check-circle-fill',
    info: 'bi bi-info-circle-fill',
    warning: 'bi bi-exclamation-triangle-fill',
    error: 'bi bi-x-circle-fill'
  }
  return icons[props.type]
})

// Methods
const close = () => {
  visible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // Wait for animation
}

// Lifecycle
onMounted(() => {
  visible.value = true
  
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style scoped>
.toast-notification {
  position: fixed;
  top: 100px;
  right: 20px;
  background: white;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-left: 4px solid;
  z-index: 9999;
  max-width: 300px;
  min-width: 200px;
}

.toast-notification.success {
  border-left-color: #28a745;
}

.toast-notification.info {
  border-left-color: #17a2b8;
}

.toast-notification.warning {
  border-left-color: #ffc107;
}

.toast-notification.error {
  border-left-color: #dc3545;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.toast-icon {
  font-size: 16px;
}

.toast-notification.success .toast-icon {
  color: #28a745;
}

.toast-notification.info .toast-icon {
  color: #17a2b8;
}

.toast-notification.warning .toast-icon {
  color: #ffc107;
}

.toast-notification.error .toast-icon {
  color: #dc3545;
}

.toast-message {
  color: #333;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@media (max-width: 768px) {
  .toast-notification {
    top: 80px;
    left: 20px;
    right: 20px;
    max-width: none;
  }
}
</style>
