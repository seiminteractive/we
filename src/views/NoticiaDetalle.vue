<template>
  <div class="nota-page" ref="rootRef">
    <!-- Progreso de lectura -->
    <div class="nota__progress" aria-hidden="true">
      <span class="nota__progress-fill" :style="{ transform: `scaleX(${progreso})` }" />
    </div>

    <article class="nota">
      <div class="nota__shell">
        <a class="nota__back" href="/#noticias" @click.prevent="volver">
          <span class="nota__back-icon"><i class="pi pi-arrow-left" aria-hidden="true"></i></span>
          <span>Volver a Novedades</span>
        </a>

        <!-- Esqueleto: evita el salto de layout al llegar los datos -->
        <div v-if="cargando" class="sk" aria-hidden="true">
          <span class="sk__line sk__line--eyebrow" />
          <span class="sk__line sk__line--title" />
          <span class="sk__line sk__line--title sk__line--short" />
          <span class="sk__line sk__line--meta" />
          <span class="sk__cover" />
          <span class="sk__line" /><span class="sk__line" />
          <span class="sk__line sk__line--short" />
        </div>

        <div v-else-if="!noticia" class="nota__estado">
          <h1 class="nota__404">No encontramos esta novedad.</h1>
          <p>Puede que haya sido dada de baja o que el enlace esté mal escrito.</p>
          <a class="nota__cta" href="/#noticias" @click.prevent="volver">
            <span>Ver todas las novedades</span>
            <span class="nota__cta-icon"><i class="pi pi-arrow-right" aria-hidden="true"></i></span>
          </a>
        </div>

        <template v-else>
          <header class="nota__head">
            <div class="nota__eyebrow">
              <span class="nota__eyebrow-mark" aria-hidden="true" />
              <span class="nota__eyebrow-text">Novedades</span>
              <span class="nota__eyebrow-rule" aria-hidden="true" />
              <span v-if="noticia.tag" class="nota__eyebrow-tag">{{ noticia.tag }}</span>
            </div>

            <h1 class="nota__title" ref="titleRef">{{ noticia.title }}</h1>

            <div class="nota__meta">
              <span v-if="fecha">{{ fecha }}</span>
              <span v-if="fecha && lectura" class="nota__meta-dot" aria-hidden="true" />
              <span v-if="lectura">{{ lectura }} min de lectura</span>
            </div>
          </header>

          <figure v-if="mostrarPortada" class="nota__cover" ref="coverRef">
            <img :src="noticia.image" alt="" class="nota__cover-img" ref="coverImgRef" />
          </figure>

          <div class="nota__body">
            <section
              v-for="(bloque, i) in bloques"
              :key="bloque.id || i"
              class="nota__block"
              data-reveal
            >
              <ImageCarousel v-if="bloque.images && bloque.images.length" :images="bloque.images" />

              <h2 v-if="bloque.heading" class="nota__h2">
                <span class="nota__h2-mark" aria-hidden="true" />
                {{ bloque.heading }}
              </h2>

              <template v-for="(parrafo, j) in parrafos(bloque.text)" :key="j">
                <blockquote v-if="esCita(parrafo)" class="nota__quote">
                  <span class="nota__quote-mark" aria-hidden="true">&ldquo;</span>
                  <span class="nota__quote-text">{{ partirCita(parrafo).texto }}</span>
                  <cite v-if="partirCita(parrafo).autor" class="nota__quote-cite">
                    {{ partirCita(parrafo).autor }}
                  </cite>
                </blockquote>
                <p
                  v-else
                  class="nota__p"
                  :class="{ 'nota__p--lead': i === 0 && j === 0 }"
                >
                  {{ parrafo }}
                </p>
              </template>
            </section>
          </div>

          <footer class="nota__end" data-reveal>
            <span class="nota__end-rule" aria-hidden="true" />
            <p class="nota__end-text">Gracias por leer.</p>
            <a class="nota__cta" href="/#noticias" @click.prevent="volver">
              <span>Ver todas las novedades</span>
              <span class="nota__cta-icon"><i class="pi pi-arrow-right" aria-hidden="true"></i></span>
            </a>
          </footer>
        </template>
      </div>
    </article>

    <SiteFooter />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { gsap } from '../lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ImageCarousel from '../components/ImageCarousel.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { fetchNoticiaPorSlug, formatDate } from '../lib/firebase'
import { destroyLenis, initLenis } from '../lib/lenis'

gsap.registerPlugin(ScrollTrigger)

const route = useRoute()
const router = useRouter()

const rootRef = ref(null)
const titleRef = ref(null)
const coverRef = ref(null)
const coverImgRef = ref(null)

const noticia = ref(null)
const cargando = ref(true)

const fecha = computed(() => formatDate(noticia.value?.createdAt))

/**
 * Las novedades cargadas antes del editor de bloques tienen el articulo entero
 * en `excerpt`. Se muestra como un bloque de texto para que la nota no quede
 * vacia hasta que se reescriba desde el panel.
 */
const bloques = computed(() => {
  const n = noticia.value
  if (!n) return []
  if (n.blocks?.length) return n.blocks
  return n.excerpt ? [{ id: 'legacy', images: [], text: n.excerpt }] : []
})

/** Minutos de lectura, a 200 palabras por minuto. */
const lectura = computed(() => {
  const texto = bloques.value.map((b) => `${b.heading || ''} ${b.text || ''}`).join(' ')
  const n = texto.split(/\s+/).filter(Boolean).length
  return n ? Math.max(1, Math.round(n / 200)) : 0
})

/**
 * La portada es, ante todo, la miniatura de la tarjeta. En el articulo se
 * muestra solo si no la esta cubriendo ya el cuerpo:
 *  - si el primer bloque abre con imagen, la portada duplicaria esa apertura;
 *  - y si la portada aparece en cualquier bloque, seria literalmente la misma
 *    imagen dos veces.
 */
const mostrarPortada = computed(() => {
  const n = noticia.value
  if (!n?.image) return false
  const primero = bloques.value[0]
  if (primero?.images?.length) return false
  return !bloques.value.some((b) =>
    (b.images || []).some((img) => img.path && img.path === n.imagePath)
  )
})

// Los testimonios vienen entrecomillados dentro del texto; se destacan.
function esCita(parrafo) {
  return /^[“"«]/.test(parrafo.trim())
}

/**
 * Separa el testimonio de su atribucion. En el texto vienen juntos, con la
 * forma: “...cita...” - Nombre, Cargo. Las comillas se dibujan aparte y el
 * autor se compone distinto, para que no se lea como parte de la cita.
 */
function partirCita(parrafo) {
  const t = parrafo.trim()
  const m = t.match(/^[“"«]\s*([\s\S]*?)[”"»]\s*[-–—]?\s*(.*)$/)
  if (m) return { texto: m[1].trim(), autor: m[2].trim().replace(/\.$/, '') }
  return { texto: t.replace(/^[“"«]\s*/, ''), autor: '' }
}

function parrafos(texto) {
  return String(texto || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

/* ─────────────────────── Volver a Novedades ─────────────────────── */

/**
 * Si se llego desde la landing, volver en el historial devuelve al punto exacto
 * del carrusel donde estaba el lector. Solo si se entro por link directo hace
 * falta navegar al ancla.
 */
function volver() {
  const anterior = window.history.state?.back
  if (typeof anterior === 'string' && (anterior === '/' || anterior.startsWith('/#'))) {
    router.back()
    return
  }
  router.push({ path: '/', hash: '#noticias' })
}

/* ─────────────────────── Progreso de lectura ─────────────────────── */

const progreso = ref(0)

function onScroll() {
  const alto = document.documentElement.scrollHeight - window.innerHeight
  progreso.value = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0
}

/* ─────────────────────────── Animaciones ─────────────────────────── */

let ctx = null

function reduceMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

async function animar() {
  ctx?.revert()
  ctx = null
  await nextTick()
  if (!rootRef.value || reduceMotion()) return

  ctx = gsap.context(() => {
    // Entrada del encabezado, escalonada.
    gsap.from('.nota__eyebrow, .nota__title, .nota__meta', {
      y: 26,
      opacity: 0,
      duration: 1.05,
      ease: 'power3.out',
      stagger: 0.09,
    })

    // Portada: entra y despues acompaña el scroll con un parallax corto.
    if (coverImgRef.value) {
      gsap.from(coverRef.value, {
        clipPath: 'inset(14% 8% 14% 8% round 20px)',
        duration: 1.2,
        ease: 'power3.out',
        delay: 0.15,
      })
      gsap.to(coverImgRef.value, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: coverRef.value, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }

    // Bloques: aparecen al entrar en viewport.
    const items = rootRef.value.querySelectorAll('[data-reveal]')
    if (items.length) {
      gsap.set(items, { opacity: 0, y: 40 })
      ScrollTrigger.batch(items, {
        start: 'top 86%',
        onEnter: (lote) =>
          gsap.to(lote, {
            opacity: 1,
            y: 0,
            duration: 1.15,
            ease: 'power3.out',
            stagger: 0.1,
            overwrite: 'auto',
            clearProps: 'transform',
          }),
      })
    }
  }, rootRef.value)

  ScrollTrigger.refresh()
}

/* ───────────────────────────── Carga ───────────────────────────── */

async function cargar(slug) {
  cargando.value = true
  noticia.value = null
  try {
    noticia.value = await fetchNoticiaPorSlug(slug)
  } catch (err) {
    console.error('No se pudo cargar la novedad:', err)
  } finally {
    cargando.value = false
  }
  document.title = noticia.value?.title ? `${noticia.value.title} · WE` : 'Novedades · WE'
  animar()
}

watch(() => route.params.slug, (slug) => slug && cargar(slug), { immediate: true })

onMounted(() => {
  // El scroll suave tambien acá: sin esto la nota se siente de otro sitio.
  initLenis()
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  ctx?.revert()
  destroyLenis()
})
</script>

<style scoped>
.nota-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  /* Color de base explicito: sin esto asomaba el blanco del html en los
     bordes y arriba de todo. */
  background: var(--brand-sand);
}

/* ─── Progreso de lectura ─── */

.nota__progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 60;
  background: rgba(21, 21, 22, 0.07);
}

.nota__progress-fill {
  display: block;
  height: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, var(--brand-terracotta), #e8845f);
}

/* ─── Lienzo ─── */

.nota {
  position: relative;
  flex: 1;
  color: var(--brand-ink);
  padding: clamp(1.75rem, 5vw, 3.5rem) var(--section-pad-x) clamp(5rem, 9vw, 7.5rem);
  /* Base calida con una veladura mas clara arriba: evita el plano uniforme. */
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(255, 253, 250, 0.9) 0%, transparent 60%),
    var(--brand-sand);
}

/* Fondo estatico: un degrade calido y una capa de grano. Sin canvas ni bucle
   de animacion, asi que no cuesta nada mientras se lee. */
.nota::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(70% 55% at 18% 22%, rgba(218, 89, 51, 0.13) 0%, transparent 62%),
    radial-gradient(60% 50% at 88% 68%, rgba(145, 151, 137, 0.16) 0%, transparent 60%),
    radial-gradient(120% 80% at 50% -12%, rgba(255, 253, 250, 0.85) 0%, transparent 58%);
}

.nota::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.42;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E");
  background-size: 160px 160px;
}

.nota__shell {
  position: relative;
  z-index: 1;
  /* Texto e imagenes comparten ancho: desbordar solo las fotos hacia los
     costados dejaba la columna de texto colgada y se leia arbitrario. */
  max-width: 48rem;
  margin: 0 auto;
}

/* ─── Volver ─── */

.nota__back {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: var(--font-w-medium);
  color: rgba(21, 21, 22, 0.6);
  text-decoration: none;
  margin-bottom: clamp(2.25rem, 5vw, 3.25rem);
  transition: color 0.25s ease;
}

.nota__back-icon {
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 1px solid rgba(21, 21, 22, 0.16);
  background: rgba(255, 255, 255, 0.55);
  font-size: 0.75rem;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), background 0.25s ease,
    color 0.25s ease, border-color 0.25s ease;
}

.nota__back:hover {
  color: var(--brand-ink);
}

.nota__back:hover .nota__back-icon {
  transform: translateX(-3px);
  background: var(--brand-terracotta);
  border-color: var(--brand-terracotta);
  color: #fff;
}

/* ─── Encabezado ─── */

.nota__head {
  margin-bottom: clamp(2.5rem, 5.5vw, 3.75rem);
}

.nota__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin-bottom: clamp(1.1rem, 2.4vw, 1.6rem);
}

.nota__eyebrow-mark {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 999px;
  background: var(--brand-terracotta);
}

.nota__eyebrow-text,
.nota__eyebrow-tag {
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.nota__eyebrow-text {
  color: var(--brand-ink);
}

.nota__eyebrow-rule {
  width: 2.4rem;
  height: 1px;
  background: rgba(21, 21, 22, 0.22);
}

.nota__eyebrow-tag {
  color: var(--brand-terracotta);
  letter-spacing: 0.16em;
}

.nota__title {
  font-family: var(--font-heading);
  font-size: clamp(2rem, 5.2vw, 3.4rem);
  line-height: 1.08;
  font-weight: var(--font-w-bold);
  letter-spacing: -0.015em;
  margin: 0 0 clamp(1rem, 2.2vw, 1.4rem);
  text-wrap: balance;
}

.nota__meta {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(21, 21, 22, 0.45);
}

.nota__meta-dot {
  width: 3px;
  height: 3px;
  border-radius: 999px;
  background: currentColor;
}

/* ─── Portada ─── */

.nota__cover {
  margin: 0 0 clamp(2.75rem, 6vw, 4rem);
  border-radius: clamp(16px, 1.8vw, 24px);
  overflow: hidden;
  background: #e3ddd0;
  box-shadow: 0 24px 60px rgba(21, 21, 22, 0.14);
}

.nota__cover-img {
  display: block;
  width: 100%;
  height: auto;
  /* Un poco mas alta que el marco: deja recorrido para el parallax. */
  scale: 1.08;
}

/* ─── Cuerpo ─── */

.nota__block + .nota__block {
  margin-top: clamp(3rem, 6.5vw, 4.75rem);
}

.nota__h2 {
  position: relative;
  font-family: var(--font-heading);
  font-size: clamp(1.3rem, 2.6vw, 1.75rem);
  line-height: 1.22;
  font-weight: var(--font-w-bold);
  letter-spacing: -0.01em;
  margin: 0 0 1.1rem;
  text-wrap: balance;
}

.nota__h2-mark {
  display: block;
  width: 1.75rem;
  height: 2px;
  border-radius: 2px;
  background: var(--brand-terracotta);
  margin-bottom: 0.85rem;
}

.nota__p {
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.15vw, 1.08rem);
  line-height: 1.78;
  color: rgba(21, 21, 22, 0.8);
  margin: 0 0 1.2rem;
  text-wrap: pretty;
}

/* Primer parrafo del articulo: entra mas grande, como bajada. */
.nota__p--lead {
  font-size: clamp(1.12rem, 1.5vw, 1.3rem);
  line-height: 1.62;
  color: rgba(21, 21, 22, 0.92);
  margin-bottom: 1.6rem;
}

.nota__p:last-child {
  margin-bottom: 0;
}

/* ─── Cita ─── */

.nota__quote {
  position: relative;
  margin: clamp(1.75rem, 4vw, 2.5rem) 0;
  padding: 0 0 0 clamp(2.25rem, 5vw, 3rem);
}

.nota__quote-mark {
  position: absolute;
  top: -0.35em;
  left: 0;
  font-family: var(--font-heading);
  font-size: clamp(3.2rem, 7vw, 4.5rem);
  font-weight: var(--font-w-bold);
  line-height: 1;
  color: var(--brand-terracotta);
  opacity: 0.28;
}

.nota__quote-cite {
  display: block;
  margin-top: 0.9rem;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-style: normal;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-terracotta);
}

.nota__quote-text {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(1.15rem, 1.9vw, 1.45rem);
  line-height: 1.5;
  font-weight: var(--font-w-medium);
  color: var(--brand-ink);
  text-wrap: pretty;
}

/* ─── Cierre ─── */

.nota__end {
  margin-top: clamp(3rem, 7vw, 4.5rem);
  text-align: center;
}

.nota__end-rule {
  display: block;
  width: 3rem;
  height: 1px;
  margin: 0 auto clamp(1.25rem, 3vw, 1.75rem);
  background: rgba(21, 21, 22, 0.2);
}

.nota__end-text {
  font-family: var(--font-heading);
  font-size: 0.72rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(21, 21, 22, 0.4);
  margin: 0 0 1.5rem;
}

.nota__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.35rem 0.35rem 1.4rem;
  border-radius: 999px;
  border: 1px solid rgba(21, 21, 22, 0.16);
  background: rgba(255, 255, 255, 0.6);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: var(--font-w-medium);
  color: var(--brand-ink);
  text-decoration: none;
  transition: border-color 0.25s ease, background 0.25s ease;
}

.nota__cta-icon {
  display: grid;
  place-items: center;
  width: 2.3rem;
  height: 2.3rem;
  border-radius: 50%;
  background: var(--brand-terracotta);
  color: #fff;
  font-size: 0.8rem;
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.nota__cta:hover {
  border-color: rgba(var(--accent-rgb), 0.45);
  background: #fff;
}

.nota__cta:hover .nota__cta-icon {
  transform: translateX(3px);
}

/* ─── Estados ─── */

.nota__estado {
  padding: 3rem 0;
  color: rgba(21, 21, 22, 0.62);
}

.nota__404 {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 3.4vw, 2.2rem);
  margin: 0 0 0.6rem;
  color: var(--brand-ink);
}

.sk {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.sk__line,
.sk__cover {
  display: block;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    rgba(21, 21, 22, 0.06) 25%,
    rgba(21, 21, 22, 0.11) 37%,
    rgba(21, 21, 22, 0.06) 63%
  );
  background-size: 400% 100%;
  animation: sk 1.5s ease-in-out infinite;
}

.sk__line { height: 1rem; }
.sk__line--eyebrow { width: 9rem; height: 0.7rem; }
.sk__line--title { height: 2.4rem; margin-top: 0.6rem; }
.sk__line--short { width: 60%; }
.sk__line--meta { width: 13rem; height: 0.7rem; margin-bottom: 0.8rem; }
.sk__cover { height: clamp(12rem, 30vw, 20rem); border-radius: 20px; margin-bottom: 0.8rem; }

@keyframes sk {
  0% { background-position: 100% 50%; }
  100% { background-position: 0 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .sk__line,
  .sk__cover { animation: none; }
  .nota__cover-img { scale: 1; }
}
</style>
