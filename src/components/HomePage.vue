<template>
  <div class="home-page">
    <AppHeader />
    <main class="main-content">
      <HeroSection />
      <StatsSection />
      <ProjectSection />
      <PartnerSection />
      <FreelancerSection />
    </main>
    <AppFooter />
    <FloatingActionButton />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import HeroSection from './HeroSection.vue'
import StatsSection from './StatsSection.vue'
import ProjectSection from './ProjectSection.vue'
import PartnerSection from './PartnerSection.vue'
import FreelancerSection from './FreelancerSection.vue'
import AppFooter from './AppFooter.vue'
import FloatingActionButton from './FloatingActionButton.vue'
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
