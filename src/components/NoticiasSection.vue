<template>
  <section id="noticias" ref="sectionRef" class="news" aria-labelledby="news-heading">
    <div class="news__fx" aria-hidden="true">
      <span class="news__fx-orb news__fx-orb--a" />
      <span class="news__fx-orb news__fx-orb--b" />
    </div>

    <div class="news__shell">
      <header class="news__head">
        <div class="news__brand" data-reveal>
          <span class="news__brand-mark" aria-hidden="true" />
          <span class="news__brand-text">Novedades</span>
          <span class="news__brand-rule" aria-hidden="true" />
          <span class="news__brand-sub">Lo último de WE</span>
        </div>

        <div class="news__head-row">
          <h2 id="news-heading" class="news__title" data-reveal>
            Noticias e ideas
            <em class="news__title-em">que mueven a las organizaciones.</em>
          </h2>

          <div v-if="isCarousel" class="news__nav" data-reveal>
            <button
              type="button"
              class="news__nav-btn"
              aria-label="Noticia anterior"
              @click="prev"
            >
              <i class="pi pi-arrow-left" aria-hidden="true"></i>
            </button>
            <button
              type="button"
              class="news__nav-btn"
              aria-label="Siguiente noticia"
              @click="next"
            >
              <i class="pi pi-arrow-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </header>

      <div
        class="news__viewport"
        :class="{ 'is-static': !isCarousel }"
        ref="viewportRef"
        data-reveal
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <ul class="news__track" :style="trackStyle" ref="trackRef" role="list">
          <li
            v-for="(item, i) in displayItems"
            :key="item._key"
            class="news-card"
            :aria-hidden="item._clone ? 'true' : null"
          >
            <a
              class="news-card__media"
              :href="item.link"
              tabindex="-1"
              aria-hidden="true"
            >
              <img
                :src="item.image"
                alt=""
                class="news-card__img"
                loading="lazy"
                draggable="false"
              />
              <span class="news-card__tag">{{ item.tag }}</span>
            </a>

            <div class="news-card__body">
              <span class="news-card__date">{{ item.date }}</span>
              <h3 class="news-card__title">{{ item.title }}</h3>
              <p class="news-card__excerpt">{{ item.excerpt }}</p>
              <a
                class="news-card__cta"
                :href="item.link"
                :tabindex="item._clone ? -1 : null"
              >
                <span class="news-card__cta-label">Leer más</span>
                <span class="news-card__cta-icon" aria-hidden="true">
                  <i class="pi pi-arrow-right"></i>
                </span>
              </a>
            </div>
          </li>
        </ul>
      </div>

      <div
        v-if="isCarousel"
        class="news__dots"
        role="tablist"
        aria-label="Seleccionar noticia"
      >
        <button
          v-for="(item, i) in news"
          :key="'dot-' + item.id"
          type="button"
          class="news__dot"
          :class="{ 'is-active': i === activeIndex }"
          :aria-label="`Ir a la noticia ${i + 1}`"
          :aria-selected="i === activeIndex ? 'true' : 'false'"
          @click="goToReal(i)"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

import imgSost from '../assets/imagenesDefinitivas/programaSustentabilidad.jpeg'
import imgIA from '../assets/imagenesDefinitivas/formacionEnIA.jpeg'
import imgGob from '../assets/imagenesDefinitivas/acompaniamosGobiernos.jpeg'
import imgCom from '../assets/imagenesDefinitivas/tallerComunicacionInstitucional.jpeg'
import imgFin from '../assets/imagenesDefinitivas/tallerFinanciamientoDeImpacto.jpeg'
import imgEst from '../assets/imagenesDefinitivas/tallerDeEstrategiaPublica.jpeg'

const { sectionRef } = useScrollReveal()

// Noticias — reemplazables por un feed real. La sección detecta automáticamente
// si hay más cards que las visibles (máx. 3) y activa el carrusel infinito.
const news = [
  {
    id: 'foro-sostenibilidad',
    tag: 'Sostenibilidad',
    date: '12 Jun 2026',
    title: 'WE en el Foro de Sostenibilidad 2026',
    excerpt:
      'Compartimos escenario para conversar sobre cómo las organizaciones integran criterios ambientales en su estrategia.',
    image: imgSost,
    link: '#contacto',
  },
  {
    id: 'programa-ia',
    tag: 'Formación',
    date: '28 May 2026',
    title: 'Nuevo programa de formación en IA aplicada',
    excerpt:
      'Abrimos inscripciones para equipos que quieren incorporar inteligencia artificial con foco en productividad y gobernanza.',
    image: imgIA,
    link: '#contacto',
  },
  {
    id: 'alianza-ciudades',
    tag: 'Gobiernos',
    date: '15 May 2026',
    title: 'Alianza para la transformación de ciudades',
    excerpt:
      'Acompañamos a gobiernos locales en proyectos de movilidad, datos y servicios más eficientes y sostenibles.',
    image: imgGob,
    link: '#contacto',
  },
  {
    id: 'taller-comunicacion',
    tag: 'Comunicación',
    date: '30 Abr 2026',
    title: 'Taller de comunicación institucional',
    excerpt:
      'Trabajamos junto a equipos y sindicatos para fortalecer reputación, claridad de mensaje y confianza.',
    image: imgCom,
    link: '#contacto',
  },
  {
    id: 'financiamiento-impacto',
    tag: 'Impacto',
    date: '18 Abr 2026',
    title: 'Financiamiento de impacto: primeros resultados',
    excerpt:
      'Presentamos los avances del programa que conecta proyectos con fondos orientados a resultados verificables.',
    image: imgFin,
    link: '#contacto',
  },
  {
    id: 'estrategias-publicas',
    tag: 'Estrategia',
    date: '02 Abr 2026',
    title: 'Estrategias públicas para una nueva etapa',
    excerpt:
      'Diseñamos rutas y métricas para modernizar procesos y sostener el impacto en el tiempo.',
    image: imgEst,
    link: '#contacto',
  },
]

const viewportRef = ref(null)
const trackRef = ref(null)

const perView = ref(3)
const pos = ref(0) // índice del slide en el track extendido (con clones)
const step = ref(0) // px por card (ancho + gap)
const transition = ref(false)
const dragDx = ref(0)

let reduce = false
let isAnimating = false
let settleTimer = null
let rafResize = 0

// Gestión del puntero (swipe táctil + arrastre con mouse)
let dragId = null
let startX = 0
let startY = 0
let decided = false
let horizontal = false

const gap = computed(() =>
  perView.value === 1 ? 16 : perView.value === 2 ? 20 : 24
)
const isCarousel = computed(() => news.length > perView.value)
const settleMs = () => (reduce ? 30 : 640)
const transDur = () => (reduce ? '0.01s' : '0.6s')

// Track extendido: clones al inicio y al final para el loop sin saltos.
const displayItems = computed(() => {
  if (!isCarousel.value) {
    return news.map((n) => ({ ...n, _key: n.id, _clone: false }))
  }
  const v = perView.value
  const head = news.slice(0, v).map((n) => ({ ...n, _key: `head-${n.id}`, _clone: true }))
  const tail = news
    .slice(news.length - v)
    .map((n) => ({ ...n, _key: `tail-${n.id}`, _clone: true }))
  const real = news.map((n) => ({ ...n, _key: n.id, _clone: false }))
  return [...tail, ...real, ...head]
})

const activeIndex = computed(() => {
  if (!isCarousel.value) return 0
  const n = news.length
  return (((pos.value - perView.value) % n) + n) % n
})

const trackStyle = computed(() => ({
  '--news-per': String(perView.value),
  '--news-gap': gap.value + 'px',
  transform: isCarousel.value
    ? `translate3d(${-(pos.value * step.value) + dragDx.value}px, 0, 0)`
    : 'none',
  transition: transition.value
    ? `transform ${transDur()} cubic-bezier(0.22, 1, 0.36, 1)`
    : 'none',
}))

function computePerView() {
  const w = window.innerWidth
  if (w <= 640) return 1
  if (w <= 1000) return 2
  return 3
}

function measure() {
  if (!viewportRef.value) return
  const w = viewportRef.value.clientWidth
  step.value = (w + gap.value) / perView.value
}

function recalc() {
  perView.value = computePerView()
  nextTick(() => {
    measure()
    transition.value = false
    pos.value = isCarousel.value ? perView.value : 0
  })
}

function scheduleSettle() {
  clearTimeout(settleTimer)
  settleTimer = setTimeout(() => {
    const n = news.length
    const v = perView.value
    if (pos.value >= v + n || pos.value < v) {
      transition.value = false
      pos.value = v + ((((pos.value - v) % n) + n) % n)
    }
    isAnimating = false
  }, settleMs())
}

function move(dir) {
  if (!isCarousel.value || isAnimating) return
  isAnimating = true
  transition.value = true
  pos.value += dir
  scheduleSettle()
}

function next() {
  move(1)
}

function prev() {
  move(-1)
}

function goToReal(i) {
  if (!isCarousel.value || isAnimating) return
  isAnimating = true
  transition.value = true
  pos.value = perView.value + i
  scheduleSettle()
}

function onPointerDown(e) {
  if (!isCarousel.value || isAnimating) return
  if (e.pointerType === 'mouse' && e.button !== 0) return
  dragId = e.pointerId
  startX = e.clientX
  startY = e.clientY
  decided = false
  horizontal = false
}

function onPointerMove(e) {
  if (dragId === null || e.pointerId !== dragId) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (!decided) {
    if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
    decided = true
    horizontal = Math.abs(dx) > Math.abs(dy)
    if (horizontal) {
      transition.value = false
      try {
        viewportRef.value.setPointerCapture(dragId)
      } catch (_) {}
    }
  }
  if (horizontal) {
    e.preventDefault()
    dragDx.value = dx
  }
}

function onPointerUp(e) {
  if (dragId === null || (e.pointerId !== undefined && e.pointerId !== dragId)) return
  const dx = dragDx.value
  const wasHorizontal = horizontal
  try {
    viewportRef.value.releasePointerCapture(dragId)
  } catch (_) {}
  dragId = null
  decided = false
  horizontal = false
  dragDx.value = 0
  if (!wasHorizontal) return
  transition.value = true
  const threshold = Math.max(40, step.value * 0.18)
  if (dx <= -threshold) move(1)
  else if (dx >= threshold) move(-1)
}

function onResize() {
  cancelAnimationFrame(rafResize)
  rafResize = requestAnimationFrame(recalc)
}

onMounted(() => {
  reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  perView.value = computePerView()
  nextTick(() => {
    measure()
    pos.value = isCarousel.value ? perView.value : 0
    requestAnimationFrame(measure)
  })
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(rafResize)
  clearTimeout(settleTimer)
})
</script>

<style scoped>
.news {
  --news-ink: #1c1a18;
  --news-muted: rgba(28, 26, 24, 0.62);
  --news-faint: rgba(28, 26, 24, 0.42);
  --news-line: rgba(28, 26, 24, 0.12);
  --news-accent: #da5933;
  --news-warm: #efdbb4;

  position: relative;
  background: transparent;
  color: var(--news-ink);
  box-sizing: border-box;
  overflow: hidden;
  isolation: isolate;
}

/* Capa decorativa muy sutil, en armonía con las demás secciones claras. */
.news__fx {
  position: absolute;
  inset: -20% -15%;
  z-index: 0;
  pointer-events: none;
}

.news__fx-orb {
  position: absolute;
  width: 38rem;
  height: 38rem;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.16;
}

.news__fx-orb--a {
  top: -12%;
  left: -8%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--news-accent) 70%, transparent),
    transparent 70%
  );
}

.news__fx-orb--b {
  bottom: -14%;
  right: -6%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--news-warm) 70%, transparent),
    transparent 70%
  );
}

.news__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  box-sizing: border-box;
  min-width: 0;
}

/* ---------- Header ---------- */
.news__head {
  margin-bottom: clamp(2rem, 4.5vw, 3.25rem);
}

.news__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: clamp(1.1rem, 2.2vw, 1.6rem);
  flex-wrap: wrap;
}

.news__brand-mark {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--news-ink);
}

.news__brand-text {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--news-ink);
}

.news__brand-rule {
  width: 2.4rem;
  height: 1px;
  background: var(--news-faint);
}

.news__brand-sub {
  font-family: var(--font-heading);
  font-size: 0.64rem;
  font-weight: var(--font-w-regular);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--news-faint);
}

.news__head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: clamp(1.5rem, 4vw, 3rem);
}

.news__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4.2vw, 3rem);
  line-height: 1.12;
  font-weight: 700;
  color: var(--news-ink);
  text-wrap: balance;
  font-synthesis: none;
  max-width: 22ch;
}

.news__title-em {
  font-style: normal;
  font-weight: var(--font-w-regular);
  color: var(--news-faint);
}

/* ---------- Nav arrows ---------- */
.news__nav {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-shrink: 0;
}

.news__nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.85rem;
  height: 2.85rem;
  border-radius: 50%;
  border: 1px solid var(--news-line);
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--news-ink);
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.news__nav-btn:hover {
  border-color: color-mix(in srgb, var(--news-accent) 55%, transparent);
  background: var(--news-accent);
  color: #fff;
  transform: translateY(-2px);
}

.news__nav-btn:active {
  transform: translateY(0);
}

.news__nav-btn .pi {
  font-size: 0.85rem;
}

/* ---------- Viewport / track ---------- */
.news__viewport {
  position: relative;
  /* Recorte horizontal para el loop infinito (oculta las cards vecinas), con
     aire vertical para que la sombra de las cards no quede cortada por el
     borde del contenedor. Sin padding horizontal: así el recorte coincide con
     el borde de la primera/última card y la medición del paso no se altera. */
  overflow: hidden;
  padding: 24px 0 52px;
  touch-action: pan-y;
  cursor: grab;
}

.news__viewport:active {
  cursor: grabbing;
}

.news__viewport.is-static {
  cursor: default;
}

.news__track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: var(--news-gap, 24px);
  will-change: transform;
  user-select: none;
}

.news__viewport.is-static .news__track {
  justify-content: center;
  flex-wrap: wrap;
}

/* ---------- Card ---------- */
.news-card {
  flex: 0 0
    calc(
      (100% - (var(--news-per, 3) - 1) * var(--news-gap, 24px)) /
        var(--news-per, 3)
    );
  max-width: calc(
    (100% - (var(--news-per, 3) - 1) * var(--news-gap, 24px)) /
      var(--news-per, 3)
  );
  min-width: 0;
  display: flex;
  flex-direction: column;
  border-radius: clamp(16px, 1.6vw, 22px);
  border: 1px solid var(--news-line);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(21, 21, 22, 0.05);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s ease, border-color 0.4s ease;
}

.news-card:hover {
  transform: translateY(-4px);
  border-color: color-mix(in srgb, var(--news-accent) 30%, transparent);
  box-shadow: 0 22px 48px rgba(21, 21, 22, 0.12);
}

.news-card__media {
  position: relative;
  display: block;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: #ebe7df;
}

.news-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.news-card:hover .news-card__img {
  transform: scale(1.05);
}

.news-card__tag {
  position: absolute;
  top: 0.85rem;
  left: 0.85rem;
  font-family: var(--font-heading);
  font-size: 0.6rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #fff;
  padding: 0.36rem 0.7rem;
  border-radius: 999px;
  background: rgba(28, 26, 24, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.news-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.55rem;
  padding: clamp(1.15rem, 2.2vw, 1.5rem);
}

.news-card__date {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--news-faint);
}

.news-card__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.1rem, 1.5vw, 1.3rem);
  line-height: 1.22;
  font-weight: var(--font-w-bold);
  color: var(--news-ink);
  font-synthesis: none;
}

.news-card__excerpt {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.86rem, 1vw, 0.95rem);
  line-height: 1.55;
  color: var(--news-muted);
  flex: 1;
}

.news-card__cta {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 0.6rem;
  margin-top: 0.4rem;
  text-decoration: none;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.04em;
  color: var(--news-ink);
  transition: color 0.25s ease, gap 0.25s ease;
}

.news-card__cta:hover {
  color: var(--news-accent);
  gap: 0.85rem;
}

.news-card__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 50%;
  background: var(--news-accent);
  color: #fff;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.news-card__cta:hover .news-card__cta-icon {
  transform: translateX(2px) rotate(-8deg);
}

.news-card__cta-icon .pi {
  font-size: 0.66rem;
}

/* ---------- Dots ---------- */
.news__dots {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.1rem;
  /* El viewport ya aporta aire inferior con su padding, así que aquí va poco. */
  margin-top: clamp(0.25rem, 1.5vw, 0.6rem);
}

.news__dot {
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.news__dot::before {
  content: '';
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 999px;
  background: rgba(28, 26, 24, 0.2);
  transition: width 0.3s ease, background 0.3s ease;
}

.news__dot.is-active::before {
  width: 1.5rem;
  background: var(--news-accent);
}

/* ---------- Responsive ---------- */
@media (max-width: 1000px) {
  .news__head-row {
    align-items: flex-start;
  }
}

@media (max-width: 640px) {
  .news__head-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1.25rem;
  }

  .news__title {
    max-width: none;
  }

  .news__nav {
    justify-content: flex-end;
  }

  .news-card__media {
    aspect-ratio: 16 / 9;
  }
}

@media (prefers-reduced-motion: reduce) {
  .news-card,
  .news-card__img,
  .news-card__cta,
  .news__nav-btn,
  .news__dot {
    transition: none !important;
  }
}
</style>
