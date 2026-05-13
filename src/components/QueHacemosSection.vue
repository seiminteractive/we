<template>
  <section
    id="que-hacemos"
    ref="sectionRef"
    class="qh"
    aria-labelledby="qh-heading"
    aria-label="Nuestros pilares"
  >
    <div class="qh__fx" aria-hidden="true">
      <span class="qh__orb qh__orb--a" />
      <span class="qh__orb qh__orb--b" />
      <svg class="qh__grid" viewBox="0 0 1000 1000" preserveAspectRatio="none">
        <defs>
          <pattern id="que-hacemos-dots" width="42" height="42" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.05)" />
          </pattern>
        </defs>
        <rect width="1000" height="1000" fill="url(#que-hacemos-dots)" />
      </svg>
    </div>

    <div class="qh__shell">
      <header class="qh__head">
        <div class="qh__eyebrow" data-reveal>
          <span class="qh__eye-pulse" aria-hidden="true">
            <span class="qh__eye-dot" />
            <span class="qh__eye-ring" />
          </span>
          <span class="qh__eye-text">Nuestros pilares</span>
          <span class="qh__eye-rule" aria-hidden="true" />
          <span class="qh__eye-sub">Tres movimientos · Un horizonte</span>
        </div>

        <div class="qh__head-grid">
          <h2 id="qh-heading" class="qh__title" data-reveal>
            Formación, comunicación y estrategia
            <em class="qh__title-em">para transformar organizaciones.</em>
          </h2>

          <div class="qh__head-right" data-reveal>
            <p class="qh__lead">
              Tres disciplinas, una misma intención:
              mover lo posible hacia lo concreto.
            </p>
            <a href="#contacto" class="qh__cta">
              <span class="qh__cta-aura" aria-hidden="true" />
              <span class="qh__cta-label">Hablemos</span>
              <span class="qh__cta-icon" aria-hidden="true">
                <i class="pi pi-arrow-right"></i>
              </span>
            </a>
          </div>
        </div>
      </header>

      <div class="qh__panels" ref="panelsRef">
        <article
          v-for="(p, i) in pillars"
          :key="p.id"
          :ref="(el) => setPanelRef(el, i)"
          class="qh-panel"
          :class="`qh-panel--${p.id}`"
          @mousemove="onCardMove($event, i)"
          @mouseleave="onCardLeave(i)"
        >
          <div class="qh-panel__drawing" aria-hidden="true">
            <svg class="qh-panel__svg" viewBox="0 0 220 220">
              <path
                v-for="(d, di) in p.paths"
                :key="di"
                :d="d"
                class="qh-panel__stroke"
                fill="none"
              />
            </svg>
          </div>

          <div class="qh-panel__body">
            <span class="qh-panel__num">{{ pad(i + 1) }}</span>
            <h3 class="qh-panel__title">{{ p.title }}</h3>
            <p class="qh-panel__desc">{{ p.detail }}</p>
            <ul class="qh-panel__tags" role="list">
              <li v-for="t in p.tags" :key="t" class="qh-panel__tag">{{ t }}</li>
            </ul>
          </div>
        </article>
      </div>
    </div>

    <div
      v-for="(p, i) in pillars"
      :key="`float-${p.id}`"
      class="qh-float"
      :ref="(el) => setFloatRef(el, i)"
      aria-hidden="true"
    >
      <img :src="p.floatImg" alt="" class="qh-float__img" />
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import imgFormacion from '../assets/formacionEnSostenibilidad.jpeg'
import imgComunicacion from '../assets/comunicacionInstitucional.jpeg'
import imgEstrategia from '../assets/estrategiasPublicasDeTransformacion.jpeg'

gsap.registerPlugin(ScrollTrigger)

const { sectionRef } = useScrollReveal()
const panelsRef = ref(null)
const panelRefs = ref([])
const floatRefs = ref([])

const pillars = [
  {
    id: 'formacion',
    title: 'Formación',
    detail:
      'Programas en sostenibilidad, inteligencia artificial, innovación y reconversión para líderes, equipos y comunidades.',
    tags: ['Líderes', 'Equipos', 'Comunidades'],
    floatImg: imgFormacion,
    paths: [
      // Open book – left page
      'M 110 160 C 100 155, 50 150, 40 130 L 40 80 C 50 95, 100 100, 110 105 Z',
      // Open book – right page
      'M 110 160 C 120 155, 170 150, 180 130 L 180 80 C 170 95, 120 100, 110 105 Z',
      // Book spine
      'M 110 105 L 110 160',
      // Rising knowledge sparks
      'M 80 75 C 80 60, 85 50, 90 38',
      'M 110 70 L 110 28',
      'M 140 75 C 140 60, 135 50, 130 38',
      // Sparkle crosses
      'M 87 35 L 93 41 M 90 33 L 90 43',
      'M 107 25 L 113 31 M 110 23 L 110 33',
      'M 127 35 L 133 41 M 130 33 L 130 43',
    ],
  },
  {
    id: 'comunicacion',
    title: 'Comunicación estratégica',
    detail:
      'Narrativas, posicionamiento, campañas y comunicación institucional para acompañar procesos de crecimiento y cambio.',
    tags: ['Narrativa', 'Campañas', 'Institucional'],
    floatImg: imgComunicacion,
    paths: [
      // Main speech bubble
      'M 30 55 C 30 38, 45 30, 55 30 L 125 30 C 140 30, 150 38, 150 55 L 150 95 C 150 112, 140 120, 125 120 L 68 120 L 48 145 L 54 120 C 40 120, 30 112, 30 95 Z',
      // Small reply bubble
      'M 160 75 C 160 66, 168 60, 175 60 L 200 60 C 207 60, 215 66, 215 75 L 215 100 C 215 109, 207 115, 200 115 L 183 115 L 176 130 L 179 115 C 168 115, 160 109, 160 100 Z',
      // Text lines in main bubble
      'M 44 58 L 120 58',
      'M 44 74 L 136 74',
      'M 44 90 L 100 90',
      // Bridge between bubbles
      'M 150 92 C 153 87, 156 83, 160 86',
    ],
  },
  {
    id: 'estrategia',
    title: 'Estrategia y transformación',
    detail:
      'Diseño de agendas, proyectos e iniciativas para modernizar organizaciones y generar impacto real.',
    tags: ['Agendas', 'Proyectos', 'Impacto'],
    floatImg: imgEstrategia,
    paths: [
      // Route / journey path
      'M 20 185 C 40 185, 50 165, 60 145 C 70 125, 90 115, 110 115 C 130 115, 140 95, 150 75 C 160 55, 180 42, 200 32',
      // Waypoint dots (small circles via arcs)
      'M 65 145 A 5 5 0 1 1 65 144.99 Z',
      'M 115 115 A 5 5 0 1 1 115 114.99 Z',
      'M 155 75 A 5 5 0 1 1 155 74.99 Z',
      // Start marker
      'M 25 185 A 5 5 0 1 1 25 184.99 Z',
      // Flag at destination
      'M 200 32 L 200 10',
      'M 200 10 L 218 18 L 200 26',
    ],
  },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

function setPanelRef(el, i) {
  if (el) panelRefs.value[i] = el
}

function setFloatRef(el, i) {
  if (el) floatRefs.value[i] = el
}

let ctx
let orbTweens = []
let tiltCleanups = []
const floatQuickTos = []

function buildCardReveal(el, i) {
  const strokes = el.querySelectorAll('.qh-panel__stroke')
  const num = el.querySelector('.qh-panel__num')
  const title = el.querySelector('.qh-panel__title')
  const desc = el.querySelector('.qh-panel__desc')
  const tags = el.querySelectorAll('.qh-panel__tag')

  strokes.forEach((p) => {
    let len = 400
    try { len = p.getTotalLength() || len } catch (_) {}
    gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
  })

  gsap.set(el, { opacity: 0, y: 52 })
  gsap.set(num, { opacity: 0, y: 16 })
  gsap.set(title, { opacity: 0, y: 22 })
  gsap.set(desc, { opacity: 0, y: 18, filter: 'blur(5px)' })
  gsap.set(tags, { opacity: 0, y: 10 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: 'top 85%',
      end: 'bottom 25%',
      toggleActions: 'play none none reverse',
    },
    defaults: { ease: 'power3.out' },
  })

  tl.to(el, { opacity: 1, y: 0, duration: 1.1 }, i * 0.14)
    .to(strokes, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut', stagger: 0.25 }, '<0.15')
    .to(num, { opacity: 1, y: 0, duration: 0.6 }, '<0.3')
    .to(title, { opacity: 1, y: 0, duration: 0.85 }, '<0.1')
    .to(desc, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.95 }, '<0.15')
    .to(tags, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 }, '<0.2')

  tl.call(() => gsap.set(desc, { clearProps: 'filter' }))
}

function bindTilt(el) {
  if (!el) return null
  const rxTo = gsap.quickTo(el, 'rotationX', { duration: 0.45, ease: 'power3.out' })
  const ryTo = gsap.quickTo(el, 'rotationY', { duration: 0.45, ease: 'power3.out' })
  const scTo = gsap.quickTo(el, 'scale', { duration: 0.55, ease: 'power3.out' })

  const onMove = (e) => {
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    rxTo(-y * 10)
    ryTo(x * 10)
    scTo(1.03)
  }
  const onLeave = () => {
    rxTo(0)
    ryTo(0)
    scTo(1)
  }
  el.addEventListener('mousemove', onMove)
  el.addEventListener('mouseleave', onLeave)
  return () => {
    el.removeEventListener('mousemove', onMove)
    el.removeEventListener('mouseleave', onLeave)
  }
}

function onCardMove(e, i) {
  const floatEl = floatRefs.value[i]
  if (!floatEl) return

  if (!floatQuickTos[i]) {
    floatQuickTos[i] = {
      x: gsap.quickTo(floatEl, 'x', { duration: 0.5, ease: 'power3.out' }),
      y: gsap.quickTo(floatEl, 'y', { duration: 0.5, ease: 'power3.out' }),
    }
  }

  floatQuickTos[i].x(e.clientX + 28)
  floatQuickTos[i].y(e.clientY - 28)

  gsap.to(floatEl, {
    opacity: 1,
    scale: 1,
    duration: 0.35,
    ease: 'power2.out',
    overwrite: 'auto',
  })
}

function onCardLeave(i) {
  const floatEl = floatRefs.value[i]
  if (!floatEl) return
  gsap.to(floatEl, {
    opacity: 0,
    scale: 0.85,
    duration: 0.3,
    ease: 'power2.in',
    overwrite: 'auto',
  })
}

onMounted(async () => {
  await nextTick()
  const root = sectionRef.value
  if (!root) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  ctx = gsap.context(() => {
    panelRefs.value.forEach((el, i) => {
      if (!el) return
      buildCardReveal(el, i)
      const c = bindTilt(el)
      if (c) tiltCleanups.push(c)
    })

    orbTweens.push(
      gsap.to('.qh__orb--a', {
        x: '+=70', y: '-=50', duration: 20,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
    )
    orbTweens.push(
      gsap.to('.qh__orb--b', {
        x: '-=60', y: '+=70', duration: 26,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      })
    )
  }, root)
})

onBeforeUnmount(() => {
  ctx?.revert()
  orbTweens.forEach((t) => t.kill())
  orbTweens = []
  tiltCleanups.forEach((fn) => fn())
  tiltCleanups = []
})
</script>

<style scoped>
.qh {
  --qh-ink: #ffffff;
  --qh-muted: rgba(255, 255, 255, 0.66);
  --qh-faint: rgba(255, 255, 255, 0.42);
  --qh-line: rgba(255, 255, 255, 0.16);
  --qh-line-soft: rgba(255, 255, 255, 0.08);
  --qh-accent: #21dc99;
  --qh-warm: #efdbb4;
  --qh-cool: #8cdcff;

  position: relative;
  isolation: isolate;
  background: transparent;
  color: var(--qh-ink);
  overflow: visible;
  box-sizing: border-box;
}

/* Capa decorativa: sin overflow:hidden para no “cortar” el blur (evita la raya / división). */
.qh__fx {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  overflow: visible;
  inset: -25% -18% -28% -18%;
}

.qh__grid {
  position: absolute;
  inset: -8%;
  width: 116%;
  height: 116%;
  opacity: 0.7;
}

.qh__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
  opacity: 0.18;
  mix-blend-mode: screen;
  will-change: transform;
}

.qh__orb--a {
  width: 40rem;
  height: 40rem;
  top: -10%;
  left: -6%;
  background: radial-gradient(circle, color-mix(in srgb, var(--qh-accent) 60%, transparent), transparent 65%);
}

.qh__orb--b {
  width: 34rem;
  height: 34rem;
  bottom: -14%;
  right: -8%;
  background: radial-gradient(circle, color-mix(in srgb, var(--qh-warm) 60%, transparent), transparent 70%);
  opacity: 0.15;
}

.qh__shell {
  position: relative;
  z-index: 1;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  box-sizing: border-box;
}

.qh__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: clamp(1.25rem, 2.4vw, 1.85rem);
  font-family: var(--font-body);
}

.qh__eye-pulse {
  position: relative;
  width: 0.55rem;
  height: 0.55rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.qh__eye-dot {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: var(--qh-accent);
  box-shadow: 0 0 12px var(--qh-accent);
}

.qh__eye-ring {
  position: absolute;
  inset: -0.35rem;
  border-radius: 999px;
  border: 1px solid var(--qh-accent);
  opacity: 0;
  animation: qhPulseRing 2.2s ease-out infinite;
}

@keyframes qhPulseRing {
  0% { opacity: 0.7; transform: scale(0.5); }
  100% { opacity: 0; transform: scale(1.6); }
}

.qh__eye-text {
  font-size: 0.7rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.qh__eye-rule {
  width: 2.2rem;
  height: 1px;
  background: var(--qh-faint);
}

.qh__eye-sub {
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--qh-faint);
}

.qh__head {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.qh__head-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: end;
}

.qh__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.65rem, 3.4vw, 2.65rem);
  line-height: 1.18;
  letter-spacing: -0.01em;
  font-weight: var(--font-w-bold);
  color: var(--qh-ink);
  text-wrap: balance;
}

.qh__title-em {
  font-style: italic;
  font-weight: var(--font-w-regular);
  color: var(--qh-faint);
}

.qh__head-right {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1rem, 2vw, 1.4rem);
}

.qh__lead {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.875rem, 1.05vw, 0.96rem);
  line-height: 1.6;
  color: var(--qh-muted);
  max-width: 22rem;
}

.qh__cta {
  position: relative;
  isolation: isolate;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: var(--qh-ink);
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.45rem 0.45rem 0.45rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: var(--font-w-medium);
  overflow: hidden;
  transition:
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s,
    background 0.3s;
}

.qh__cta-aura {
  position: absolute;
  inset: -50%;
  z-index: -1;
  background: radial-gradient(circle, color-mix(in srgb, var(--qh-accent) 35%, transparent), transparent 60%);
  opacity: 0;
  transform: scale(0.6);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s;
  pointer-events: none;
}

.qh__cta:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.5);
}

.qh__cta:hover .qh__cta-aura {
  opacity: 1;
  transform: scale(1);
}

.qh__cta-label {
  padding-right: 0.75rem;
}

.qh__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: #fff;
  color: var(--brand-01);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.qh__cta:hover .qh__cta-icon {
  transform: rotate(-10deg);
}

.qh__cta-icon .pi {
  font-size: 0.7rem;
}

/* ---------- Panels ---------- */
.qh__panels {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1rem, 2.2vw, 1.8rem);
  perspective: 1200px;
}

.qh-panel {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  padding: clamp(1.5rem, 2.4vw, 2rem);
  border-radius: 22px;
  border: 1px solid var(--qh-line);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 100%),
    rgba(8, 14, 12, 0.4);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  transform-style: preserve-3d;
  transition:
    border-color 0.4s ease,
    box-shadow 0.55s ease;
  will-change: transform;
  overflow: visible;
  cursor: default;
}

.qh-panel:hover {
  border-color: rgba(255, 255, 255, 0.34);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.25),
    0 0 0 1px rgba(255, 255, 255, 0.06) inset;
}

.qh-panel--formacion:hover { border-color: color-mix(in srgb, var(--qh-accent) 55%, transparent); }
.qh-panel--comunicacion:hover { border-color: color-mix(in srgb, var(--qh-warm) 55%, transparent); }
.qh-panel--estrategia:hover { border-color: color-mix(in srgb, var(--qh-cool) 55%, transparent); }

/* SVG drawing */
.qh-panel__drawing {
  position: relative;
  width: 100%;
  height: clamp(8rem, 13vw, 11rem);
  margin-bottom: clamp(1rem, 1.8vw, 1.4rem);
}

.qh-panel__svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.qh-panel__stroke {
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.6;
  transition: opacity 0.4s ease;
}

.qh-panel--formacion .qh-panel__stroke {
  stroke: var(--qh-accent);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--qh-accent) 45%, transparent));
}

.qh-panel--comunicacion .qh-panel__stroke {
  stroke: var(--qh-warm);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--qh-warm) 45%, transparent));
}

.qh-panel--estrategia .qh-panel__stroke {
  stroke: var(--qh-cool);
  filter: drop-shadow(0 0 6px color-mix(in srgb, var(--qh-cool) 45%, transparent));
}

.qh-panel:hover .qh-panel__stroke {
  opacity: 1;
}

/* Body */
.qh-panel__body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.qh-panel__num {
  display: block;
  margin-bottom: clamp(0.55rem, 1vw, 0.75rem);
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.2em;
  color: var(--qh-faint);
}

.qh-panel__title {
  margin: 0 0 clamp(0.6rem, 1vw, 0.85rem);
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 1.75vw, 1.55rem);
  line-height: 1.18;
  letter-spacing: -0.01em;
  font-weight: var(--font-w-bold);
  color: var(--qh-ink);
}

.qh-panel__desc {
  margin: 0 0 clamp(1rem, 1.8vw, 1.4rem);
  font-family: var(--font-body);
  font-size: clamp(0.86rem, 1vw, 0.95rem);
  line-height: 1.6;
  color: var(--qh-muted);
  flex: 1;
}

.qh-panel__tags {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.qh-panel__tag {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.03em;
  padding: 0.32rem 0.72rem;
  border-radius: 999px;
  border: 1px solid var(--qh-line);
  background: rgba(255, 255, 255, 0.03);
  color: var(--qh-muted);
  transition: border-color 0.3s, color 0.3s;
}

.qh-panel:hover .qh-panel__tag {
  border-color: rgba(255, 255, 255, 0.28);
  color: var(--qh-ink);
}

/* Floating image – fixed to viewport, follows cursor freely */
.qh-float {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
  pointer-events: none;
  width: clamp(7rem, 11vw, 9.5rem);
  height: clamp(7rem, 11vw, 9.5rem);
  border-radius: 16px;
  overflow: hidden;
  opacity: 0;
  transform: translate(-20%, -80%) scale(0.85);
  box-shadow:
    0 16px 48px rgba(0, 0, 0, 0.38),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  will-change: transform, opacity;
}

.qh-float__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .qh__head-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .qh__panels {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .qh-float {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .qh-panel {
    transform: none !important;
    opacity: 1 !important;
  }

  .qh-panel__stroke {
    stroke-dasharray: none !important;
    stroke-dashoffset: 0 !important;
  }

  .qh__orb,
  .qh__eye-ring {
    animation: none !important;
  }
}
</style>
