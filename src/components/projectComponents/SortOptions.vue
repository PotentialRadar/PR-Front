<template>
  <div class="sort-options">
    <div 
      class="sort-option" 
      :class="{ selected: selectedSort === 'latest' }" 
      @click="setSort('latest')"
    >
      최신순
    </div>
    <div 
      class="sort-option" 
      :class="{ selected: selectedSort === 'recommended' }" 
      @click="setSort('recommended')"
    >
      추천순
    </div>
    <div 
      class="sort-option" 
      :class="{ selected: selectedSort === 'popular' }" 
      @click="setSort('popular')"
    >
      인기순
    </div>
  </div>
</template>

<script>
export default {
  name: 'SortOptions',
  data() {
    return {
      selectedSort: 'recommended' 
    }
  },
  methods: {
    setSort(sortType) {
      this.selectedSort = sortType;
      this.$emit('sort-changed', this.selectedSort);
    }
  },
  watch: {
    selectedSort(newValue) {
      this.$emit('sort-changed', newValue) 
    }
  }
}
</script>

<style scoped>
.sort-options {
  display: flex;
  border-radius: 20px;
  background: #F0F0F0;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 10px;
}

.sort-option {
  padding: 8px 18px;
  border-radius: 17px;
  cursor: pointer;
  font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #888;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.sort-option.selected {
  background: #FFF;
  color: #000;
  font-weight: 700;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.sort-option:hover:not(.selected) {
  background-color: #e8e8e8;
  color: #555;
}
</style>
