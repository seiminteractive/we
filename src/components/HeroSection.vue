<template>
  <section class="hero" ref="heroRef">
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__bg-scale">
        <!-- <video autoplay loop muted playsinline :src="fondoHero" alt="" class="hero__bg-img" /> -->
        <img :src="fondoHero" alt="" class="hero__bg-img" />
        <div class="hero__bg-overlay" />
      </div>
    </div>

    <header class="hero__nav">
      <a href="/" class="hero__logo">
        <LogoWe ref="logoWeRef" class="hero__logo-img" />
      </a>

      <nav class="hero__nav-center" aria-label="Principal">
        <a href="#">Quiénes somos</a>
        <a href="#">Qué hacemos</a>
        <a href="#">Verticales</a>
        <a href="#">Contacto</a>
      </nav>

      <div class="hero__nav-spacer" aria-hidden="true" />
    </header>

    <div class="hero__main">
      <div class="hero__copy">
        <h1 class="hero__title">
          <span class="hero__line">Liderar el <br>futuro</span>
        </h1>
        <p class="hero__desc">
          Formamos, posicionamos y transformamos organizaciones
          para liderar el futuro.
        </p>
        <div class="hero__cta-group">
          <a href="#" class="hero__btn hero__btn--primary">Agendar reunión</a>
        </div>
      </div>
    </div>

    <aside class="hero__card hero__card--stats" aria-label="Estadísticas">
      <div class="hero__stats-noise" aria-hidden="true" />
      <div class="hero__stats-inner">
        <p class="hero__stat-num">4</p>
        <p class="hero__stat-label">Verticales de impacto</p>
        <div class="hero__circles" aria-hidden="true">
          <span class="hero__circle hero__circle--accent" />
          <span class="hero__circle" />
          <span class="hero__circle" />
          <span class="hero__circle" />
        </div>
      </div>
    </aside>

    <aside class="hero__card hero__card--project">
      <div class="hero__glass-noise" aria-hidden="true" />
      <div class="hero__glass-content">
        <div class="hero__project-top">
          <span class="hero__pin" aria-hidden="true">
            <i class="pi pi-map-marker"></i>
          </span>
          <button type="button" class="hero__arrow-btn" aria-label="Abrir proyecto">
            <i class="pi pi-arrow-up-right"></i>
          </button>
        </div>
        <p class="hero__project-text">
          Trabajamos con empresas, gobiernos y organizaciones en sostenibilidad, inteligencia artificial,
          comunicación estratégica y transformación institucional.
        </p>
      </div>
    </aside>

    <div class="hero__pagination" aria-hidden="true">
      <span class="hero__page-num">01</span>
      <div class="hero__page-track">
        <div class="hero__page-progress" ref="pageProgressRef" />
      </div>
      <span class="hero__page-num">03</span>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
// import fondoHero from '../assets/ReunionWe.jpeg'
import fondoHero from '../assets/ReunionWePrueba.jpg'
import LogoWe from './LogoWe.vue'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const heroRef = ref(null)
const pageProgressRef = ref(null)
const logoWeRef = ref(null)
let ctx
let heroReplayTrigger

function playHeroAnimations(root) {
  if (!root) return

  ctx?.revert()

  ctx = gsap.context(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const easeMain = 'power4.out'

    if (reduceMotion) {
      gsap.set('.hero__bg-scale', { scale: 1 })
      logoWeRef.value?.showInstant()
      if (pageProgressRef.value) {
        gsap.set(pageProgressRef.value, {
          scaleX: 0.38,
          transformOrigin: 'left center',
        })
      }
      return
    }

    gsap.set('.hero__bg-scale', { scale: 1.1, transformOrigin: 'center center' })

    const tl = gsap.timeline({ defaults: { ease: easeMain } })

    tl.to('.hero__bg-scale', {
      scale: 1,
      duration: 2.9,
      ease: 'power3.out',
      onComplete: () => {
        gsap.set('.hero__bg-scale', { clearProps: 'willChange' })
      },
    }, 0)
      .from(
        '.hero__logo',
        { y: -32, opacity: 0, filter: 'blur(6px)', duration: 1.32 },
        0.14
      )

    logoWeRef.value?.addRevealToTimeline(tl, 0.18)

    tl.fromTo(
  '.hero__nav-center a',
  {
    y: -22,
    opacity: 1,
    filter: 'blur(4px)'
  },
  {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    duration: 1.1,
    stagger: 0.082
  },
  0.2
)
      .from(
        '.hero__line',
        { yPercent: 115, opacity: 0, rotate: 0.0001, duration: 1.42 },
        0.26
      )
      .from(
        '.hero__desc',
        { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.25 },
        0.42
      )
      .from(
        '.hero__btn',
        { y: 28, opacity: 0, duration: 1.02, stagger: 0.12 },
        0.52
      )
      .from(
        '.hero__card--stats',
        { opacity: 0, scale: 0.9, y: 36, filter: 'blur(10px)', duration: 1.32 },
        0.36
      )
      .from(
        '.hero__card--project',
        { opacity: 0, y: 56, filter: 'blur(12px)', duration: 1.38 },
        0.44
      )
      .from('.hero__pagination', { opacity: 0, y: 22, duration: 1.12 }, 0.58)

    if (pageProgressRef.value) {
      tl.fromTo(
        pageProgressRef.value,
        { scaleX: 0.1, transformOrigin: 'left center' },
        { scaleX: 0.38, duration: 2.9, ease: 'power2.inOut' },
        0.62
      )
    }

    tl.call(() => {
      gsap.set(
        [
          '.hero__logo',
          '.hero__nav-center a',
          '.hero__desc',
          '.hero__card--stats',
          '.hero__card--project',
        ],
        { clearProps: 'filter' }
      )
    })

    tl.add(
      gsap.to('.hero__card--stats', {
        y: '+=10',
        duration: 3.85,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    )
    tl.add(
      gsap.to('.hero__card--project', {
        y: '+=12',
        duration: 4.55,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      }),
      '<'
    )
  }, root)
}

onMounted(async () => {
  await nextTick()
  const root = heroRef.value
  if (!root) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  playHeroAnimations(root)

  if (!reduceMotion) {
    let scrolledPastHero = false
    heroReplayTrigger = ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: 'bottom top',
      onLeave: () => {
        scrolledPastHero = true
      },
      onEnterBack: () => {
        if (!scrolledPastHero) return
        scrolledPastHero = false
        nextTick(() => {
          playHeroAnimations(heroRef.value)
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
.hero {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  overflow-x: clip;
  overflow-y: visible;
  color: #fff;
  /* Sólido: sin degradado Neat; mismo tono que los overlays del video */
  background: #0f1612;
  padding: clamp(1.2rem, 2.4vw, 1.85rem) clamp(1.25rem, 6.5vw, 5.5rem)
    clamp(2.25rem, 5vw, 3.5rem);
  display: flex;
  flex-direction: column;
}

.hero::after {
  content: '';
  position: absolute;
  right: clamp(0rem, 4vw, 3rem);
  bottom: clamp(3rem, 10vh, 6rem);
  width: clamp(18rem, 28vw, 26rem);
  height: clamp(18rem, 28vw, 26rem);
  border-radius: 50%;
  /* background: radial-gradient(
    circle,
    rgba(112, 255, 170, 0.16) 0%,
    rgba(112, 255, 170, 0.07) 35%,
    transparent 70%
  ); */
  filter: blur(42px);
  z-index: 0;
  pointer-events: none;
}

.hero__bg {
  /* Solo cubre el hero; `fixed` dejaba el video bajo todo el scroll */
  position: absolute;
  inset: 0;
  width: 100%;
  min-height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero__bg-scale {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  will-change: transform;
}

.hero__bg-img {
  width: 100%;
  height: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  object-fit: cover;
  object-position: center;
  display: block;
}

.hero__bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
      105deg,
      rgba(15, 22, 18, 0.42) 0%,
      rgba(15, 22, 18, 0.18) 45%,
      rgba(15, 22, 18, 0.28) 100%
    ),
    linear-gradient(to top, rgba(12, 18, 15, 0.38) 0%, transparent 42%);
  pointer-events: none;
}

.hero__nav {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  padding-top: clamp(0.65rem, 1.6vh, 1.1rem);
}

.hero__logo {
  display: inline-flex;
  align-items: center;
  line-height: 0;
  text-decoration: none;
  color: inherit;
}

.hero__logo-img {
  display: block;
}

.hero__nav-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(1.25rem, 2.8vw, 2.5rem);
  justify-self: center;
}

.hero__nav-spacer {
  pointer-events: none;
}

.hero__nav-center a {
  color: inherit;
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 0.9vw, 0.8125rem);
  font-weight: var(--font-w-medium);
  letter-spacing: 0.06em;
  text-transform: none;
  opacity: 0.95;
  transition: opacity 0.2s;
}

.hero__nav-center a:hover {
  opacity: 1;
}

.hero__main {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  align-items: center;
  padding-top: clamp(2rem, 8vh, 5rem);
  padding-bottom: clamp(4rem, 12vh, 7rem);
}

.hero__copy {
  max-width: min(44rem, 92vw);
}

.hero__title {
  margin: 0 0 clamp(1.1rem, 2.2vh, 1.5rem);
  font-family: var(--font-heading);
  /* font-weight: var(--font-w-extrabold); */
  font-size: clamp(2.6rem, 6.5vw, 4.5rem);
  line-height: 1.05;
  text-transform: none;
  font-synthesis: none;
}

.hero__line {
  display: block;
  will-change: transform, opacity;
}

.hero__desc {
  margin: 0 0 clamp(1.75rem, 3vh, 2.25rem);
  font-family: var(--font-body);
  font-size: clamp(0.875rem, 1.1vw, 1rem);
  font-weight: var(--font-w-regular);
  line-height: 1.65;
  max-width: min(29rem, 100%);
  opacity: 0.94;
}

.hero__cta-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: clamp(1rem, 2.5vw, 1.75rem);
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 1vw, 0.875rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.02em;
  transition: transform 0.2s, opacity 0.2s;
}

.hero__btn--primary {
  background: #fff;
  color: #1a1f1c;
  padding: 0.95rem 1.85rem;
  border-radius: 2px;
}

.hero__btn--primary:hover {
  transform: translateY(-1px);
}

.hero__btn--ghost {
  background: transparent;
  color: #fff;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.85);
  border-radius: 0;
  font-weight: var(--font-w-medium);
}

.hero__btn--ghost:hover {
  opacity: 0.9;
}

.hero__card {
  position: absolute;
  z-index: 2;
}

.hero__card--stats {
  top: clamp(3.35rem, 9vh, 5.25rem);
  right: clamp(1rem, 6.5vw, 5.5rem);
  width: min(12.75rem, 36vw);
  padding: 0;
  border-radius: clamp(16px, 2vw, 22px);
  overflow: hidden;
  isolation: isolate;

  /* background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.03) 100%),
    linear-gradient(135deg, rgba(40, 100, 70, 0.2) 0%, rgba(10, 50, 35, 0.18) 100%); */

  backdrop-filter: blur(28px) saturate(170%) brightness(1.06);
  -webkit-backdrop-filter: blur(28px) saturate(170%) brightness(1.06);

  border: 1px solid rgba(255, 255, 255, 0.16);

  box-shadow:
    0 14px 36px rgba(0, 0, 0, 0.22),
    0 28px 56px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);

  color: var(--brand-02);
}

.hero__card--stats::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    125deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0.06) 22%,
    rgba(255, 255, 255, 0.02) 42%,
    transparent 58%
  );
  opacity: 0.85;
}

.hero__card--stats::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.32) 0%,
    rgba(255, 255, 255, 0.1) 30%,
    rgba(255, 255, 255, 0.04) 55%,
    rgba(255, 255, 255, 0.16) 100%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.hero__stats-noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 72px 72px;
  opacity: 0.05;
  pointer-events: none;
}

.hero__stats-inner {
  position: relative;
  z-index: 2;
  padding: 1.35rem 1.3rem 1.45rem;
}

.hero__stat-num {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.35rem, 5vw, 3rem);
  /* font-weight: var(--font-w-extrabold); */
  line-height: 0.95;
  color: var(--brand-02);
  text-shadow: 0 1px 18px color-mix(in srgb, var(--brand-03) 22%, transparent);
  font-synthesis: none;
}

.hero__stat-label {
  margin: 0.4rem 0 0;
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
  max-width: 9.5rem;
  line-height: 1.35;
}

.hero__circles {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-top: 1.1rem;
  padding-left: 0.1rem;
}

.hero__circle {
  width: 2rem;
  height: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  margin-left: -0.65rem;
  flex-shrink: 0;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.hero__circle:first-child {
  margin-left: 0;
}

.hero__circle--accent {
  border-color: color-mix(in srgb, var(--brand-03) 72%, transparent);
  background: color-mix(in srgb, var(--brand-03) 14%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--brand-03) 28%, transparent),
    0 4px 12px color-mix(in srgb, var(--brand-03) 18%, transparent);
}

.hero__card--project {
  right: clamp(1rem, 6.5vw, 5.5rem);
  bottom: clamp(5rem, 14vh, 7.5rem);
  width: min(24rem, 92vw);
  padding: clamp(1.75rem, 3.2vw, 2.5rem);
  border-radius: clamp(28px, 3.5vw, 48px);
  overflow: hidden;
  isolation: isolate;
  position: absolute;
  z-index: 2;

  /* background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%),
    linear-gradient(135deg, rgba(40, 100, 70, 0.18) 0%, rgba(10, 50, 35, 0.16) 100%); */

  backdrop-filter: blur(34px) saturate(165%) brightness(1.08);
  -webkit-backdrop-filter: blur(34px) saturate(165%) brightness(1.08);

  border: 1px solid rgba(255, 255, 255, 0.14);

  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.2),
    0 35px 80px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    inset 0 -1px 0 rgba(255, 255, 255, 0.04);

  color: var(--brand-02);
}

.hero__card--project::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.08) 18%,
    rgba(255, 255, 255, 0.03) 38%,
    transparent 58%
  );
  opacity: 0.95;
}

.hero__card--project::after {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: inherit;
  z-index: 3;
  pointer-events: none;

  background: linear-gradient(
    140deg,
    rgba(255, 255, 255, 0.34) 0%,
    rgba(255, 255, 255, 0.12) 24%,
    rgba(255, 255, 255, 0.04) 52%,
    rgba(255, 255, 255, 0.18) 100%
  );

  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
}

.hero__glass-noise {
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 90px 90px;
  opacity: 0.045;
  pointer-events: none;
}

.hero__glass-content {
  position: relative;
  z-index: 2;
  color: var(--brand-02);
}

.hero__project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
}

.hero__pin {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.95);
}

.hero__pin .pi {
  font-size: 1.2rem;
  line-height: 1;
}

.hero__arrow-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.1rem;
  height: 4.1rem;
  border-radius: 999px;
  padding: 0;
  cursor: pointer;

  border: 1px solid rgba(255, 255, 255, 0.28);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.05) 100%),
    rgba(255, 255, 255, 0.04);

  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 8px 18px rgba(0, 0, 0, 0.12);

  color: rgba(255, 255, 255, 0.92);
  transition: transform 0.25s ease, background 0.25s ease, border-color 0.25s ease;
}

.hero__arrow-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(255, 255, 255, 0.38);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.07) 100%),
    rgba(255, 255, 255, 0.05);
}

.hero__arrow-btn .pi {
  font-size: 1.05rem;
  line-height: 1;
}

.hero__project-text {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.75rem, 0.95vw, 0.8125rem);
  line-height: 1.6;
  font-weight: var(--font-w-regular);
  color: rgba(255, 255, 255, 0.78);
}

.hero__pagination {
  position: absolute;
  z-index: 2;
  left: clamp(1.25rem, 6.5vw, 5.5rem);
  bottom: clamp(1.75rem, 5vh, 3rem);
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: min(16rem, 42vw);
}

.hero__page-num {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.12em;
  opacity: 0.9;
}

.hero__page-track {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.28);
  border-radius: 1px;
  position: relative;
  overflow: hidden;
}

.hero__page-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  border-radius: 1px;
  transform: scaleX(0.12);
  transform-origin: left center;
}

@media (max-width: 900px) {
  .hero__nav {
    display: flex;
    justify-content: flex-start;
  }

  .hero__nav-center {
    display: none;
  }

  .hero__nav-spacer {
    display: none;
  }

  .hero__card--stats {
    top: auto;
    bottom: clamp(11rem, 32vh, 14rem);
    right: 1rem;
    width: 10rem;
  }

  .hero__card--project {
    left: 1rem;
    right: 1rem;
    width: auto;
    max-width: 20rem;
    margin: 0 auto;
  }
}

@media (max-width: 520px) {
  .hero__title {
    font-size: clamp(1.85rem, 8vw, 2.35rem);
  }

  .hero__card--stats {
    display: none;
  }
}
</style>
