<template>
  <section class="hero3" ref="heroRef">
    <div class="hero3__bg" aria-hidden="true">
      <img :src="fondo" alt="" class="hero3__bg-img" />
      <div class="hero3__bg-overlay" />
    </div>

    <header class="hero3__nav">
      <a href="/" class="hero3__logo" aria-label="WE — Inicio">
        <img :src="logoSrc" alt="WE" class="hero3__logo-img" />
      </a>

      <nav class="hero3__nav-center" aria-label="Principal">
        <a href="#">Quiénes somos</a>
        <a href="#">Qué hacemos</a>
        <a href="#">Verticales</a>
        <a href="#">Servicios</a>
        <a href="#">Blog</a>
      </nav>

      <a href="#" class="hero3__nav-cta">Contactanos</a>
    </header>

    <div class="hero3__main">
      <p class="hero3__eyebrow">FORMAR · POSICIONAR · TRANSFORMAR</p>

      <h1 class="hero3__title">
        <span class="hero3__title-row">
          <span class="hero3__title-word">Liderar el</span>
        </span>
        <span class="hero3__title-row">
          <span class="hero3__title-word">futuro</span>
        </span>
      </h1>

      <p class="hero3__desc">
        Formamos, posicionamos y transformamos organizaciones
        para liderar el futuro.
      </p>

      <div class="hero3__cta-group">
        <a href="#" class="hero3__cta">
          <span>Agendar reunión</span>
          <span class="hero3__cta-icon" aria-hidden="true">
            <i class="pi pi-arrow-up-right"></i>
          </span>
        </a>
        <a href="#" class="hero3__cta-ghost">Ver qué hacemos</a>
      </div>
    </div>

    <footer class="hero3__footer">
      <div class="hero3__stats" aria-label="Indicadores">
        <div class="hero3__stat">
          <p class="hero3__stat-num">+50</p>
          <p class="hero3__stat-label">Proyectos realizados</p>
        </div>
        <div class="hero3__stat">
          <p class="hero3__stat-num">+20</p>
          <p class="hero3__stat-label">Especialistas</p>
        </div>
        <div class="hero3__stat">
          <p class="hero3__stat-num">4</p>
          <p class="hero3__stat-label">Verticales de impacto</p>
        </div>
        <div class="hero3__stat">
          <p class="hero3__stat-num">+10</p>
          <p class="hero3__stat-label">Años de experiencia</p>
        </div>
      </div>

      <div class="hero3__scroll" aria-hidden="true">
        <span>Scroll down</span>
        <i class="pi pi-arrow-down"></i>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import fondo from '../assets/fondoHero3.jpeg'
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

    gsap.set('.hero3__bg-img', { scale: 1.08, transformOrigin: 'center center' })

    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

    tl.to('.hero3__bg-img', { scale: 1, duration: 2.6, ease: 'power3.out' }, 0)
      .from('.hero3__logo', { y: -20, opacity: 0, duration: 0.95 }, 0.1)
      .from('.hero3__nav-center', { y: -20, opacity: 0, duration: 0.95 }, 0.16)
      .from('.hero3__nav-cta', { y: -20, opacity: 0, duration: 0.95 }, 0.22)
      .from('.hero3__eyebrow', { y: 20, opacity: 0, duration: 0.85 }, 0.36)
      .from(
        '.hero3__title-word',
        { yPercent: 115, opacity: 0, duration: 1.25, stagger: 0.1 },
        0.44
      )
      .from('.hero3__desc', { y: 22, opacity: 0, duration: 0.95 }, 0.82)
      .from('.hero3__cta-group > *', { y: 22, opacity: 0, duration: 0.95, stagger: 0.08 }, 0.96)
      .from(
        '.hero3__stat',
        { y: 26, opacity: 0, duration: 0.95, stagger: 0.1 },
        0.85
      )
      .from('.hero3__scroll', { opacity: 0, duration: 0.9 }, 1.2)
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
.hero3 {
  position: relative;
  isolation: isolate;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  color: var(--brand-02);
  background: #0d1218;
  padding: clamp(1rem, 1.8vw, 1.5rem) clamp(1.25rem, 3.5vw, 3rem)
    clamp(1.25rem, 2.4vw, 1.85rem);
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vh, 1.5rem);
}

/* ───── Fondo ───── */
.hero3__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero3__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  will-change: transform;
}

.hero3__bg-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(13, 18, 24, 0.45) 0%, rgba(13, 18, 24, 0.08) 28%, rgba(13, 18, 24, 0.55) 100%),
    linear-gradient(90deg, rgba(13, 18, 24, 0.55) 0%, rgba(13, 18, 24, 0.12) 55%, rgba(13, 18, 24, 0) 100%);
  pointer-events: none;
}

.hero3 > *:not(.hero3__bg) {
  position: relative;
  z-index: 1;
}

/* ───── Nav ───── */
.hero3__nav {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  padding-top: clamp(0.25rem, 0.6vh, 0.5rem);
}

.hero3__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 18px;
  padding: 0.55rem 0.95rem;
  box-shadow:
    0 10px 24px rgba(0, 0, 0, 0.22),
    0 2px 6px rgba(0, 0, 0, 0.12);
  text-decoration: none;
  line-height: 0;
}

.hero3__logo-img {
  display: block;
  height: clamp(1.4rem, 1.7vw, 1.75rem);
  width: auto;
}

.hero3__nav-center {
  justify-self: center;
  display: inline-flex;
  align-items: center;
  gap: clamp(0.4rem, 1vw, 0.85rem);
  padding: 0.4rem 0.55rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  backdrop-filter: blur(18px) saturate(160%);
  -webkit-backdrop-filter: blur(18px) saturate(160%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 8px 22px rgba(0, 0, 0, 0.18);
}

.hero3__nav-center a {
  position: relative;
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: var(--font-w-medium);
  letter-spacing: 0.01em;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  transition: color 0.2s ease, background 0.2s ease;
}

.hero3__nav-center a:hover {
  color: var(--brand-02);
  background: rgba(255, 255, 255, 0.08);
}

.hero3__nav-cta {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  background: var(--brand-02);
  color: var(--brand-01);
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.005em;
  padding: 0.7rem 1.2rem;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.hero3__nav-cta:hover {
  transform: translateY(-1px);
  background: transparent;
  color: var(--brand-02);
  border-color: rgba(255, 255, 255, 0.85);
}

/* ───── Main ───── */
.hero3__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(0.85rem, 2vh, 1.4rem);
  max-width: min(60rem, 100%);
  padding-top: clamp(1rem, 4vh, 2.5rem);
}

.hero3__eyebrow {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.28em;
  color: rgba(255, 255, 255, 0.78);
}

.hero3__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.4rem, 6.2vw, 5rem);
  line-height: 1.02;
  letter-spacing: -0.022em;
  font-weight: 600;
  text-transform: none;
  color: var(--brand-02);
  font-synthesis: none;
}

.hero3__title-row {
  display: block;
  overflow: hidden;
  padding-bottom: 0.06em;
}

.hero3__title-word {
  display: inline-block;
  will-change: transform, opacity;
}

.hero3__desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.88rem, 1.05vw, 1rem);
  line-height: 1.55;
  font-weight: var(--font-w-regular);
  color: rgba(255, 255, 255, 0.82);
  max-width: 32rem;
}

.hero3__cta-group {
  display: inline-flex;
  align-items: center;
  gap: clamp(1.1rem, 2.2vw, 1.85rem);
  flex-wrap: wrap;
  margin-top: clamp(0.25rem, 1vh, 0.6rem);
}

.hero3__cta-ghost {
  color: var(--brand-02);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 0.95vw, 0.9rem);
  font-weight: var(--font-w-medium);
  letter-spacing: 0.005em;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);
  transition: opacity 0.2s ease, border-color 0.2s ease;
}

.hero3__cta-ghost:hover {
  opacity: 0.85;
}

.hero3__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  background: var(--brand-02);
  color: var(--brand-01);
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 0.95vw, 0.9rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.005em;
  padding: 0.55rem 0.6rem 0.55rem 1.4rem;
  border-radius: 999px;
  border: 1px solid var(--brand-02);
  transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
}

.hero3__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: var(--brand-01);
  color: var(--brand-02);
  transition: transform 0.3s ease;
}

.hero3__cta-icon .pi {
  font-size: 0.82rem;
}

.hero3__cta:hover {
  transform: translateY(-1px);
}

.hero3__cta:hover .hero3__cta-icon {
  transform: rotate(45deg);
}

/* ───── Footer (stats + scroll) ───── */
.hero3__footer {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(0.85rem, 1.8vh, 1.35rem);
  padding-top: clamp(0.5rem, 1.5vh, 1rem);
}

.hero3__stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(0.85rem, 2vw, 2rem);
  padding-top: clamp(0.85rem, 2vh, 1.4rem);
  border-top: 1px solid rgba(255, 255, 255, 0.16);
}

.hero3__stat {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.hero3__stat-num {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.65rem, 2.6vw, 2.4rem);
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--brand-02);
  font-synthesis: none;
}

.hero3__stat-label {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.85vw, 0.82rem);
  font-weight: var(--font-w-regular);
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 0.01em;
}

.hero3__scroll {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, calc(100% + 0.1rem));
  display: none;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.hero3__scroll .pi {
  font-size: 0.78rem;
  animation: hero3ScrollBob 1.8s ease-in-out infinite;
}

@keyframes hero3ScrollBob {
  0%, 100% { transform: translateY(0); opacity: 0.85; }
  50% { transform: translateY(3px); opacity: 1; }
}

/* En este layout el "scroll down" va dentro del footer, centrado debajo de stats */
.hero3__footer {
  align-items: stretch;
}

.hero3__footer > .hero3__scroll {
  position: static;
  transform: none;
  display: inline-flex;
  align-self: center;
  margin-top: 0.15rem;
}

/* ───── Responsive ───── */
@media (max-width: 1024px) {
  .hero3__nav-center {
    gap: 0.2rem;
    padding: 0.35rem 0.4rem;
  }

  .hero3__nav-center a {
    padding: 0.45rem 0.7rem;
    font-size: 0.72rem;
  }
}

@media (max-width: 900px) {
  .hero3__nav {
    grid-template-columns: auto 1fr;
  }

  .hero3__nav-center {
    display: none;
  }

  .hero3__nav-cta {
    justify-self: end;
  }

  .hero3__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.1rem 1.5rem;
  }
}

@media (max-width: 520px) {
  .hero3 {
    padding-left: 1.1rem;
    padding-right: 1.1rem;
  }

  .hero3__title {
    font-size: clamp(1.9rem, 9vw, 2.6rem);
  }

  .hero3__cta {
    padding-left: 1.15rem;
  }

  .hero3__cta-icon {
    width: 1.9rem;
    height: 1.9rem;
  }

  .hero3__stat-num {
    font-size: 1.5rem;
  }

  .hero3__scroll {
    display: none !important;
  }
}
</style>
