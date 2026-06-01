<template>
  <section class="heroM" ref="heroRef">
    <div class="heroM__bg" aria-hidden="true">
      <img :src="fondo" alt="" class="heroM__bg-img" />
      <div class="heroM__bg-wash" />
    </div>

    <header class="heroM__nav">
      <a href="/" class="heroM__logo" aria-label="WE — Inicio">
        <img :src="logoSrc" alt="WE" class="heroM__logo-img" />
      </a>

      <nav class="heroM__nav-center" aria-label="Principal">
        <a href="#">Quiénes somos</a>
        <a href="#">Qué hacemos</a>
        <a href="#">Verticales</a>
        <a href="#">Contacto</a>
      </nav>

      <a href="#" class="heroM__nav-cta">Agendar reunión</a>
    </header>

    <div class="heroM__main">
      <a href="#" class="heroM__badge">
        <span class="heroM__badge-label">Consultoría estratégica</span>
        <span class="heroM__badge-sep" aria-hidden="true">·</span>
        <span class="heroM__badge-tag">EST. 2024</span>
      </a>

      <h1 class="heroM__title">
        <span class="heroM__title-row">
          <span class="heroM__title-word">Liderar el</span>
          <span class="heroM__title-word">futuro</span>
        </span>
      </h1>

      <p class="heroM__desc">
        Formamos, posicionamos y transformamos organizaciones
        <br class="heroM__desc-br" />
        para liderar el futuro.
      </p>

      <div class="heroM__cta-group">
        <a href="#" class="heroM__cta">
          <span class="heroM__cta-icon" aria-hidden="true">
            <i class="pi pi-play"></i>
          </span>
          <span>Agendar reunión</span>
        </a>
        <a href="#" class="heroM__cta-ghost">Ver qué hacemos</a>
      </div>
    </div>

    <footer class="heroM__footer">
      <div class="heroM__footer-stat">
        <p class="heroM__footer-num">4</p>
        <p class="heroM__footer-stat-label">Verticales de impacto</p>
      </div>

      <p class="heroM__footer-text">
        Trabajamos con empresas, gobiernos y organizaciones en
        <strong>sostenibilidad</strong>, <strong>inteligencia artificial</strong>,
        <strong>comunicación estratégica</strong> y
        <strong>transformación institucional</strong>.
      </p>

      <div class="heroM__footer-pagination" aria-hidden="true">
        <span>01</span>
        <span class="heroM__footer-pag-track"><span class="heroM__footer-pag-fill" /></span>
        <span>03</span>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import fondo from '../assets/fondoHero2.jpeg'
import logoSrc from '../assets/logoNegro.png'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref(null)
let ctx
let heroReplayTrigger

function playAnimations(root) {
  if (!root) return
  ctx?.revert()

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.from('.heroM__logo', { y: -18, opacity: 0, duration: 0.95 }, 0)
      .from('.heroM__nav-center a', { y: -16, opacity: 0, duration: 0.85, stagger: 0.07 }, 0.06)
      .from('.heroM__nav-cta', { y: -16, opacity: 0, duration: 0.85 }, 0.16)
      .from('.heroM__badge', { y: 18, opacity: 0, duration: 0.9 }, 0.28)
      .from(
        '.heroM__title-word',
        { yPercent: 110, opacity: 0, duration: 1.25, stagger: 0.1 },
        0.36
      )
      .from('.heroM__desc', { y: 18, opacity: 0, duration: 0.9 }, 0.78)
      .from('.heroM__cta-group > *', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.92)
      .from('.heroM__footer-stat', { y: 18, opacity: 0, duration: 0.9 }, 0.78)
      .from('.heroM__footer-text', { y: 18, opacity: 0, duration: 0.9 }, 0.88)
      .from('.heroM__footer-pagination', { y: 14, opacity: 0, duration: 0.8 }, 0.98)
      .fromTo(
        '.heroM__footer-pag-fill',
        { scaleX: 0.1, transformOrigin: 'left center' },
        { scaleX: 0.38, duration: 2.4, ease: 'power2.inOut' },
        1.05
      )
  }, root)
}

onMounted(async () => {
  await nextTick()
  const root = heroRef.value
  if (!root) return

  playAnimations(root)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion) {
    let scrolledPast = false
    heroReplayTrigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      onLeave: () => { scrolledPast = true },
      onEnterBack: () => {
        if (!scrolledPast) return
        scrolledPast = false
        nextTick(() => {
          playAnimations(heroRef.value)
          ScrollTrigger.refresh()
        })
      },
    })
  }
})

onUnmounted(() => {
  heroReplayTrigger?.kill()
  heroReplayTrigger = null
  ctx?.revert()
})
</script>

<style scoped>
.heroM {
  position: relative;
  isolation: isolate;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  color: var(--brand-01);
  background: #f3eee8;
  padding: clamp(1rem, 1.8vw, 1.5rem) clamp(1.25rem, 4vw, 3.5rem);
  display: flex;
  flex-direction: column;
}

/* ───── Fondo ───── */
.heroM__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.heroM__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
  display: block;
}

.heroM__bg-wash {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 35%),
    radial-gradient(70% 55% at 50% 42%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.heroM > *:not(.heroM__bg) {
  position: relative;
  z-index: 1;
}

/* ───── Nav ───── */
.heroM__nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding-top: clamp(0.35rem, 0.8vh, 0.65rem);
}

.heroM__logo {
  display: inline-flex;
  align-items: center;
  line-height: 0;
  text-decoration: none;
}

.heroM__logo-img {
  display: block;
  height: clamp(1.4rem, 1.8vw, 1.8rem);
  width: auto;
}

.heroM__nav-center {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 1.85rem);
  justify-self: center;
}

.heroM__nav-center a {
  position: relative;
  color: rgba(21, 21, 22, 0.78);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: var(--font-w-medium);
  letter-spacing: 0.01em;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.heroM__nav-center a:hover {
  color: var(--brand-01);
}

.heroM__nav-cta {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  background: var(--brand-01);
  color: var(--brand-02);
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.005em;
  padding: 0.6rem 1.05rem;
  border-radius: 999px;
  border: 1px solid var(--brand-01);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.heroM__nav-cta:hover {
  transform: translateY(-1px);
  background: transparent;
  color: var(--brand-01);
}

/* ───── Main centrado ───── */
.heroM__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: clamp(1rem, 2.2vh, 1.6rem);
  padding-bottom: clamp(1rem, 3vh, 2rem);
}

/* Badge "Backed by..." */
.heroM__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: rgba(21, 21, 22, 0.72);
  font-family: var(--font-body);
  font-size: 0.74rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.01em;
  padding: 0.4rem 0.85rem;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(21, 21, 22, 0.08);
  border-radius: 999px;
  backdrop-filter: blur(8px) saturate(140%);
  -webkit-backdrop-filter: blur(8px) saturate(140%);
  transition: background 0.2s ease;
}

.heroM__badge:hover {
  background: rgba(255, 255, 255, 0.75);
}

.heroM__badge-sep {
  opacity: 0.45;
}

.heroM__badge-tag {
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.08em;
  color: var(--brand-01);
}

/* Título */
.heroM__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 6.2vw, 5.25rem);
  line-height: 1;
  letter-spacing: -0.025em;
  font-weight: 600;
  text-transform: none;
  color: var(--brand-01);
  font-synthesis: none;
  max-width: min(96vw, 90rem);
  width: 100%;
}

.heroM__title-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: baseline;
  gap: 0.22em;
  overflow: hidden;
  padding-bottom: 0.05em;
  white-space: nowrap;
}

.heroM__title-word {
  display: inline-block;
  will-change: transform, opacity;
}

/* Bajada */
.heroM__desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 1vw, 0.98rem);
  line-height: 1.55;
  font-weight: var(--font-w-regular);
  color: rgba(21, 21, 22, 0.7);
  max-width: 34rem;
}

/* CTA group */
.heroM__cta-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.7rem, 1.4vh, 1rem);
  margin-top: clamp(0.35rem, 1vh, 0.85rem);
}

.heroM__cta-ghost {
  color: var(--brand-01);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 0.95vw, 0.9rem);
  font-weight: var(--font-w-medium);
  letter-spacing: 0.005em;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(21, 21, 22, 0.55);
  transition: color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.heroM__cta-ghost:hover {
  opacity: 0.78;
}

/* CTA principal */
.heroM__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  background: var(--brand-01);
  color: var(--brand-02);
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 0.95vw, 0.9rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.005em;
  padding: 0.75rem 1.35rem 0.75rem 1.1rem;
  border-radius: 999px;
  border: 1px solid var(--brand-01);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.heroM__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.05rem;
  height: 1.05rem;
}

.heroM__cta-icon .pi {
  font-size: 0.6rem;
  transform: translateX(0.5px);
}

.heroM__cta:hover {
  transform: translateY(-1px);
  background: transparent;
  color: var(--brand-01);
}

/* ───── Footer (stat + descripción + paginación) ───── */
.heroM__footer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(1.25rem, 3.5vw, 3rem);
  padding-top: clamp(0.85rem, 1.6vh, 1.2rem);
  border-top: 1px solid rgba(21, 21, 22, 0.12);
}

.heroM__footer-stat {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 6rem;
}

.heroM__footer-num {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 2.6vw, 2.4rem);
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--brand-01);
  font-synthesis: none;
}

.heroM__footer-stat-label {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(21, 21, 22, 0.55);
}

.heroM__footer-text {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 0.95vw, 0.92rem);
  line-height: 1.55;
  color: rgba(21, 21, 22, 0.72);
  max-width: 38rem;
  justify-self: center;
  text-align: left;
}

.heroM__footer-text strong {
  color: var(--brand-01);
  font-weight: var(--font-w-semibold);
}

.heroM__footer-pagination {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-body);
  font-size: 0.66rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.12em;
  color: rgba(21, 21, 22, 0.7);
  font-variant-numeric: tabular-nums;
}

.heroM__footer-pag-track {
  position: relative;
  display: block;
  width: clamp(4rem, 8vw, 7rem);
  height: 2px;
  background: rgba(21, 21, 22, 0.18);
  border-radius: 1px;
  overflow: hidden;
}

.heroM__footer-pag-fill {
  position: absolute;
  inset: 0;
  background: var(--brand-01);
  border-radius: 1px;
  transform: scaleX(0.12);
  transform-origin: left center;
}

/* ───── Responsive ───── */
@media (max-width: 900px) {
  .heroM__nav {
    grid-template-columns: auto 1fr;
  }

  .heroM__nav-center {
    display: none;
  }

  .heroM__nav-cta {
    justify-self: end;
  }

  .heroM__footer {
    grid-template-columns: 1fr;
    text-align: left;
    gap: 0.85rem;
  }

  .heroM__footer-text {
    justify-self: start;
  }

  .heroM__footer-pagination {
    justify-self: start;
  }
}

@media (max-width: 520px) {
  .heroM {
    padding-left: 1.1rem;
    padding-right: 1.1rem;
  }

  .heroM__title {
    font-size: clamp(2.4rem, 12vw, 3.6rem);
  }

  .heroM__desc-br {
    display: none;
  }

  .heroM__footer-num {
    font-size: 1.5rem;
  }
}
</style>
