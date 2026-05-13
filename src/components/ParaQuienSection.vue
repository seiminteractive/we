<template>
  <section
    id="para-quien"
    ref="sectionRef"
    class="para"
    :class="{ 'has-active': activeIx !== null }"
    aria-labelledby="para-heading"
  >
    <div class="para__grain" aria-hidden="true" />
    <div class="para__fx" aria-hidden="true">
      <span class="para__fx-orb para__fx-orb--a" />
      <span class="para__fx-orb para__fx-orb--b" />
    </div>

    <div class="para__shell">
      <header class="para__head">
        <div class="para__brand" data-reveal>
          <span class="para__brand-mark" aria-hidden="true" />
          <span class="para__brand-text">A quiénes acompañamos</span>
          <span class="para__brand-rule" aria-hidden="true" />
          <span class="para__brand-sub">3 perfiles · misión compartida</span>
        </div>

        <div class="para__head-row">
          <Transition :css="false" mode="out-in" @enter="onHeadEnter" @leave="onHeadLeave">
            <h2
              v-if="activeIx === null"
              key="title"
              id="para-heading"
              class="para__title"
              data-reveal
            >
              Organizaciones
              <em class="para__title-em">que buscan liderar el futuro.</em>
            </h2>
            <button
              v-else
              key="back"
              type="button"
              class="para__back"
              @click="handleClose"
              aria-label="Volver a los perfiles"
            >
              <span class="para__back-arrow" aria-hidden="true">←</span>
              <span class="para__back-label">Volver a los perfiles</span>
            </button>
          </Transition>

          <a href="#que-hacemos" class="para__cta" data-reveal>
            <span class="para__cta-label">Explorar servicios</span>
            <span class="para__cta-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <ol class="para__columns" role="list">
        <li
          v-for="(item, i) in audiences"
          :key="item.ix"
          :ref="(el) => setColRef(el, i)"
          class="para__col"
          :class="{
            'is-active': activeIx === item.ix,
            'is-faded': activeIx !== null && activeIx !== item.ix,
          }"
          tabindex="0"
          :aria-label="item.label"
          @click="handleColumnClick(item.ix)"
          @keydown.enter.prevent="handleColumnClick(item.ix)"
          @keydown.space.prevent="handleColumnClick(item.ix)"
        >
          <div class="para__col-media" :ref="(el) => setMediaRef(el, i)">
            <img
              :src="item.image"
              alt=""
              class="para__col-img"
              :ref="(el) => setImgRef(el, i)"
              loading="lazy"
              draggable="false"
            />
            <div class="para__col-veil" aria-hidden="true" />
            <div class="para__col-corners" aria-hidden="true">
              <span class="para__col-corner para__col-corner--tl" />
              <span class="para__col-corner para__col-corner--tr" />
              <span class="para__col-corner para__col-corner--bl" />
              <span class="para__col-corner para__col-corner--br" />
            </div>
          </div>

          <div class="para__col-chrome" aria-hidden="true">
            <span class="para__col-code">{{ item.code }}</span>
            <div class="para__col-mark-wrap">
              <span class="para__col-mark">+</span>
              <span class="para__col-hint">Más info</span>
            </div>
          </div>

          <div class="para__col-foot">
            <span class="para__col-ix">{{ item.ix }}</span>
            <h3 class="para__col-label">{{ item.label }}</h3>
            <span class="para__col-line" aria-hidden="true" />
            <span class="para__col-tagline">{{ item.tagline }}</span>
          </div>

          <div
            class="para__col-panel"
            :class="{ 'is-visible': activeIx === item.ix }"
            :ref="(el) => setPanelRef(el, i)"
            aria-hidden="true"
          >
            <span class="para__col-kicker">{{ item.tagline }}</span>
            <h4 class="para__col-headline">
              <span
                v-for="(w, wi) in item.headline.split(' ')"
                :key="wi"
                class="para__col-word"
              >
                <span class="para__col-word-inner">{{ w }}</span>
              </span>
            </h4>
            <p class="para__col-desc">{{ item.detail }}</p>
            <ul class="para__col-highlights" role="list">
              <li
                v-for="(h, hi) in item.highlights"
                :key="h"
                class="para__col-highlight"
              >
                <span class="para__col-highlight-num">A · {{ pad(hi + 1) }}</span>
                <span class="para__col-highlight-line" aria-hidden="true" />
                <span class="para__col-highlight-text">{{ h }}</span>
              </li>
            </ul>
            <a href="#contacto" class="para__col-cta">
              <span>Trabajar con nosotros</span>
              <span class="para__col-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'
import imgEmpresas from '../assets/empresas.jpeg'
import imgGobiernos from '../assets/gobiernos.jpeg'
import imgOrganizaciones from '../assets/organizaciones.jpeg'
import { useScrollReveal } from '../composables/useScrollReveal'
import { gsap } from '../lib/gsap'

const { sectionRef } = useScrollReveal()
const colRefs = ref([])
const mediaRefs = ref([])
const imgRefs = ref([])
const panelRefs = ref([])
const activeIx = ref(null)

const audiences = [
  {
    ix: '01',
    code: 'P · 01',
    label: 'Empresas',
    tagline: 'Escala y posicionamiento',
    headline: 'Escalar con foco, no con ruido.',
    detail:
      'Acompañamos a equipos de liderazgo en estrategia, comunicación e innovación aplicada para crecer con foco y diferenciación real.',
    highlights: [
      'Estrategia de posicionamiento',
      'Liderazgo y cultura',
      'Innovación aplicada',
    ],
    image: imgEmpresas,
  },
  {
    ix: '02',
    code: 'P · 02',
    label: 'Gobiernos',
    tagline: 'Transformación pública',
    headline: 'Política pública que se ejecuta.',
    detail:
      'Diseñamos soluciones para gestionar complejidad, fortalecer capacidades institucionales y mejorar la implementación de políticas públicas.',
    highlights: [
      'Gestión de complejidad',
      'Capacidades institucionales',
      'Implementación de políticas',
    ],
    image: imgGobiernos,
  },
  {
    ix: '03',
    code: 'P · 03',
    label: 'Organizaciones',
    tagline: 'Impacto y sostenibilidad',
    headline: 'Impacto que perdura en el tiempo.',
    detail:
      'Impulsamos procesos de evolución organizacional, articulación y narrativa para ampliar alcance y generar resultados medibles.',
    highlights: [
      'Evolución organizacional',
      'Articulación y alianzas',
      'Narrativa de impacto',
    ],
    image: imgOrganizaciones,
  },
]

let reduce = false
let mainTl = null
let kenBurnsTweens = []
let ambientTweens = []
let orbTweens = []

const isMobile = () => window.matchMedia('(max-width: 960px)').matches

function pad(n) {
  return String(n).padStart(2, '0')
}

function setColRef(el, i) {
  if (el) colRefs.value[i] = el
}
function setMediaRef(el, i) {
  if (el) mediaRefs.value[i] = el
}
function setImgRef(el, i) {
  if (el) imgRefs.value[i] = el
}
function setPanelRef(el, i) {
  if (el) panelRefs.value[i] = el
}

function startKenBurns() {
  if (reduce) return
  imgRefs.value.forEach((el, i) => {
    if (!el) return
    kenBurnsTweens.push(
      gsap.fromTo(
        el,
        { scale: 1, xPercent: 0, yPercent: 0 },
        {
          scale: 1.08,
          xPercent: i % 2 === 0 ? -2 : 2,
          yPercent: i === 1 ? -1.5 : 1.5,
          duration: 16 + i * 1.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.6,
        }
      )
    )
  })
}

function startAmbient() {
  if (reduce) return
  colRefs.value.forEach((el, i) => {
    if (!el) return
    const line = el.querySelector('.para__col-line')
    if (line) {
      ambientTweens.push(
        gsap.fromTo(
          line,
          { scaleX: 0.35 },
          {
            scaleX: 1,
            duration: 4 + i * 0.6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            transformOrigin: 'left center',
            delay: i * 0.4,
          }
        )
      )
    }
  })
}

function startOrbs() {
  if (reduce) return
  orbTweens.push(
    gsap.to('.para__fx-orb--a', {
      x: '+=80',
      y: '-=60',
      duration: 22,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  )
  orbTweens.push(
    gsap.to('.para__fx-orb--b', {
      x: '-=70',
      y: '+=80',
      duration: 28,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  )
}

function expandColumn(targetIx) {
  if (isMobile()) return
  const wraps = colRefs.value
  if (!wraps.length) return

  const targetIdx = audiences.findIndex((a) => a.ix === targetIx)
  const targetEl = wraps[targetIdx]
  if (!targetEl) return

  mainTl?.kill()
  mainTl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  const corners = targetEl.querySelectorAll('.para__col-corner')
  const panel = panelRefs.value[targetIdx]

  if (panel) {
    const kicker = panel.querySelector('.para__col-kicker')
    const words = panel.querySelectorAll('.para__col-word-inner')
    const desc = panel.querySelector('.para__col-desc')
    const highlights = panel.querySelectorAll('.para__col-highlight')
    const cta = panel.querySelector('.para__col-cta')

    gsap.set(panel, { opacity: 1, pointerEvents: 'auto' })
    gsap.set(words, { yPercent: 118 })
    gsap.set([kicker, desc, cta].filter(Boolean), { opacity: 0, y: 22 })
    gsap.set(highlights, { opacity: 0, x: -18 })

    if (corners.length) {
      mainTl.fromTo(
        corners,
        { opacity: 0, scale: 0.6 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          ease: 'back.out(1.6)',
        },
        0.6
      )
    }

    mainTl.to(kicker, { opacity: 1, y: 0, duration: 0.55 }, 0.7)
    mainTl.to(
      words,
      { yPercent: 0, duration: 1.05, stagger: 0.06, ease: 'expo.out' },
      0.75
    )
    mainTl.to(desc, { opacity: 1, y: 0, duration: 0.7 }, 0.95)
    mainTl.to(
      highlights,
      { opacity: 1, x: 0, duration: 0.7, stagger: 0.08 },
      1.1
    )
    mainTl.to(cta, { opacity: 1, y: 0, duration: 0.6 }, 1.3)
  }
}

function collapseColumns() {
  if (isMobile()) return
  const wraps = colRefs.value
  if (!wraps.length) return

  mainTl?.kill()
  mainTl = gsap.timeline({ defaults: { ease: 'power3.in' } })

  wraps.forEach((el, i) => {
    if (!el) return
    const corners = el.querySelectorAll('.para__col-corner')
    const panel = panelRefs.value[i]

    if (corners.length) {
      mainTl.to(
        corners,
        { opacity: 0, scale: 0.7, duration: 0.3 },
        0
      )
    }

    if (panel) {
      const kicker = panel.querySelector('.para__col-kicker')
      const words = panel.querySelectorAll('.para__col-word-inner')
      const desc = panel.querySelector('.para__col-desc')
      const highlights = panel.querySelectorAll('.para__col-highlight')
      const cta = panel.querySelector('.para__col-cta')

      mainTl.to(
        [kicker, desc, cta].filter(Boolean),
        { opacity: 0, y: 14, duration: 0.32 },
        0
      )
      mainTl.to(
        highlights,
        { opacity: 0, x: -10, duration: 0.32, stagger: 0.03 },
        0
      )
      mainTl.to(
        words,
        { yPercent: 118, duration: 0.35, stagger: 0.03 },
        0
      )
      mainTl.set(panel, { opacity: 0, pointerEvents: 'none' }, 0.4)
    }
  })
}

function handleColumnClick(ix) {
  if (isMobile()) return
  if (activeIx.value === ix) {
    handleClose()
    return
  }
  activeIx.value = ix
  nextTick(() => expandColumn(ix))
}

function handleClose() {
  if (activeIx.value === null) return
  activeIx.value = null
  nextTick(() => collapseColumns())
}

function onHeadEnter(el, done) {
  if (reduce) {
    done()
    return
  }
  gsap.fromTo(
    el,
    { opacity: 0, y: 14, filter: 'blur(8px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.6,
      ease: 'power3.out',
      onComplete: done,
    }
  )
}

function onHeadLeave(el, done) {
  if (reduce) {
    done()
    return
  }
  gsap.to(el, {
    opacity: 0,
    y: -10,
    filter: 'blur(6px)',
    duration: 0.3,
    ease: 'power3.in',
    onComplete: done,
  })
}

function onEscape(e) {
  if (e.key === 'Escape' && activeIx.value !== null) {
    handleClose()
  }
}

onMounted(async () => {
  await nextTick()
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  panelRefs.value.forEach((p) => {
    if (p) gsap.set(p, { opacity: 0, pointerEvents: 'none' })
  })

  colRefs.value.forEach((el) => {
    if (!el) return
    const corners = el.querySelectorAll('.para__col-corner')
    gsap.set(corners, { opacity: 0, scale: 0.7 })
  })

  if (!reduce) {
    startKenBurns()
    startAmbient()
    startOrbs()
  }

  window.addEventListener('keydown', onEscape)
})

onBeforeUnmount(() => {
  mainTl?.kill()
  mainTl = null
  kenBurnsTweens.forEach((t) => t.kill())
  kenBurnsTweens = []
  ambientTweens.forEach((t) => t.kill())
  ambientTweens = []
  orbTweens.forEach((t) => t.kill())
  orbTweens = []
})

onUnmounted(() => {
  window.removeEventListener('keydown', onEscape)
})
</script>

<style scoped>
.para {
  --para-ink: #1c1a18;
  --para-muted: rgba(28, 26, 24, 0.60);
  --para-rule: rgba(28, 26, 24, 0.18);
  --para-line: rgba(28, 26, 24, 0.12);
  --para-line-soft: rgba(28, 26, 24, 0.07);
  --para-accent: #21dc99;
  --para-warm: #efdbb4;

  position: relative;
  background: transparent;
  color: var(--para-ink);
  overflow: visible;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
}

/* ---------- FX ---------- */
.para__fx {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  overflow: visible;
  inset: -25% -18% -28% -18%;
}

.para__fx-orb {
  position: absolute;
  width: 42rem;
  height: 42rem;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.22;
  will-change: transform;
}

.para__fx-orb--a {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--para-accent) 70%, transparent),
    transparent 70%
  );
  top: -18%;
  right: -10%;
}

.para__fx-orb--b {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--para-warm) 70%, transparent),
    transparent 70%
  );
  bottom: -18%;
  left: -10%;
}

.para__grain {
  position: absolute;
  inset: -3.5rem 0;
  pointer-events: none;
  overflow: visible;
  opacity: 0.32;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 80px 80px;
  mix-blend-mode: multiply;
  z-index: 1;
}

.para__shell {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* ---------- Header ---------- */
.para__head {
  position: relative;
  z-index: 4;
  padding: clamp(1.8rem, 3.6vw, 2.8rem) clamp(1.5rem, 4vw, 3.5rem) 0;
  display: grid;
  gap: clamp(1rem, 2vw, 1.4rem);
}

.para__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.para__brand-mark {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: #1c1a18;
}

.para__brand-text {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #1c1a18;
}

.para__brand-rule {
  width: 2.4rem;
  height: 1px;
  background: var(--para-rule);
}

.para__brand-sub {
  font-family: var(--font-body);
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-family: var(--font-heading);
  font-size: 0.64rem;
  font-weight: var(--font-w-regular);
  letter-spacing: 0.18em;
  color: rgba(28, 26, 24, 0.55);
}

.para__head-row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: clamp(1rem, 3vw, 2rem);
}

.para__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4.2vw, 3rem);
  line-height: 1.12;
  font-weight: 700;
  color: #1c1a18;
  text-wrap: balance;
  max-width: 36rem;
  font-synthesis: none;
}

.para__title-em {
  display: block;
  font-style: normal;
  font-weight: var(--font-w-regular);
  color: rgba(28, 26, 24, 0.50);
}

.para__back {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: transparent;
  border: 0;
  padding: 0.4rem 0;
  cursor: pointer;
  color: #1c1a18;
  font-family: var(--font-body);
  font-size: 0.76rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.para__back:hover {
  color: var(--para-accent);
}

.para__back-arrow {
  font-size: 1.05rem;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__back:hover .para__back-arrow {
  transform: translateX(-4px);
}

.para__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.65rem 1.2rem;
  border: 1px solid rgba(28, 26, 24, 0.18);
  border-radius: 999px;
  background: rgba(28, 26, 24, 0.05);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #1c1a18;
  transition: border-color 0.35s ease, background 0.35s ease,
    transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
  align-self: end;
  white-space: nowrap;
}

.para__cta:hover {
  border-color: rgba(28, 26, 24, 0.38);
  background: rgba(28, 26, 24, 0.08);
}

.para__cta-arrow {
  font-size: 0.92rem;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__cta:hover .para__cta-arrow {
  transform: translateX(4px);
}

/* ---------- Columns ---------- */
.para__columns {
  list-style: none;
  padding: 0;
  display: flex;
  flex: 1;
  min-height: 0;
  min-width: 0;
  margin: clamp(1.4rem, 3vw, 2.2rem) clamp(1.5rem, 4vw, 3rem)
    clamp(1.4rem, 3vw, 2.2rem);
  border: 1px solid var(--para-line);
  border-radius: clamp(20px, 2vw, 28px);
  overflow: hidden;
  background: rgba(8, 10, 9, 0.07);
}

.para__col {
  position: relative;
  flex: 0 0 auto;
  width: 33.333%;
  min-width: 0;
  height: 100%;
  cursor: pointer;
  outline: none;
  isolation: isolate;
  overflow: hidden;
  border-right: 1px solid var(--para-line);
  background-color: transparent;
  opacity: 1;
  transition: width 1.1s cubic-bezier(0.86, 0, 0.07, 1),
    opacity 0.55s cubic-bezier(0.4, 0, 0.4, 1),
    background-color 0.5s ease;
  will-change: width, opacity;
}

.para.has-active .para__col {
  width: 0%;
  opacity: 0;
  pointer-events: none;
}

.para.has-active .para__col.is-active {
  width: 100%;
  opacity: 1;
  pointer-events: auto;
}

.para__col:last-child {
  border-right: none;
}

.para__col:focus-visible {
  background: rgba(255, 255, 255, 0.04);
}

/* Media (image background that morphs to poster) */
.para__col-media {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  border-radius: 0;
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
  transition: top 1.05s cubic-bezier(0.86, 0, 0.07, 1) 0.08s,
    left 1.05s cubic-bezier(0.86, 0, 0.07, 1) 0.08s,
    right 1.05s cubic-bezier(0.86, 0, 0.07, 1) 0.08s,
    bottom 1.05s cubic-bezier(0.86, 0, 0.07, 1) 0.08s,
    border-radius 1.05s cubic-bezier(0.86, 0, 0.07, 1) 0.08s,
    box-shadow 0.8s ease 0.45s;
  will-change: top, left, right, bottom, border-radius;
}

.para__col.is-active .para__col-media {
  top: clamp(2rem, 5vw, 4rem);
  left: clamp(2rem, 5vw, 4rem);
  right: 50%;
  bottom: clamp(4rem, 6vw, 5rem);
  border-radius: 20px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38),
    0 10px 30px rgba(0, 0, 0, 0.22);
}

.para__col-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0.42;
  filter: saturate(0.85) contrast(0.95);
  transition: opacity 0.6s ease, filter 0.6s ease;
  will-change: transform, opacity, filter;
}

.para__col:hover .para__col-img,
.para__col:focus-visible .para__col-img {
  opacity: 0.72;
  filter: saturate(1) contrast(1);
}

.para__col.is-active .para__col-img {
  opacity: 1;
  filter: saturate(1) contrast(1);
}

.para__col-veil {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(8, 10, 14, 0.4) 0%,
    rgba(8, 10, 14, 0.1) 35%,
    rgba(8, 10, 14, 0.66) 100%
  );
  z-index: 1;
  pointer-events: none;
}

.para__col.is-active .para__col-veil {
  background: linear-gradient(
    180deg,
    rgba(8, 10, 14, 0.18) 0%,
    rgba(8, 10, 14, 0.06) 40%,
    rgba(8, 10, 14, 0.3) 100%
  );
}

/* Corners */
.para__col-corners {
  position: absolute;
  inset: clamp(0.85rem, 1.4vw, 1.2rem);
  pointer-events: none;
  z-index: 2;
}

.para__col-corner {
  position: absolute;
  width: clamp(1.1rem, 1.6vw, 1.5rem);
  height: clamp(1.1rem, 1.6vw, 1.5rem);
  border-color: rgba(255, 255, 255, 0.6);
}

.para__col-corner--tl {
  top: 0;
  left: 0;
  border-top: 1px solid;
  border-left: 1px solid;
}

.para__col-corner--tr {
  top: 0;
  right: 0;
  border-top: 1px solid;
  border-right: 1px solid;
}

.para__col-corner--bl {
  bottom: 0;
  left: 0;
  border-bottom: 1px solid;
  border-left: 1px solid;
}

.para__col-corner--br {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid;
  border-right: 1px solid;
}

/* Chrome (top of column) */
.para__col-chrome {
  position: absolute;
  top: clamp(1rem, 2vw, 1.4rem);
  left: clamp(1.1rem, 2.4vw, 1.6rem);
  right: clamp(1.1rem, 2.4vw, 1.6rem);
  z-index: 5;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  pointer-events: none;
}

.para__col-code {
  font-family: var(--font-heading);
  font-size: 0.62rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.84);
  padding: 0.32rem 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__col:hover .para__col-code,
.para__col.is-active .para__col-code {
  opacity: 1;
  transform: translateY(0);
}

.para__col-mark {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  line-height: 1;
  font-synthesis: none;
  color: rgba(255, 255, 255, 0.85);
  width: 2.1rem;
  height: 2.1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.30);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  position: relative;
  opacity: 0.65;
  transform: scale(1);
  transition: opacity 0.4s ease,
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.4s ease, border-color 0.4s ease;
}

.para__col:not(.is-active) .para__col-mark::before {
  content: '';
  position: absolute;
  inset: -4px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  animation: paraMarkPulse 2.4s ease-out infinite;
  pointer-events: none;
}

@keyframes paraMarkPulse {
  0%   { transform: scale(1);   opacity: 0.60; }
  70%  { transform: scale(2.1); opacity: 0;    }
  100% { transform: scale(2.1); opacity: 0;    }
}

.para__col:hover .para__col-mark {
  opacity: 1;
  transform: scale(1.08);
  border-color: rgba(255, 255, 255, 0.55);
}

.para__col:hover .para__col-mark::before {
  animation-play-state: paused;
}

.para__col-mark-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.para__col-hint {
  font-family: var(--font-heading);
  font-size: 0.56rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.60);
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.4s ease, transform 0.4s ease;
  white-space: nowrap;
}

.para__col.is-active .para__col-hint {
  opacity: 0;
  transform: translateY(-6px);
  pointer-events: none;
}

.para__col.is-active .para__col-mark {
  opacity: 1;
  transform: scale(1) rotate(45deg);
  color: var(--para-accent);
  border-color: color-mix(in srgb, var(--para-accent) 55%, transparent);
}

/* Foot (idle column content) */
.para__col-foot {
  position: absolute;
  left: clamp(1.2rem, 2.4vw, 1.8rem);
  right: clamp(1.2rem, 2.4vw, 1.8rem);
  bottom: clamp(1.4rem, 2.8vw, 2rem);
  z-index: 3;
  display: grid;
  gap: 0.35rem;
}

.para__col-ix {
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 0.85vw, 0.78rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
  transition: color 0.4s ease;
}

.para__col:hover .para__col-ix {
  color: rgba(255, 255, 255, 0.85);
}

.para__col-label {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 2.8vw, 2.4rem);
  line-height: 1;
  font-weight: var(--font-w-extrabold);
  color: #fff;
  font-synthesis: none;
}

.para__col-line {
  display: block;
  width: 2.4rem;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.75) 0%,
    transparent 100%
  );
  margin: 0.2rem 0 0.1rem;
  transform-origin: left center;
  will-change: transform;
  transition: width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__col:hover .para__col-line,
.para__col.is-active .para__col-line {
  width: 4.2rem;
}

.para__col-tagline {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.62);
  opacity: 1;
  transform: translateX(0);
  transition: opacity 0.35s cubic-bezier(0.4, 0, 0.4, 1),
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__col.is-active .para__col-tagline {
  opacity: 0;
  transform: translateX(-8px);
}

/* Active panel */
.para__col-panel {
  position: absolute;
  top: 50%;
  right: clamp(2rem, 5vw, 5rem);
  width: min(36rem, 44%);
  transform: translateY(-50%);
  z-index: 4;
  display: grid;
  gap: clamp(0.85rem, 1.6vw, 1.2rem);
  pointer-events: none;
}

.para__col-kicker {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-heading);
  font-size: 0.64rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.70);
  padding: 0.4rem 0.75rem;
  border: 1px solid rgba(28, 26, 24, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  justify-self: start;
  will-change: opacity, transform;
}

.para__col-headline {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4.2vw, 3rem);
  line-height: 1.12;
  font-weight: 700;
  color: #1c1a18;
  text-wrap: balance;
  font-synthesis: none;
}

.para__col-word {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  margin-right: 0.2em;
  line-height: 1.08;
  padding-bottom: 0.05em;
}

.para__col-word-inner {
  display: inline-block;
  will-change: transform;
}

.para__col-desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.92rem, 1.1vw, 1.05rem);
  line-height: 1.55;
  color: rgba(28, 26, 24, 0.65);
  max-width: 34rem;
  will-change: opacity, transform;
}

.para__col-highlights {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

.para__col-highlight {
  display: grid;
  grid-template-columns: 3.4rem 2rem 1fr;
  align-items: center;
  gap: 0.85rem;
  padding: 0.7rem 0;
  border-top: 1px solid var(--para-line-soft);
  will-change: opacity, transform;
}

.para__col-highlight:last-child {
  border-bottom: 1px solid var(--para-line-soft);
}

.para__col-highlight-num {
  font-family: var(--font-body);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.42);
}

.para__col-highlight-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(28, 26, 24, 0.25) 0%,
    transparent 100%
  );
}

.para__col-highlight-text {
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 1.05vw, 0.98rem);
  color: #1c1a18;
  line-height: 1.4;
}

.para__col-cta {
  pointer-events: auto;
  align-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.78rem 1.3rem;
  margin-top: 0.4rem;
  border: 1px solid color-mix(in srgb, var(--para-accent) 55%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--para-accent) 10%, transparent);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.74rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #1c1a18;
  transition: border-color 0.35s ease, background 0.35s ease,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.para__col-cta:hover {
  border-color: var(--para-accent);
  background: color-mix(in srgb, var(--para-accent) 18%, transparent);
}

.para__col-cta-arrow {
  font-size: 0.92rem;
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__col-cta:hover .para__col-cta-arrow {
  transform: translateX(4px);
}

.para__col.is-faded {
  pointer-events: none;
}

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .para {
    height: auto;
    min-height: auto;
  }

  .para__shell {
    height: auto;
  }

  .para__head {
    padding: var(--section-pad-y) var(--section-pad-x) 0;
  }

  .para__head-row {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .para__cta {
    justify-self: start;
  }

  .para__columns {
    flex-direction: column;
    height: auto;
    margin: clamp(1.5rem, 4vw, 2rem) 0 0;
    border-bottom: none;
  }

  .para__col {
    width: 100% !important;
    flex: 0 0 auto;
    border-right: none;
    border-bottom: 1px solid var(--para-line);
    height: auto;
    min-height: clamp(20rem, 60vw, 28rem);
    cursor: default;
  }

  .para__col-foot {
    bottom: clamp(1.3rem, 4vw, 1.8rem);
  }

  .para__col-panel {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    transform: none;
    padding: clamp(1.4rem, 4vw, 2rem) clamp(var(--section-pad-x), 5vw, 2.5rem);
    pointer-events: auto;
    opacity: 1 !important;
    background: rgba(0, 0, 0, 0.18);
    border-top: 1px solid var(--para-line);
  }
}

@media (prefers-reduced-motion: reduce) {
  .para__col-mark::before {
    animation: none !important;
  }

  .para__col-hint {
    transition: none !important;
  }

  .para__col-img,
  .para__fx-orb,
  .para__col-line,
  .para__col-corner,
  .para__col-code,
  .para__col-mark,
  .para__col-word-inner,
  .para__col-kicker,
  .para__col-desc,
  .para__col-highlight,
  .para__col-cta {
    transform: none !important;
    opacity: 1 !important;
    animation: none !important;
  }
}
</style>
