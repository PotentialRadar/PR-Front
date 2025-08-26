<template>
  <div class="project-header" v-if="project">
    <div class="project-tags">
      <div class="tag-container">
        <span class="tag status-tag">{{ statusText }}</span>

        <!-- 기술스택 표시 -->
        <span
            v-for="(stack, i) in techStacksSafe"
            :key="i"
            class="tag self-tag"
        >#{{ stack.techStackName }}</span>
      </div>

      <div class="registration-date">
        <span>{{ formatDate(project.startDate) }}</span>
      </div>
    </div>

    <div class="project-title">
      <h1>{{ project.title }}</h1>
    </div>

    <div class="project-sub-title">
      {{ project.description }}
    </div>

    <hr style="background:#eee; height:1px; border:0; margin:40px 0" />

    <div class="tag-title">이런 기술을 사용할 예정이에요</div>
    <div v-if="techStacksSafe.length" class="technology-tags">
      <span
          v-for="(ts, i) in techStacksSafe"
          :key="'ts-'+i"
          class="tech-tag"
      >{{ ts.techStackName }}</span>
    </div>

    <div class="project-metadata">
      <div class="metadata-item">
        <div class="metadata-label">기간</div>
        <div class="metadata-value">
          <span class="number">{{ calcDuration(project.startDate, project.endDate) }}</span>
          <span class="unit">일</span>
        </div>
      </div>

      <div class="metadata-item">
        <div class="metadata-label">지원자수</div>
        <div class="metadata-value">
          <span class="number">{{ project.appliedCount || 0 }}</span>
        </div>
      </div>

      <div class="metadata-item">
        <div class="metadata-label">마감일</div>
        <div class="metadata-value">
          <span class="deadline">{{ calcDeadline(project.recruitDeadline) }}</span>
        </div>
      </div>
    </div>

    <div class="recruitment-parts-section">
      <div class="section-title">모집인원 (파트별)</div>
      <div class="parts-container">
        <div v-if="project.recruitmentParts && project.recruitmentParts.length" class="parts-list">
          <div v-for="(part, index) in project.recruitmentParts" :key="index" class="part-item-card">
            <span class="part-name">{{ getPartLabel(part.partName) }}</span>
            <span class="part-count">{{ part.recruitCount }}명</span>
          </div>
        </div>
        <div v-else class="no-recruitment-info">
          <span class="no-recruitment">파트별 모집 정보 없음</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 로딩 스켈레톤/플레이스홀더(선택) -->
  <div v-else class="project-header">
    로딩 중…
  </div>
</template>

<script>
import { PART_OPTIONS } from '@/constants/parts'; // <-- 이 줄을 추가합니다.

export default {
  name: 'ProjectHeader',
  props: {
    project: { type: Object, default: null } // ✅ null 허용
  },
  computed: {
    statusText() {
      const s = this.project?.status
      return s === 'RECRUITING' ? '모집중' : (s || '진행중')
    },
    techStacksSafe() {
      // 백엔드: project.techStacks = [{ techStackName }]
      // 혹시 tags(string[])가 남아있다면 호환 처리
      if (Array.isArray(this.project?.techStacks)) return this.project.techStacks
      if (Array.isArray(this.project?.tags)) {
        return this.project.tags.map(t => ({ techStackName: String(t) }))
      }
      return []
    }
  },
  methods: {
    getPartLabel(partValue) {
      const part = PART_OPTIONS.find(option => option.value === partValue);
      return part ? part.label : partValue;
    },
    formatDate(dateStr) {
      if (!dateStr) return ''
      const d = new Date(dateStr)
      if (isNaN(d)) return ''
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    },
    calcDuration(start, end) {
      if (!start || !end) return '-'
      const s = new Date(start), e = new Date(end)
      if (isNaN(s) || isNaN(e)) return '-'
      return Math.max(1, Math.ceil((e - s) / (1000 * 60 * 60 * 24)))
    },
    calcDeadline(deadline) {
      if (!deadline) return '-'
      const today = new Date(), dday = new Date(deadline)
      if (isNaN(dday)) return '-'
      const diff = Math.ceil((dday - today) / (1000 * 60 * 60 * 24))
      return diff > 0 ? `D-${diff}` : '마감'
    }
  }
}
</script>

<style scoped>
.project-header {
  width: 100%;
  background: #FFF;
}

.project-tags {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.tag-container {
  display: flex;
  align-items: center;
  gap: 5px;
}

.tag {
  padding: 8px 10px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  color: #262626;
}

.employment-type {
  background: #EFEFEF;
}

.status-tag {
  background: #D6F6FD;
}

.self-tag {
  background: #eee;
}

.registration-date span {
  color: #AAA;
  font-size: 15px;
  font-weight: 400;
  line-height: 17px;
}

.project-title {
  margin-bottom: 15px;
}

.project-title h1 {
  color: #262626;
  font-size: 24px;
  font-weight: 700;
  line-height: 28px;
  margin: 0;
}

.project-sub-title {
  font-size: 18px;
  white-space: pre-wrap; /* Preserve whitespace and allow wrapping */
  word-wrap: break-word; /* Break long words */
}

.project-metadata {
  display: flex;
  gap: 15px;
  margin: 50px 0 20px;
}

.metadata-item {
  display: flex;
  padding: 12px 10px;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 3px;
  background: #F7F7F8;
}

.metadata-label {
  color: #262626;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  margin-right: 10px;
}

.metadata-value {
  display: flex;
  align-items: center;
  gap: 2px;
}

.number {
  color: #262626;
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
}

.unit {
  color: #262626;
  font-size: 17px;
  font-weight: 700;
  line-height: 17px;
}

.deadline {
  color: #262626;
  font-size: 15px;
  font-weight: 700;
  line-height: 17px;
}

.tag-title {
  font-size: 20px;
  font-weight: 700;
  padding: 0 0 10px;
}

.technology-tags {
  display: flex;
  /* align-items: flex-start;  <- 이 부분을 다음과 같이 변경합니다. */
  align-items: center; /* 라벨과 태그 그룹이 세로 중앙에 맞춰 정렬됩니다. */
  gap: 10px;
  flex-wrap: wrap;
  margin: 10px 0;
}

.tech-label {
  /* 고정 너비를 주어 모든 라벨의 시작점을 맞춥니다. */
  width: 70px; /* 적절한 너비로 조절하세요 (예: 60px, 70px, 80px 등) */
  flex-shrink: 0; /* 내용이 길어져도 줄어들지 않도록 함 */
  text-align: right; /* 라벨 텍스트를 오른쪽 정렬하여 태그와 가까이 붙임 */
  padding-right: 5px; /* 라벨과 태그 그룹 사이 미세 간격 추가 */
  color: #262626;
  font-size: 12px;
  font-weight: 400;
  line-height: 15px;
  /* margin-right: 5px; <- 이 부분은 gap으로 대체되므로 제거해도 됩니다. */
}

.tech-tags {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
  flex-grow: 1; /* 남은 공간을 채우도록 허용 */
}

.tech-tag {
  padding: 7px 9px;
  border-radius: 3px;
  border: 1px solid #E5E5E5;
  color: #262626;
  font-size: 14px;
  font-weight: 400;
  line-height: 15px;
}
.technology-tags {
  margin: 16px 0 0 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.tech-tag {
  background: #e9f5ec;
  color: #219653;
  border-radius: 7px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 600;
}

/* New styles for recruitment parts section */
.recruitment-parts-section {
  margin-top: 40px; /* Space from metadata */
  padding: 25px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.recruitment-parts-section .section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.parts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* Space between part items */
}

.part-item-card {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e6f7ed; /* Light green background */
  border: 1px solid #b3e0c9;
  border-radius: 10px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #219653;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.part-item-card .part-name {
  font-weight: 600;
  color: #1e8e3e; /* Darker green for name */
}

.part-item-card .part-count {
  font-weight: 700;
  color: #28a745; /* Brighter green for count */
}

.no-recruitment-info {
  font-size: 14px;
  color: #888;
  padding: 10px 0;
}

/* Styles for metadata-item.recruitment-by-part (from previous iteration, now combined) */
.metadata-item.recruitment-by-part {
  flex-direction: column; /* Stack label and value parts vertically */
  align-items: flex-start; /* Align content to the start */
  padding: 12px 15px; /* Adjust padding */
}

.metadata-value-parts {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  gap: 8px; /* Space between part items */
  margin-top: 5px; /* Space between label and part items */
  width: 100%; /* Take full width */
}

.part-item {
  display: flex;
  align-items: center;
  gap: 4px; /* Space between part name and count */
  background: #e0ffe0; /* Light green background for each part */
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 13px;
  white-space: nowrap; /* Prevent part name/count from breaking */
}

.part-name {
  font-weight: 600;
  color: #219653; /* Green color for part name */
}

.part-count {
  color: #4CAF50; /* Slightly darker green for count */
}

.no-recruitment {
  font-size: 13px;
  color: #888;
  padding: 10px 0;
}

.recruitment-parts-section {
  margin-top: 40px; /* Space from metadata */
  padding: 25px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #e9ecef;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.recruitment-parts-section .section-title {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 20px;
}

.parts-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px; /* Space between part items */
}

.part-item-card {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #e6f7ed; /* Light green background */
  border: 1px solid #b3e0c9;
  border-radius: 10px;
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  color: #219653;
  white-space: nowrap;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.03);
}

.part-item-card .part-name {
  font-weight: 600;
  color: #1e8e3e; /* Darker green for name */
}

.part-item-card .part-count {
  font-weight: 700;
  color: #28a745; /* Brighter green for count */
}

.no-recruitment-info {
  font-size: 14px;
  color: #888;
  padding: 10px 0;
}

.metadata-item.recruitment-by-part {
  flex-direction: column; /* Stack label and value parts vertically */
  align-items: flex-start; /* Align content to the start */
  padding: 12px 15px; /* Adjust padding */
}

.metadata-value-parts {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap to the next line */
  gap: 8px; /* Space between part items */
  margin-top: 5px; /* Space between label and part items */
  width: 100%; /* Take full width */
}

.part-item {
  display: flex;
  align-items: center;
  gap: 4px; /* Space between part name and count */
  background: #e0ffe0; /* Light green background for each part */
  border-radius: 5px;
  padding: 4px 8px;
  font-size: 13px;
  white-space: nowrap; /* Prevent part name/count from breaking */
}

.part-name {
  font-weight: 600;
  color: #219653; /* Green color for part name */
}

.part-count {
  color: #4CAF50; /* Slightly darker green for count */
}

.no-recruitment {
  font-size: 13px;
  color: #888;
}

/* 모집인원을 옆으로 나란히 배열 */
.parts-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

</style>
