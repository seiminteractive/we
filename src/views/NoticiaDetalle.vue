<template>
  <div class="nota-page">
    <article class="nota">
    <div class="nota__shell">
      <RouterLink class="nota__back" to="/#noticias">
        <i class="pi pi-arrow-left" aria-hidden="true"></i>
        <span>Volver a Novedades</span>
      </RouterLink>

      <p v-if="cargando" class="nota__estado">Cargando…</p>

      <div v-else-if="!noticia" class="nota__estado">
        <h1 class="nota__404">No encontramos esta novedad.</h1>
        <p>Puede que haya sido dada de baja o que el enlace esté mal escrito.</p>
        <RouterLink class="nota__cta" to="/#noticias">Ver todas las novedades</RouterLink>
      </div>

      <template v-else>
        <header class="nota__head">
          <span v-if="noticia.tag" class="nota__tag">{{ noticia.tag }}</span>
          <h1 class="nota__title">{{ noticia.title }}</h1>
          <span v-if="fecha" class="nota__date">{{ fecha }}</span>
        </header>

        <img v-if="mostrarPortada" :src="noticia.image" alt="" class="nota__cover" />

        <div class="nota__body">
          <section v-for="(bloque, i) in bloques" :key="bloque.id || i" class="nota__block">
            <ImageCarousel
              v-if="bloque.images && bloque.images.length"
              :images="bloque.images"
            />
            <h2 v-if="bloque.heading" class="nota__h2">{{ bloque.heading }}</h2>
            <template v-for="(parrafo, j) in parrafos(bloque.text)" :key="j">
              <blockquote v-if="esCita(parrafo)" class="nota__quote">{{ parrafo }}</blockquote>
              <p v-else class="nota__p">{{ parrafo }}</p>
            </template>
          </section>
        </div>
      </template>
      </div>
    </article>

    <SiteFooter />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ImageCarousel from '../components/ImageCarousel.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { fetchNoticiaPorSlug, formatDate } from '../lib/firebase'

const route = useRoute()
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

// Los testimonios vienen entrecomillados dentro del texto; se destacan.
function esCita(parrafo) {
  return /^[“"«]/.test(parrafo.trim())
}

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

  const enBloques = bloques.value.some((b) =>
    (b.images || []).some((img) => img.path && img.path === n.imagePath)
  )
  return !enBloques
})

function parrafos(texto) {
  return String(texto || '')
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
}

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
}

watch(() => route.params.slug, (slug) => slug && cargar(slug), { immediate: true })
</script>

<style scoped>
.nota-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
}

.nota {
  flex: 1;
  background: var(--brand-sand);
  color: var(--brand-ink);
  padding: clamp(1.5rem, 5vw, 3.5rem) var(--section-pad-x) clamp(4rem, 8vw, 6rem);
}

.nota__shell {
  max-width: 760px;
  margin: 0 auto;
}

.nota__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: var(--font-w-medium);
  color: rgba(21, 21, 22, 0.6);
  text-decoration: none;
  margin-bottom: clamp(2rem, 5vw, 3rem);
  transition: color 0.2s ease;
}

.nota__back:hover {
  color: var(--brand-terracotta);
}

.nota__estado {
  padding: 3rem 0;
  color: rgba(21, 21, 22, 0.6);
}

.nota__404 {
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 3vw, 2rem);
  margin: 0 0 0.5rem;
  color: var(--brand-ink);
}

.nota__cta {
  display: inline-block;
  margin-top: 1.25rem;
  padding: 0.7rem 1.4rem;
  border-radius: 999px;
  background: var(--brand-terracotta);
  color: #fff;
  font-family: var(--font-heading);
  font-weight: var(--font-w-semibold);
  font-size: 0.85rem;
  text-decoration: none;
}

.nota__head {
  margin-bottom: clamp(1.75rem, 4vw, 2.5rem);
}

.nota__tag {
  display: inline-block;
  font-family: var(--font-heading);
  font-size: 0.66rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-terracotta);
  margin-bottom: 0.75rem;
}

.nota__title {
  font-family: var(--font-heading);
  font-size: clamp(1.7rem, 4.5vw, 2.9rem);
  line-height: 1.12;
  font-weight: var(--font-w-bold);
  margin: 0 0 0.75rem;
  text-wrap: balance;
}

.nota__date {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(21, 21, 22, 0.42);
}

.nota__cover {
  display: block;
  width: 100%;
  height: auto;
  border-radius: clamp(16px, 1.6vw, 22px);
  margin-bottom: clamp(2rem, 5vw, 3rem);
  background: #ebe7df;
}

.nota__block + .nota__block {
  margin-top: clamp(2.25rem, 5vw, 3.25rem);
}

.nota__h2 {
  font-family: var(--font-heading);
  font-size: clamp(1.2rem, 2.2vw, 1.55rem);
  line-height: 1.25;
  font-weight: var(--font-w-bold);
  margin: 0 0 0.9rem;
}

.nota__quote {
  margin: 0 0 1.15rem;
  padding: 0.15rem 0 0.15rem 1.15rem;
  border-left: 2px solid var(--brand-terracotta);
  font-family: var(--font-body);
  font-size: clamp(1.02rem, 1.25vw, 1.15rem);
  line-height: 1.6;
  font-style: italic;
  color: rgba(21, 21, 22, 0.72);
}

.nota__p {
  font-family: var(--font-body);
  font-size: clamp(1rem, 1.15vw, 1.075rem);
  line-height: 1.72;
  color: rgba(21, 21, 22, 0.82);
  margin: 0 0 1.15rem;
}

/* Un subtitulo o un parrafo que viene justo despues de una imagen necesita
   mas aire que la separacion normal entre parrafos. */
.nota__block :deep(.ncar) + .nota__p,
.nota__block :deep(.ncar) + .nota__h2 {
  margin-top: 1.5rem;
}
</style>
