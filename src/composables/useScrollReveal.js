import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

let pluginRegistered = false

function registerScrollTrigger() {
  if (!pluginRegistered) {
    gsap.registerPlugin(ScrollTrigger)
    pluginRegistered = true
  }
}

/**
 * Animación al entrar en viewport (data-reveal). Se repite al volver a bajar
 * después de salir por abajo al hacer scroll hacia arriba (onLeaveBack → onEnter).
 * La salida (onLeaveBack) también va animada, no a saltos.
 * @param {object} [options]
 * @param {string} [options.selector='[data-reveal]']
 * @param {string} [options.start='top 88%']
 */
export function useScrollReveal(options = {}) {
  const {
    selector = '[data-reveal]',
    start = 'top 88%',
    y = 48,
    duration = 1.38,
    stagger = 0.09,
    ease = 'power4.out',
    exitDuration = 1.22,
    easeExit = 'power3.in',
    exitStaggerFrom = 'end',
  } = options

  const sectionRef = ref(null)
  let batchTriggers = []

  onMounted(async () => {
    registerScrollTrigger()
    await nextTick()

    const root = sectionRef.value
    if (!root || typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const items = root.querySelectorAll(selector)
    if (!items.length) return

    gsap.set(items, { opacity: 0, y })

    batchTriggers = ScrollTrigger.batch(items, {
      start,
      interval: 0.11,
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration,
          ease,
          stagger,
          overwrite: 'auto',
          clearProps: 'transform',
        })
      },
      onLeaveBack: (batch) => {
        gsap.killTweensOf(batch)
        gsap.to(batch, {
          opacity: 0,
          y,
          duration: exitDuration,
          ease: easeExit,
          stagger: {
            each: stagger,
            from: exitStaggerFrom,
          },
          overwrite: 'auto',
        })
      },
    })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    })
  })

  onUnmounted(() => {
    batchTriggers.forEach((t) => t.kill())
    batchTriggers = []
  })

  return { sectionRef }
}
