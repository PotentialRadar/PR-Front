<template>
  <div class="project-content">
    <!-- 프로젝트 작성자 정보 섹션 -->
    <div v-if="author" class="project-author-section">
      <div class="author-info">
        <div class="author-avatar">
          <img :src="author.avatar || defaultAvatar" :alt="author.name" />
          <div v-if="author.isVerified" class="verified-badge">
            <i class="bi bi-check-circle-fill"></i>
          </div>
        </div>
        <div class="author-details">
          <div class="author-name">{{ author.name }}</div>
          <div class="author-title">{{ author.title || '프로젝트 리더' }}</div>
        </div>
        <div class="author-actions">
          <button class="contact-button" @click="contactAuthor">
            <i class="bi bi-chat-dots"></i>
            문의하기
          </button>
          <button class="portfolio-button" @click="viewPortfolio">
            <i class="bi bi-briefcase"></i>
            포트폴리오 보기
          </button>
        </div>
      </div>
    </div>

    <!-- 프로젝트 설명 -->
    <div class="project-description">
      {{ description }}
    </div>

    <!-- 사용 기술(태그) 리스트 -->
    <div v-if="tags && tags.length" class="project-tags-list">
      <div class="tags-label">사용 기술</div>
      <div class="tags-container">
        <span
          v-for="tag in tags"
          :key="tag"
          class="project-tag"
        >{{ tag }}</span>
      </div>
    </div>

    <!-- 첨부파일 섹션 -->
    <div v-if="attachments && attachments.length" class="project-attachments">
      <div class="attachments-label">
        <i class="bi bi-paperclip"></i>
        첨부파일 ({{ attachments.length }}개)
      </div>
      <div class="attachments-list">
        <div
          v-for="(file, index) in attachments"
          :key="index"
          class="attachment-item"
          @click="handleFileClick(file)"
        >
          <div class="file-icon">
            <i :class="getFileIcon(file.name || file.url)"></i>
          </div>
          <div class="file-info">
            <div class="file-name">{{ file.name || extractFileName(file.url) }}</div>
            <div class="file-details">
              <span v-if="file.size" class="file-size">{{ formatFileSize(file.size) }}</span>
              <span class="file-type">{{ getFileExtension(file.name || file.url) }}</span>
            </div>
          </div>
          <div class="file-actions">
            <button class="download-btn" @click.stop="downloadFile(file)">
              <i class="bi bi-download"></i>
            </button>
            <button v-if="isImage(file.name || file.url)" class="preview-btn" @click.stop="previewImage(file)">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 이미지 미리보기 모달 -->
    <div v-if="showImagePreview" class="image-preview-modal" @click="closeImagePreview">
      <div class="modal-content" @click.stop>
        <button class="close-btn" @click="closeImagePreview">
          <i class="bi bi-x-lg"></i>
        </button>
        <img :src="previewImageUrl" :alt="previewImageName" />
        <div class="image-info">
          <span>{{ previewImageName }}</span>
        </div>
      </div>
    </div>

    <!-- 레거시 단일 파일 지원 (하위 호환성) -->
    <div v-if="fileUrl && (!attachments || !attachments.length)" class="project-file-legacy">
      <div class="file-legacy-label">첨부파일</div>
      <div class="file-legacy-item">
        <img v-if="isImage(fileUrl)" :src="fileUrl" alt="첨부이미지" class="legacy-image" />
        <a v-else :href="fileUrl" target="_blank" download class="legacy-download">
          <i class="bi bi-download"></i>
          첨부파일 다운로드
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: {
      type: String,
      default: '',
    },
    tags: {
      type: Array,
      default: () => [],
    },
    fileUrl: {
      type: String,
      default: '',
    },
    attachments: {
      type: Array,
      default: () => [],
      // 예시: [{ name: 'document.pdf', url: 'http://...', size: 1024000 }]
    },
    author: {
      type: Object,
      default: () => null,
      // 예시: { name: '김개발', title: 'Frontend Developer', avatar: '...', isVerified: true }
    },
  },
  data() {
    return {
      showImagePreview: false,
      previewImageUrl: '',
      previewImageName: '',
      defaultAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
    }
  },
  methods: {
    isImage(url) {
      return /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(url)
    },
    getFileIcon(fileName) {
      const ext = this.getFileExtension(fileName).toLowerCase()
      const iconMap = {
        pdf: 'bi bi-file-earmark-pdf',
        doc: 'bi bi-file-earmark-word',
        docx: 'bi bi-file-earmark-word',
        xls: 'bi bi-file-earmark-excel',
        xlsx: 'bi bi-file-earmark-excel',
        ppt: 'bi bi-file-earmark-ppt',
        pptx: 'bi bi-file-earmark-ppt',
        zip: 'bi bi-file-earmark-zip',
        rar: 'bi bi-file-earmark-zip',
        txt: 'bi bi-file-earmark-text',
        jpg: 'bi bi-file-earmark-image',
        jpeg: 'bi bi-file-earmark-image',
        png: 'bi bi-file-earmark-image',
        gif: 'bi bi-file-earmark-image',
        mp4: 'bi bi-file-earmark-play',
        avi: 'bi bi-file-earmark-play',
        mp3: 'bi bi-file-earmark-music',
        wav: 'bi bi-file-earmark-music',
      }
      return iconMap[ext] || 'bi bi-file-earmark'
    },
    getFileExtension(fileName) {
      return fileName.split('.').pop() || ''
    },
    extractFileName(url) {
      return url.split('/').pop() || 'unknown'
    },
    formatFileSize(bytes) {
      if (!bytes) return ''
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(1024))
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
    },
    handleFileClick(file) {
      if (this.isImage(file.name || file.url)) {
        this.previewImage(file)
      } else {
        this.downloadFile(file)
      }
    },
    downloadFile(file) {
      const link = document.createElement('a')
      link.href = file.url
      link.download = file.name || this.extractFileName(file.url)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    previewImage(file) {
      this.previewImageUrl = file.url
      this.previewImageName = file.name || this.extractFileName(file.url)
      this.showImagePreview = true
    },
    closeImagePreview() {
      this.showImagePreview = false
      this.previewImageUrl = ''
      this.previewImageName = ''
    },
    contactAuthor() {
      // 작성자 연락하기 로직
      this.$emit('contact-author', this.author)
    },
    viewPortfolio() {
      // 포트폴리오 보기 로직 - 작성자의 포트폴리오 페이지로 이동
      this.$emit('view-portfolio', this.author)
    }
  }
}
</script>

<style scoped>
/* Bootstrap Icons 필요 */
@import url('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css');

.project-content {
  padding: 30px 0;
}

/* 작성자 정보 섹션 */
.project-author-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 30px;
  border: 1px solid #e9ecef;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.author-avatar {
  position: relative;
  flex-shrink: 0;
}

.author-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #4CAF50;
  object-fit: cover;
}

.verified-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: #4CAF50;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

.author-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.author-name {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
}

.author-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 0;
}

.author-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

.contact-button, .portfolio-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 120px;
}

.contact-button {
  background: #4CAF50;
  color: white;
}

.contact-button:hover {
  background: #388E3C;
  transform: translateY(-1px);
}

.portfolio-button {
  background: white;
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.portfolio-button:hover {
  background: #4CAF50;
  color: white;
}

/* 프로젝트 설명 */
.project-description {
  line-height: 1.7;
  color: #444;
  margin-bottom: 24px;
  font-size: 15px;
}

/* 태그 섹션 */
.project-tags-list {
  margin-bottom: 30px;
}

.tags-label {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tags-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.project-tag {
  background: #e8f5e8;
  color: #2e7d32;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid #c8e6c9;
  transition: all 0.2s ease;
}

.project-tag:hover {
  background: #c8e6c9;
  transform: translateY(-1px);
}

/* 첨부파일 섹션 */
.project-attachments {
  margin-bottom: 30px;
}

.attachments-label {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.attachment-item:hover {
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);
}

.file-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  margin-right: 16px;
  font-size: 20px;
  color: #4CAF50;
}

.file-info {
  flex: 1;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 4px;
}

.file-details {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.file-actions {
  display: flex;
  gap: 8px;
}

.download-btn, .preview-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.download-btn:hover, .preview-btn:hover {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

/* 이미지 미리보기 모달 */
.image-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.modal-content img {
  max-width: 100%;
  max-height: calc(90vh - 60px);
  object-fit: contain;
  display: block;
}

.image-info {
  padding: 16px;
  background: white;
  text-align: center;
  font-weight: 600;
  color: #262626;
}

/* 레거시 파일 지원 */
.project-file-legacy {
  margin-bottom: 30px;
}

.file-legacy-label {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
}

.legacy-image {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.legacy-download {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #4CAF50;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}

.legacy-download:hover {
  background: #388E3C;
  transform: translateY(-1px);
}

/* 반응형 */
@media (max-width: 768px) {
  .author-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-actions {
    flex-direction: row;
    justify-content: center;
  }

  .attachment-item {
    padding: 12px;
  }

  .file-icon {
    margin-right: 12px;
  }
}
</style>