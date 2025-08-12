<template>
  <div class="home-page">
    
    <main class="main-content">
      <HeroSection />
      <StatsSection />
      <ProjectSection />
      <PartnerSection />
    </main>
    
    <FloatingActionButton />
  </div>
</template>

<script setup>

import HeroSection from '@/components/homeComponents/HeroSection.vue'
import StatsSection from '@/components/homeComponents/StatsSection.vue'
import ProjectSection from '@/components/homeComponents/ProjectSection.vue'
import PartnerSection from '@/components/homeComponents/PartnerSection.vue'
import FloatingActionButton from '@/components/homeComponents/FloatingActionButton.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #fff;
}

.main-content {
  width: 100%;
  position: relative;
}
</style>
