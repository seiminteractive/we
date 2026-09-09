import { createRouter, createWebHistory } from 'vue-router'
import Landing from '../views/Landing.vue'
import { waitForAuth } from '../lib/firebase'

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
  scrollBehavior(to) {
    // Volver a la landing desde una nota con un ancla (los links del footer)
    // tiene que bajar a esa seccion, no al principio de la pagina.
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// No redirige: espera a que Firebase resuelva la sesion para que /admin no
// parpadee mostrando el login a alguien que ya esta autenticado.
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) await waitForAuth()
  return true
})

export default router
