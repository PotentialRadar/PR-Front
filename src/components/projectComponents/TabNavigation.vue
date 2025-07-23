<template>
  <div class="tab-navigation">
    <div class="tab-item" :class="{ active: activeTab === 'summary' }" @click="setActiveTab('summary')">
      <span>요약</span>
    </div>
    <div class="tab-item" :class="{ active: activeTab === 'content' }" @click="setActiveTab('content')">
      <span>업무내용</span>
    </div>
    <div class="tab-item" :class="{ active: activeTab === 'freetalk' }" @click="setActiveTab('freetalk')">
      <span>프리톡</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabNavigation',
  props: {
    activeTab: {
      type: String,
      default: 'freetalk'
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
  border-bottom: 3px solid #FF7D12;
}

.tab-item span {
  color: #AAA;
  text-align: center;
  font-family: Lato, -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 17px;
  transition: all 0.3s ease;
}

.tab-item.active span {
  color: #000;
  font-family: Inter, -apple-system, Roboto, Helvetica, sans-serif;
  font-weight: 700;
}

.tab-item:hover span {
  color: #555;
}
</style>
