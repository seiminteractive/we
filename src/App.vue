<template>
  <div id="app-root">
    <div class="neat-gradient-layer" aria-hidden="true">
      <canvas ref="neatCanvasRef" class="neat-gradient-layer__canvas" />
    </div>
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
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { NeatGradient } from '@firecms/neat'
import { neatGradientConfig } from './lib/neatGradientConfig'
import HeroSection from './components/HeroSection.vue'
import QuienesSomosSection from './components/QuienesSomosSection.vue'
import ParaQuienSection from './components/ParaQuienSection.vue'
import QueHacemosSection from './components/QueHacemosSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import TemasSection from './components/TemasSection.vue'
import ComoTrabajamosSection from './components/ComoTrabajamosSection.vue'
import CtaFinalSection from './components/CtaFinalSection.vue'
import SiteFooter from './components/SiteFooter.vue'

const neatCanvasRef = ref(null)
let neatGradient = null

function syncNeatScroll() {
  if (neatGradient) neatGradient.yOffset = window.scrollY
}

onMounted(async () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  await nextTick()
  const canvas = neatCanvasRef.value
  if (!canvas) return

  neatGradient = new NeatGradient({
    ref: canvas,
    ...neatGradientConfig,
  })
  neatGradient.yOffset = window.scrollY
  window.addEventListener('scroll', syncNeatScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', syncNeatScroll)
  neatGradient?.destroy()
  neatGradient = null
})
</script>

<style>
.neat-gradient-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.neat-gradient-layer__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Por encima del degradado global y del fondo del hero */
#app-root > * ~ * {
  position: relative;
  z-index: 1;
}
</style>
