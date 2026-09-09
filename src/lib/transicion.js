// Transicion entre vistas del router.
//
// Una sola figura barre la pantalla y se va deformando: el borde es una curva
// cuya comba cambia mientras avanza, asi que entra y sale como una masa
// liquida en vez de como un panel rigido. Es el mismo gesto de borde curvo que
// la landing usa entre secciones, pero en movimiento.
import { gsap } from './gsap'

let root = null
let path = null

export function registrarCortina(refs) {
  root = refs.root
  path = refs.path
}

function sinMovimiento() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// El viewBox es 0..100 en ambos ejes y se estira al viewport, asi que todo se
// razona en porcentajes. Se desborda a -1/101 para no dejar hilos sin pintar.
const estado = { borde: 110, comba: 0 }

/** Region por DEBAJO de la onda: la figura sube desde abajo. */
function subiendo({ borde: b, comba: c }) {
  return `M -1,${b + c} C 25,${b - c} 75,${b - c} 101,${b + c} L 101,101 L -1,101 Z`
}

/** Region por ENCIMA de la onda: la figura se retira hacia arriba. */
function saliendo({ borde: b, comba: c }) {
  return `M -1,-1 L 101,-1 L 101,${b - c} C 75,${b + c} 25,${b + c} -1,${b - c} Z`
}

function pintar(forma) {
  path.setAttribute('d', forma(estado))
}

/** Cubre la pantalla. Se espera antes de montar la vista nueva. */
export function cubrir() {
  if (!path || sinMovimiento()) return Promise.resolve()
  return new Promise((resolve) => {
    root.style.visibility = 'visible'
    estado.borde = 112
    estado.comba = 0
    pintar(subiendo)

    gsap
      .timeline({ onComplete: resolve, onUpdate: () => pintar(subiendo) })
      .to(estado, { borde: -1, duration: 0.72, ease: 'power2.inOut' }, 0)
      // La comba crece al arrancar y se aplana al llegar: da el efecto liquido.
      .to(estado, { comba: 26, duration: 0.3, ease: 'power2.out' }, 0)
      .to(estado, { comba: 0, duration: 0.42, ease: 'power2.inOut' }, 0.3)
  })
}

/** Descubre la vista nueva. */
export function descubrir() {
  if (!path || sinMovimiento()) return Promise.resolve()
  return new Promise((resolve) => {
    estado.borde = 101
    estado.comba = 0
    pintar(saliendo)

    gsap
      .timeline({
        onUpdate: () => pintar(saliendo),
        onComplete: () => {
          root.style.visibility = 'hidden'
          resolve()
        },
      })
      .to(estado, { borde: -1, duration: 0.78, ease: 'power2.inOut' }, 0)
      .to(estado, { comba: 26, duration: 0.34, ease: 'power2.out' }, 0)
      .to(estado, { comba: 0, duration: 0.44, ease: 'power2.inOut' }, 0.34)
  })
}
