<template>
  <section id="como-trabajamos" ref="sectionRef" class="cw" lang="es" aria-labelledby="cw-screen-title">
    <div class="cw__shell">
      <div class="cw__topbar" data-reveal>
        <div class="cw__brand">
          <span class="cw__brand-mark" aria-hidden="true" />
          <span class="cw__brand-text">COMO TRABAJAMOS</span>
        </div>
        <div class="cw__meta">
          <span class="cw__meta-count">
            {{ String(activeStepIndex + 1).padStart(2, '0') }} / {{ String(steps.length).padStart(2, '0') }}
          </span>
          <div class="cw__meta-track" aria-hidden="true">
            <span class="cw__meta-progress" :style="{ width: `${progressPercent}%` }" />
          </div>
        </div>
      </div>

      <div class="cw__screen-wrap" data-reveal @mouseenter="stopAutoplay" @mouseleave="startAutoplay">
        <div class="cw__screen-backdrop" aria-hidden="true" />

        <Transition name="cw-step" mode="out-in">
          <article :key="activeStep.id" class="cw__screen">
            <p class="cw__screen-kicker">{{ activeStep.kicker }}</p>
            <h2 id="cw-screen-title" class="cw__screen-title">{{ activeStep.screenTitle }}</h2>
            <p class="cw__screen-desc">{{ activeStep.screenDesc }}</p>

            <div class="cw__screen-row">
              <ul class="cw__highlights">
                <li v-for="item in activeStep.highlights" :key="item" class="cw__highlight-item">
                  <span class="cw__highlight-dot" aria-hidden="true" />
                  <span>{{ item }}</span>
                </li>
              </ul>

              <aside class="cw__fact-card" aria-label="Dato del paso">
                <span class="cw__fact-value">{{ activeStep.metricValue }}</span>
                <span class="cw__fact-label">{{ activeStep.metricLabel }}</span>
              </aside>
            </div>
          </article>
        </Transition>

        <div class="cw__controls">
          <button type="button" class="cw__ctrl" @click="goPrev">
            Anterior
          </button>
          <button type="button" class="cw__ctrl" @click="toggleAutoplay">
            {{ isAutoplay ? 'Pausar auto' : 'Reanudar auto' }}
          </button>
          <button type="button" class="cw__ctrl cw__ctrl--primary" @click="goNext">
            Siguiente
          </button>
        </div>
      </div>

      <div class="cw__path-wrap" data-reveal>
        <svg class="cw__path-svg" viewBox="0 0 1200 170" aria-hidden="true" preserveAspectRatio="none">
          <defs>
            <linearGradient id="cwPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#7f58ff" />
              <stop offset="45%" stop-color="#a674ff" />
              <stop offset="100%" stop-color="#7f58ff" />
            </linearGradient>
          </defs>
          <path
            class="cw__path cw__path--base"
            d="M 30 74 C 180 126, 330 20, 480 86 S 780 146, 930 78 S 1110 34, 1170 90"
          />
          <path
            ref="progressPathRef"
            class="cw__path cw__path--progress"
            d="M 30 74 C 180 126, 330 20, 480 86 S 780 146, 930 78 S 1110 34, 1170 90"
          />
          <circle ref="progressDotRef" class="cw__dot-active" cx="30" cy="74" r="10" />
        </svg>

        <ol class="cw__steps" role="list">
          <li v-for="(step, i) in steps" :key="step.id" class="cw__step-item">
            <button
              type="button"
              class="cw__step-node"
              :class="{ 'is-active': i === activeStepIndex, 'is-done': i < activeStepIndex }"
              @click="setActiveStep(i)"
              :aria-label="`Ir al paso ${i + 1}`"
            />
            <div class="cw__step-copy">
              <span class="cw__ix">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="cw__step-title">{{ step.title }}</h3>
              <p class="cw__step-desc">{{ step.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { gsap } from '../lib/gsap'

const { sectionRef } = useScrollReveal()
const progressPathRef = ref(null)
const progressDotRef = ref(null)

const activeStepIndex = ref(0)
const isAutoplay = ref(true)
const pathLength = ref(1)
const progressState = { value: 0 }
let progressTween
let autoplayTimer = null

const steps = [
  {
    id: 'diagnostico',
    title: 'Escuchamos y diagnosticamos',
    text: 'Entendemos el contexto, los desafios y el momento de cada organizacion.',
    kicker: 'Paso 01 - Diagnostico',
    screenTitle: 'Entender antes de actuar.',
    screenDesc:
      'Iniciamos con escucha activa para identificar oportunidades reales y definir prioridades claras.',
    highlights: ['Mapeo de contexto y actores', 'Hipotesis de trabajo priorizadas', 'Objetivos claros por fase'],
    metricValue: '7-10 dias',
    metricLabel: 'Tiempo estimado de inmersion',
  },
  {
    id: 'propuesta',
    title: 'Disenamos una propuesta a medida',
    text: 'Adaptamos contenidos, estrategia y formato segun el objetivo.',
    kicker: 'Paso 02 - Diseno de estrategia',
    screenTitle: 'Cada estrategia se diseña para tu realidad.',
    screenDesc:
      'Traducimos el diagnostico en un plan concreto, con enfoque, alcance y ritmos posibles de implementar.',
    highlights: ['Arquitectura de plan accionable', 'Escenarios y prioridades', 'Roadmap con hitos medibles'],
    metricValue: '3 rutas',
    metricLabel: 'Escenarios evaluados por proyecto',
  },
  {
    id: 'activamos',
    title: 'Activamos formacion, comunicacion o estrategia',
    text: 'Ponemos en marcha el trabajo con un enfoque aplicado y cercano.',
    kicker: 'Paso 03 - Activacion',
    screenTitle: 'Pasamos de la idea a la accion.',
    screenDesc:
      'Ejecutamos junto a tu equipo para generar avances visibles desde etapas tempranas del proceso.',
    highlights: ['Pilotos y despliegue progresivo', 'Alineacion de equipos clave', 'Ritmo operativo semanal'],
    metricValue: '2-4 sprints',
    metricLabel: 'Cadencia inicial de implementacion',
  },
  {
    id: 'acompanamos',
    title: 'Acompanamos el proceso de cambio',
    text: 'Buscamos capacidades, posicionamiento y resultados medibles.',
    kicker: 'Paso 04 - Consolidacion',
    screenTitle: 'Sostener el cambio tambien es parte del trabajo.',
    screenDesc:
      'Monitoreamos, ajustamos y consolidamos resultados para que el impacto sea durable en el tiempo.',
    highlights: ['Seguimiento de indicadores', 'Ajustes continuos por evidencia', 'Transferencia de capacidades'],
    metricValue: '+90 dias',
    metricLabel: 'Ventana de acompanamiento activo',
  },
]

const activeStep = computed(() => steps[activeStepIndex.value])
const progressPercent = computed(() => ((activeStepIndex.value + 1) / steps.length) * 100)

function applyProgress(progress) {
  const p = Math.max(0, Math.min(progress, 1))
  const root = sectionRef.value
  const pathEl = progressPathRef.value
  const dotEl = progressDotRef.value
  if (!root || !pathEl || !dotEl) return

  root.style.setProperty('--cw-progress', String(p))

  const point = pathEl.getPointAtLength(pathLength.value * p)
  dotEl.setAttribute('cx', String(point.x))
  dotEl.setAttribute('cy', String(point.y))
}

function animateToIndex(index) {
  const maxIndex = steps.length - 1
  const target = maxIndex <= 0 ? 1 : index / maxIndex
  progressTween?.kill()

  progressTween = gsap.to(progressState, {
    value: target,
    duration: 0.92,
    ease: 'power3.inOut',
    onUpdate: () => applyProgress(progressState.value),
  })
}

function animateScreenContent() {
  const root = sectionRef.value
  if (!root) return

  gsap.fromTo(
    ['.cw__screen-kicker', '.cw__screen-title', '.cw__screen-desc'],
    { y: 18, opacity: 0, filter: 'blur(4px)' },
    {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.55,
      ease: 'power3.out',
      stagger: 0.06,
      overwrite: 'auto',
    }
  )

  gsap.fromTo(
    ['.cw__highlight-item', '.cw__fact-card'],
    { y: 12, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.05,
      delay: 0.1,
      overwrite: 'auto',
    }
  )
}

function normalizeIndex(index) {
  const max = steps.length
  if (index < 0) return max - 1
  if (index >= max) return 0
  return index
}

function setActiveStep(index) {
  activeStepIndex.value = normalizeIndex(index)
}

function goPrev() {
  setActiveStep(activeStepIndex.value - 1)
  restartAutoplay()
}

function goNext() {
  setActiveStep(activeStepIndex.value + 1)
  restartAutoplay()
}

function stopAutoplay() {
  if (autoplayTimer) {
    window.clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function startAutoplay() {
  if (!isAutoplay.value || autoplayTimer) return
  autoplayTimer = window.setInterval(() => {
    setActiveStep(activeStepIndex.value + 1)
  }, 5600)
}

function restartAutoplay() {
  stopAutoplay()
  startAutoplay()
}

function toggleAutoplay() {
  isAutoplay.value = !isAutoplay.value
  if (isAutoplay.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

onMounted(async () => {
  await nextTick()
  const pathEl = progressPathRef.value
  if (!pathEl) return

  pathLength.value = pathEl.getTotalLength()
  const root = sectionRef.value
  root?.style.setProperty('--cw-path-length', String(pathLength.value))
  applyProgress(0)
  animateScreenContent()
  startAutoplay()
})

watch(activeStepIndex, (index) => {
  animateToIndex(index)
  nextTick(() => animateScreenContent())
})

onBeforeUnmount(() => {
  progressTween?.kill()
  progressTween = null
  stopAutoplay()
})
</script>

<style scoped>
.cw {
  --cw-ink: #141417;
  --cw-muted: #52545b;
  --cw-line-base: rgba(122, 78, 255, 0.3);
  --cw-line-active: #7f58ff;
  --cw-glow: rgba(127, 88, 255, 0.32);
  --cw-path-length: 1;
  --cw-progress: 0;

  position: relative;
  color: var(--cw-ink);
  overflow-x: clip;
}

.cw__shell {
  position: relative;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  box-sizing: border-box;
}

.cw__topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: clamp(1.1rem, 2vw, 1.5rem);
}

.cw__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.cw__brand-mark {
  width: 0.42rem;
  height: 0.42rem;
  background: var(--cw-ink);
  border-radius: 999px;
}

.cw__brand-text {
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.cw__meta {
  display: grid;
  gap: 0.35rem;
  min-width: min(13rem, 32vw);
}

.cw__meta-count {
  justify-self: end;
  font-family: var(--font-body);
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  color: rgba(20, 20, 23, 0.45);
}

.cw__meta-track {
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: rgba(20, 20, 23, 0.12);
  overflow: hidden;
}

.cw__meta-progress {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #7f58ff 0%, #ab81ff 100%);
  transition: width 0.5s ease;
}

.cw__screen-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.05rem;
  margin-bottom: clamp(2.6rem, 6.4vw, 4.1rem);
  padding: clamp(1.1rem, 2.6vw, 1.65rem);
  border: 1px solid rgba(20, 20, 23, 0.1);
  border-radius: clamp(20px, 2.4vw, 30px);
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.28) 100%);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.cw__screen-backdrop {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 12%, rgba(127, 88, 255, 0.14), transparent 42%),
    radial-gradient(circle at 90% 84%, rgba(127, 88, 255, 0.1), transparent 48%);
  opacity: 0.9;
}

.cw__screen {
  min-height: clamp(10rem, 16vw, 12rem);
  max-width: min(54rem, 100%);
  position: relative;
  z-index: 1;
}

.cw__screen-kicker {
  margin: 0 0 0.4rem;
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(20, 20, 23, 0.54);
}

.cw__screen-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5vw, 4.05rem);
  line-height: 0.98;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.cw__screen-desc {
  margin: clamp(0.8rem, 1.55vw, 1.05rem) 0 0;
  max-width: min(46rem, 100%);
  font-family: var(--font-body);
  font-size: clamp(0.98rem, 1.4vw, 1.22rem);
  line-height: 1.45;
  color: var(--cw-muted);
}

.cw__screen-row {
  margin-top: clamp(1rem, 2vw, 1.4rem);
  display: grid;
  grid-template-columns: 1fr auto;
  gap: clamp(0.8rem, 2vw, 1.2rem);
  align-items: end;
}

.cw__highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.42rem;
}

.cw__highlight-item {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 0.98vw, 0.95rem);
  color: rgba(20, 20, 23, 0.74);
}

.cw__highlight-dot {
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: var(--cw-line-active);
  flex-shrink: 0;
}

.cw__fact-card {
  min-width: clamp(10rem, 16vw, 13.5rem);
  padding: clamp(0.7rem, 1.35vw, 0.95rem);
  border-radius: 14px;
  border: 1px solid rgba(20, 20, 23, 0.12);
  background: rgba(255, 255, 255, 0.66);
  box-shadow: 0 12px 28px rgba(20, 20, 23, 0.08);
  display: grid;
  gap: 0.16rem;
}

.cw__fact-value {
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 2vw, 1.55rem);
  line-height: 1;
  letter-spacing: -0.02em;
}

.cw__fact-label {
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.84vw, 0.82rem);
  color: rgba(20, 20, 23, 0.62);
}

.cw__controls {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.cw__ctrl {
  border: 1px solid rgba(20, 20, 23, 0.2);
  background: transparent;
  color: var(--cw-ink);
  border-radius: 999px;
  padding: 0.5rem 0.95rem;
  font-family: var(--font-body);
  font-size: 0.74rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}

.cw__ctrl:hover {
  border-color: rgba(20, 20, 23, 0.36);
}

.cw__ctrl--primary {
  border-color: rgba(127, 88, 255, 0.48);
  background: rgba(127, 88, 255, 0.11);
  color: #5e34e2;
}

.cw__ctrl:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.cw__path-wrap {
  position: relative;
  padding-top: 0.5rem;
}

.cw__path-svg {
  width: 100%;
  height: clamp(7rem, 12vw, 9.4rem);
  overflow: visible;
}

.cw__path {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.cw__path--base {
  stroke: var(--cw-line-base);
  stroke-width: 4;
}

.cw__path--progress {
  stroke: url(#cwPathGradient);
  stroke-width: 5;
  stroke-dasharray: var(--cw-path-length);
  stroke-dashoffset: calc(var(--cw-path-length) * (1 - var(--cw-progress)));
  filter: drop-shadow(0 0 8px var(--cw-glow));
}

.cw__dot-active {
  fill: #fff;
  stroke: var(--cw-line-active);
  stroke-width: 6;
  filter: drop-shadow(0 4px 14px rgba(127, 88, 255, 0.42));
}

.cw__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.85rem, 2.1vw, 1.35rem);
}

.cw__step-item {
  margin: 0;
}

.cw__step-node {
  width: clamp(0.95rem, 1.25vw, 1.2rem);
  height: clamp(0.95rem, 1.25vw, 1.2rem);
  border-radius: 50%;
  border: 2px solid rgba(127, 88, 255, 0.34);
  background: #fff;
  cursor: pointer;
  margin-bottom: 0.85rem;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.cw__step-node.is-active {
  transform: scale(1.12);
  border-color: var(--cw-line-active);
  background: color-mix(in srgb, var(--cw-line-active) 20%, #fff);
  box-shadow: 0 0 0 6px rgba(127, 88, 255, 0.12);
}

.cw__step-node.is-done {
  border-color: var(--cw-line-active);
}

.cw__ix {
  display: block;
  margin-bottom: 0.42rem;
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.16em;
  color: rgba(20, 20, 23, 0.45);
}

.cw__step-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-heading);
  font-size: clamp(0.98rem, 1.25vw, 1.22rem);
  line-height: 1.26;
  letter-spacing: -0.02em;
}

.cw__step-desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.84rem, 1.04vw, 0.98rem);
  line-height: 1.54;
  color: var(--cw-muted);
}

.cw-step-enter-active,
.cw-step-leave-active {
  transition: opacity 0.36s ease, transform 0.44s cubic-bezier(0.22, 1, 0.36, 1);
}

.cw-step-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.cw-step-leave-to {
  opacity: 0;
  transform: translateY(-14px);
}

@media (max-width: 900px) {
  .cw__topbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .cw__meta {
    width: 100%;
  }

  .cw__meta-count {
    justify-self: start;
  }

  .cw__screen-row {
    grid-template-columns: 1fr;
  }

  .cw__steps {
    grid-template-columns: 1fr;
  }

  .cw__path-svg {
    height: 5rem;
  }

  .cw__screen-title {
    font-size: clamp(1.8rem, 8.2vw, 2.8rem);
  }
}
</style>
