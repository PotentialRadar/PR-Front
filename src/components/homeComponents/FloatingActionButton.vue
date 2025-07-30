<template>
  <div class="tooltip-wrapper">
    <div class="floating-button">
      <button class="action-button" @click="goToProjectCreate">
        <div class="button-background">
          <span class="button-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM21.41 6.34a1.25 1.25 0 0 0 0-1.77l-2-2a1.25 1.25 0 0 0-1.77 0l-1.83 1.83 3.75 3.75 1.85-1.81z"/>
            </svg>
          </span>
        </div>
      </button>
      <div class="custom-tooltip">프로젝트 생성</div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToProjectCreate = () => {
  router.push({ name: 'ProjectCreate' });
};
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
  background: linear-gradient(180deg, #46A74B 0%, #46A74B 100%);
  box-shadow: 0px 0px 0px 1px rgba(255, 255, 255, 0.20) inset, 
              0px 4px 6px 0px rgba(0, 0, 0, 0.10), 
              0px 8px 30px 0px rgba(0, 0, 0, 0.15);
}

.button-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.custom-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 50%;
  transform: translateX(50%) translateY(5px);
  background-color: #46A74B;
  color: white;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 16px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.floating-button:hover .custom-tooltip {
  opacity: 1;
  transform: translateX(50%) translateY(-5px);
}
</style>
