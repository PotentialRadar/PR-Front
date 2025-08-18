<template>
  <div class="tab-navigation">
    <!-- <div class="tab-item" :class="{ active: activeTab === 'summary' }" @click="setActiveTab('summary')">
      <span>요약</span>
    </div> -->
    <div class="tab-item" :class="{ active: activeTab === 'content' }" @click="setActiveTab('content')">
      <span>프로젝트 내용</span>
    </div>
    <div 
      class="tab-item" 
      :class="{ active: activeTab === 'recommendations' }" 
      @click="setActiveTab('recommendations')"
    >
      <span>🤖 팀원 추천</span>
    </div>
    <div class="tab-item" :class="{ active: activeTab === 'comment' }" @click="setActiveTab('comment')">
      <span>댓글</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabNavigation',
  props: {
    activeTab: {
      type: String,
      default: 'comment'
    },
    isProjectOwner: {
      type: Boolean,
      default: false
    }
  },
  emits: ['tab-change'],
  methods: {
    setActiveTab(tab) {
      this.$emit('tab-change', tab);
    }
  }
}
</script>

<style scoped>
.tab-navigation {
  display: flex;
  width: 100%;
  background: #FFF;
}

.tab-item {
  display: flex;
  padding: 17px 0px 18.5px 0px;
  flex-direction: column;
  align-items: center;
  flex: 1;
  border-bottom: 1.5px solid #D4D4D4;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.active {
  border-bottom: 3px solid #4CAF50;
}

.tab-item span {
  color: #AAA;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  transition: all 0.3s ease;
}

.tab-item.active span {
  color: #000;
  font-weight: 700;
}

.tab-item:hover span {
  color: #555;
}
</style>
