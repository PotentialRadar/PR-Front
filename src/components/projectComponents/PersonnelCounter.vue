<template>
  <div class="personnel-counter">
    <div :class="['counter-controls', { 'error': error }]">
      <button
        @click="decrementCount"
        :disabled="localCount <= min"
        class="counter-button"
        type="button"
        :aria-label="'인원 감소'"
      >
        <i class="bi bi-dash"></i>
      </button>

      <div class="counter-display">
        <span class="counter-value">{{ localCount }}</span>
        <span class="counter-unit">명</span>
      </div>

      <button
        @click="incrementCount"
        :disabled="localCount >= max"
        class="counter-button"
        type="button"
        :aria-label="'인원 증가'"
      >
        <i class="bi bi-plus"></i>
      </button>
    </div>
    <div class="counter-info">
      <span class="counter-range">{{ min }}명 - {{ max }}명</span>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'PersonnelCounter',
  props: {
    modelValue: {
      type: Number,
      default: 6
    },
    min: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 99
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const localCount = ref(props.modelValue)

    const incrementCount = () => {
      if (localCount.value < props.max) {
        localCount.value++
        emit('update:modelValue', localCount.value)
        emit('change', localCount.value)
      }
    }

    const decrementCount = () => {
      if (localCount.value > props.min) {
        localCount.value--
        emit('update:modelValue', localCount.value)
        emit('change', localCount.value)
      }
    }

    watch(() => props.modelValue, (newValue) => {
      localCount.value = newValue
    })

    return {
      localCount,
      incrementCount,
      decrementCount
    }
  }
}
</script>

<style scoped>
.personnel-counter {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  position: relative;
}

.counter-controls {
  display: flex;
  align-items: center;
  border: 2px solid var(--color-grey-85, #D9D9D9);
  border-radius: 8px;
  background: var(--color-white-solid, #FFF);
  overflow: hidden;
  transition: all 0.3s ease;
}

.counter-controls:focus-within {
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.counter-controls.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.counter-button {
  display: flex;
  width: 45px;
  height: 45px;
  justify-content: center;
  align-items: center;
  background: var(--color-white-solid, #FFF);
  border: none;
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.counter-button:hover:not(:disabled) {
  background: var(--color-grey-96, #F6F6F6);
  color: #4CAF50;
  transform: scale(1.1);
}

.counter-button:active:not(:disabled) {
  transform: scale(0.95);
}

.counter-button:disabled {
  color: var(--color-grey-67, #AAA);
  cursor: not-allowed;
  opacity: 0.5;
}

.counter-display {
  display: flex;
  width: 80px;
  height: 45px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-left: 1px solid var(--color-grey-85, #D9D9D9);
  border-right: 1px solid var(--color-grey-85, #D9D9D9);
  background: var(--color-grey-96, #F6F6F6);
}

.counter-value {
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
}

.counter-unit {
  color: var(--color-grey-67, #AAA);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.counter-info {
  display: flex;
  align-items: center;
  padding-left: 4px;
}

.counter-range {
  color: var(--color-grey-67, #AAA);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .counter-button {
    width: 42px;
    height: 42px;
    font-size: 14px;
  }

  .counter-display {
    width: 70px;
    height: 42px;
  }

  .counter-value {
    font-size: 16px;
  }

  .counter-unit {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .counter-button {
    width: 38px;
    height: 38px;
  }

  .counter-display {
    width: 60px;
    height: 38px;
  }

  .counter-value {
    font-size: 15px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .counter-controls {
    border-width: 3px;
  }

  .counter-button:hover:not(:disabled) {
    background: var(--color-grey-15, #262626);
    color: var(--color-white-solid, #FFF);
  }
}
</style>