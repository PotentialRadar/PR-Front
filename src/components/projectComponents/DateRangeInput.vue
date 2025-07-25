<template>
  <div class="date-range-container">
    <div class="date-inputs">
      <div :class="['date-input-wrapper', { 'error': error }]">
        <i class="bi bi-calendar3"></i>
        <input
          type="date"
          v-model="localDateRange.startDate"
          @input="updateDates"
          @blur="$emit('blur')"
          class="date-input"
          placeholder="2025년 07월 23일"
          :aria-invalid="!!error"
        />
        <label class="date-label">시작일</label>
      </div>

      <span class="date-separator">~</span>

      <div :class="['date-input-wrapper', { 'error': error }]">
        <i class="bi bi-calendar3"></i>
        <input
          type="date"
          v-model="localDateRange.endDate"
          @input="updateDates"
          @blur="$emit('blur')"
          class="date-input"
          placeholder="2025년 07월 24일"
          :aria-invalid="!!error"
        />
        <label class="date-label">종료일</label>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch } from 'vue'

export default {
  name: 'DateRangeInput',
  props: {
    modelValue: {
      type: Object,
      default: () => ({
        startDate: '',
        endDate: ''
      })
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'blur'],
  setup(props, { emit }) {
    const localDateRange = reactive({
      startDate: props.modelValue.startDate || '',
      endDate: props.modelValue.endDate || ''
    })

    const updateDates = () => {
      emit('update:modelValue', { ...localDateRange })
    }

    watch(() => props.modelValue, (newValue) => {
      localDateRange.startDate = newValue.startDate || ''
      localDateRange.endDate = newValue.endDate || ''
    }, { deep: true })

    return {
      localDateRange,
      updateDates
    }
  }
}
</script>

<style scoped>
.date-range-container {
  display: flex;
  align-items: center;
  align-self: stretch;
  position: relative;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.date-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  border-radius: 8px;
  background: var(--color-white-solid, #FFF);
  flex: 1;
  position: relative;
  transition: all 0.3s ease;
}

.date-input-wrapper:focus-within {
  border-color: var(--www-freemoa-net-pumpkin, #FF7D12);
  box-shadow: 0 0 0 3px rgba(255, 125, 18, 0.1);
  transform: translateY(-1px);
}

.date-input-wrapper.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.date-input-wrapper i {
  color: var(--color-grey-67, #AAA);
  font-size: 16px;
  transition: color 0.3s ease;
}

.date-input-wrapper:focus-within i {
  color: var(--www-freemoa-net-pumpkin, #FF7D12);
}

.date-input-wrapper.error i {
  color: #dc3545;
}

.date-input {
  border: none;
  outline: none;
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 15px;
  color: var(--color-grey-15, #262626);
  background: transparent;
  flex: 1;
  min-width: 0;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.date-input::placeholder {
  color: var(--color-grey-67, #AAA);
}

.date-label {
  position: absolute;
  top: -8px;
  left: 12px;
  background: var(--color-white-solid, #FFF);
  padding: 0 4px;
  font-size: 12px;
  color: var(--color-grey-67, #AAA);
  font-weight: 500;
  transition: color 0.3s ease;
}

.date-input-wrapper:focus-within .date-label {
  color: var(--www-freemoa-net-pumpkin, #FF7D12);
}

.date-input-wrapper.error .date-label {
  color: #dc3545;
}

.date-separator {
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 500;
  margin: 0 5px;
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .date-inputs {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .date-separator {
    align-self: center;
    transform: rotate(90deg);
    font-size: 16px;
    margin: 5px 0;
  }

  .date-input-wrapper {
    padding: 12px 14px;
  }

  .date-input {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

@media (max-width: 480px) {
  .date-inputs {
    gap: 10px;
  }

  .date-input-wrapper {
    padding: 10px 12px;
  }

  .date-label {
    font-size: 11px;
    top: -6px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .date-input-wrapper {
    border-width: 3px;
  }
}
</style>
