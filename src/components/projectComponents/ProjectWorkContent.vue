<template>
  <div class="project-content">
    <div class="project-description">
      {{ description }}
    </div>

    <!-- 사용 기술(태그) 리스트 추가 -->
    <div v-if="tags && tags.length" class="project-tags-list">
      <span
          v-for="tag in tags"
          :key="tag"
          class="project-tag"
      >{{ tag }}</span>
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
  },
  methods: {
    isImage(url) {
      return /\.(jpg|jpeg|png|gif)$/i.test(url)
    }
  }
}
</script>

<style scoped>
.project-content {
  padding: 30px 0;
}

.project-tags-list {
  margin: 20px 0 10px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.project-tag {
  background: #e9f5ec;
  color: #219653;
  border-radius: 7px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 600;
  margin-right: 4px;
}
</style>
