<template>
  <AdminLogin v-if="ready && !user" />

  <div v-else-if="ready" class="admin">
    <header class="admin__bar">
      <div class="admin__brand">Admin</div>
      <div class="admin__user">
        <RouterLink class="btn btn--ghost btn--sm" to="/admin">Volver al listado</RouterLink>
      </div>
    </header>

    <main class="admin__shell editor">
      <p v-if="cargando" class="mgr__empty">Cargando…</p>

      <form v-else @submit.prevent="guardar">
        <h1 class="editor__title">{{ esNueva ? 'Nueva novedad' : 'Editar novedad' }}</h1>

        <p v-if="error" class="form-error">{{ error }}</p>

        <!-- ── Datos de la tarjeta ── -->
        <section class="editor__card">
          <h2 class="editor__section">Tarjeta del carrusel</h2>
          <p class="editor__hint">
            Esto es lo que se ve en la home. El texto es un resumen corto: el artículo completo
            se arma más abajo.
          </p>

          <div class="field">
            <label class="field__label">Imagen de portada</label>
            <div class="field__drop">
              <img v-if="portadaPreview" class="field__preview" :src="portadaPreview" alt="" />
              <span v-else class="field__preview field__preview--empty">
                <i class="pi pi-image"></i>
              </span>
              <label class="btn btn--ghost btn--sm">
                {{ portadaPreview ? 'Cambiar imagen' : 'Subir imagen' }}
                <input type="file" accept="image/*" hidden @change="onPortada" />
              </label>
            </div>
          </div>

          <div class="field">
            <label class="field__label" for="f-title">Título</label>
            <input id="f-title" v-model.trim="form.title" type="text" class="field__input" />
          </div>

          <div class="field">
            <label class="field__label" for="f-tag">Badge</label>
            <input
              id="f-tag"
              v-model.trim="form.tag"
              type="text"
              class="field__input"
              placeholder="Sostenibilidad"
            />
            <p class="editor__hint editor__hint--tight">
              Etiqueta corta. Si es muy larga se recorta en la tarjeta.
            </p>
          </div>

          <div class="field">
            <label class="field__label" for="f-excerpt">Texto del resumen</label>
            <textarea
              id="f-excerpt"
              v-model.trim="form.excerpt"
              class="field__textarea"
              placeholder="Dos o tres líneas que inviten a leer la nota."
            ></textarea>
          </div>
        </section>

        <!-- ── Cuerpo del artículo ── -->
        <section class="editor__card">
          <h2 class="editor__section">Artículo</h2>
          <p class="editor__hint">
            Se arma con bloques. Cada bloque puede llevar una imagen, varias (se muestran como
            carrusel) o ninguna, y un texto debajo.
          </p>

          <div v-if="!bloques.length" class="mgr__empty">
            Todavía no hay bloques. Agregá el primero con el botón de abajo.
          </div>

          <div
            v-for="(bloque, i) in bloques"
            :key="bloque.id"
            class="bloque"
          >
            <div class="bloque__head">
              <span class="bloque__num">Bloque {{ i + 1 }}</span>
              <div class="bloque__acciones">
                <button
                  class="btn btn--ghost btn--sm"
                  type="button"
                  :disabled="i === 0"
                  aria-label="Subir bloque"
                  @click="moverBloque(i, -1)"
                >
                  <i class="pi pi-arrow-up"></i>
                </button>
                <button
                  class="btn btn--ghost btn--sm"
                  type="button"
                  :disabled="i === bloques.length - 1"
                  aria-label="Bajar bloque"
                  @click="moverBloque(i, 1)"
                >
                  <i class="pi pi-arrow-down"></i>
                </button>
                <button
                  class="btn btn--danger btn--sm"
                  type="button"
                  @click="quitarBloque(i)"
                >
                  Quitar
                </button>
              </div>
            </div>

            <div v-if="bloque.images.length" class="bloque__imgs">
              <div v-for="(img, j) in bloque.images" :key="img.uid" class="bloque__img">
                <img class="bloque__thumb" :src="img.preview || img.url" alt="" />
                <div class="bloque__img-campos">
                  <input
                    v-model.trim="img.caption"
                    type="text"
                    class="field__input"
                    placeholder="Epígrafe (opcional)"
                  />
                  <div class="bloque__img-acciones">
                    <button
                      class="btn btn--ghost btn--sm"
                      type="button"
                      :disabled="j === 0"
                      aria-label="Mover imagen a la izquierda"
                      @click="moverImagen(bloque, j, -1)"
                    >
                      <i class="pi pi-arrow-left"></i>
                    </button>
                    <button
                      class="btn btn--ghost btn--sm"
                      type="button"
                      :disabled="j === bloque.images.length - 1"
                      aria-label="Mover imagen a la derecha"
                      @click="moverImagen(bloque, j, 1)"
                    >
                      <i class="pi pi-arrow-right"></i>
                    </button>
                    <button
                      class="btn btn--danger btn--sm"
                      type="button"
                      @click="quitarImagen(bloque, j)"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p v-if="bloque.images.length > 1" class="editor__hint editor__hint--tight">
              Con más de una imagen, el bloque se muestra como carrusel.
            </p>

            <div class="bloque__pie">
              <label class="btn btn--ghost btn--sm">
                Agregar imagen
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  @change="onImagenesBloque($event, bloque)"
                />
              </label>
            </div>

            <div class="field">
              <label class="field__label">Título del bloque (opcional)</label>
              <input
                v-model.trim="bloque.heading"
                type="text"
                class="field__input"
                placeholder="Ej: El punto de partida"
              />
            </div>

            <div class="field">
              <label class="field__label">Texto</label>
              <textarea
                v-model="bloque.text"
                class="field__textarea bloque__texto"
                placeholder="Texto del bloque. Dejá una línea en blanco para separar párrafos."
              ></textarea>
            </div>
          </div>

          <button
            class="btn btn--dark editor__add"
            type="button"
            :disabled="hayBloqueVacio"
            @click="agregarBloque"
          >
            <i class="pi pi-plus"></i>
            Agregar bloque
          </button>
          <p v-if="hayBloqueVacio" class="editor__hint editor__hint--tight">
            Completá el bloque vacío (una imagen, un título o texto) antes de agregar otro.
            Los bloques que queden vacíos no se guardan.
          </p>
        </section>

        <div class="editor__acciones">
          <RouterLink class="btn btn--ghost" to="/admin">Cancelar</RouterLink>
          <button class="btn btn--primary" type="submit" :disabled="guardando">
            {{ guardando ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup>
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLogin from '../../components/admin/AdminLogin.vue'
import {
  authReady,
  currentUser,
  fetchNoticiaPorId,
  generarSlugUnico,
  limpiarHuerfanos,
  noticiasApi,
  pathsDeImagenes,
  uploadImage,
} from '../../lib/firebase'
import '../../styles/admin.css'

const route = useRoute()
const router = useRouter()

const user = computed(() => currentUser.value)
const ready = computed(() => authReady.value)

const esNueva = computed(() => route.params.id === 'nueva')

const cargando = ref(true)
const guardando = ref(false)
const error = ref('')

const form = reactive({ title: '', tag: '', excerpt: '' })
const bloques = ref([])

// Estado original, para saber que imagenes dejaron de usarse al guardar.
const original = ref(null)

/* ── Previsualizaciones locales (blob:) ── */

const blobs = new Set()
function nuevoBlob(file) {
  const url = URL.createObjectURL(file)
  blobs.add(url)
  return url
}
onUnmounted(() => {
  blobs.forEach((u) => URL.revokeObjectURL(u))
  blobs.clear()
})

const uid = () => Math.random().toString(36).slice(2, 10)

/* ── Portada ── */

const portadaFile = ref(null)
const portadaPreview = ref('')

function onPortada(e) {
  const file = e.target.files?.[0]
  if (!file) return
  portadaFile.value = file
  portadaPreview.value = nuevoBlob(file)
}

/* ── Bloques ── */

/** Un bloque sin imagenes, sin titulo y sin texto no aporta nada. */
function esBloqueVacio(b) {
  return !b.images.length && !(b.heading || '').trim() && !(b.text || '').trim()
}

const hayBloqueVacio = computed(() => bloques.value.some(esBloqueVacio))

function agregarBloque() {
  // Se permite un solo bloque vacio a la vez: el que se esta completando.
  if (hayBloqueVacio.value) return
  bloques.value.push({ id: uid(), heading: '', images: [], text: '' })
}

function quitarBloque(i) {
  bloques.value.splice(i, 1)
}

function moverBloque(i, delta) {
  const j = i + delta
  if (j < 0 || j >= bloques.value.length) return
  const [b] = bloques.value.splice(i, 1)
  bloques.value.splice(j, 0, b)
}

function onImagenesBloque(e, bloque) {
  const files = Array.from(e.target.files || [])
  for (const file of files) {
    bloque.images.push({ uid: uid(), url: '', path: '', caption: '', file, preview: nuevoBlob(file) })
  }
  // Permite volver a elegir el mismo archivo si lo quitaron por error.
  e.target.value = ''
}

function quitarImagen(bloque, j) {
  bloque.images.splice(j, 1)
}

function moverImagen(bloque, j, delta) {
  const k = j + delta
  if (k < 0 || k >= bloque.images.length) return
  const [img] = bloque.images.splice(j, 1)
  bloque.images.splice(k, 0, img)
}

/* ── Carga ── */

async function cargar() {
  cargando.value = true
  error.value = ''
  if (esNueva.value) {
    original.value = null
    form.title = ''
    form.tag = ''
    form.excerpt = ''
    bloques.value = []
    portadaFile.value = null
    portadaPreview.value = ''
    cargando.value = false
    return
  }
  try {
    const n = await fetchNoticiaPorId(route.params.id)
    if (!n) {
      error.value = 'No encontramos esta novedad.'
    } else {
      original.value = n
      form.title = n.title || ''
      form.tag = n.tag || ''
      form.excerpt = n.excerpt || ''
      portadaPreview.value = n.image || ''
      bloques.value = (n.blocks || []).map((b) => ({
        id: b.id || uid(),
        heading: b.heading || '',
        text: b.text || '',
        images: (b.images || []).map((img) => ({
          uid: uid(),
          url: img.url || '',
          path: img.path || '',
          caption: img.caption || '',
          file: null,
          preview: '',
        })),
      }))
    }
  } catch (err) {
    console.error(err)
    error.value = 'No se pudo cargar la novedad.'
  } finally {
    cargando.value = false
  }
}

watch(() => route.params.id, cargar, { immediate: true })

/* ── Guardado ── */

async function guardar() {
  error.value = ''

  if (!form.title.trim()) return (error.value = 'Completá el título.')
  if (!form.tag.trim()) return (error.value = 'Completá el badge.')
  if (!form.excerpt.trim()) return (error.value = 'Completá el texto del resumen.')
  if (esNueva.value && !portadaFile.value) return (error.value = 'Subí una imagen de portada.')

  guardando.value = true
  try {
    const payload = {
      title: form.title.trim(),
      tag: form.tag.trim(),
      excerpt: form.excerpt.trim(),
    }

    // Se sube recien aca: si el usuario cancela, no queda basura en Storage.
    if (portadaFile.value) {
      const { url, path } = await uploadImage(portadaFile.value, 'noticias')
      payload.image = url
      payload.imagePath = path
    }

    payload.blocks = []
    // Los bloques vacios se descartan en vez de persistirse.
    for (const b of bloques.value.filter((b) => !esBloqueVacio(b))) {
      const imagenes = []
      for (const img of b.images) {
        if (img.file) {
          const { url, path } = await uploadImage(img.file, 'noticias')
          imagenes.push({ url, path, caption: img.caption || '' })
        } else if (img.url) {
          imagenes.push({ url: img.url, path: img.path || '', caption: img.caption || '' })
        }
      }
      payload.blocks.push({
        id: b.id,
        heading: (b.heading || '').trim(),
        images: imagenes,
        text: (b.text || '').trim(),
      })
    }

    payload.slug = await generarSlugUnico(payload.title, esNueva.value ? null : route.params.id)

    let id = route.params.id
    if (esNueva.value) {
      const docRef = await noticiasApi.create(payload)
      id = docRef.id
    } else {
      await noticiasApi.update(id, payload)
    }

    // Recien despues de que el guardado salio bien se borran las imagenes que
    // dejaron de usarse. Al reves, un fallo dejaria la nota sin sus fotos.
    if (original.value) {
      const antes = pathsDeImagenes(original.value)
      const despues = pathsDeImagenes({ ...payload, imagePath: payload.imagePath ?? original.value.imagePath })
      await limpiarHuerfanos(antes, despues)
    }

    router.push('/admin')
  } catch (err) {
    console.error(err)
    error.value = 'No se pudo guardar. Revisá la conexión y las reglas de Firebase.'
  } finally {
    guardando.value = false
  }
}
</script>
