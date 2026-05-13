<template>
  <section
    id="como-trabajamos"
    ref="sectionRef"
    class="cw"
    aria-labelledby="cw-heading"
  >
    <div class="cw__fx" aria-hidden="true">
      <span class="cw__fx-orb cw__fx-orb--a" />
      <span class="cw__fx-orb cw__fx-orb--b" />
      <div class="cw__fx-grain" />
    </div>

    <div class="cw__shell">
      <header class="cw__head">
        <div class="cw__brand" data-reveal>
          <span class="cw__brand-mark" aria-hidden="true" />
          <span class="cw__brand-text">Cómo trabajamos</span>
          <span class="cw__brand-rule" aria-hidden="true" />
          <span class="cw__brand-sub">Método · 4 movimientos</span>
        </div>

        <h2 id="cw-heading" class="cw__title" data-reveal>
          Un método.
          <em class="cw__title-em">Cuatro movimientos.</em>
        </h2>

        <p class="cw__lead" data-reveal>
          No es una fórmula: es la disciplina de escuchar, diseñar, activar y sostener —
          al ritmo de cada organización.
        </p>
      </header>

      <div class="cw__body">
        <aside class="cw__rail" aria-hidden="true">
          <div class="cw__rail-spine">
            <span class="cw__rail-fill" ref="railFillRef" />
            <span
              v-for="(s, ri) in steps"
              :key="s.id"
              class="cw__rail-tick"
              :style="{ top: `${(ri / (steps.length - 1)) * 100}%` }"
            />
          </div>
          <div class="cw__rail-meta">
            <span class="cw__rail-now" ref="railNowRef">01</span>
            <span class="cw__rail-of">— {{ totalLabel }}</span>
            <span class="cw__rail-label">paso</span>
          </div>
        </aside>

        <ol class="cw__steps" role="list">
          <li
            v-for="(step, i) in steps"
            :key="step.id"
            :ref="(el) => setStepRef(el, i)"
            class="cw__step"
            :class="`cw__step--${step.id}`"
            :data-index="i"
          >
            <span class="cw__step-numeral" aria-hidden="true">{{ pad(i + 1) }}</span>

            <div class="cw__step-glyph">
              <svg
                class="cw__step-emblem"
                viewBox="0 0 240 240"
                aria-hidden="true"
              >
                <g v-if="step.id === 'diagnostico'" class="cw__emblem-shape">
                  <circle cx="120" cy="120" r="22" />
                  <circle cx="120" cy="120" r="52" />
                  <circle cx="120" cy="120" r="82" />
                  <circle cx="120" cy="120" r="110" />
                  <line x1="120" y1="10" x2="120" y2="230" />
                </g>
                <g v-else-if="step.id === 'propuesta'" class="cw__emblem-shape">
                  <rect x="46" y="46" width="148" height="148" />
                  <line x1="46" y1="120" x2="194" y2="120" />
                  <line x1="120" y1="46" x2="120" y2="194" />
                  <circle cx="120" cy="120" r="42" />
                  <circle cx="120" cy="120" r="8" />
                </g>
                <g v-else-if="step.id === 'activamos'" class="cw__emblem-shape">
                  <path d="M 22 120 A 98 98 0 0 1 218 120" />
                  <path d="M 56 120 A 64 64 0 0 1 184 120" />
                  <path d="M 22 120 A 98 98 0 0 0 218 120" />
                  <line x1="120" y1="18" x2="120" y2="222" />
                  <circle cx="120" cy="120" r="7" />
                </g>
                <g v-else class="cw__emblem-shape">
                  <ellipse cx="120" cy="120" rx="100" ry="32" transform="rotate(-30 120 120)" />
                  <ellipse cx="120" cy="120" rx="100" ry="32" transform="rotate(30 120 120)" />
                  <ellipse cx="120" cy="120" rx="100" ry="32" transform="rotate(90 120 120)" />
                  <circle cx="120" cy="120" r="10" />
                </g>
              </svg>

              <span class="cw__step-kicker">{{ step.kicker }}</span>
              <span class="cw__step-arc" aria-hidden="true">
                <span class="cw__step-arc-line" />
                <span class="cw__step-arc-dot" />
              </span>
            </div>

            <div class="cw__step-content">
              <h3 class="cw__step-title">
                <span
                  v-for="(w, wi) in step.screenTitle.split(' ')"
                  :key="wi"
                  class="cw__word"
                >
                  <span class="cw__word-inner">{{ w }}</span>
                </span>
              </h3>

              <p class="cw__step-lead">{{ step.screenDesc }}</p>

              <ul class="cw__chips" role="list">
                <li
                  v-for="(h, hi) in step.highlights"
                  :key="h"
                  class="cw__chip"
                >
                  <span class="cw__chip-num">A · {{ pad(hi + 1) }}</span>
                  <span class="cw__chip-line" aria-hidden="true" />
                  <span class="cw__chip-text">{{ h }}</span>
                  <span class="cw__chip-mark" aria-hidden="true">+</span>
                </li>
              </ul>

              <div class="cw__metric">
                <span class="cw__metric-label">{{ step.metricLabel }}</span>
                <span class="cw__metric-value">{{ step.metricValue }}</span>
                <span class="cw__metric-bar" aria-hidden="true">
                  <span class="cw__metric-bar-fill" />
                </span>
              </div>
            </div>
          </li>
        </ol>
      </div>

      <footer class="cw__close" data-reveal>
        <span class="cw__close-tag">Resultado</span>
        <p class="cw__close-text">
          Cuatro movimientos, una misma intención: transformar lo posible en
          algo concreto, medible y sostenible.
        </p>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const { sectionRef } = useScrollReveal()
const railFillRef = ref(null)
const railNowRef = ref(null)
const stepRefs = ref([])

const steps = [
  {
    id: 'diagnostico',
    kicker: 'Paso 01 · Diagnóstico',
    screenTitle: 'Entender antes de actuar.',
    screenDesc:
      'Iniciamos con escucha activa para identificar oportunidades reales y definir prioridades claras junto al equipo.',
    highlights: [
      'Mapeo de contexto y actores',
      'Hipótesis de trabajo priorizadas',
      'Objetivos claros por fase',
    ],
    metricValue: '7–10 días',
    metricLabel: 'Tiempo estimado de inmersión',
  },
  {
    id: 'propuesta',
    kicker: 'Paso 02 · Diseño de estrategia',
    screenTitle: 'Cada estrategia se diseña para tu realidad.',
    screenDesc:
      'Traducimos el diagnóstico en un plan concreto, con enfoque, alcance y ritmos posibles de implementar.',
    highlights: [
      'Arquitectura de plan accionable',
      'Escenarios y prioridades',
      'Roadmap con hitos medibles',
    ],
    metricValue: '3 rutas',
    metricLabel: 'Escenarios evaluados por proyecto',
  },
  {
    id: 'activamos',
    kicker: 'Paso 03 · Activación',
    screenTitle: 'Pasamos de la idea a la acción.',
    screenDesc:
      'Ejecutamos junto a tu equipo para generar avances visibles desde etapas tempranas del proceso.',
    highlights: [
      'Pilotos y despliegue progresivo',
      'Alineación de equipos clave',
      'Ritmo operativo semanal',
    ],
    metricValue: '2–4 sprints',
    metricLabel: 'Cadencia inicial de implementación',
  },
  {
    id: 'acompanamos',
    kicker: 'Paso 04 · Consolidación',
    screenTitle: 'Sostener el cambio también es parte del trabajo.',
    screenDesc:
      'Monitoreamos, ajustamos y consolidamos resultados para que el impacto sea durable en el tiempo.',
    highlights: [
      'Seguimiento de indicadores',
      'Ajustes continuos por evidencia',
      'Transferencia de capacidades',
    ],
    metricValue: '+90 días',
    metricLabel: 'Ventana de acompañamiento activo',
  },
]

const totalLabel = computed(() => String(steps.length).padStart(2, '0'))

function pad(n) {
  return String(n).padStart(2, '0')
}

function setStepRef(el, i) {
  if (el) stepRefs.value[i] = el
}

let stepContexts = []
let triggers = []
let orbTweens = []

function buildStepTimeline(stepEl) {
  return gsap.context(() => {
    const numeral = stepEl.querySelector('.cw__step-numeral')
    const emblemPaths = stepEl.querySelectorAll('.cw__emblem-shape > *')
    const kicker = stepEl.querySelector('.cw__step-kicker')
    const arcLine = stepEl.querySelector('.cw__step-arc-line')
    const arcDot = stepEl.querySelector('.cw__step-arc-dot')
    const words = stepEl.querySelectorAll('.cw__word-inner')
    const lead = stepEl.querySelector('.cw__step-lead')
    const chips = stepEl.querySelectorAll('.cw__chip')
    const metric = stepEl.querySelector('.cw__metric')
    const barFill = stepEl.querySelector('.cw__metric-bar-fill')

    if (emblemPaths.length) {
      emblemPaths.forEach((p) => {
        let length = 480
        try {
          if (typeof p.getTotalLength === 'function') {
            length = p.getTotalLength() || length
          }
        } catch (_) {
          length = 480
        }
        gsap.set(p, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
      })
    }

    gsap.set(words, { yPercent: 118 })
    gsap.set([kicker, lead, metric].filter(Boolean), {
      opacity: 0,
      y: 24,
    })
    gsap.set(chips, { opacity: 0, x: -28 })
    gsap.set(numeral, { opacity: 0, x: -40, scale: 1.06 })
    if (arcLine) gsap.set(arcLine, { scaleX: 0, transformOrigin: 'left center' })
    if (arcDot) gsap.set(arcDot, { scale: 0 })
    if (barFill) gsap.set(barFill, { scaleX: 0, transformOrigin: 'left center' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stepEl,
        start: 'top 78%',
        end: 'bottom 25%',
        toggleActions: 'play none none reverse',
      },
      defaults: { ease: 'power3.out' },
    })

    tl.to(
      numeral,
      { opacity: 1, x: 0, scale: 1, duration: 1.35, ease: 'expo.out' },
      0
    )

    if (emblemPaths.length) {
      tl.to(
        emblemPaths,
        {
          strokeDashoffset: 0,
          duration: 1.55,
          stagger: 0.13,
          ease: 'power3.inOut',
        },
        0.08
      )
    }

    tl.to(kicker, { opacity: 1, y: 0, duration: 0.8 }, 0.18)

    if (arcLine) {
      tl.to(arcLine, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, 0.22)
    }
    if (arcDot) {
      tl.to(arcDot, { scale: 1, duration: 0.5, ease: 'back.out(2)' }, 0.85)
    }

    tl.to(
      words,
      {
        yPercent: 0,
        duration: 1.1,
        stagger: 0.06,
        ease: 'expo.out',
      },
      0.2
    )

    tl.to(lead, { opacity: 1, y: 0, duration: 0.85 }, 0.45)

    tl.to(
      chips,
      {
        opacity: 1,
        x: 0,
        duration: 0.7,
        stagger: 0.09,
      },
      0.55
    )

    tl.to(metric, { opacity: 1, y: 0, duration: 0.75 }, 0.82)

    if (barFill) {
      tl.to(barFill, { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.88)
    }
  }, stepEl)
}

function buildParallax(stepEl) {
  const numeral = stepEl.querySelector('.cw__step-numeral')
  const emblem = stepEl.querySelector('.cw__step-emblem')
  if (numeral) {
    const tween = gsap.fromTo(
      numeral,
      { yPercent: 18 },
      {
        yPercent: -22,
        ease: 'none',
        scrollTrigger: {
          trigger: stepEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
    triggers.push(tween.scrollTrigger)
  }
  if (emblem) {
    const tween = gsap.fromTo(
      emblem,
      { rotation: -8 },
      {
        rotation: 8,
        ease: 'none',
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: stepEl,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      }
    )
    triggers.push(tween.scrollTrigger)
  }
}

onMounted(async () => {
  await nextTick()
  const root = sectionRef.value
  if (!root) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  stepRefs.value.forEach((el) => {
    if (!el) return
    stepContexts.push(buildStepTimeline(el))
    buildParallax(el)
  })

  const stepsEl = root.querySelector('.cw__steps')
  if (stepsEl && railFillRef.value) {
    const railTrigger = ScrollTrigger.create({
      trigger: stepsEl,
      start: 'top 55%',
      end: 'bottom 65%',
      onUpdate: (self) => {
        const p = self.progress
        gsap.to(railFillRef.value, {
          scaleY: p,
          duration: 0.25,
          overwrite: 'auto',
          ease: 'none',
        })
        const idx = Math.min(
          steps.length,
          Math.max(1, Math.ceil(p * steps.length || 1))
        )
        if (railNowRef.value && railNowRef.value.textContent !== pad(idx)) {
          railNowRef.value.textContent = pad(idx)
          gsap.fromTo(
            railNowRef.value,
            { y: 10, opacity: 0, filter: 'blur(4px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.45,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          )
        }
      },
    })
    triggers.push(railTrigger)
  }

  orbTweens.push(
    gsap.to('.cw__fx-orb--a', {
      x: '+=90',
      y: '-=55',
      duration: 18,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  )
  orbTweens.push(
    gsap.to('.cw__fx-orb--b', {
      x: '-=70',
      y: '+=80',
      duration: 24,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  )
})

onBeforeUnmount(() => {
  stepContexts.forEach((c) => c.revert())
  stepContexts = []
  triggers.forEach((t) => t?.kill?.())
  triggers = []
  orbTweens.forEach((t) => t.kill())
  orbTweens = []
})
</script>

<style scoped>
.cw {
  --cw-ink: #ffffff;
  --cw-muted: rgba(255, 255, 255, 0.66);
  --cw-line: rgba(255, 255, 255, 0.18);
  --cw-line-soft: rgba(255, 255, 255, 0.08);
  --cw-accent: #21dc99;
  --cw-warm: #efdbb4;
  --cw-glow: rgba(33, 220, 153, 0.55);
  --cw-glow-soft: rgba(33, 220, 153, 0.22);

  position: relative;
  color: var(--cw-ink);
  overflow: clip;
  isolation: isolate;
}

/* ---------- FX layer ---------- */
.cw__fx {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.cw__fx-orb {
  position: absolute;
  width: 42rem;
  height: 42rem;
  border-radius: 50%;
  filter: blur(110px);
  opacity: 0.22;
  will-change: transform;
  mix-blend-mode: screen;
}

.cw__fx-orb--a {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--cw-accent) 60%, transparent),
    transparent 70%
  );
  top: -16%;
  left: -14%;
}

.cw__fx-orb--b {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--cw-warm) 80%, transparent),
    transparent 70%
  );
  bottom: -18%;
  right: -12%;
}

.cw__fx-grain {
  position: absolute;
  inset: 0;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-size: 240px;
  opacity: 0.035;
  mix-blend-mode: screen;
}

/* ---------- Shell ---------- */
.cw__shell {
  position: relative;
  z-index: 1;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  box-sizing: border-box;
}

/* ---------- Header ---------- */
.cw__head {
  position: relative;
  margin-bottom: clamp(3.5rem, 8vw, 5.5rem);
  max-width: 64rem;
}

.cw__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: clamp(1.3rem, 2.2vw, 1.8rem);
}

.cw__brand-mark {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--cw-ink);
}

.cw__brand-text {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.cw__brand-rule {
  width: 2.4rem;
  height: 1px;
  background: color-mix(in srgb, var(--cw-ink) 35%, transparent);
}

.cw__brand-sub {
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cw-ink) 55%, transparent);
}

.cw__title {
  margin: 0 0 clamp(1.4rem, 2.4vw, 2rem);
  font-family: var(--font-heading);
  font-size: clamp(2.7rem, 8.4vw, 6.2rem);
  line-height: 1.04;
  letter-spacing: 0;
  font-weight: var(--font-w-extrabold);
  text-wrap: balance;
}

.cw__title-em {
  display: block;
  font-style: italic;
  font-weight: var(--font-w-regular);
  color: color-mix(in srgb, var(--cw-ink) 48%, transparent);
}

.cw__lead {
  margin: 0;
  max-width: 40rem;
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.3vw, 1.18rem);
  line-height: 1.55;
  color: var(--cw-muted);
}

/* ---------- Body grid ---------- */
.cw__body {
  display: grid;
  grid-template-columns: clamp(60px, 7vw, 104px) 1fr;
  gap: clamp(1.4rem, 3.2vw, 2.8rem);
  position: relative;
}

/* ---------- Rail (sticky progress) ---------- */
.cw__rail {
  position: sticky;
  top: 28vh;
  align-self: start;
  display: grid;
  gap: 1.4rem;
  height: max-content;
  z-index: 2;
}

.cw__rail-spine {
  position: relative;
  width: 1px;
  height: clamp(10rem, 22vh, 16rem);
  background: var(--cw-line-soft);
  margin-left: 0.45rem;
}

.cw__rail-fill {
  position: absolute;
  inset: 0;
  background: var(--cw-ink);
  transform-origin: top center;
  transform: scaleY(0);
}

.cw__rail-tick {
  position: absolute;
  left: 50%;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: #fff;
  border: 1px solid rgba(33, 220, 153, 0.55);
  box-shadow: 0 0 6px rgba(33, 220, 153, 0.4);
  transform: translate(-50%, -50%);
}

.cw__rail-meta {
  display: grid;
  gap: 0.25rem;
  margin-left: -0.05rem;
}

.cw__rail-now {
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 2.6vw, 2.25rem);
  font-weight: var(--font-w-bold);
  letter-spacing: 0;
  line-height: 1.05;
  display: inline-block;
  will-change: transform, opacity, filter;
}

.cw__rail-of,
.cw__rail-label {
  font-family: var(--font-body);
  font-size: 0.66rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cw-ink) 55%, transparent);
}

/* ---------- Steps ---------- */
.cw__steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

.cw__step {
  position: relative;
  display: grid;
  grid-template-columns: clamp(11rem, 22vw, 16rem) minmax(0, 1fr);
  gap: clamp(2rem, 4.5vw, 3.8rem);
  padding: clamp(5.5rem, 12vw, 9rem) 0;
  align-items: start;
  border-top: 1px solid var(--cw-line-soft);
}

.cw__step:first-child {
  border-top: none;
  padding-top: clamp(1rem, 2vw, 2rem);
}

.cw__step-numeral {
  position: absolute;
  top: -1rem;
  right: -3vw;
  font-family: var(--font-heading);
  font-size: clamp(11rem, 28vw, 26rem);
  font-weight: var(--font-w-extrabold);
  line-height: 0.92;
  letter-spacing: 0;
  color: transparent;
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.10);
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
  z-index: 0;
  will-change: transform;
}

/* ----- Glyph column ----- */
.cw__step-glyph {
  position: relative;
  display: grid;
  gap: 1.3rem;
  z-index: 1;
}

.cw__step-emblem {
  width: 100%;
  max-width: 12rem;
  height: auto;
  aspect-ratio: 1 / 1;
  stroke: #f5fffa;
  stroke-width: 1.4;
  fill: none;
  overflow: visible;
  will-change: transform, filter;
  filter:
    drop-shadow(0 0 3px var(--cw-glow))
    drop-shadow(0 0 11px var(--cw-glow-soft));
  animation: cwEmblemBreathe 6s ease-in-out infinite;
}

.cw__step-emblem * {
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Variación cromática sutil para no caer en monotonía: cada paso respira en un matiz distinto */
.cw__step--propuesta .cw__step-emblem {
  filter:
    drop-shadow(0 0 3px rgba(239, 219, 180, 0.5))
    drop-shadow(0 0 12px rgba(239, 219, 180, 0.2));
  animation-name: cwEmblemBreatheWarm;
}

.cw__step--acompanamos .cw__step-emblem {
  filter:
    drop-shadow(0 0 3px rgba(120, 220, 255, 0.5))
    drop-shadow(0 0 12px rgba(120, 220, 255, 0.2));
  animation-name: cwEmblemBreatheCool;
}

@keyframes cwEmblemBreathe {
  0%, 100% {
    filter:
      drop-shadow(0 0 3px rgba(33, 220, 153, 0.55))
      drop-shadow(0 0 11px rgba(33, 220, 153, 0.22));
  }
  50% {
    filter:
      drop-shadow(0 0 5px rgba(33, 220, 153, 0.78))
      drop-shadow(0 0 18px rgba(33, 220, 153, 0.34));
  }
}

@keyframes cwEmblemBreatheWarm {
  0%, 100% {
    filter:
      drop-shadow(0 0 3px rgba(239, 219, 180, 0.5))
      drop-shadow(0 0 12px rgba(239, 219, 180, 0.2));
  }
  50% {
    filter:
      drop-shadow(0 0 5px rgba(239, 219, 180, 0.7))
      drop-shadow(0 0 18px rgba(239, 219, 180, 0.3));
  }
}

@keyframes cwEmblemBreatheCool {
  0%, 100% {
    filter:
      drop-shadow(0 0 3px rgba(120, 220, 255, 0.5))
      drop-shadow(0 0 12px rgba(120, 220, 255, 0.2));
  }
  50% {
    filter:
      drop-shadow(0 0 5px rgba(120, 220, 255, 0.7))
      drop-shadow(0 0 18px rgba(120, 220, 255, 0.3));
  }
}

.cw__step-kicker {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cw-ink) 60%, transparent);
}

.cw__step-arc {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
}

.cw__step-arc-line {
  display: block;
  width: 3.2rem;
  height: 1px;
  background: var(--cw-ink);
  transform-origin: left center;
}

.cw__step-arc-dot {
  display: block;
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--cw-accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--cw-accent) 22%, transparent);
}

/* ----- Content column ----- */
.cw__step-content {
  position: relative;
  z-index: 1;
  max-width: 46rem;
}

.cw__step-title {
  margin: 0 0 clamp(1.1rem, 2vw, 1.5rem);
  font-family: var(--font-heading);
  font-size: clamp(2rem, 4.6vw, 3.6rem);
  line-height: 1.12;
  letter-spacing: 0;
  font-weight: var(--font-w-extrabold);
  text-wrap: balance;
}

.cw__word {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  margin-right: 0.24em;
  line-height: 1.12;
  padding-bottom: 0.18em;
}

.cw__word-inner {
  display: inline-block;
  will-change: transform;
}

.cw__step-lead {
  margin: 0 0 clamp(2rem, 3.4vw, 2.8rem);
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.3vw, 1.18rem);
  line-height: 1.6;
  color: var(--cw-muted);
  max-width: 38rem;
}

/* Chips — editorial divider list */
.cw__chips {
  list-style: none;
  margin: 0 0 clamp(2rem, 3.4vw, 2.8rem);
  padding: 0;
  display: grid;
}

.cw__chip {
  display: grid;
  grid-template-columns: 3.6rem 2.8rem 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem 0;
  border-top: 1px solid var(--cw-line-soft);
  position: relative;
  transition: padding 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform, opacity;
}

.cw__chip:last-child {
  border-bottom: 1px solid var(--cw-line-soft);
}

.cw__chip:hover {
  padding-left: 0.5rem;
}

.cw__chip-num {
  font-family: var(--font-body);
  font-size: 0.66rem;
  letter-spacing: 0.18em;
  color: color-mix(in srgb, var(--cw-ink) 50%, transparent);
  text-transform: uppercase;
}

.cw__chip-line {
  height: 1px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.45) 0%,
    transparent 100%
  );
  transform-origin: left center;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}

.cw__chip:hover .cw__chip-line {
  transform: scaleX(1.2);
}

.cw__chip-text {
  font-family: var(--font-body);
  font-size: clamp(0.96rem, 1.15vw, 1.1rem);
  color: var(--cw-ink);
  line-height: 1.4;
}

.cw__chip-mark {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: var(--font-w-regular);
  color: color-mix(in srgb, var(--cw-ink) 40%, transparent);
  transition: transform 0.35s ease, color 0.35s ease;
}

.cw__chip:hover .cw__chip-mark {
  transform: rotate(45deg);
  color: var(--cw-accent);
}

/* Metric */
.cw__metric {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.35rem 1.5rem;
  align-items: end;
  padding-top: clamp(0.4rem, 1vw, 0.8rem);
}

.cw__metric-label {
  grid-column: 1;
  grid-row: 1;
  align-self: end;
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cw-ink) 55%, transparent);
}

.cw__metric-value {
  grid-column: 2;
  grid-row: 1 / span 2;
  font-family: var(--font-heading);
  font-size: clamp(1.9rem, 3.6vw, 2.8rem);
  font-weight: var(--font-w-extrabold);
  letter-spacing: 0;
  line-height: 1.05;
  align-self: center;
  color: var(--cw-ink);
}

.cw__metric-bar {
  grid-column: 1;
  grid-row: 2;
  display: block;
  height: 1px;
  background: var(--cw-line-soft);
  position: relative;
  margin-top: 0.45rem;
}

.cw__metric-bar-fill {
  position: absolute;
  inset: 0;
  background: var(--cw-ink);
}

/* ---------- Closing strip ---------- */
.cw__close {
  margin-top: clamp(3.5rem, 6vw, 5rem);
  display: grid;
  grid-template-columns: clamp(7rem, 14vw, 10rem) 1fr;
  align-items: start;
  gap: clamp(1rem, 3vw, 2.2rem);
  padding-top: clamp(2rem, 4vw, 3rem);
  border-top: 1px solid var(--cw-line-soft);
}

.cw__close-tag {
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--cw-ink) 55%, transparent);
  padding-top: 0.3rem;
}

.cw__close-text {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.35rem, 2.6vw, 2.05rem);
  line-height: 1.3;
  letter-spacing: 0;
  color: var(--cw-ink);
  font-weight: var(--font-w-regular);
  font-style: italic;
  max-width: 42rem;
}

/* ---------- Responsive ---------- */
@media (max-width: 960px) {
  .cw__body {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .cw__rail {
    display: none;
  }

  .cw__step {
    grid-template-columns: 1fr;
    gap: 1.6rem;
    padding: clamp(3.5rem, 11vw, 5rem) 0;
  }

  .cw__step-numeral {
    font-size: clamp(8rem, 36vw, 14rem);
    top: -2rem;
    right: -1rem;
  }

  .cw__step-emblem {
    max-width: 8rem;
  }

  .cw__step-title {
    font-size: clamp(1.8rem, 8vw, 2.6rem);
  }

  .cw__close {
    grid-template-columns: 1fr;
  }

  .cw__chip {
    grid-template-columns: 3rem 1.6rem 1fr auto;
    gap: 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cw__word-inner,
  .cw__step-numeral,
  .cw__step-kicker,
  .cw__step-lead,
  .cw__chip,
  .cw__metric,
  .cw__rail-now {
    transform: none !important;
    opacity: 1 !important;
    filter: none !important;
  }

  .cw__emblem-shape > *,
  .cw__metric-bar-fill,
  .cw__step-arc-line,
  .cw__step-arc-dot,
  .cw__rail-fill {
    stroke-dashoffset: 0 !important;
    stroke-dasharray: none !important;
    transform: none !important;
  }

  .cw__fx-orb,
  .cw__step-emblem {
    animation: none !important;
  }
}
</style>
