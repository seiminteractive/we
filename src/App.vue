<template>
  <div id="app-root">
    <IntroOverlay />

    <div class="hero-pin">
      <HeroSection v-if="heroVariant === 'original'" />
      <HeroSectionMinimal v-else-if="heroVariant === 'minimal'" />
      <HeroSection3 v-else-if="heroVariant === 'editorial'" />
      <HeroSection v-else />
    </div>

    <div class="page-stack">
      <QuienesSomosSection />
      <ParaQuienSection />
      <ServiciosSection />
      <QueHacemosSection />
      <TemasSection />
      <ComoTrabajamosSection />
      <CtaFinalSection />
      <SiteFooter />
    </div>

    <HeroSwitcher v-model="heroVariant" />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
// import ParticleBackground from './components/ParticleBackground.vue'
import IntroOverlay from './components/IntroOverlay.vue'
import HeroSection from './components/HeroSection.vue'
import HeroSectionMinimal from './components/HeroSectionMinimal.vue'
import HeroSection3 from './components/HeroSection3.vue'
import HeroSwitcher from './components/HeroSwitcher.vue'
import QuienesSomosSection from './components/QuienesSomosSection.vue'
import ParaQuienSection from './components/ParaQuienSection.vue'
import QueHacemosSection from './components/QueHacemosSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import TemasSection from './components/TemasSection.vue'
import ComoTrabajamosSection from './components/ComoTrabajamosSection.vue'
import CtaFinalSection from './components/CtaFinalSection.vue'
import SiteFooter from './components/SiteFooter.vue'

const STORAGE_KEY = 'we:heroVariant:v2'
const valid = ['original', 'minimal', 'editorial']

const initial = (() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && valid.includes(stored)) return stored
  } catch (_) {}
  return 'minimal'
})()

const heroVariant = ref(initial)

watch(heroVariant, (v) => {
  try {
    localStorage.setItem(STORAGE_KEY, v)
  } catch (_) {}
})
</script>

<style>
#app-root > .hero-pin {
  position: sticky;
  top: 0;
  z-index: 0;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

#app-root > .page-stack {
  position: relative;
  z-index: 1;
  background: #ffffff;
  border-top-left-radius: clamp(20px, 2vw, 32px);
  border-top-right-radius: clamp(20px, 2vw, 32px);
  box-shadow: 0 -24px 60px rgba(0, 0, 0, 0.18);
}
</style>
