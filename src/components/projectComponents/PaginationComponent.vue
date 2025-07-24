<template>
  <div class="pagination-component">
    <div class="pagination-container">
      <button
        v-for="page in pages"
        :key="page"
        :class="['page-button', { 'active': page === currentPage }]"
        @click="selectPage(page)"
      >
        {{ page }}
      </button>
      <button class="next-button" @click="nextPage">
        <img src="https://api.builder.io/api/v1/image/assets/TEMP/a4aa8c18b033604f5f922a2f89e4392ca723ec8f?width=68" alt="Next" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaginationComponent',
  data() {
    return {
      currentPage: 1,
      totalPages: 10
    }
  },
  computed: {
    pages() {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1)
    }
  },
  methods: {
    selectPage(page) {
      this.currentPage = page
      this.$emit('page-changed', page)
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.selectPage(this.currentPage + 1)
      }
    }
  }
}
</script>

<style scoped>
.pagination-component {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 50px;
}

.pagination-container {
  display: flex;
  align-items: center;
  gap: 6px;
}

.page-button {
  display: flex;
  width: 34px;
  height: 34px;
  padding: 1px;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  border: 1px solid #A6A6A6;
  background: transparent;
  cursor: pointer;
  color: #666;
  text-align: center;
  font-family: 'Freesentation', -apple-system, Roboto, Helvetica, sans-serif;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 35px;
  transition: all 0.2s ease;
}

.page-button:hover {
  background: #f0f0f0;
}

.page-button.active {
  background: #31D0F4;
  color: white;
  border-color: #31D0F4;
}

.next-button {
  width: 34px;
  height: 34px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-left: 6px;
}

.next-button img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.next-button:hover {
  opacity: 0.8;
}
</style>
