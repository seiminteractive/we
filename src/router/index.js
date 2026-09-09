import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import { waitForAuth } from '../lib/firebase'
import { getLenis } from '../lib/lenis'
import { cubrir, descubrir } from '../lib/transicion'

/** Espera a que un elemento aparezca en el DOM, hasta un limite. */
function esperarElemento(selector, limiteMs = 2000) {
  return new Promise((resolve) => {
    const desde = performance.now()
    const probar = () => {
      const el = document.querySelector(selector)
      if (el) return resolve(el)
      if (performance.now() - desde > limiteMs) return resolve(null)
      requestAnimationFrame(probar)
    }
    probar()
  })
}

const routes = [
  { path: '/', name: 'landing', component: Landing },
  {
    path: '/novedades/:slug',
    name: 'noticia',
    component: () => import('../views/NoticiaDetalle.vue'),
  },
  {
    path: '/admin',
    name: 'admin',
    // Lazy: el panel y el SDK de auth no se descargan al visitar la landing.
    component: () => import('../views/Admin.vue'),
    meta: { requiresAuth: true },
  },
  {
    // El editor de bloques no entra en un modal: vive en su propia pagina.
    // "nueva" como id significa alta.
    path: '/admin/novedades/:id',
    name: 'admin-noticia',
    component: () => import('../views/admin/NoticiaEditor.vue'),
    meta: { requiresAuth: true },
  },
  // Cualquier otra cosa vuelve a la landing.
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  async scrollBehavior(to, from, savedPosition) {
    const lenis = getLenis()

    // Volver atras: se restaura donde estaba el lector.
    if (savedPosition) {
      if (lenis) {
        lenis.scrollTo(savedPosition.top, { immediate: true })
        return false
      }
      return savedPosition
    }

    if (!to.hash) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true })
        return false
      }
      return { top: 0 }
    }

    // La seccion puede no existir todavia: la landing monta y recien despues
    // llegan los datos de Firestore que definen que se renderiza.
    const el = await esperarElemento(to.hash)
    if (!el) return { top: 0 }

    if (lenis) {
      // Lenis lleva su propia posicion: un window.scrollTo nativo queda pisado
      // en el siguiente frame. Ademas, si la cortina esta tapando la pantalla
      // el salto va instantaneo: nadie lo ve y al descubrir ya estas ahi.
      lenis.scrollTo(el, { immediate: tapando })
      return false
    }
    return { el, behavior: tapando ? 'instant' : 'smooth' }
  },
})

// Mientras la cortina cubre, los saltos de scroll van sin animar.
let tapando = false

// No redirige: espera a que Firebase resuelva la sesion para que /admin no
// parpadee mostrando el login a alguien que ya esta autenticado.
router.beforeEach(async (to, from) => {
  if (to.meta.requiresAuth) await waitForAuth()

  // La cortina solo corre entre vistas distintas. Cambiar de ancla dentro de
  // la misma pagina no justifica tapar la pantalla.
  if (from.name && to.path !== from.path) {
    tapando = true
    await cubrir()
  }
  return true
})

router.afterEach(() => {
  if (!tapando) return
  // Un respiro para que monte la vista nueva y corra scrollBehavior detras de
  // la cortina, y recien ahi se descubre.
  setTimeout(() => {
    tapando = false
    descubrir()
  }, 130)
})

export default router
