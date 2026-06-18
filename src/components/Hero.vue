<template>
  <section class="hero" ref="heroRef">
    <!-- ───── Fondo: humo / gases WebGL reactivo al mouse ───── -->
    <div class="hero__bg" aria-hidden="true">
      <canvas class="hero__canvas" ref="canvasRef"></canvas>
      <div class="hero__grain" />
    </div>

    <header class="hero__nav">
      <a href="/" class="hero__logo" aria-label="WE — Inicio">
        <img :src="logoSrc" alt="WE" class="hero__logo-img" />
      </a>

      <nav class="hero__nav-center" aria-label="Principal">
        <a href="#quienes-somos">Quiénes somos</a>
        <a href="#que-hacemos">Qué hacemos</a>
        <a href="#temas">Verticales</a>
        <a href="#noticias">Noticias</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <div class="hero__nav-end">
        <a href="#contacto" class="hero__nav-cta">Agendar reunión</a>
        <button
          type="button"
          class="hero__burger"
          :class="{ 'is-open': menuOpen }"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          aria-controls="hero-mobile-menu"
          aria-label="Abrir menú de navegación"
          @click="toggleMenu"
        >
          <span class="hero__burger-line" aria-hidden="true" />
          <span class="hero__burger-line" aria-hidden="true" />
        </button>
      </div>
    </header>

    <Teleport to="body">
      <div
        id="hero-mobile-menu"
        class="hero__menu"
        :class="{ 'is-open': menuOpen }"
        role="dialog"
        aria-modal="true"
        aria-label="Navegación"
        @click.self="closeMenu"
      >
        <button
          type="button"
          class="hero__menu-close"
          aria-label="Cerrar menú"
          @click="closeMenu"
        >
          <span class="hero__menu-close-line" aria-hidden="true" />
          <span class="hero__menu-close-line" aria-hidden="true" />
        </button>

        <nav class="hero__menu-nav" aria-label="Principal móvil">
          <a href="#quienes-somos" @click="closeMenu">Quiénes somos</a>
          <a href="#que-hacemos" @click="closeMenu">Qué hacemos</a>
          <a href="#temas" @click="closeMenu">Verticales</a>
          <a href="#noticias" @click="closeMenu">Noticias</a>
          <a href="#contacto" @click="closeMenu">Contacto</a>
        </nav>
        <a href="#contacto" class="hero__menu-cta" @click="closeMenu">
          <span>Agendar reunión</span>
          <i class="pi pi-arrow-right" aria-hidden="true"></i>
        </a>
      </div>
    </Teleport>

    <div class="hero__main">
      <a href="#que-hacemos" class="hero__badge">
        <span class="hero__badge-dot" aria-hidden="true" />
        <span class="hero__badge-label">Consultoría estratégica</span>
        <span class="hero__badge-rule" aria-hidden="true" />
        <span class="hero__badge-sub">Est. 2024</span>
      </a>

      <h1 class="hero__title">
        <span class="hero__title-row">
          <span class="hero__title-word">Liderar el</span>
          <span class="hero__title-word hero__title-word--accent">futuro</span>
        </span>
      </h1>

      <p class="hero__desc">
        Transformamos organizaciones para liderar el futuro.
      </p>

      <div class="hero__cta-group">
        <a href="#contacto" class="hero__cta">
          <span class="hero__cta-icon" aria-hidden="true">
            <i class="pi pi-play"></i>
          </span>
          <span>Agendar reunión</span>
        </a>
        <a href="#que-hacemos" class="hero__cta-ghost">Ver qué hacemos</a>
      </div>
    </div>

    <footer class="hero__footer">
      <div class="hero__footer-stat">
        <p class="hero__footer-num">4</p>
        <p class="hero__footer-stat-label">Verticales de impacto</p>
      </div>

      <p class="hero__footer-text">
        Formamos, conectamos y potenciamos organizaciones para liderar la nueva economía:
        <strong>más tecnológica</strong>, <strong>más sostenible</strong> y
        <strong>más inclusiva</strong>.
      </p>

      <a href="#quienes-somos" class="hero__footer-scroll" aria-label="Explorar el sitio">
        <span class="hero__footer-scroll-label">Explorar</span>
        <span class="hero__footer-scroll-track" aria-hidden="true">
          <span class="hero__footer-scroll-fill" />
        </span>
        <i class="pi pi-chevron-down hero__footer-scroll-icon" aria-hidden="true" />
      </a>
    </footer>
  </section>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import logoSrc from '../assets/logoBlancoDefinitivo.png'
import { gsap } from '../lib/gsap'
import { createSmokeBackground } from '../lib/smokeBackground'
import { getLenis } from '../lib/lenis'

const heroRef = ref(null)
const canvasRef = ref(null)
const menuOpen = ref(false)

let ctx
let smoke

function openMenu() {
  menuOpen.value = true
  getLenis()?.stop()
  document.body.style.overflow = 'hidden'
}

function closeMenu() {
  menuOpen.value = false
  getLenis()?.start()
  document.body.style.overflow = ''
}

function toggleMenu() {
  menuOpen.value ? closeMenu() : openMenu()
}

function onKeydown(e) {
  if (e.key === 'Escape' && menuOpen.value) closeMenu()
}

function playReveal() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) return

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero__logo', { y: -18, opacity: 0, duration: 0.95 }, 0)
    .from('.hero__nav-center a', { y: -16, opacity: 0, duration: 0.85, stagger: 0.07 }, 0.06)
    .from('.hero__nav-end', { y: -16, opacity: 0, duration: 0.85 }, 0.16)
    .from('.hero__badge', { y: 18, opacity: 0, duration: 0.9 }, 0.3)
    .from('.hero__title-word', { yPercent: 110, opacity: 0, duration: 1.25, stagger: 0.12 }, 0.38)
    .from('.hero__desc', { y: 18, opacity: 0, duration: 0.9 }, 0.85)
    .from('.hero__cta-group > *', { y: 18, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.98)
    .from('.hero__footer-stat', { y: 18, opacity: 0, duration: 0.9 }, 0.85)
    .from('.hero__footer-text', { y: 18, opacity: 0, duration: 0.9 }, 0.95)
    .from('.hero__footer-scroll', { y: 14, opacity: 0, duration: 0.8 }, 1.05)
    .fromTo(
      '.hero__footer-scroll-fill',
      { scaleX: 0.1, transformOrigin: 'left center' },
      { scaleX: 1, duration: 2.4, ease: 'power2.inOut' },
      1.1
    )
}

onMounted(async () => {
  await nextTick()
  const root = heroRef.value
  if (!root) return

  // Fondo de humo en WebGL — degrada con elegancia si el contexto no existe.
  if (canvasRef.value) {
    smoke = createSmokeBackground(canvasRef.value, root)
  }

  ctx = gsap.context(() => {
    playReveal()
  }, root)

  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  smoke?.destroy()
  ctx?.revert()
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
  getLenis()?.start()
})
</script>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  color: #f4efe6;
  background: var(--brand-ink);
  padding: clamp(1rem, 1.8vw, 1.5rem) clamp(1.25rem, 4vw, 3.5rem);
  display: flex;
  flex-direction: column;
}

/* ───── Fondo humo ───── */
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
  /* Fallback estático si WebGL no está disponible. */
  background:
    radial-gradient(60% 80% at 30% 42%, rgba(var(--accent-rgb), 0.42) 0%, rgba(var(--accent-rgb), 0) 60%),
    radial-gradient(55% 75% at 74% 58%, rgba(var(--sage-rgb), 0.32) 0%, rgba(var(--sage-rgb), 0) 62%),
    radial-gradient(120% 90% at 50% 38%, #20201f 0%, var(--brand-ink) 60%, #0e0e0f 100%);
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

/* Grano sutil para textura de humo */
.hero__grain {
  position: absolute;
  inset: 0;
  opacity: 0.14;
  mix-blend-mode: overlay;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-size: 200px 200px;
}

.hero > *:not(.hero__bg) {
  position: relative;
  z-index: 1;
}

/* ───── Nav ───── */
.hero__nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding-top: clamp(0.35rem, 0.8vh, 0.65rem);
}

.hero__logo {
  display: inline-flex;
  align-items: center;
  line-height: 0;
  text-decoration: none;
}

.hero__logo-img {
  display: block;
  height: clamp(1.4rem, 1.8vw, 1.8rem);
  width: auto;
}

.hero__nav-center {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2vw, 1.85rem);
  justify-self: center;
}

.hero__nav-center a {
  position: relative;
  color: rgba(244, 239, 230, 0.72);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: var(--font-w-medium);
  letter-spacing: 0.01em;
  padding: 0.25rem 0;
  transition: color 0.2s ease;
}

.hero__nav-center a:hover {
  color: #fff;
}

.hero__nav-cta {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 0.85vw, 0.8rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.005em;
  padding: 0.6rem 1.05rem;
  border-radius: 999px;
  border: 1px solid var(--accent);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
}

.hero__nav-cta:hover {
  transform: translateY(-1px);
  background: transparent;
  color: #fff;
}

.hero__nav-end {
  justify-self: end;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

/* ───── Botón hamburguesa (solo móvil) ───── */
.hero__burger {
  display: none;
  position: relative;
  width: 2.6rem;
  height: 2.6rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  z-index: 1001;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.hero__burger:hover {
  border-color: rgba(var(--accent-rgb), 0.55);
}

.hero__burger-line {
  display: block;
  width: 1.15rem;
  height: 1.6px;
  border-radius: 2px;
  background: #f4efe6;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.25s ease;
}

.hero__burger.is-open .hero__burger-line:first-child {
  transform: translateY(3.3px) rotate(45deg);
}

.hero__burger.is-open .hero__burger-line:last-child {
  transform: translateY(-3.3px) rotate(-45deg);
}

/* ───── Menú móvil a pantalla completa ───── */
.hero__menu {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: clamp(1.75rem, 6vh, 3rem);
  padding: 2rem;
  background: rgba(10, 10, 11, 0.94);
  backdrop-filter: blur(20px) saturate(120%);
  -webkit-backdrop-filter: blur(20px) saturate(120%);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.4s ease, visibility 0.4s ease;
}

.hero__menu.is-open {
  opacity: 1;
  visibility: visible;
}

.hero__menu-close {
  position: absolute;
  top: clamp(1.1rem, 3.5vw, 1.6rem);
  right: clamp(1.1rem, 4vw, 1.6rem);
  width: 2.8rem;
  height: 2.8rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.06);
  cursor: pointer;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.hero__menu-close:hover {
  border-color: rgba(var(--accent-rgb), 0.55);
  background: rgba(var(--accent-rgb), 0.12);
}

.hero__menu-close-line {
  position: absolute;
  width: 1.25rem;
  height: 1.6px;
  border-radius: 2px;
  background: #f4efe6;
}

.hero__menu-close-line:first-child {
  transform: rotate(45deg);
}

.hero__menu-close-line:last-child {
  transform: rotate(-45deg);
}

.hero__menu-nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.1rem, 4.5vh, 1.85rem);
}

.hero__menu-nav a {
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 8vw, 2.5rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: -0.01em;
  color: #f4efe6;
  text-decoration: none;
  font-synthesis: none;
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    color 0.2s ease;
}

.hero__menu-nav a:hover {
  color: var(--accent);
}

.hero__menu.is-open .hero__menu-nav a {
  opacity: 1;
  transform: translateY(0);
}

.hero__menu.is-open .hero__menu-nav a:nth-child(1) { transition-delay: 0.08s; }
.hero__menu.is-open .hero__menu-nav a:nth-child(2) { transition-delay: 0.14s; }
.hero__menu.is-open .hero__menu-nav a:nth-child(3) { transition-delay: 0.20s; }
.hero__menu.is-open .hero__menu-nav a:nth-child(4) { transition-delay: 0.26s; }
.hero__menu.is-open .hero__menu-nav a:nth-child(5) { transition-delay: 0.32s; }

.hero__menu-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: var(--font-w-semibold);
  padding: 0.85rem 1.6rem;
  border-radius: 999px;
  border: 1px solid var(--accent);
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.5s ease 0.38s,
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.38s;
}

.hero__menu.is-open .hero__menu-cta {
  opacity: 1;
  transform: translateY(0);
}

.hero__menu-cta .pi {
  font-size: 0.78rem;
}

/* ───── Main centrado ───── */
.hero__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: clamp(1rem, 2.2vh, 1.6rem);
  padding-bottom: clamp(1rem, 3vh, 2rem);
}

/* Eyebrow alineado al "kicker" que usa todo el sitio (punto + texto en
   mayúscula con tracking + línea fina + subtítulo). Mismo lenguaje que
   Quiénes somos, Para quién, Temas, Cómo trabajamos… adaptado al fondo oscuro
   del hero, con el punto en terracota para sumar un acento de marca. */
.hero__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 0.7rem;
  text-decoration: none;
  font-family: var(--font-heading);
  /* El humo puede aclararse justo detrás del eyebrow; una sombra suave oscura
     despega el texto del fondo, sea claro u oscuro. */
  text-shadow: 0 1px 14px rgba(8, 8, 10, 0.55), 0 0 3px rgba(8, 8, 10, 0.45);
  transition: opacity 0.3s ease;
}

.hero__badge:hover {
  opacity: 0.82;
}

.hero__badge-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 10px rgba(var(--accent-rgb), 0.7);
  flex-shrink: 0;
}

.hero__badge-label {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #f6f1e8;
  white-space: nowrap;
}

.hero__badge-rule {
  width: 2.2rem;
  height: 1px;
  background: rgba(244, 239, 230, 0.55);
  box-shadow: 0 0 8px rgba(8, 8, 10, 0.4);
  flex-shrink: 0;
}

.hero__badge-sub {
  font-family: var(--font-heading);
  font-size: 0.64rem;
  font-weight: var(--font-w-regular);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.82);
  white-space: nowrap;
}

/* Título */
.hero__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.6rem, 7vw, 6rem);
  line-height: 1;
  letter-spacing: -0.025em;
  font-weight: 600;
  text-transform: none;
  color: #f7f3ec;
  font-synthesis: none;
  max-width: min(96vw, 90rem);
  width: 100%;
}

.hero__title-row {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: baseline;
  gap: 0.24em;
  overflow: hidden;
  padding-bottom: 0.06em;
  white-space: nowrap;
}

.hero__title-word {
  display: inline-block;
  will-change: transform, opacity;
}

.hero__title-word--accent {
  color: var(--accent);
}

/* Bajada */
.hero__desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.85rem, 1vw, 1rem);
  line-height: 1.55;
  font-weight: var(--font-w-regular);
  color: rgba(244, 239, 230, 0.7);
  max-width: 34rem;
}

/* CTA group */
.hero__cta-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.7rem, 1.4vh, 1rem);
  margin-top: clamp(0.35rem, 1vh, 0.85rem);
}

.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  text-decoration: none;
  background: var(--accent);
  color: #fff;
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 0.95vw, 0.9rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.005em;
  padding: 0.75rem 1.35rem 0.75rem 1.1rem;
  border-radius: 999px;
  border: 1px solid var(--accent);
  box-shadow: 0 10px 30px rgba(var(--accent-rgb), 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.hero__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.05rem;
  height: 1.05rem;
}

.hero__cta-icon .pi {
  font-size: 0.6rem;
  transform: translateX(0.5px);
}

.hero__cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 38px rgba(var(--accent-rgb), 0.45);
}

.hero__cta-ghost {
  color: rgba(244, 239, 230, 0.92);
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.8rem, 0.95vw, 0.9rem);
  font-weight: var(--font-w-medium);
  letter-spacing: 0.005em;
  padding: 0.35rem 0;
  border-bottom: 1px solid rgba(244, 239, 230, 0.45);
  transition: color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
}

.hero__cta-ghost:hover {
  opacity: 0.8;
  border-color: var(--accent);
}

/* ───── Footer ───── */
.hero__footer {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: clamp(1.25rem, 3.5vw, 3rem);
  padding-top: clamp(0.85rem, 1.6vh, 1.2rem);
  border-top: 1px solid rgba(244, 239, 230, 0.14);
}

.hero__footer-stat {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 6rem;
}

.hero__footer-num {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 2.6vw, 2.4rem);
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--accent);
  font-synthesis: none;
}

.hero__footer-stat-label {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.55);
}

.hero__footer-text {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.82rem, 0.95vw, 0.92rem);
  line-height: 1.55;
  color: rgba(244, 239, 230, 0.72);
  max-width: 38rem;
  justify-self: center;
  text-align: left;
}

.hero__footer-text strong {
  color: #fff;
  font-weight: var(--font-w-semibold);
}

.hero__footer-scroll {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-body);
  font-size: 0.66rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(244, 239, 230, 0.7);
  text-decoration: none;
  transition: color 0.2s ease;
}

.hero__footer-scroll:hover,
.hero__footer-scroll:focus-visible {
  color: #fff;
}

.hero__footer-scroll-track {
  position: relative;
  display: block;
  width: clamp(3rem, 6vw, 5rem);
  height: 2px;
  background: rgba(244, 239, 230, 0.18);
  border-radius: 1px;
  overflow: hidden;
}

.hero__footer-scroll-fill {
  position: absolute;
  inset: 0;
  background: var(--accent);
  border-radius: 1px;
  transform: scaleX(0.12);
  transform-origin: left center;
}

.hero__footer-scroll-icon {
  font-size: 0.55rem;
  opacity: 0.85;
}

/* ───── Responsive ───── */
@media (max-width: 900px) {
  .hero__nav {
    grid-template-columns: auto 1fr;
  }

  .hero__nav-center {
    display: none;
  }

  .hero__burger {
    display: inline-flex;
  }

  .hero__footer {
    grid-template-columns: 1fr;
    text-align: left;
    gap: 0.85rem;
  }

  .hero__footer-text {
    justify-self: start;
  }

  .hero__footer-scroll {
    justify-self: start;
  }
}

@media (max-width: 520px) {
  .hero {
    padding-left: 1.1rem;
    padding-right: 1.1rem;
  }

  .hero__main {
    gap: clamp(0.85rem, 2vh, 1.3rem);
  }

  /* Eyebrow más compacto para que entre en una sola línea en teléfonos. */
  .hero__badge {
    gap: 0.5rem;
  }

  .hero__badge-label {
    font-size: 0.6rem;
    letter-spacing: 0.16em;
  }

  .hero__badge-rule {
    width: 1.4rem;
  }

  .hero__badge-sub {
    font-size: 0.56rem;
    letter-spacing: 0.14em;
  }

  .hero__title {
    font-size: clamp(2.6rem, 14vw, 4rem);
  }

  /* En pantallas muy angostas el título dejaría de entrar en una sola línea;
     permitimos que "futuro" baje a un segundo renglón en lugar de recortarse. */
  .hero__title-row {
    white-space: normal;
    flex-wrap: wrap;
    overflow: visible;
  }

  .hero__desc-br {
    display: none;
  }

  /* En pantallas chicas priorizamos el CTA: ocultamos la píldora redundante
     del nav (sigue accesible dentro del menú) y dejamos solo la hamburguesa. */
  .hero__nav-cta {
    display: none;
  }

  .hero__footer-num {
    font-size: 1.5rem;
  }

  .hero__footer {
    grid-template-columns: 1fr auto;
    align-items: end;
    gap: 0.95rem;
  }

  .hero__footer-stat {
    min-width: 0;
  }

  .hero__footer-scroll {
    justify-self: end;
  }

  .hero__footer-scroll-track {
    width: clamp(3.2rem, 20vw, 4.4rem);
  }

  /* El bloque de footer del hero es alto; en teléfonos cortos ocultamos el
     párrafo secundario para que el contenido principal nunca quede cortado. */
  .hero__footer-text {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__menu,
  .hero__menu-nav a,
  .hero__menu-cta,
  .hero__burger-line {
    transition-duration: 0.01ms !important;
  }
}
</style>
