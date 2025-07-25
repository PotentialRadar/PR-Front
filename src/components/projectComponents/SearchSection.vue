<template>
  <div class="search-section">
    <div class="search-container">
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="제목, 기술 스택, 파트 등을 검색해보세요"
          class="search-input"
        />
        <button class="search-button" @click="handleSearch">
          <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.79738 15.8852C12.662 15.8852 15.795 12.7522 15.795 8.88759C15.795 5.02294 12.662 1.89001 8.79738 1.89001C4.93273 1.89001 1.7998 5.02294 1.7998 8.88759C1.7998 12.7522 4.93273 15.8852 8.79738 15.8852Z" stroke="#4CAF50" stroke-width="2"/>
            <path d="M14.2949 14.3854L20.2938 20.3842" stroke="#4CAF50" stroke-width="2"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchSection',
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('perform-search', this.searchQuery);
      console.log('Searching for:', this.searchQuery)
    }
  }
}
</script>

<style scoped>
.search-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.search-container {
  width: 60vw; 
  max-width: 700px;
  min-width: 500px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50px; 
  background-color: #E8F5E8; 
  border: 1px solid #C8E6C9; 
  box-shadow: 0 2px 4px 0 rgba(76, 175, 80, 0.1); 
  
  position: relative; 
  padding: 0; 

  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
}

.search-container:focus-within {
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  border-color: #4CAF50;
}

.search-box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between; 
  background: transparent;
  padding: 0 20px;
}

.search-input {
  flex-grow: 1;
  padding: 0 10px;
  border: none;
  outline: none;
  background: transparent;
  color: #262626;
  font-family: 'Inter', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: normal;
  height: 100%;
}

.search-input::placeholder {
  color: #81C784;
  font-weight: 400;
}

.search-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px; 
  display: flex; 
  align-items: center;
  justify-content: center;
  width: 36px; 
  height: 36px; 
  border-radius: 50%;
  transition: all 0.2s ease;
}

.search-button:hover {
  background-color: rgba(76, 175, 80, 0.1);
  transform: scale(1.05);
}

.search-button:active {
  transform: scale(0.95);
}

.search-button svg path {
  stroke: #4CAF50;
  transition: stroke 0.2s ease;
}

.search-button:hover svg path {
  stroke: #2E7D32;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .search-container {
    width: 80vw;
    min-width: 300px;
    max-width: 500px;
  }
}

@media (max-width: 480px) {
  .search-container {
    width: 90vw;
    min-width: 280px;
    height: 45px;
  }

  .search-input {
    font-size: 14px;
  }

  .search-button {
    width: 32px;
    height: 32px;
  }

  .search-button svg {
    width: 18px;
    height: 18px;
  }
}
</style>