<template>
  <div id="app-root">
    <!-- <ParticleBackground /> -->
    <HeroSection />
    <QuienesSomosSection />
    <ParaQuienSection />
    <ServiciosSection />
    <QueHacemosSection />
    <TemasSection />
    <ComoTrabajamosSection />
    <CtaFinalSection />
    <SiteFooter />
  </div>
</template>

<script setup>
// import ParticleBackground from './components/ParticleBackground.vue'
import HeroSection from './components/HeroSection.vue'
import QuienesSomosSection from './components/QuienesSomosSection.vue'
import ParaQuienSection from './components/ParaQuienSection.vue'
import QueHacemosSection from './components/QueHacemosSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import TemasSection from './components/TemasSection.vue'
import ComoTrabajamosSection from './components/ComoTrabajamosSection.vue'
import CtaFinalSection from './components/CtaFinalSection.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<style>
#app-root > * ~ * {
  position: relative;
  z-index: 1;
}
</style>
