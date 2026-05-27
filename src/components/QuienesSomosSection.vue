<template>
  <section
    id="quienes-somos"
    ref="sectionRef"
    class="about"
    aria-labelledby="about-title"
    @mousemove="onSectionMouseMove"
    @mouseleave="onSectionMouseLeave"
  >
    <!-- <div class="about__cursor-light" ref="lightRef" aria-hidden="true" /> -->

    <div class="about__shell">
      <!-- Kicker (same pattern as the rest of the site) -->
      <div class="about__kicker" data-reveal>
        <span class="about__kicker-pill" aria-hidden="true" />
        <span class="about__kicker-text">QUÉ HACEMOS</span>
        <span class="about__kicker-rule" aria-hidden="true" />
        <span class="about__kicker-sub">Tres movimientos · Un horizonte</span>
      </div>

      <!-- Hero: title left, 3D Earth right -->
      <div class="about__hero">
        <div class="about__title-col">
          <h2 id="about-title" class="about__title" ref="titleRef">
            <span class="about__title-row">
              <span
                v-for="(ch, i) in t1Chars"
                :key="`a${i}`"
                class="about__char"
              >{{ ch === ' ' ? ' ' : ch }}</span>
            </span>
            <span class="about__title-row about__title-row--em">
              <span
                v-for="(ch, i) in t2Chars"
                :key="`b${i}`"
                class="about__char"
              >{{ ch === ' ' ? ' ' : ch }}</span>
            </span>
          </h2>
        </div>

        <div class="about__visual">
          <div class="about__frame">
            <span class="about__corner about__corner--tl" aria-hidden="true" />
            <span class="about__corner about__corner--tr" aria-hidden="true" />
            <span class="about__corner about__corner--bl" aria-hidden="true" />
            <span class="about__corner about__corner--br" aria-hidden="true" />
            <div class="about__earth">
              <Earth3D ref="earth3dRef" />
            </div>
            <div class="about__frame-axis about__frame-axis--h" aria-hidden="true" />
            <div class="about__frame-axis about__frame-axis--v" aria-hidden="true" />
          </div>
          <div class="about__frame-meta">
            <span class="about__frame-tag">
              <span class="about__frame-dot" aria-hidden="true" />
              Plataforma · En órbita
            </span>
            <span class="about__frame-coords" ref="coordRef">— · —</span>
          </div>
        </div>
      </div>

      <!-- Manifesto statement + CTA -->
      <div class="about__manifesto">
        <p class="about__statement" ref="statementRef">
          <span
            v-for="(w, i) in stmtWords"
            :key="i"
            class="about__stmt-word"
          >
            <span class="about__stmt-inner">{{ w }}</span>
          </span>
        </p>
        <a href="#contacto" class="about__cta" ref="ctaRef">
          <span class="about__cta-glow" aria-hidden="true" />
          <span class="about__cta-label">Conocer más</span>
          <span class="about__cta-arrow" aria-hidden="true">
            <i class="pi pi-arrow-right"></i>
          </span>
        </a>
      </div>

      <!-- Divider with traveling pulse -->
      <div class="about__divider" aria-hidden="true">
        <svg
          class="about__divider-svg"
          viewBox="0 0 1000 4"
          preserveAspectRatio="none"
        >
          <line
            x1="0"
            y1="2"
            x2="1000"
            y2="2"
            stroke="rgba(28,26,24,0.18)"
            stroke-width="1"
            vector-effect="non-scaling-stroke"
          />
          <line
            ref="pulseLineRef"
            x1="0"
            y1="2"
            x2="1000"
            y2="2"
            stroke="#21dc99"
            stroke-width="1.8"
            stroke-dasharray="60 940"
            vector-effect="non-scaling-stroke"
            style="filter: drop-shadow(0 0 5px rgba(33,220,153,0.85));"
          />
        </svg>
      </div>

      <!-- Verticales row -->
      <ol class="about__verticales" role="list">
        <li
          v-for="(v, i) in verticales"
          :key="v.id"
          class="about__vert"
          :ref="(el) => setVertRef(el, i)"
        >
          <div class="about__vert-head">
            <span class="about__vert-num" :ref="(el) => setNumRef(el, i)">{{ pad(i + 1) }}</span>
            <span class="about__vert-rule" aria-hidden="true" />
            <span class="about__vert-name">{{ v.name }}</span>
          </div>
          <p class="about__vert-desc">{{ v.desc }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Earth3D from './Earth3D.vue'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const lightRef = ref(null)
const titleRef = ref(null)
const earth3dRef = ref(null)
const statementRef = ref(null)
const ctaRef = ref(null)
const pulseLineRef = ref(null)
const coordRef = ref(null)
const vertRefs = ref([])
const numRefs = ref([])

const titlePart1 = 'Tres disciplinas,'
const titlePart2 = 'una misma intención.'
const t1Chars = computed(() => titlePart1.split(''))
const t2Chars = computed(() => titlePart2.split(''))

const stmtWords = computed(() =>
  'WE es una plataforma de formación, comunicación estratégica y diseño de transformación que acompaña a organizaciones en una nueva etapa: más tecnológica, más sostenible y más exigente en términos de liderazgo. No trabajamos desde lo teórico. Trabajamos desde lo aplicado, lo institucional y lo estratégico.'.split(' ')
)

const verticales = [
  {
    id: 'formacion',
    name: 'Formación',
    desc: 'Capacitación aplicada para equipos que lideran cambio real, con foco en sostenibilidad, IA e innovación.',
  },
  {
    id: 'comunicacion',
    name: 'Comunicación',
    desc: 'Estrategia narrativa alineada al propósito y la reputación, para sostener procesos de transformación.',
  },
  {
    id: 'estrategia',
    name: 'Estrategia',
    desc: 'Diseño de transformación: procesos, cultura y gobernanza con visión de futuro institucional.',
  },
]

function pad(n) {
  return String(n).padStart(2, '0')
}

function setVertRef(el, i) {
  if (el) vertRefs.value[i] = el
}
function setNumRef(el, i) {
  if (el) numRefs.value[i] = el
}

let ctx
let pointer = { x: 0, y: 0, tx: 0, ty: 0 }
let pointerRAF = 0
let scrollTrigger = null
let pulseTween = null
let lightQX, lightQY, ctaQX, ctaQY
let coordRAF = 0
let coordLon = 0
let cleanupCTA

function onSectionMouseMove(e) {
  const rect = sectionRef.value.getBoundingClientRect()
  pointer.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1
  pointer.ty = ((e.clientY - rect.top) / rect.height) * 2 - 1
  if (lightQX && lightQY) {
    lightQX(e.clientX - rect.left)
    lightQY(e.clientY - rect.top)
  }
}
function onSectionMouseLeave() {
  pointer.tx = 0
  pointer.ty = 0
}

function pointerLoop() {
  pointerRAF = requestAnimationFrame(pointerLoop)
  pointer.x += (pointer.tx - pointer.x) * 0.06
  pointer.y += (pointer.ty - pointer.y) * 0.06
  if (earth3dRef.value) {
    earth3dRef.value.setPointer(pointer.x, pointer.y)
  }
}

function setupCursorLight() {
  if (!lightRef.value) return
  lightQX = gsap.quickTo(lightRef.value, 'x', { duration: 0.55, ease: 'power3.out' })
  lightQY = gsap.quickTo(lightRef.value, 'y', { duration: 0.55, ease: 'power3.out' })
}

function setupCTAMagnetic() {
  const cta = ctaRef.value
  if (!cta) return null
  ctaQX = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power2.out' })
  ctaQY = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power2.out' })
  const onMove = (e) => {
    const rect = cta.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    ctaQX((e.clientX - cx) * 0.22)
    ctaQY((e.clientY - cy) * 0.22)
  }
  const onLeave = () => {
    ctaQX(0)
    ctaQY(0)
  }
  cta.addEventListener('mousemove', onMove)
  cta.addEventListener('mouseleave', onLeave)
  return () => {
    cta.removeEventListener('mousemove', onMove)
    cta.removeEventListener('mouseleave', onLeave)
  }
}

function setupReveal() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    gsap.set([
      '.about__kicker',
      '.about__char',
      '.about__visual',
      '.about__statement',
      '.about__cta',
      '.about__vert',
      '.about__divider',
    ], { opacity: 1, y: 0, x: 0, scale: 1 })
    return
  }

  const tl = gsap.timeline({
    scrollTrigger: { trigger: sectionRef.value, start: 'top 75%', once: true },
    defaults: { ease: 'power3.out' },
  })

  // Kicker
  gsap.set('.about__kicker', { opacity: 0, y: 10 })
  tl.to('.about__kicker', { opacity: 1, y: 0, duration: 0.8 }, 0)

  // Title characters - each rises from below with stagger
  const chars = titleRef.value ? titleRef.value.querySelectorAll('.about__char') : []
  gsap.set(chars, { opacity: 0, y: 36, rotateX: -65 })
  tl.to(
    chars,
    {
      opacity: 1,
      y: 0,
      rotateX: 0,
      duration: 1.0,
      stagger: 0.014,
      ease: 'expo.out',
    },
    0.15
  )

  // 3D Earth frame
  gsap.set('.about__visual', { opacity: 0, scale: 0.85, transformOrigin: 'center center' })
  tl.to(
    '.about__visual',
    { opacity: 1, scale: 1, duration: 1.3, ease: 'expo.out' },
    0.5
  )

  // Statement words
  const stmtInners = statementRef.value
    ? statementRef.value.querySelectorAll('.about__stmt-inner')
    : []
  gsap.set(stmtInners, { opacity: 0, y: 18, filter: 'blur(4px)' })
  tl.to(
    stmtInners,
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.85,
      stagger: 0.014,
    },
    0.9
  )

  // CTA
  gsap.set('.about__cta', { opacity: 0, y: 14 })
  tl.to('.about__cta', { opacity: 1, y: 0, duration: 0.7 }, 1.6)

  // Divider
  gsap.set('.about__divider', { opacity: 0, scaleX: 0.5, transformOrigin: 'center center' })
  tl.to('.about__divider', { opacity: 1, scaleX: 1, duration: 1.0 }, 1.7)

  // Verticales
  vertRefs.value.forEach((el, i) => {
    if (!el) return
    const rule = el.querySelector('.about__vert-rule')
    const name = el.querySelector('.about__vert-name')
    const desc = el.querySelector('.about__vert-desc')
    const numEl = numRefs.value[i]

    gsap.set(el, { opacity: 1 })
    if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' })
    if (name) gsap.set(name, { opacity: 0, y: 10 })
    if (desc) gsap.set(desc, { opacity: 0, y: 12 })
    if (numEl) gsap.set(numEl, { opacity: 0, y: 10 })

    const t = 1.9 + i * 0.18
    if (numEl) {
      tl.to(numEl, { opacity: 1, y: 0, duration: 0.6 }, t)
      const counter = { v: 0 }
      const finalN = i + 1
      tl.to(
        counter,
        {
          v: finalN,
          duration: 0.95,
          ease: 'power2.out',
          onUpdate: () => {
            numEl.textContent = pad(Math.floor(counter.v))
          },
          onComplete: () => {
            numEl.textContent = pad(finalN)
          },
        },
        t
      )
    }
    if (rule) tl.to(rule, { scaleX: 1, duration: 0.85, ease: 'power3.out' }, t + 0.1)
    if (name) tl.to(name, { opacity: 1, y: 0, duration: 0.6 }, t + 0.18)
    if (desc) tl.to(desc, { opacity: 1, y: 0, duration: 0.7 }, t + 0.28)
  })

  // Start pulse loop on divider
  tl.call(() => startPulseLoop(), null, 2.6)
}

function startPulseLoop() {
  if (!pulseLineRef.value) return
  pulseTween = gsap.fromTo(
    pulseLineRef.value,
    { attr: { 'stroke-dashoffset': 1000 } },
    {
      attr: { 'stroke-dashoffset': -60 },
      duration: 3.4,
      ease: 'power1.inOut',
      repeat: -1,
      repeatDelay: 0.5,
    }
  )
}

function setupScrollLink() {
  scrollTrigger = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      if (earth3dRef.value) earth3dRef.value.setScrollProgress(self.progress)
    },
  })
}

function startCoordTicker() {
  function update() {
    coordRAF = requestAnimationFrame(update)
    coordLon += 0.16
    const lat = Math.sin(performance.now() * 0.00022) * 38
    if (coordRef.value) {
      const lo = coordLon % 360
      coordRef.value.textContent =
        `${lo.toFixed(1).padStart(5, '0')}° · ${lat.toFixed(1).padStart(4, '0')}°`
    }
  }
  update()
}

onMounted(() => {
  ctx = gsap.context(() => {
    setupCursorLight()
    setupReveal()
    setupScrollLink()
    cleanupCTA = setupCTAMagnetic()
    startCoordTicker()
    pointerLoop()
  }, sectionRef.value)
})

onUnmounted(() => {
  cancelAnimationFrame(pointerRAF)
  cancelAnimationFrame(coordRAF)
  if (scrollTrigger) scrollTrigger.kill()
  if (pulseTween) pulseTween.kill()
  if (cleanupCTA) cleanupCTA()
  if (ctx) ctx.revert()
})
</script>

<style scoped>
.about {
  --ink: #1c1a18;
  --ink-soft: rgba(28, 26, 24, 0.62);
  --ink-faint: rgba(28, 26, 24, 0.36);
  --ink-line: rgba(28, 26, 24, 0.12);
  --ink-line-soft: rgba(28, 26, 24, 0.08);
  --accent: #21dc99;

  position: relative;
  background: transparent;
  color: var(--ink);
  box-sizing: border-box;
  overflow: hidden;
  isolation: isolate;
  padding: clamp(4rem, 9vh, 6.5rem) 0 clamp(4rem, 9vh, 6.5rem);
}

.about__cursor-light {
  position: absolute;
  top: 0;
  left: 0;
  width: 30rem;
  height: 30rem;
  margin: -15rem 0 0 -15rem;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  background: radial-gradient(
    circle,
    rgba(33, 220, 153, 0.10) 0%,
    rgba(33, 220, 153, 0.03) 40%,
    transparent 72%
  );
  filter: blur(8px);
  will-change: transform;
}

.about__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: 0 var(--section-pad-x);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 6vh, 4rem);
}

/* Kicker — same pattern as the rest of the site */
.about__kicker {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-family: var(--font-heading);
}

.about__kicker-pill {
  display: block;
  width: 1.4rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--ink);
  flex-shrink: 0;
}

.about__kicker-text {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
}

.about__kicker-rule {
  display: inline-block;
  width: 2.2rem;
  height: 1px;
  background: var(--ink-faint);
  flex-shrink: 0;
}

.about__kicker-sub {
  font-family: var(--font-heading);
  font-size: 0.64rem;
  font-weight: var(--font-w-regular);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

/* ===== Hero: title left, 3D right ===== */
.about__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
}

.about__title-col {
  min-width: 0;
}

.about__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4.2vw, 3rem);
  line-height: 1.12;
  font-weight: 700;
  color: var(--ink);
  font-synthesis: none;
  text-wrap: balance;
  perspective: 700px;
}

.about__title-row {
  display: block;
}

.about__title-row--em {
  font-weight: var(--font-w-regular);
  color: var(--ink-soft);
}

.about__char {
  display: inline-block;
  white-space: pre;
  will-change: transform, opacity;
}

/* 3D Earth frame */
.about__visual {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  align-items: stretch;
  min-width: 0;
}

.about__frame {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  max-width: 22rem;
  margin: 0 auto;
}

.about__corner {
  position: absolute;
  width: 1.05rem;
  height: 1.05rem;
  border-color: var(--ink);
  z-index: 2;
}

.about__corner--tl {
  top: -2px;
  left: -2px;
  border-top: 1px solid;
  border-left: 1px solid;
}
.about__corner--tr {
  top: -2px;
  right: -2px;
  border-top: 1px solid;
  border-right: 1px solid;
}
.about__corner--bl {
  bottom: -2px;
  left: -2px;
  border-bottom: 1px solid;
  border-left: 1px solid;
}
.about__corner--br {
  bottom: -2px;
  right: -2px;
  border-bottom: 1px solid;
  border-right: 1px solid;
}

.about__earth {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.about__frame-axis {
  position: absolute;
  z-index: 1;
  pointer-events: none;
}

.about__frame-axis--h {
  left: 0;
  right: 0;
  top: 50%;
  height: 0;
  border-top: 1px dashed var(--ink-line);
  transform: translateY(-0.5px);
}

.about__frame-axis--v {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 0;
  border-left: 1px dashed var(--ink-line);
  transform: translateX(-0.5px);
}

.about__frame-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 0.1rem;
  max-width: 22rem;
  margin: 0 auto;
  width: 100%;
}

.about__frame-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-heading);
  font-size: 0.58rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.about__frame-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 8px var(--accent);
  animation: aboutDotPulse 2.2s ease-in-out infinite;
}

@keyframes aboutDotPulse {
  0%, 100% { opacity: 0.65; transform: scale(0.9); }
  50%      { opacity: 1; transform: scale(1.08); }
}

.about__frame-coords {
  font-family: var(--font-body);
  font-size: 0.58rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.10em;
  color: var(--ink-faint);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

/* ===== Manifesto (statement + CTA) ===== */
.about__manifesto {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4rem);
  align-items: end;
}

.about__statement {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.98rem, 1.15vw, 1.08rem);
  font-weight: var(--font-w-regular);
  line-height: 1.6;
  color: var(--ink);
  max-width: 36rem;
}

.about__stmt-word {
  display: inline-block;
  margin-right: 0.24em;
  overflow: hidden;
}

.about__stmt-inner {
  display: inline-block;
  will-change: transform, opacity, filter;
}

.about__cta {
  position: relative;
  display: inline-flex;
  align-items: center;
  align-self: end;
  justify-self: end;
  gap: 0.55rem;
  padding: 0.85rem 0.4rem 0.85rem 1.3rem;
  text-decoration: none;
  color: var(--ink);
  border: 1px solid var(--ink-line);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-family: var(--font-heading);
  font-size: 0.66rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  overflow: visible;
  isolation: isolate;
  transition: border-color 0.3s ease, background 0.3s ease;
  will-change: transform;
}

.about__cta-glow {
  position: absolute;
  inset: -10px;
  border-radius: 999px;
  background: radial-gradient(
    circle,
    rgba(33, 220, 153, 0.30) 0%,
    rgba(33, 220, 153, 0.08) 50%,
    transparent 80%
  );
  filter: blur(14px);
  opacity: 0;
  z-index: -1;
  transition: opacity 0.4s ease;
}

.about__cta:hover {
  border-color: rgba(28, 26, 24, 0.3);
  background: rgba(255, 255, 255, 0.78);
}

.about__cta:hover .about__cta-glow {
  opacity: 1;
}

.about__cta-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.about__cta:hover .about__cta-arrow {
  transform: rotate(-12deg);
}

.about__cta-arrow .pi {
  font-size: 0.7rem;
}

/* ===== Divider with traveling pulse ===== */
.about__divider {
  position: relative;
  width: 100%;
  height: 4px;
}

.about__divider-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

/* ===== Verticales ===== */
.about__verticales {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.75rem, 4vw, 3rem);
}

.about__vert {
  margin: 0;
  min-width: 0;
}

.about__vert-head {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.85rem;
}

.about__vert-num {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 2.3vw, 2.05rem);
  /* font-weight: var(--font-w-extrabold); */
  line-height: 0.95;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  color: var(--ink);
  display: inline-block;
}

.about__vert-rule {
  flex: 1;
  height: 1px;
  background: var(--ink);
  opacity: 0.7;
  display: block;
  max-width: 2.5rem;
}

.about__vert-name {
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--ink);
  display: inline-block;
}

.about__vert-desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 0.96vw, 0.92rem);
  font-weight: var(--font-w-regular);
  line-height: 1.55;
  color: var(--ink-soft);
  max-width: 22rem;
}

/* ===== Responsive ===== */
@media (max-width: 960px) {
  .about__hero {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about__frame {
    max-width: 16rem;
  }

  .about__manifesto {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .about__cta {
    justify-self: start;
  }

  .about__verticales {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 720px) {
  .about__cursor-light {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about__frame-dot {
    animation: none !important;
  }
  .about__cursor-light {
    display: none;
  }
}
</style>
