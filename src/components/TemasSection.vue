<template>
  <section id="temas" ref="sectionRef" class="temas" aria-labelledby="temas-heading">
    <div class="temas__grain" aria-hidden="true" />
    <div class="temas__fx" aria-hidden="true">
      <span class="temas__fx-orb temas__fx-orb--a" />
      <span class="temas__fx-orb temas__fx-orb--b" />
    </div>

    <div class="temas__shell">
      <header class="temas__head">
        <div class="temas__brand" data-reveal>
          <span class="temas__brand-mark" aria-hidden="true" />
          <span class="temas__brand-text">Temas en los que trabajamos</span>
          <span class="temas__brand-rule" aria-hidden="true" />
          <span class="temas__brand-sub">4 verticales · práctica integral</span>
        </div>

        <h2 id="temas-heading" class="temas__title" data-reveal>
          Experiencia y método
          <em class="temas__title-em">para cada desafío institucional.</em>
        </h2>

        <p class="temas__lead" data-reveal>
          Una práctica multidisciplinaria que articula sostenibilidad, tecnología,
          narrativa y diseño institucional — al servicio de organizaciones que
          quieren liderar el cambio.
        </p>
      </header>

      <div class="temas__showcase">
        <div class="temas__main">
        <div
          class="temas__stage"
          ref="stageRef"
          @mouseenter="onStageEnter"
          @mouseleave="onStageLeave"
          @mousemove="onStageMouseMove"
        >
          <div class="temas__stage-deck" ref="deckRef">
            <div
              v-for="(t, i) in topics"
              :key="t.id"
              :ref="(el) => setSlideRef(el, i)"
              class="temas__stage-slide"
              :class="{ 'is-active': i === active, 'is-compare': t.compare }"
            >
              <template v-if="!t.compare">
                <img
                  :src="t.image"
                  alt=""
                  class="temas__stage-img"
                  loading="lazy"
                  draggable="false"
                />
              </template>
              <template v-else>
                <div
                  ref="compareRef"
                  class="temas-compare"
                  @pointerdown="onComparePointerDown"
                >
                  <img
                    :src="compareAfter"
                    alt=""
                    class="temas-compare__base"
                    draggable="false"
                  />
                  <div
                    class="temas-compare__before"
                    :style="{ clipPath: `inset(0 ${100 - comparePct}% 0 0)` }"
                  >
                    <img
                      :src="compareBefore"
                      alt=""
                      class="temas-compare__before-img"
                      draggable="false"
                    />
                  </div>
                  <div
                    class="temas-compare__handle"
                    :style="{ left: `${comparePct}%` }"
                  >
                    <span class="temas-compare__line" aria-hidden="true" />
                    <span class="temas-compare__knob" aria-hidden="true">
                      <i class="pi pi-angle-left"></i>
                      <i class="pi pi-angle-right"></i>
                    </span>
                  </div>
                </div>
              </template>
            </div>
          </div>

          <div class="temas__stage-gradient" aria-hidden="true" />

          <div class="temas__stage-chrome">
            <span class="temas__stage-code">{{ activeTopic.code }}</span>
            <span class="temas__stage-frame" aria-hidden="true">
              <span class="temas__stage-frame-corner temas__stage-frame-corner--tl" />
              <span class="temas__stage-frame-corner temas__stage-frame-corner--tr" />
              <span class="temas__stage-frame-corner temas__stage-frame-corner--bl" />
              <span class="temas__stage-frame-corner temas__stage-frame-corner--br" />
            </span>
            <span class="temas__stage-mark" aria-hidden="true">+</span>
          </div>

          <div class="temas__progress" aria-hidden="true">
            <span class="temas__progress-fill" ref="progressRef" />
          </div>
        </div>

        <Transition
          :css="false"
          mode="out-in"
          @enter="onCaptionEnter"
          @leave="onCaptionLeave"
        >
          <div :key="activeTopic.id" class="temas__caption">
            <span class="temas__caption-kicker">{{ activeTopic.tagline }}</span>
            <h3 class="temas__caption-title">
              <span
                v-for="(w, wi) in activeTopic.headline.split(' ')"
                :key="wi"
                class="temas-word"
              >
                <span class="temas-word-inner">{{ w }}</span>
              </span>
            </h3>
            <p class="temas__caption-desc">{{ activeTopic.desc }}</p>
          </div>
        </Transition>
        </div>

        <aside class="temas__panel">
          <div class="temas__panel-top">
            <div class="temas__panel-counter">
              <span class="temas__panel-now" ref="counterRef">{{ pad(active + 1) }}</span>
              <span class="temas__panel-of">— {{ pad(topics.length) }}</span>
            </div>
            <span class="temas__panel-label">vertical en foco</span>
          </div>

          <ol class="temas__panel-list" role="list">
            <li
              v-for="(t, i) in topics"
              :key="t.id"
              class="temas__panel-item"
              :class="{ 'is-active': i === active }"
            >
              <button
                type="button"
                class="temas__panel-btn"
                @click="setActive(i, true)"
                @mouseenter="setActive(i, true)"
                :aria-current="i === active ? 'true' : 'false'"
                :aria-label="`Mostrar ${t.label}`"
              >
                <span class="temas__panel-num">{{ pad(i + 1) }}</span>
                <span class="temas__panel-line" aria-hidden="true" />
                <span class="temas__panel-copy">
                  <span class="temas__panel-name">{{ t.label }}</span>
                  <span class="temas__panel-tagline">{{ t.tagline }}</span>
                </span>
                <span class="temas__panel-dot" aria-hidden="true" />
              </button>
            </li>
          </ol>

          <Transition
            :css="false"
            mode="out-in"
            @enter="onHighlightsEnter"
            @leave="onHighlightsLeave"
          >
            <div
              :key="activeTopic.id + '-h'"
              class="temas__panel-highlights"
            >
              <span class="temas__panel-tag">Prácticas clave</span>
              <ul role="list">
                <li
                  v-for="(h, hi) in activeTopic.highlights"
                  :key="h"
                  class="temas__panel-highlight"
                >
                  <span class="temas__panel-highlight-num">A · {{ pad(hi + 1) }}</span>
                  <span class="temas__panel-highlight-line" aria-hidden="true" />
                  <span class="temas__panel-highlight-text">{{ h }}</span>
                </li>
              </ul>
            </div>
          </Transition>

          <div class="temas__panel-controls">
            <button
              type="button"
              class="temas__ctrl"
              @click="setActive(active - 1, true)"
              aria-label="Vertical anterior"
            >
              <i class="pi pi-arrow-left"></i>
            </button>
            <button
              type="button"
              class="temas__ctrl temas__ctrl--toggle"
              @click="toggleAutoplay"
              :aria-pressed="autoplay ? 'true' : 'false'"
            >
              <i :class="autoplay ? 'pi pi-pause' : 'pi pi-play'"></i>
              <span>{{ autoplay ? 'Pausar' : 'Reanudar' }}</span>
            </button>
            <button
              type="button"
              class="temas__ctrl"
              @click="setActive(active + 1, true)"
              aria-label="Vertical siguiente"
            >
              <i class="pi pi-arrow-right"></i>
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import imgSostenibilidad from '../assets/sostenibilidad.jpeg'
import imgInteligenciaArtificial from '../assets/inteligenciaArtificial.jpeg'
import imgComunicacionNarrativa from '../assets/comunicacionNarrativa.jpeg'
import imgInnovacionInstitucional from '../assets/innovacionInstitucional.jpeg'
import temaEnLosQueTrabajamosDos from '../assets/temaEnLosQueTrabajamosDos.png'

gsap.registerPlugin(ScrollTrigger)

const { sectionRef } = useScrollReveal()

const stageRef = ref(null)
const deckRef = ref(null)
const compareRef = ref(null)
const progressRef = ref(null)
const counterRef = ref(null)
const slideRefs = ref([])

const active = ref(0)
const autoplay = ref(true)
const comparePct = ref(48)

const compareBefore = imgInnovacionInstitucional
const compareAfter = temaEnLosQueTrabajamosDos

const topics = [
  {
    id: 'sostenibilidad',
    code: 'T · 01',
    label: 'Sostenibilidad',
    tagline: 'Práctica + estrategia',
    headline: 'Sostenibilidad accionable.',
    desc:
      'Formación y estrategia para integrar sostenibilidad de manera realista y medible, alineada con los objetivos de cada organización.',
    highlights: [
      'Diagnóstico y estrategia ESG',
      'Capacitaciones aplicadas',
      'Reporte y comunicación',
    ],
    image: imgSostenibilidad,
  },
  {
    id: 'inteligencia-artificial',
    code: 'T · 02',
    label: 'Inteligencia artificial',
    tagline: 'Adopción + aplicación',
    headline: 'IA aplicada al cambio.',
    desc:
      'Capacitaciones y programas para comprender, adoptar y aplicar inteligencia artificial dentro de las organizaciones, con foco en impacto real.',
    highlights: [
      'Programas de adopción',
      'Casos de uso aplicados',
      'Gobernanza y ética',
    ],
    image: imgInteligenciaArtificial,
  },
  {
    id: 'innovacion-institucional',
    code: 'T · 03',
    label: 'Innovación institucional',
    tagline: 'Modelos + capacidades',
    headline: 'Antes y después del cambio.',
    desc:
      'Herramientas para actualizar modelos, agendas y capacidades institucionales. Arrastrá el divisor para ver la transformación.',
    highlights: [
      'Rediseño de procesos',
      'Mapas de capacidades',
      'Roadmap institucional',
    ],
    image: imgInnovacionInstitucional,
    compare: true,
  },
  {
    id: 'comunicacion-narrativa',
    code: 'T · 04',
    label: 'Comunicación y narrativa',
    tagline: 'Mensajes + relevancia',
    headline: 'Narrativa que construye relevancia.',
    desc:
      'Diseño de mensajes, posicionamiento y campañas para construir la voz institucional y conectar con públicos clave.',
    highlights: [
      'Estrategia de posicionamiento',
      'Campañas integrales',
      'Narrativas internas',
    ],
    image: imgComunicacionNarrativa,
  },
]

const activeTopic = computed(() => topics[active.value])

let reduce = false
let autoplayTimer = null
let progressTween = null
let orbTweens = []
let stageCtx = null
let initialTrigger = null
let pointerHover = false
let pointerActive = false

const AUTOPLAY_MS = 7000

function pad(n) {
  return String(n).padStart(2, '0')
}

function setSlideRef(el, i) {
  if (el) slideRefs.value[i] = el
}

function setActive(i, manual = false) {
  const n = topics.length
  const next = ((i % n) + n) % n
  if (next === active.value) return
  active.value = next
  if (manual) restartAutoplay()
}

function startAutoplay() {
  if (!autoplay.value || autoplayTimer || reduce) return
  autoplayTimer = window.setInterval(() => {
    if (!pointerHover) setActive(active.value + 1)
  }, AUTOPLAY_MS)
  startProgress()
}

function stopAutoplay() {
  if (autoplayTimer) {
    window.clearInterval(autoplayTimer)
    autoplayTimer = null
  }
  if (progressTween) {
    progressTween.kill()
    progressTween = null
  }
  if (progressRef.value) gsap.set(progressRef.value, { scaleX: 0 })
}

function restartAutoplay() {
  stopAutoplay()
  startAutoplay()
}

function toggleAutoplay() {
  autoplay.value = !autoplay.value
  if (autoplay.value) startAutoplay()
  else stopAutoplay()
}

function startProgress() {
  if (!progressRef.value || reduce) return
  if (progressTween) progressTween.kill()
  gsap.set(progressRef.value, { scaleX: 0, transformOrigin: 'left center' })
  progressTween = gsap.to(progressRef.value, {
    scaleX: 1,
    duration: AUTOPLAY_MS / 1000,
    ease: 'none',
  })
}

function animateSlideSwitch(prevIdx, newIdx) {
  if (reduce) return
  const prevSlide = slideRefs.value[prevIdx]
  const newSlide = slideRefs.value[newIdx]

  if (prevSlide) {
    gsap.to(prevSlide, {
      opacity: 0,
      scale: 1.08,
      filter: 'blur(14px)',
      duration: 0.7,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        gsap.set(prevSlide, {
          opacity: 0,
          scale: 1.18,
          filter: 'blur(18px)',
          clipPath: 'inset(0 100% 0 0)',
        })
      },
    })
  }

  if (newSlide) {
    gsap.fromTo(
      newSlide,
      {
        opacity: 0,
        scale: 1.18,
        filter: 'blur(18px)',
        clipPath: 'inset(0 100% 0 0)',
      },
      {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.35,
        ease: 'expo.out',
        delay: 0.05,
        overwrite: 'auto',
      }
    )
  }

  if (counterRef.value) {
    counterRef.value.textContent = pad(newIdx + 1)
    gsap.fromTo(
      counterRef.value,
      { y: 14, opacity: 0, filter: 'blur(6px)' },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.55,
        ease: 'power3.out',
        overwrite: 'auto',
      }
    )
  }
}

function onCaptionEnter(el, done) {
  if (reduce) {
    done()
    return
  }
  const words = el.querySelectorAll('.temas-word-inner')
  const kicker = el.querySelector('.temas__caption-kicker')
  const desc = el.querySelector('.temas__caption-desc')
  gsap.set(words, { yPercent: 118 })
  gsap.set([kicker, desc].filter(Boolean), { opacity: 0, y: 16 })
  const tl = gsap.timeline({
    onComplete: done,
    defaults: { ease: 'power3.out' },
  })
  tl.to(kicker, { opacity: 1, y: 0, duration: 0.55 }, 0)
  tl.to(
    words,
    { yPercent: 0, duration: 1.0, stagger: 0.055, ease: 'expo.out' },
    0.08
  )
  tl.to(desc, { opacity: 1, y: 0, duration: 0.7 }, 0.32)
}

function onCaptionLeave(el, done) {
  if (reduce) {
    done()
    return
  }
  const words = el.querySelectorAll('.temas-word-inner')
  const kicker = el.querySelector('.temas__caption-kicker')
  const desc = el.querySelector('.temas__caption-desc')
  const tl = gsap.timeline({
    onComplete: done,
    defaults: { ease: 'power2.in' },
  })
  tl.to([kicker, desc].filter(Boolean), { opacity: 0, y: -10, duration: 0.3 }, 0)
  tl.to(words, { yPercent: -130, duration: 0.36, stagger: 0.03 }, 0)
}

function onHighlightsEnter(el, done) {
  if (reduce) {
    done()
    return
  }
  const tag = el.querySelector('.temas__panel-tag')
  const items = el.querySelectorAll('.temas__panel-highlight')
  gsap.set([tag, ...items].filter(Boolean), { opacity: 0, x: -16 })
  const tl = gsap.timeline({
    onComplete: done,
    defaults: { ease: 'power3.out' },
  })
  tl.to(tag, { opacity: 1, x: 0, duration: 0.5 }, 0)
  tl.to(items, { opacity: 1, x: 0, duration: 0.6, stagger: 0.07 }, 0.12)
}

function onHighlightsLeave(el, done) {
  if (reduce) {
    done()
    return
  }
  const tag = el.querySelector('.temas__panel-tag')
  const items = el.querySelectorAll('.temas__panel-highlight')
  gsap.to([tag, ...items].filter(Boolean), {
    opacity: 0,
    x: -10,
    duration: 0.32,
    stagger: 0.03,
    ease: 'power2.in',
    onComplete: done,
  })
}

function onStageEnter() {
  pointerHover = true
  if (progressTween) progressTween.pause()
}

function onStageLeave() {
  pointerHover = false
  if (autoplay.value && progressTween) progressTween.resume()
  if (reduce || activeTopic.value.compare || !stageRef.value) return
  gsap.to(stageRef.value, {
    rotationX: 0,
    rotationY: 0,
    duration: 1.1,
    ease: 'elastic.out(1, 0.45)',
  })
  if (deckRef.value) {
    gsap.to(deckRef.value, {
      x: 0,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    })
  }
}

function onStageMouseMove(e) {
  if (reduce || activeTopic.value.compare || !stageRef.value) return
  const rect = stageRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  gsap.to(stageRef.value, {
    rotationY: x * 5,
    rotationX: -y * 4,
    duration: 0.6,
    ease: 'power2.out',
    transformPerspective: 1200,
    transformOrigin: 'center center',
  })
  if (deckRef.value) {
    gsap.to(deckRef.value, {
      x: -x * 16,
      y: -y * 12,
      duration: 0.6,
      ease: 'power2.out',
    })
  }
}

function setPctFromClientX(clientX) {
  const el = compareRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const x = clientX - r.left
  comparePct.value = Math.min(100, Math.max(0, (x / r.width) * 100))
}

function onComparePointerDown(e) {
  const root = compareRef.value
  if (!root || !root.contains(e.target)) return
  e.preventDefault()
  pointerActive = true
  root.setPointerCapture?.(e.pointerId)
  setPctFromClientX(e.clientX)

  const move = (ev) => {
    if (!pointerActive) return
    setPctFromClientX(ev.clientX)
  }
  const up = () => {
    pointerActive = false
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}

watch(active, (newIdx, prevIdx) => {
  animateSlideSwitch(prevIdx, newIdx)
  if (autoplay.value && !pointerHover) startProgress()
})

onMounted(async () => {
  await nextTick()
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  slideRefs.value.forEach((el, i) => {
    if (!el) return
    if (i === active.value) {
      gsap.set(el, {
        opacity: 0,
        scale: 1.22,
        filter: 'blur(22px)',
        clipPath: 'inset(0 100% 0 0)',
      })
    } else {
      gsap.set(el, {
        opacity: 0,
        scale: 1,
        filter: 'blur(0px)',
        clipPath: 'inset(0 100% 0 0)',
      })
    }
  })

  const captionEl = sectionRef.value?.querySelector('.temas__caption')
  if (captionEl) {
    gsap.set(captionEl.querySelectorAll('.temas-word-inner'), { yPercent: 118 })
    gsap.set(
      [
        captionEl.querySelector('.temas__caption-kicker'),
        captionEl.querySelector('.temas__caption-desc'),
      ].filter(Boolean),
      { opacity: 0, y: 16 }
    )
  }

  const highlightsEl = sectionRef.value?.querySelector(
    '.temas__panel-highlights'
  )
  if (highlightsEl) {
    const tag = highlightsEl.querySelector('.temas__panel-tag')
    const items = highlightsEl.querySelectorAll('.temas__panel-highlight')
    gsap.set([tag, ...items].filter(Boolean), { opacity: 0, x: -16 })
  }

  if (reduce) {
    slideRefs.value.forEach((el, i) => {
      if (!el) return
      gsap.set(el, {
        opacity: i === active.value ? 1 : 0,
        scale: 1,
        filter: 'none',
        clipPath: 'inset(0)',
      })
    })
    if (captionEl) {
      gsap.set(captionEl.querySelectorAll('.temas-word-inner'), { yPercent: 0 })
      gsap.set(
        [
          captionEl.querySelector('.temas__caption-kicker'),
          captionEl.querySelector('.temas__caption-desc'),
        ].filter(Boolean),
        { opacity: 1, y: 0 }
      )
    }
    if (highlightsEl) {
      gsap.set(
        [
          highlightsEl.querySelector('.temas__panel-tag'),
          ...highlightsEl.querySelectorAll('.temas__panel-highlight'),
        ].filter(Boolean),
        { opacity: 1, x: 0 }
      )
    }
    return
  }

  stageCtx = gsap.context(() => {
    initialTrigger = ScrollTrigger.create({
      trigger: stageRef.value,
      start: 'top 78%',
      once: true,
      onEnter: () => {
        const activeSlide = slideRefs.value[active.value]
        if (activeSlide) {
          gsap.to(activeSlide, {
            opacity: 1,
            scale: 1,
            filter: 'blur(0px)',
            clipPath: 'inset(0)',
            duration: 1.55,
            ease: 'expo.out',
          })
        }

        if (captionEl) {
          const words = captionEl.querySelectorAll('.temas-word-inner')
          const kicker = captionEl.querySelector('.temas__caption-kicker')
          const desc = captionEl.querySelector('.temas__caption-desc')
          gsap.to(kicker, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            delay: 0.28,
          })
          gsap.to(words, {
            yPercent: 0,
            duration: 1.05,
            stagger: 0.055,
            ease: 'expo.out',
            delay: 0.38,
          })
          gsap.to(desc, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            delay: 0.7,
          })
        }

        gsap.from('.temas__stage-chrome > *', {
          opacity: 0,
          y: -14,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.5,
        })

        gsap.from('.temas__panel-top > *', {
          opacity: 0,
          y: 16,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.2,
        })
        gsap.from('.temas__panel-item', {
          opacity: 0,
          x: 22,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.3,
        })
        gsap.from('.temas__panel-controls > *', {
          opacity: 0,
          y: 12,
          duration: 0.55,
          stagger: 0.07,
          ease: 'power3.out',
          delay: 0.95,
        })

        if (highlightsEl) {
          const tag = highlightsEl.querySelector('.temas__panel-tag')
          const items = highlightsEl.querySelectorAll(
            '.temas__panel-highlight'
          )
          gsap.to(tag, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: 'power3.out',
            delay: 0.7,
          })
          gsap.to(items, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power3.out',
            delay: 0.85,
          })
        }

        gsap.delayedCall(1.8, () => startAutoplay())
      },
    })
  }, sectionRef.value)

  orbTweens.push(
    gsap.to('.temas__fx-orb--a', {
      x: '+=70',
      y: '-=50',
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  )
  orbTweens.push(
    gsap.to('.temas__fx-orb--b', {
      x: '-=80',
      y: '+=60',
      duration: 26,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  )
})

onBeforeUnmount(() => {
  stopAutoplay()
  stageCtx?.revert()
  stageCtx = null
  initialTrigger?.kill()
  initialTrigger = null
  orbTweens.forEach((t) => t.kill())
  orbTweens = []
})

onUnmounted(() => {
  pointerActive = false
})
</script>

<style scoped>
.temas {
  --temas-bg: var(--section-bg);
  --temas-ink: #1c1a18;
  --temas-muted: rgba(28, 26, 24, 0.62);
  --temas-rule: rgba(28, 26, 24, 0.18);
  --temas-line-soft: rgba(28, 26, 24, 0.10);
  --temas-line-faint: rgba(28, 26, 24, 0.07);
  --temas-accent: #21dc99;
  --temas-warm: #efdbb4;

  position: relative;
  background: var(--temas-bg);
  color: var(--temas-ink);
  box-sizing: border-box;
  overflow: visible;
  isolation: isolate;
}

/* Capa decorativa: sin recorte del blur (evita la “división” / borde duro entre secciones). */
.temas__fx {
  position: absolute;
  z-index: 0;
  pointer-events: none;
  overflow: visible;
  inset: -25% -18% -28% -18%;
}

.temas__fx-orb {
  position: absolute;
  width: 42rem;
  height: 42rem;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.28;
  will-change: transform;
}

.temas__fx-orb--a {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--temas-accent) 70%, transparent),
    transparent 70%
  );
  top: -16%;
  right: -12%;
}

.temas__fx-orb--b {
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--temas-warm) 70%, transparent),
    transparent 70%
  );
  bottom: -16%;
  left: -10%;
}

.temas__grain {
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

/* ---------- Shell ---------- */
.temas__shell {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-temas-bottom);
  box-sizing: border-box;
  min-width: 0;
}

/* ---------- Header ---------- */
.temas__head {
  margin-bottom: clamp(2.8rem, 5.5vw, 4.2rem);
  max-width: 64rem;
}

.temas__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: clamp(1.2rem, 2.2vw, 1.7rem);
  flex-wrap: wrap;
}

.temas__brand-mark {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: #1c1a18;
}

.temas__brand-text {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #1c1a18;
}

.temas__brand-rule {
  width: 2.4rem;
  height: 1px;
  background: var(--temas-rule);
}

.temas__brand-sub {
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-family: var(--font-heading);
  font-size: 0.64rem;
  font-weight: var(--font-w-regular);
  letter-spacing: 0.18em;
  color: rgba(28, 26, 24, 0.52);
}

.temas__title {
  margin: 0 0 clamp(1.2rem, 2.2vw, 1.8rem);
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4.2vw, 3rem);
  line-height: 1.12;
  font-weight: 700;
  color: #1c1a18;
  text-wrap: balance;
  font-synthesis: none;
}

.temas__title-em {
  display: block;
  font-style: normal;
  font-weight: var(--font-w-regular);
  color: rgba(28, 26, 24, 0.48);
}

.temas__lead {
  margin: 0;
  max-width: 40rem;
  font-family: var(--font-body);
  font-size: clamp(0.98rem, 1.25vw, 1.16rem);
  line-height: 1.6;
  color: var(--temas-muted);
}

/* ---------- Showcase ---------- */
.temas__showcase {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(280px, 1fr);
  gap: clamp(2rem, 4.5vw, 3.6rem);
  align-items: start;
}

.temas__main {
  display: grid;
  gap: clamp(1.8rem, 3.4vw, 2.8rem);
  min-width: 0;
}

/* ---------- Stage ---------- */
.temas__stage {
  position: relative;
  border-radius: clamp(22px, 2.5vw, 32px);
  overflow: hidden;
  background: #0a0a0c;
  aspect-ratio: 4 / 3;
  max-height: clamp(380px, 46vw, 520px);
  isolation: isolate;
  transform-style: preserve-3d;
  will-change: transform;
}

.temas__stage::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(255, 255, 255, 0.08);
  pointer-events: none;
  z-index: 6;
}

.temas__stage-deck {
  position: absolute;
  inset: 0;
  will-change: transform;
}

.temas__stage-slide {
  position: absolute;
  inset: 0;
  z-index: 1;
  will-change: transform, opacity, filter, clip-path;
  overflow: hidden;
  opacity: 0;
}

.temas__stage-slide.is-active {
  z-index: 2;
}

.temas__stage-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.temas__stage-gradient {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.34) 0%,
    rgba(0, 0, 0, 0.14) 28%,
    transparent 62%
  );
  opacity: 0.85;
}

/* Stage chrome */
.temas__stage-chrome {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.temas__stage-code {
  position: absolute;
  top: clamp(1rem, 2vw, 1.5rem);
  left: clamp(1.1rem, 2.4vw, 1.7rem);
  font-family: var(--font-body);
  font-size: 0.66rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
  padding: 0.4rem 0.7rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 999px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.05);
}

.temas__stage-mark {
  position: absolute;
  top: clamp(1rem, 2vw, 1.5rem);
  right: clamp(1.1rem, 2.4vw, 1.7rem);
  font-family: var(--font-heading);
  font-size: 1.3rem;
  line-height: 1;
  font-synthesis: none;
  color: rgba(255, 255, 255, 0.92);
  width: 2.5rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.4s ease, border-color 0.4s ease;
}

.temas__stage:hover .temas__stage-mark {
  transform: rotate(45deg);
  color: var(--temas-accent);
  border-color: color-mix(in srgb, var(--temas-accent) 60%, transparent);
}

/* Decorative corners */
.temas__stage-frame {
  position: absolute;
  inset: clamp(0.85rem, 1.6vw, 1.25rem);
  pointer-events: none;
}

.temas__stage-frame-corner {
  position: absolute;
  width: clamp(1.2rem, 1.8vw, 1.7rem);
  height: clamp(1.2rem, 1.8vw, 1.7rem);
  border-color: rgba(255, 255, 255, 0.55);
}

.temas__stage-frame-corner--tl {
  top: 0;
  left: 0;
  border-top: 1px solid;
  border-left: 1px solid;
}

.temas__stage-frame-corner--tr {
  top: 0;
  right: 0;
  border-top: 1px solid;
  border-right: 1px solid;
}

.temas__stage-frame-corner--bl {
  bottom: 0;
  left: 0;
  border-bottom: 1px solid;
  border-left: 1px solid;
}

.temas__stage-frame-corner--br {
  bottom: 0;
  right: 0;
  border-bottom: 1px solid;
  border-right: 1px solid;
}

/* Caption block (below stage, in normal flow) */
.temas__caption {
  display: grid;
  gap: clamp(0.55rem, 1vw, 0.85rem);
  max-width: 36rem;
  padding: 0 clamp(0.2rem, 0.6vw, 0.5rem);
  position: relative;
}

.temas__caption-kicker {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-body);
  font-size: 0.62rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.55);
  padding: 0.32rem 0.65rem;
  border: 1px solid rgba(28, 26, 24, 0.14);
  border-radius: 999px;
  background: rgba(28, 26, 24, 0.04);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  justify-self: start;
  will-change: transform, opacity;
}

.temas__caption-title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 2vw, 1.7rem);
  line-height: 1.12;
  font-weight: var(--font-w-semibold);
  color: #1c1a18;
  text-wrap: balance;
  font-synthesis: none;
}

.temas-word {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  margin-right: 0.22em;
  line-height: 1.16;
  padding-bottom: 0.04em;
}

.temas-word-inner {
  display: inline-block;
  will-change: transform;
}

.temas__caption-desc {
  margin: 0;
  max-width: 34rem;
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 1.05vw, 0.98rem);
  line-height: 1.55;
  color: rgba(28, 26, 24, 0.60);
  will-change: transform, opacity;
}

/* Progress bar */
.temas__progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 5;
  pointer-events: none;
}

.temas__progress-fill {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    var(--temas-accent) 0%,
    color-mix(in srgb, var(--temas-accent) 60%, white) 100%
  );
  transform: scaleX(0);
  transform-origin: left center;
}

/* Compare slider */
.temas-compare {
  position: absolute;
  inset: 0;
  cursor: ew-resize;
  touch-action: none;
  user-select: none;
}

.temas-compare__base,
.temas-compare__before-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}

.temas-compare__before {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.temas-compare__handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
  z-index: 4;
  pointer-events: none;
}

.temas-compare__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  margin-left: -1px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.18);
}

.temas-compare__knob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
  color: #141417;
  pointer-events: auto;
  cursor: ew-resize;
  transition: transform 0.35s ease;
}

.temas-compare__knob:hover {
  transform: translate(-50%, -50%) scale(1.06);
}

.temas-compare__knob .pi {
  font-size: 0.68rem;
  line-height: 1;
}

/* ---------- Panel ---------- */
.temas__panel {
  display: grid;
  gap: clamp(1.4rem, 2.4vw, 2rem);
  align-content: start;
  padding-top: clamp(0.3rem, 0.8vw, 0.6rem);
}

.temas__panel-top {
  display: grid;
  gap: 0.4rem;
}

.temas__panel-counter {
  display: inline-flex;
  align-items: baseline;
  gap: 0.5rem;
  color: var(--temas-ink);
}

.temas__panel-now {
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 4.4vw, 3.6rem);
  font-weight: var(--font-w-extrabold);
  line-height: 0.95;
  display: inline-block;
  will-change: transform, opacity, filter;
  font-synthesis: none;
}

.temas__panel-of {
  font-family: var(--font-body);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.45);
}

.temas__panel-label {
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.45);
}

/* Panel list */
.temas__panel-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  border-top: 1px solid var(--temas-line-faint);
  border-bottom: 1px solid var(--temas-line-faint);
}

.temas__panel-item {
  border-bottom: 1px solid var(--temas-line-faint);
}

.temas__panel-item:last-child {
  border-bottom: none;
}

.temas__panel-btn {
  width: 100%;
  background: transparent;
  border: 0;
  padding: clamp(0.9rem, 1.6vw, 1.2rem) 0.2rem;
  display: grid;
  grid-template-columns: 2.6rem 2.4rem 1fr auto;
  align-items: center;
  gap: 0.85rem;
  cursor: pointer;
  color: inherit;
  text-align: left;
  transition: padding 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.4s ease;
  position: relative;
}

.temas__panel-btn:hover,
.temas__panel-item.is-active .temas__panel-btn {
  padding-left: 0.7rem;
  background: rgba(28, 26, 24, 0.05);
}

.temas__panel-num {
  font-family: var(--font-body);
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.40);
  transition: color 0.4s ease;
}

.temas__panel-item.is-active .temas__panel-num {
  color: rgba(28, 26, 24, 0.82);
}

.temas__panel-line {
  height: 1px;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(28, 26, 24, 0.35) 0%,
    transparent 100%
  );
  transform-origin: left center;
  transform: scaleX(0.6);
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.4s ease;
}

.temas__panel-btn:hover .temas__panel-line,
.temas__panel-item.is-active .temas__panel-line {
  transform: scaleX(1);
}

.temas__panel-item.is-active .temas__panel-line {
  background: linear-gradient(
    90deg,
    var(--temas-accent) 0%,
    color-mix(in srgb, var(--temas-accent) 30%, transparent) 100%
  );
}

.temas__panel-copy {
  display: grid;
  gap: 0.18rem;
}

.temas__panel-name {
  font-family: var(--font-heading);
  font-size: clamp(1rem, 1.4vw, 1.18rem);
  font-weight: var(--font-w-semibold);
  line-height: 1.15;
  color: rgba(28, 26, 24, 0.65);
  transition: color 0.4s ease;
  font-synthesis: none;
}

.temas__panel-item.is-active .temas__panel-name {
  color: #1c1a18;
}

.temas__panel-tagline {
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.38);
}

.temas__panel-dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--temas-accent);
  box-shadow: 0 0 0 5px color-mix(in srgb, var(--temas-accent) 18%, transparent);
  opacity: 0;
  transform: scale(0.4);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.temas__panel-item.is-active .temas__panel-dot {
  opacity: 1;
  transform: scale(1);
}

/* Highlights */
.temas__panel-highlights {
  display: grid;
  gap: 0.6rem;
}

.temas__panel-tag {
  font-family: var(--font-body);
  font-size: 0.66rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.48);
  will-change: transform, opacity;
}

.temas__panel-highlights ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

.temas__panel-highlight {
  display: grid;
  grid-template-columns: 3.4rem 1.8rem 1fr;
  align-items: center;
  gap: 0.85rem;
  padding: 0.7rem 0;
  border-top: 1px solid var(--temas-line-faint);
  will-change: transform, opacity;
}

.temas__panel-highlight:last-child {
  border-bottom: 1px solid var(--temas-line-faint);
}

.temas__panel-highlight-num {
  font-family: var(--font-body);
  font-size: 0.62rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(28, 26, 24, 0.42);
}

.temas__panel-highlight-line {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(28, 26, 24, 0.30) 0%,
    transparent 100%
  );
}

.temas__panel-highlight-text {
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 1.05vw, 0.98rem);
  color: #1c1a18;
  line-height: 1.4;
}

/* Controls */
.temas__panel-controls {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-top: 0.4rem;
}

.temas__ctrl {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  border-radius: 999px;
  border: 1px solid rgba(28, 26, 24, 0.14);
  background: rgba(28, 26, 24, 0.05);
  color: #1c1a18;
  font-family: var(--font-body);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.3s ease, background 0.3s ease, color 0.3s ease;
}

.temas__ctrl .pi {
  font-size: 0.78rem;
  line-height: 1;
}

.temas__ctrl:hover {
  border-color: rgba(28, 26, 24, 0.28);
  background: rgba(28, 26, 24, 0.09);
}

.temas__ctrl--toggle {
  width: auto;
  padding: 0 0.95rem;
  height: 2.4rem;
}

.temas__ctrl--toggle span {
  font-size: 0.66rem;
}

/* ---------- Responsive ---------- */
@media (max-width: 1080px) {
  .temas__showcase {
    grid-template-columns: 1fr;
    gap: clamp(2rem, 5vw, 3rem);
  }

  .temas__stage {
    aspect-ratio: 16 / 10;
    max-height: clamp(360px, 56vw, 480px);
  }
}

@media (max-width: 640px) {
  .temas__stage {
    aspect-ratio: 4 / 3;
    max-height: 360px;
  }

  .temas__caption-title {
    font-size: clamp(1.2rem, 5.5vw, 1.6rem);
  }

  .temas__panel-btn {
    grid-template-columns: 2rem 1.6rem 1fr auto;
    gap: 0.55rem;
  }

  .temas__ctrl--toggle span {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .temas__stage-slide,
  .temas__stage-deck,
  .temas__stage {
    transform: none !important;
    filter: none !important;
    clip-path: inset(0) !important;
  }
  .temas__stage-slide:not(.is-active) {
    opacity: 0 !important;
  }
  .temas__stage-slide.is-active {
    opacity: 1 !important;
  }
  .temas-word-inner {
    transform: none !important;
  }
  .temas__caption-kicker,
  .temas__caption-desc,
  .temas__panel-tag,
  .temas__panel-highlight {
    opacity: 1 !important;
    transform: none !important;
  }
  .temas__fx-orb {
    animation: none !important;
  }
}
</style>
