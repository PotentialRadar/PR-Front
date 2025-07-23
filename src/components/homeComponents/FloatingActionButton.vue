<template>
  <div class="floating-button">
    <button class="action-button">
      <div class="button-background">
        <svg class="button-icon" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Add appropriate icon here -->
        </svg>
      </div>
    </button>
  </div>
</template>

<script setup>
</script>

<style scoped>
.floating-button {
  position: fixed;
  bottom: 120px;
  right: 80px;
  width: 56px;
  height: 56px;
  z-index: 1000;
}

.action-button {
  display: flex;
  width: 56px;
  height: 56px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 24px;
  backdrop-filter: blur(15px);
  border: none;
  cursor: pointer;
}

.button-background {
  display: flex;
  width: 56px;
  height: 56px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 24px;
  background: linear-gradient(180deg, #263DD1 0%, #263DD1 100%);
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.20) inset, 
              0px 4px 6px 0px rgba(0, 0, 0, 0.10), 
              0px 8px 30px 0px rgba(0, 0, 0, 0.15);
}

.button-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}
</style>
