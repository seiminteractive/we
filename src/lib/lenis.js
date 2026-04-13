import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let lenisInstance = null
let rafId = null

export function initLenis() {
  if (lenisInstance) return lenisInstance

  lenisInstance = new Lenis()

  function raf(time) {
    lenisInstance.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  return lenisInstance
}

export function destroyLenis() {
  if (rafId != null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }
}

export function getLenis() {
  return lenisInstance
}
