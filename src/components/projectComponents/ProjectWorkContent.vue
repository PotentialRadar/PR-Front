<template>
  <div class="work-content">
    <div class="content-section">
      <div class="section-header">
        <h3>프로젝트 내용</h3>
      </div>
      
      <div class="content-text">
        <div class="content-block">
          <div class="block-title">※프로젝트의 진행 방식</div>
          <div class="block-content">
            <div class="content-line">- 최초 온/오프라인 미팅(협의 가능)</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

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
