<template>
  <div class="file-upload-area">
    <div
      :class="['upload-zone', { 'dragover': isDragOver, 'error': error }]"
      @click="triggerFileInput"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
    >
      <div class="upload-content">
        <div class="upload-icon">
          <i class="bi bi-cloud-upload upload-icon-svg"></i>
        </div>
        <div class="upload-text">
          <p class="upload-primary">
            <strong>클릭하여 파일 선택</strong> 또는 파일을 여기로 드래그하세요
          </p>
          <p class="upload-secondary">
            PDF, DOC, PPT, 이미지 파일 등 (최대 5MB)
          </p>
          <p class="upload-formats">
            지원 형식: .pdf, .doc, .docx, .ppt, .pptx, .jpg, .png, .gif
          </p>
        </div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      multiple
      @change="handleFileSelect"
      accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
      style="display: none;"
      :aria-describedby="error ? 'file-error' : undefined"
    />

    <div v-if="selectedFiles.length > 0" class="file-list">
      <div class="file-list-header">
        <h4 class="file-list-title">첨부된 파일 ({{ selectedFiles.length }}개)</h4>
        <button @click="clearAllFiles" class="clear-all-btn">
          <i class="bi bi-trash"></i>
          모두 삭제
        </button>
      </div>

      <div
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="file-item"
      >
        <div class="file-info">
          <i :class="getFileIcon(file)" class="file-icon"></i>
          <div class="file-details">
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ formatFileSize(file.size) }}</span>
          </div>
        </div>
        <button @click="removeFile(index)" class="remove-file" :aria-label="`${file.name} 삭제`">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

export default {
  name: 'FileUploadArea',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    maxFileSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5MB
    },
    error: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const fileInput = ref(null)
    const selectedFiles = ref([...props.modelValue])
    const isDragOver = ref(false)
    const toast = useToast()

    const triggerFileInput = () => {
      fileInput.value?.click()
    }

    const handleFileSelect = (event) => {
      const files = Array.from(event.target.files || [])
      addFiles(files)
      event.target.value = '' // Reset input
    }

    const handleDragOver = () => {
      isDragOver.value = true
    }

    const handleDragLeave = () => {
      isDragOver.value = false
    }

    const handleDrop = (event) => {
      isDragOver.value = false
      const files = Array.from(event.dataTransfer.files || [])
      addFiles(files)
    }

    const addFiles = (files) => {
      const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png', '.gif']
      const validFiles = []
      const errors = []

      files.forEach(file => {
        const extension = '.' + file.name.split('.').pop().toLowerCase()

        if (!allowedTypes.includes(extension)) {
          errors.push(`지원하지 않는 파일 형식: ${file.name}`)
          return
        }

        if (file.size > props.maxFileSize) {
          errors.push(`파일 크기가 너무 큽니다 (최대 5MB): ${file.name}`)
          return
        }

        // Check for duplicates
        const isDuplicate = selectedFiles.value.some(existingFile =>
          existingFile.name === file.name && existingFile.size === file.size
        )

        if (isDuplicate) {
          errors.push(`이미 추가된 파일입니다: ${file.name}`)
          return
        }

        validFiles.push(file)
      })

      if (errors.length > 0) {
        errors.forEach(error => toast.error(error));
      }

      if (validFiles.length > 0) {
        selectedFiles.value.push(...validFiles)
        emit('update:modelValue', [...selectedFiles.value])
        emit('change', [...selectedFiles.value])
      }
    }

    const removeFile = (index) => {
      selectedFiles.value.splice(index, 1)
      emit('update:modelValue', [...selectedFiles.value])
      emit('change', [...selectedFiles.value])
    }

    const clearAllFiles = () => {
      selectedFiles.value = []
      emit('update:modelValue', [])
      emit('change', [])
    }

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const getFileIcon = (file) => {
      const extension = file.name.split('.').pop().toLowerCase()

      const iconMap = {
        pdf: 'bi-file-earmark-pdf',
        doc: 'bi-file-earmark-word',
        docx: 'bi-file-earmark-word',
        ppt: 'bi-file-earmark-ppt',
        pptx: 'bi-file-earmark-ppt',
        jpg: 'bi-file-earmark-image',
        jpeg: 'bi-file-earmark-image',
        png: 'bi-file-earmark-image',
        gif: 'bi-file-earmark-image'
      }

      return iconMap[extension] || 'bi-file-earmark'
    }

    watch(() => props.modelValue, (newValue) => {
      selectedFiles.value = [...newValue]
    }, { deep: true })

    return {
      fileInput,
      selectedFiles,
      isDragOver,
      triggerFileInput,
      handleFileSelect,
      handleDragOver,
      handleDragLeave,
      handleDrop,
      removeFile,
      clearAllFiles,
      formatFileSize,
      getFileIcon
    }
  }
}
</script>

<style scoped>
.file-upload-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
  position: relative;
}

.upload-zone {
  display: flex;
  padding: 40px 24px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  border-radius: 12px;
  border: 2px dashed var(--color-grey-86, #DCDCDC);
  background: var(--color-grey-96, #F6F6F6);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 160px;
  justify-content: center;
}

.upload-zone:hover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(76, 175, 80, 0.15);
}

.upload-zone.dragover {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
  transform: scale(1.02);
  box-shadow: 0 10px 30px rgba(76, 175, 80, 0.2);
}

.upload-zone.error {
  border-color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.upload-icon {
  display: flex;
  width: 64px;
  height: 64px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #4CAF50;
  color: var(--color-white-solid, #FFF);
  transition: all 0.3s ease;
}

.upload-zone:hover .upload-icon {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.3);
}

.upload-icon-svg {
  font-size: 28px;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 400px;
}

.upload-primary {
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
}

.upload-secondary {
  color: var(--color-grey-67, #AAA);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
}

.upload-formats {
  color: var(--color-grey-67, #AAA);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
  opacity: 0.8;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-self: stretch;
}

.file-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-grey-90, #E5E5E5);
}

.file-list-title {
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.clear-all-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: none;
  border: 1px solid var(--color-grey-85, #D9D9D9);
  border-radius: 6px;
  color: var(--color-grey-67, #AAA);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all-btn:hover {
  background: #dc3545;
  border-color: #dc3545;
  color: white;
}

.file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 1px solid var(--color-grey-85, #D9D9D9);
  border-radius: 8px;
  background: var(--color-white-solid, #FFF);
  transition: all 0.3s ease;
}

.file-item:hover {
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
  transform: translateY(-1px);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  color: #4CAF50;
  font-size: 20px;
  flex-shrink: 0;
}

.file-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.file-name {
  color: var(--color-grey-15, #262626);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  color: var(--color-grey-67, #AAA);
  font-family: 'Lato', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
}

.remove-file {
  display: flex;
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-grey-67, #AAA);
  border-radius: 6px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-file:hover {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  transform: scale(1.1);
}

/* Mobile Responsive Design */
@media (max-width: 768px) {
  .upload-zone {
    padding: 30px 20px;
    min-height: 140px;
  }

  .upload-content {
    gap: 12px;
  }

  .upload-icon {
    width: 48px;
    height: 48px;
  }

  .upload-icon-svg {
    font-size: 24px;
  }

  .upload-primary {
    font-size: 15px;
  }

  .upload-secondary {
    font-size: 13px;
  }

  .upload-formats {
    font-size: 11px;
  }

  .file-item {
    padding: 10px 12px;
  }

  .file-info {
    gap: 10px;
  }

  .file-icon {
    font-size: 18px;
  }

  .file-name {
    font-size: 13px;
  }

  .file-size {
    font-size: 11px;
  }

  .remove-file {
    width: 28px;
    height: 28px;
  }

  .file-list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .clear-all-btn {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .upload-zone {
    padding: 24px 16px;
    min-height: 120px;
  }

  .upload-content {
    gap: 10px;
  }

  .upload-icon {
    width: 40px;
    height: 40px;
  }

  .upload-icon-svg {
    font-size: 20px;
  }

  .upload-primary {
    font-size: 14px;
  }

  .upload-secondary, .upload-formats {
    font-size: 12px;
  }

  .file-item {
    padding: 8px 10px;
  }

  .file-details {
    gap: 1px;
  }

  .file-name {
    font-size: 12px;
  }

  .file-size {
    font-size: 10px;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .upload-zone {
    border-width: 3px;
  }

  .file-item {
    border-width: 2px;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .upload-zone, .file-item, .upload-icon {
    transition: none;
  }

  .upload-zone:hover, .file-item:hover {
    transform: none;
  }
}
</style>