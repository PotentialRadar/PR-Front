<template>
  <div class="project-content">
    <div class="project-description">
      {{ description }}
    </div>
    <div v-if="fileUrl" class="project-file">
      <img v-if="isImage(fileUrl)" :src="fileUrl" alt="첨부이미지" />
      <a v-else :href="fileUrl" target="_blank" download>첨부파일 다운로드</a>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    description: String,
    fileUrl: String,
  },
  methods: {
    isImage(url) {
      return /\.(jpg|jpeg|png|gif)$/i.test(url)
    }
  }
}
</script>

<style scoped>
.work-content {
  padding: 60px 0;
}

.section-header {
  margin-bottom: 24px;
}

.section-header h3 {
  color: #262626;
  font-size: 17px;
  font-weight: 700;
  line-height: 20px;
  margin: 0;
}

.content-text {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.content-block {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.block-title {
  color: #262626;
  font-size: 13px;
  font-weight: 700;
  line-height: 15px;
}

.block-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sub-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sub-title {
  color: #262626;
  font-size: 15px;
  font-weight: 400;
  line-height: 24px;
}

.content-line {
  color: #262626;
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  margin-bottom: 0;
}

.content-line.indented {
  padding-left: 3px;
}
</style>
