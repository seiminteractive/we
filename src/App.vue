<template>
  <div id="app-root">
    <IntroOverlay />

    <div class="hero-pin">
      <Hero />
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
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { gsap } from './lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import IntroOverlay from './components/IntroOverlay.vue'
import Hero from './components/Hero.vue'
import QuienesSomosSection from './components/QuienesSomosSection.vue'
import ParaQuienSection from './components/ParaQuienSection.vue'
import QueHacemosSection from './components/QueHacemosSection.vue'
import ServiciosSection from './components/ServiciosSection.vue'
import TemasSection from './components/TemasSection.vue'
import ComoTrabajamosSection from './components/ComoTrabajamosSection.vue'
import CtaFinalSection from './components/CtaFinalSection.vue'
import SiteFooter from './components/SiteFooter.vue'

gsap.registerPlugin(ScrollTrigger)

// Entrada curva del borde superior de cada bloque de color: arranca como
// semicírculo hacia abajo y se endereza a medida que la sección sube.
let bendTweens = []

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const max = Math.min(90, Math.round(window.innerWidth * 0.06))
  const selectors = ['#servicios', '#como-trabajamos', '#contacto', '.foot']

  selectors.forEach((sel) => {
    const el = document.querySelector(sel)
    if (!el) return
    if (reduce) {
      el.style.setProperty('--bend', '0px')
      return
    }
    const tw = gsap.fromTo(
      el,
      { '--bend': max + 'px' },
      {
        '--bend': '0px',
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'top 58%',
          scrub: true,
        },
      }
    )
    bendTweens.push(tw)
  })

  // Recalcular posiciones cuando el intro libera el scroll / cargan fuentes.
  setTimeout(() => ScrollTrigger.refresh(), 300)
})

onUnmounted(() => {
  bendTweens.forEach((t) => t.scrollTrigger?.kill())
  bendTweens.forEach((t) => t.kill())
  bendTweens = []
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
  /* Fondo claro (casi blanco) con auroras de humo súper sutiles en colores
     de marca, en armonía con el hero. */
  background-color: #ffffff;
  border-top-left-radius: clamp(20px, 2vw, 32px);
  border-top-right-radius: clamp(20px, 2vw, 32px);
  box-shadow: 0 -24px 60px rgba(21, 21, 22, 0.22);
}

/* ───── Entrada curva del borde superior de cada bloque de color ─────
   Un "cap" del color de la sección anterior cubre la parte de arriba con
   forma de semicírculo; su altura (--bend) baja a 0 con el scroll → recto. */
#servicios,
#como-trabajamos,
#contacto,
.foot {
  --bend: 0px;
}

#servicios::before,
#como-trabajamos::before,
#contacto::before,
.foot::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: var(--bend);
  pointer-events: none;
  border-bottom-left-radius: 50% 100%;
  border-bottom-right-radius: 50% 100%;
}

/* Color del cap = color de la sección anterior, para que la curva se lea
   como el borde de la sección de color que está entrando. */
#servicios::before,
#como-trabajamos::before {
  background: #ffffff;
}

#contacto::before {
  background: #373737;
}

.foot::before {
  background: var(--brand-sage);
}
</style>
