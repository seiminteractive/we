<template>
  <section id="servicios" ref="sectionRef" class="svc" aria-labelledby="svc-heading">
    <div class="svc__shell">
      <div class="svc__left">
        <div class="svc__left-top" data-reveal>
          <div class="svc__tag">
            <i class="pi pi-desktop svc__tag-ico" aria-hidden="true" />
            <span class="svc__tag-text">PROGRAMAS</span>
          </div>
          <h2 id="svc-heading" class="svc__title">
            Iniciativas que dan forma a un futuro más sostenible.
          </h2>
        </div>

        <div class="svc__left-bottom" data-reveal>
          <p class="svc__body">
            Desde infraestructura verde hasta programas comunitarios, descubrí cómo construimos
            ecosistemas resilientes para el mañana: una iniciativa a la vez.
          </p>
          <a href="#" class="svc__cta">
            <span class="svc__cta-label">Comenzá</span>
            <span class="svc__cta-icon" aria-hidden="true">
              <i class="pi pi-arrow-right"></i>
            </span>
          </a>
        </div>
      </div>

      <div class="svc__right" data-reveal>
        <div class="svc-carousel">
          <div class="svc-carousel__slides" aria-live="polite">
            <div
              v-for="(slide, i) in slides"
              :key="slide.id"
              class="svc-carousel__slide"
              :class="{ 'svc-carousel__slide--active': i === current }"
            >
              <img
                :src="slide.image"
                alt=""
                class="svc-carousel__img"
                width="640"
                height="900"
                loading="lazy"
              />
            </div>
          </div>

          <div class="svc-carousel__chrome">
            <div class="svc-carousel__progress" role="tablist" aria-label="Progreso del carrusel">
              <div
                v-for="(slide, i) in slides"
                :key="'p-' + slide.id"
                class="svc-carousel__seg"
              >
                <div
                  class="svc-carousel__seg-fill"
                  :class="{
                    'svc-carousel__seg-fill--done': i < current,
                    'svc-carousel__seg-fill--active': i === current,
                    'svc-carousel__seg-fill--idle': i > current,
                  }"
                  :style="i === current ? segActiveStyle() : undefined"
                />
              </div>
            </div>

            <button
              type="button"
              class="svc-carousel__nav svc-carousel__nav--prev"
              aria-label="Anterior"
              @click="goPrev"
            >
              <i class="pi pi-chevron-left" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              class="svc-carousel__nav svc-carousel__nav--next"
              aria-label="Siguiente"
              @click="goNext"
            >
              <i class="pi pi-chevron-right" aria-hidden="true"></i>
            </button>

            <div class="svc-carousel__overlay">
              <p class="svc-carousel__date">{{ slides[current].date }}</p>
              <p class="svc-carousel__slide-title">{{ slides[current].title }}</p>
              <p class="svc-carousel__slide-desc">{{ slides[current].description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import imgFormacionSostenibilidad from '../assets/formacionEnSostenibilidad.jpeg'
import imgUsoIA from '../assets/usoDeIA.jpeg'
import imgTalleresGobEmpSind from '../assets/talleresGobiernosEmpresas.jpeg'
import imgComunicacionInstitucional from '../assets/comunicacionInstitucional.jpeg'
import imgCampaniasPosicionamiento from '../assets/campaniasYPosicionamiento.jpeg'
import imgEstrategiasPublicas from '../assets/estrategiasPublicasDeTransformacion.jpeg'
import imgTallerFinanciamiento from '../assets/tallerFinanciamiento.jpeg'

const { sectionRef } = useScrollReveal()

const SLIDE_DURATION_MS = 6000

const slides = [
  {
    id: 'sostenibilidad',
    title: 'Formación en sostenibilidad',
    description:
      'Programas aplicados para integrar criterios ambientales y sociales en equipos y proyectos.',
    date: '12/03/2025',
    image: imgFormacionSostenibilidad,
  },
  {
    id: 'ia',
    title: 'Formación en IA',
    description:
      'Capacitación práctica para adoptar IA con foco en productividad y gobernanza responsable.',
    date: '28/03/2025',
    image: imgUsoIA,
  },
  {
    id: 'talleres',
    title: 'Talleres para gobiernos, empresas y sindicatos',
    description:
      'Espacios de trabajo conjunto para alinear lenguajes y prioridades entre actores clave.',
    date: '5/04/2025',
    image: imgTalleresGobEmpSind,
  },
  {
    id: 'comunicacion',
    title: 'Comunicación institucional',
    description:
      'Estrategias que fortalecen reputación, claridad de mensaje y confianza de las audiencias.',
    date: '18/04/2025',
    image: imgComunicacionInstitucional,
  },
  {
    id: 'campanas',
    title: 'Campañas y posicionamiento',
    description:
      'Campañas que conectan propósito, narrativa y canales con objetivos medibles.',
    date: '2/05/2025',
    image: imgCampaniasPosicionamiento,
  },
  {
    id: 'estrategias',
    title: 'Estrategias públicas y de transformación',
    description:
      'Rutas, decisiones y métricas para modernizar procesos y sostener el impacto.',
    date: '20/05/2025',
    image: imgEstrategiasPublicas,
  },
  {
    id: 'financiamiento',
    title: 'Financiamiento para proyectos de impacto',
    description:
      'Estructuración de propuestas, alianzas y fondos orientados a resultados verificables.',
    date: '7/06/2025',
    image: imgTallerFinanciamiento,
  },
]

const current = ref(0)
const segProgress = ref(0)

let rafId = 0
let slideStartAt = 0

function segActiveStyle() {
  return { transform: `scaleX(${segProgress.value})` }
}

function resetSlideClock(now) {
  slideStartAt = now
  segProgress.value = 0
}

function goTo(index) {
  const n = slides.length
  current.value = ((index % n) + n) % n
  resetSlideClock(performance.now())
}

function goNext() {
  goTo(current.value + 1)
}

function goPrev() {
  goTo(current.value - 1)
}

function tick(now) {
  const elapsed = now - slideStartAt
  const t = Math.min(1, elapsed / SLIDE_DURATION_MS)
  segProgress.value = t

  if (t >= 1) {
    const n = slides.length
    current.value = (current.value + 1) % n
    slideStartAt = now
    segProgress.value = 0
  }

  rafId = requestAnimationFrame(tick)
}

onMounted(() => {
  resetSlideClock(performance.now())
  rafId = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.svc {
  --svc-ink: #ffffff;

  position: relative;
  background: transparent;
  color: var(--svc-ink);
  box-sizing: border-box;
  overflow: visible;
  min-height: min(100vh, 100dvh);
}

.svc__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x);
  box-sizing: border-box;
  min-width: 0;
  min-height: min(100vh, 100dvh);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.92fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: stretch;
}

.svc__left {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: clamp(2rem, 5vh, 3.5rem);
  padding: clamp(0.5rem, 2vh, 1.25rem) 0;
  min-width: 0;
}

.svc__tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  align-self: flex-start;
  padding: 0.35rem 0.85rem 0.35rem 0.55rem;
  border-radius: 999px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  margin-bottom: clamp(1.25rem, 3vw, 1.75rem);
}

.svc__tag-ico {
  font-size: 0.7rem;
  opacity: 0.95;
}

.svc__tag-text {
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.svc__title {
  margin: 0;
  max-width: min(26rem, 100%);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.5vw, 3.35rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: #fff;
}

.svc__body {
  margin: 0 0 clamp(1.35rem, 3vh, 2rem);
  max-width: min(32rem, 100%);
  font-family: var(--font-body);
  font-size: clamp(0.9375rem, 1.35vw, 1.0625rem);
  font-weight: var(--font-w-regular);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.92);
}

.svc__cta {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.2rem 0.2rem 0.2rem 1.35rem;
  box-shadow: none;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.02em;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.svc__cta:hover {
  border-color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.14);
}

.svc__cta-label {
  padding-right: 0.75rem;
}

.svc__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

.svc__cta-icon .pi {
  font-size: 0.72rem;
}

.svc__right {
  min-width: 0;
  display: flex;
  align-items: stretch;
}

.svc-carousel {
  position: relative;
  width: 100%;
  border-radius: clamp(22px, 3vw, 32px);
  overflow: hidden;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.12),
    0 8px 20px rgba(0, 0, 0, 0.06);
  min-height: clamp(22rem, 62vh, 36rem);
  background: #1a1a1a;
}

.svc-carousel__slides {
  position: absolute;
  inset: 0;
}

.svc-carousel__slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.65s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.svc-carousel__slide--active {
  opacity: 1;
  z-index: 0;
}

.svc-carousel__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.svc-carousel__chrome {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.svc-carousel__chrome > * {
  pointer-events: auto;
}

.svc-carousel__progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 6px;
  padding: clamp(1rem, 2.5vw, 1.35rem);
  z-index: 3;
}

.svc-carousel__seg {
  flex: 1;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.35);
  overflow: hidden;
}

.svc-carousel__seg-fill {
  height: 100%;
  width: 100%;
  border-radius: inherit;
  transform-origin: left center;
  transform: scaleX(0);
  background: #fff;
 will-change: transform;
}

.svc-carousel__seg-fill--done {
  transform: scaleX(1);
  transition: transform 0.35s ease;
}

.svc-carousel__seg-fill--active {
  background: #fff;
}

.svc-carousel__seg-fill--idle {
  transform: scaleX(0);
  background: rgba(255, 255, 255, 0.5);
}

.svc-carousel__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.35rem;
  height: 2.35rem;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.38);
  color: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  transition: background 0.2s ease;
  z-index: 4;
}

.svc-carousel__nav:hover {
  background: rgba(0, 0, 0, 0.55);
}

.svc-carousel__nav .pi {
  font-size: 0.85rem;
}

.svc-carousel__nav--prev {
  left: clamp(0.75rem, 2vw, 1.1rem);
}

.svc-carousel__nav--next {
  right: clamp(0.75rem, 2vw, 1.1rem);
}

.svc-carousel__overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: clamp(1.35rem, 3.5vw, 2.25rem);
  background: linear-gradient(to top, rgba(0, 0, 0, 0.72) 0%, transparent 100%);
  z-index: 3;
}

.svc-carousel__date {
  margin: 0 0 0.35rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.04em;
  color: rgba(255, 255, 255, 0.85);
}

.svc-carousel__slide-title {
  margin: 0 0 0.45rem;
  font-family: var(--font-heading);
  font-size: clamp(1.15rem, 2.2vw, 1.5rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: #fff;
  max-width: 20rem;
}

.svc-carousel__slide-desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 1.2vw, 0.9375rem);
  font-weight: var(--font-w-regular);
  line-height: 1.45;
  color: rgba(255, 255, 255, 0.88);
  max-width: 22rem;
}

@media (max-width: 960px) {
  .svc__shell {
    min-height: 0;
    grid-template-columns: 1fr;
    gap: clamp(2rem, 5vw, 2.75rem);
  }

  .svc__left {
    justify-content: flex-start;
  }

  .svc__title {
    max-width: none;
  }

  .svc-carousel {
    min-height: clamp(20rem, 58vh, 28rem);
    aspect-ratio: 4 / 5;
    max-height: 520px;
    margin: 0 auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .svc-carousel__slide {
    transition-duration: 0.01ms;
  }

  .svc-carousel__seg-fill--done {
    transition-duration: 0.01ms;
  }
}
</style>
