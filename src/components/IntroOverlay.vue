<template>
  <div
    v-if="visible"
    ref="rootRef"
    class="intro"
    :class="{ 'intro--lock': locked }"
    role="presentation"
  >
    <div class="intro__cover" ref="coverRef" aria-hidden="true">
      <!-- Filas en marquee, sangrando fuera del viewport -->
      <div class="intro__rows" ref="rowsRef" aria-hidden="true">
        <div
          v-for="(row, i) in rows"
          :key="i"
          class="intro__row"
          :ref="el => (rowEls[i] = el)"
        >
          <div
            class="intro__row-track"
            :ref="el => (trackEls[i] = el)"
          >
            <img
              v-for="n in row.count * 2"
              :key="n"
              :src="logoSrc"
              class="intro__row-logo"
              alt=""
            />
          </div>
        </div>
      </div>

      <!-- Vignette fuerte: brillo en el centro, oscuridad en los bordes -->
      <div class="intro__vignette" ref="vignetteRef" aria-hidden="true" />

      <!-- Logo héroe -->
      <div class="intro__hero" ref="heroRef" aria-hidden="true">
        <div class="intro__hero-mask" ref="heroMaskRef">
          <img :src="logoSrc" class="intro__hero-img" alt="" />
        </div>
      </div>

      <!-- Topbar: porcentaje de carga arriba a la derecha -->
      <header class="intro__topbar" ref="topbarRef" aria-hidden="true">
        <span class="intro__loader">
          <span ref="counterRef">000</span><span class="intro__loader-unit">%</span>
        </span>
      </header>

      <!-- Footer: manifiesto abajo a la izquierda -->
      <footer class="intro__footer" ref="footerRef" aria-hidden="true">
        <span class="intro__footer-text">FORMAR · POSICIONAR · TRANSFORMAR</span>
      </footer>

      <!-- Regla inferior -->
      <div class="intro__rule" ref="ruleRef" aria-hidden="true">
        <div class="intro__rule-fill" ref="ruleFillRef" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import logoSrc from '../assets/logoBlancoDefinitivo.png'
import { gsap } from '../lib/gsap'

const visible = ref(true)
const locked = ref(true)

const rootRef = ref(null)
const coverRef = ref(null)
const rowsRef = ref(null)
const vignetteRef = ref(null)
const heroRef = ref(null)
const heroMaskRef = ref(null)
const topbarRef = ref(null)
const footerRef = ref(null)
const ruleRef = ref(null)
const ruleFillRef = ref(null)
const counterRef = ref(null)

const rowEls = ref([])
const trackEls = ref([])

// Velocidades distintas para variedad — todas suaves (sin sensación de "playful")
const SPEEDS = [26, 32, 22, 36, 28, 34, 24, 30, 38, 26, 32, 22]

// Calculamos filas dinámicamente según altura. Logos por fila se calculan para
// que cubran ~2x ancho de viewport (loop limpio con xPercent 0 ↔ -50).
function buildRows() {
  const h = window.innerHeight
  const w = window.innerWidth
  const topPad = Math.max(56, Math.min(80, h * 0.075))
  const usableH = h - topPad * 2
  const targetRowH = 86
  const count = Math.max(8, Math.ceil(usableH / targetRowH))

  const logoApproxW = 120 // px aprox por logo + gap
  const perSide = Math.max(10, Math.ceil(w / logoApproxW) + 3)

  return Array.from({ length: count }, (_, i) => ({
    dir: i % 2 === 0 ? 'left' : 'right',
    speed: SPEEDS[i % SPEEDS.length],
    count: perSide,
  }))
}

const rows = ref(buildRows())

let ctx
let scrollLockY = 0

function lockScroll() {
  scrollLockY = window.scrollY || 0
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
}

function unlockScroll() {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  window.scrollTo(0, scrollLockY)
}

function finish() {
  visible.value = false
  locked.value = false
  unlockScroll()
}

onMounted(async () => {
  lockScroll()
  await nextTick()

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduceMotion) {
    setTimeout(finish, 200)
    return
  }

  ctx = gsap.context(() => {
    // -------- Estado inicial --------
    gsap.set(rootRef.value, { opacity: 1 })
    gsap.set(coverRef.value, { yPercent: 0 })
    gsap.set(topbarRef.value, { opacity: 0, y: -10 })
    gsap.set(footerRef.value, { opacity: 0, y: 10 })
    gsap.set(ruleFillRef.value, { scaleX: 0, transformOrigin: 'left center' })
    gsap.set(vignetteRef.value, { opacity: 0 })

    gsap.set(rowsRef.value, { opacity: 1 })
    rowEls.value.forEach((el, i) => {
      const row = rows.value[i]
      gsap.set(el, {
        opacity: 0,
        x: row.dir === 'left' ? 80 : -80,
        filter: 'blur(6px)',
      })
    })

    gsap.set(heroRef.value, { opacity: 0 })
    gsap.set(heroMaskRef.value, {
      clipPath: 'inset(0% 50% 0% 50%)',
      webkitClipPath: 'inset(0% 50% 0% 50%)',
      scale: 0.985,
    })

    // -------- Marquee infinito por fila --------
    trackEls.value.forEach((track, i) => {
      const row = rows.value[i]
      if (row.dir === 'left') {
        gsap.fromTo(
          track,
          { xPercent: 0 },
          { xPercent: -50, duration: row.speed, ease: 'none', repeat: -1 }
        )
      } else {
        gsap.fromTo(
          track,
          { xPercent: -50 },
          { xPercent: 0, duration: row.speed, ease: 'none', repeat: -1 }
        )
      }
    })

    // -------- Timeline principal --------
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: finish,
    })

    // 1) Tipografía editorial
    tl.to(topbarRef.value, {
      opacity: 0.92,
      y: 0,
      duration: 0.9,
      ease: 'power2.out',
    }, 0.05)
      .to(footerRef.value, {
        opacity: 0.7,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
      }, 0.12)

    // 2) Regla inferior
    tl.to(ruleFillRef.value, {
      scaleX: 0.5,
      duration: 1.4,
      ease: 'power2.inOut',
    }, 0.35)

    // 3) Loader 0% → 100%
    const counterObj = { v: 0 }
    tl.to(counterObj, {
      v: 100,
      duration: 4.6,
      ease: 'power1.out',
      onUpdate: () => {
        if (counterRef.value) {
          counterRef.value.textContent = String(Math.round(counterObj.v)).padStart(3, '0')
        }
      },
    }, 0.15)

    // 4) Vignette aparece temprano para crear jerarquía inmediata
    tl.to(vignetteRef.value, {
      opacity: 1,
      duration: 1.0,
      ease: 'power2.out',
    }, 0.25)

    // 5) FILAS entran desde el centro hacia afuera (las del medio primero)
    //    Stagger corto + apertura rápida = mucha dinámica
    tl.to(rowEls.value, {
      opacity: 1,
      x: 0,
      filter: 'blur(0px)',
      duration: 0.85,
      ease: 'expo.out',
      stagger: { each: 0.055, from: 'center' },
    }, 0.3)

    // 6) Hold breve — el marquee provee el movimiento; no necesitamos quietud
    //    (las filas ya están corriendo en direcciones opuestas)

    // 7) Salida de filas: ligero zoom-out + fade, y aceleración perceptual del scroll
    //    Aumentamos la velocidad de marquee al final con un boost
    tl.to(trackEls.value, {
      timeScale: 2.4,
      duration: 0.6,
      ease: 'power2.in',
    }, 2.8)

    tl.to(rowsRef.value, {
      scale: 0.95,
      opacity: 0,
      duration: 0.7,
      ease: 'power3.inOut',
      transformOrigin: 'center center',
    }, 3.05)

    // 8) Logo héroe revela
    tl.to(heroRef.value, {
      opacity: 1,
      duration: 0.4,
      ease: 'power1.out',
    }, 3.25)
      .to(heroMaskRef.value, {
        clipPath: 'inset(0% 0% 0% 0%)',
        webkitClipPath: 'inset(0% 0% 0% 0%)',
        scale: 1,
        duration: 1.35,
        ease: 'expo.out',
      }, 3.25)

    // 9) Regla completa
    tl.to(ruleFillRef.value, {
      scaleX: 1,
      duration: 1.1,
      ease: 'power2.inOut',
    }, 3.4)

    // 10) Respiración mínima del héroe
    tl.to(heroMaskRef.value, {
      scale: 1.015,
      duration: 0.8,
      ease: 'sine.inOut',
    }, 4.7)
      .to(heroMaskRef.value, {
        scale: 1,
        duration: 0.65,
        ease: 'sine.inOut',
      }, 5.5)

    // 11) UI editorial (regla, topbar, footer) desaparece antes del slide
    tl.to([ruleRef.value, topbarRef.value, footerRef.value], {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
    }, 5.25)

    // 12) Salida: portada sube revelando el sitio
    tl.to(coverRef.value, {
      yPercent: -100,
      duration: 1.25,
      ease: 'expo.inOut',
    }, 5.7)
  }, rootRef)
})

onUnmounted(() => {
  ctx?.revert()
  unlockScroll()
})
</script>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  color: #f4f4f0;
}

.intro--lock {
  pointer-events: auto;
}

.intro__cover {
  position: absolute;
  inset: 0;
  background: #0a0a0a;
  will-change: transform;
}

/* Contenedor de filas: sangra edge-to-edge */
.intro__rows {
  position: absolute;
  top: clamp(3.5rem, 7vh, 5rem);
  bottom: clamp(3.5rem, 7vh, 5rem);
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  will-change: transform, opacity;
}

.intro__row {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: visible;
  will-change: transform, opacity, filter;
}

.intro__row-track {
  display: flex;
  align-items: center;
  gap: 48px;
  width: max-content;
  will-change: transform;
}

.intro__row-logo {
  height: 56px;
  width: auto;
  display: block;
  flex-shrink: 0;
  opacity: 1;
  user-select: none;
  -webkit-user-drag: none;
}

/* Vignette fuerte: brillo intenso al centro, oscuridad casi total a los bordes */
.intro__vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 65% 80% at center,
      transparent 0%,
      transparent 12%,
      rgba(10, 10, 10, 0.35) 32%,
      rgba(10, 10, 10, 0.72) 58%,
      rgba(10, 10, 10, 0.94) 82%,
      rgba(10, 10, 10, 1) 100%
    ),
    /* Refuerzo lateral para asegurar oscuridad en los costados */
    linear-gradient(
      to right,
      rgba(10, 10, 10, 0.85) 0%,
      transparent 18%,
      transparent 82%,
      rgba(10, 10, 10, 0.85) 100%
    );
  will-change: opacity;
}

/* Logo héroe */
.intro__hero {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  will-change: opacity;
}

.intro__hero-mask {
  display: block;
  overflow: hidden;
  width: clamp(220px, 28vw, 380px);
  will-change: clip-path, transform;
  filter: drop-shadow(0 12px 36px rgba(0, 0, 0, 0.55));
}

.intro__hero-img {
  display: block;
  width: 100%;
  height: auto;
  user-select: none;
  -webkit-user-drag: none;
}

/* Topbar: solo timecode arriba a la derecha */
.intro__topbar {
  position: absolute;
  top: clamp(1.6rem, 3.6vh, 2.6rem);
  right: clamp(1.5rem, 4vw, 3.25rem);
  z-index: 3;
  display: flex;
  align-items: center;
  will-change: opacity, transform;
}

.intro__loader {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: var(--font-w-regular);
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.18em;
  color: rgba(244, 244, 240, 0.85);
  display: inline-flex;
  align-items: baseline;
}

.intro__loader-unit {
  margin-left: 0.18em;
  opacity: 0.55;
}

/* Footer: manifiesto abajo a la izquierda */
.intro__footer {
  position: absolute;
  bottom: clamp(1.6rem, 3.6vh, 2.6rem);
  left: clamp(1.5rem, 4vw, 3.25rem);
  z-index: 3;
  display: flex;
  align-items: center;
  will-change: opacity, transform;
}

.intro__footer-text {
  font-family: var(--font-body);
  font-size: 0.6rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.3em;
  color: rgba(244, 244, 240, 0.6);
  text-transform: uppercase;
}

/* Regla inferior */
.intro__rule {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(244, 244, 240, 0.08);
  overflow: hidden;
  z-index: 3;
}

.intro__rule-fill {
  position: absolute;
  inset: 0;
  background: rgba(244, 244, 240, 0.55);
  transform-origin: left center;
  will-change: transform;
}

@media (max-width: 720px) {
  .intro__row-logo {
    height: 42px;
  }
  .intro__row-track {
    gap: 32px;
  }
  .intro__hero-mask {
    width: 56vw;
  }
  .intro__loader {
    font-size: 0.62rem;
    letter-spacing: 0.14em;
  }
  .intro__footer-text {
    font-size: 0.52rem;
    letter-spacing: 0.22em;
  }
}
</style>
