import { ref, reactive, computed } from 'vue'

export function useFormValidation() {
  const errors = reactive({})
  const isSubmitting = ref(false)
  const submitAttempted = ref(false)

  // Korean error messages
  const errorMessages = {
    required: '필수 입력 항목입니다.',
    email: '올바른 이메일 주소를 입력해주세요.',
    minLength: (min) => `최소 ${min}자 이상 입력해주세요.`,
    maxLength: (max) => `최대 ${max}자까지 입력 가능합니다.`,
    dateRange: '종료일은 시작일보다 늦어야 합니다.',
    fileSize: '파일 크기는 5MB 이하여야 합니다.',
    fileType: '지원하지 않는 파일 형식입니다.',
    personnel: {
      min: '최소 1명 이상이어야 합니다.',
      max: '최대 99명까지 가능합니다.'
    },
    techStack: '최소 1개 이상의 기술을 선택해주세요.'
  }

  // Validation rules
  const rules = {
    required: (value) => {
      if (Array.isArray(value)) return value.length > 0 ? true : '필수 입력 항목입니다.'
      if (typeof value === 'object' && value !== null) {
        return Object.values(value).some(v => v && v.toString().trim() !== '') ? true : '필수 입력 항목입니다.'
      }
      return value !== null && value !== undefined && value.toString().trim() !== ''
          ? true
          : '필수 입력 항목입니다.'
    },
    
    email: (value) => {
      if (!value) return true // Let required rule handle empty values
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    },
    
    minLength: (min) => (value) => {
      if (!value) return true
      return value.toString().length >= min
    },
    
    maxLength: (max) => (value) => {
      if (!value) return true
      return value.toString().length <= max
    },
    
    dateRange: (dateRange) => {
      if (!dateRange.startDate || !dateRange.endDate) return true
      return new Date(dateRange.endDate) > new Date(dateRange.startDate)
    },
    
    personnel: (value) => {
      const num = parseInt(value)
      return num >= 1 && num <= 99
    },
    
    techStack: (value) => {
      return Array.isArray(value) && value.length > 0
    },
    
    fileSize: (files, maxSize = 5 * 1024 * 1024) => {
      if (!files || files.length === 0) return true
      return files.every(file => file.size <= maxSize)
    },
    
    fileType: (files, allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif']) => {
      if (!files || files.length === 0) return true
      return files.every(file => {
        const extension = '.' + file.name.split('.').pop().toLowerCase()
        return allowedTypes.includes(extension)
      })
    }
  }

  // Validate single field
  const validateField = (fieldName, value, fieldRules) => {
    const fieldErrors = []

    for (const rule of fieldRules) {
      let isValid = true
      let errorMessage = ''

      if (typeof rule === 'string') {
        const result = rules[rule](value)
        isValid = result === true
        errorMessage = typeof result === 'string' ? result : errorMessages[rule]
      } else if (typeof rule === 'object') {
        const [ruleName, param] = Object.entries(rule)[0]
        const result = rules[ruleName](param)(value)
        isValid = result === true
        errorMessage = typeof result === 'string'
            ? result
            : (typeof errorMessages[ruleName] === 'function'
                ? errorMessages[ruleName](param)
                : errorMessages[ruleName])
      } else if (typeof rule === 'function') {
        const result = rule(value)
        isValid = result === true
        errorMessage = typeof result === 'string' ? result : '입력 값이 올바르지 않습니다.'
      }

      if (!isValid) {
        fieldErrors.push(errorMessage)
      }
    }

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors[0]
    } else {
      delete errors[fieldName]
    }

    return fieldErrors.length === 0
  }

  // Validate entire form
  const validateForm = (formData, validationSchema) => {
    submitAttempted.value = true
    let isValid = true
    
    Object.keys(validationSchema).forEach(fieldName => {
      const fieldRules = validationSchema[fieldName]
      const fieldValue = formData[fieldName]
      const fieldValid = validateField(fieldName, fieldValue, fieldRules)
      if (!fieldValid) isValid = false
    })
    
    return isValid
  }

  // Clear errors for field
  const clearError = (fieldName) => {
    delete errors[fieldName]
  }

  // Clear all errors
  const clearErrors = () => {
    Object.keys(errors).forEach(key => delete errors[key])
    submitAttempted.value = false
  }

  // Check if form has any errors
  const hasErrors = computed(() => Object.keys(errors).length > 0)

  // Check if field has error
  const hasError = (fieldName) => computed(() => !!errors[fieldName])

  // Get error message for field
  const getError = (fieldName) => computed(() => errors[fieldName] || '')

  return {
    errors,
    isSubmitting,
    submitAttempted,
    errorMessages,
    validateField,
    validateForm,
    clearError,
    clearErrors,
    hasErrors,
    hasError,
    getError
  }
}
