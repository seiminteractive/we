<template>
  <AdminLogin v-if="ready && !user" />

  <div v-else-if="ready" class="admin">
    <header class="admin__bar">
      <div class="admin__brand">Admin</div>
      <div class="admin__user">
        <span v-if="user?.email" class="admin__user-mail">{{ user.email }}</span>
        <button class="btn btn--ghost btn--sm" type="button" @click="onLogout">Salir</button>
      </div>
    </header>

    <main class="admin__shell">
      <div class="admin__tabs" role="tablist">
        <button
          class="admin__tab"
          :class="{ 'is-active': tab === 'noticias' }"
          type="button"
          role="tab"
          :aria-selected="tab === 'noticias'"
          @click="tab = 'noticias'"
        >
          Novedades
        </button>
        <button
          class="admin__tab"
          :class="{ 'is-active': tab === 'cursos' }"
          type="button"
          role="tab"
          :aria-selected="tab === 'cursos'"
          @click="tab = 'cursos'"
        >
          Programas
        </button>
      </div>

      <div v-show="tab === 'noticias'" class="settings-row">
        <div class="settings-row__text">
          <p class="settings-row__title">Mostrar sección de Novedades en el sitio</p>
          <p class="settings-row__sub">
            Apagalo si todavía no tenés novedades: la sección desaparece de la landing pública.
          </p>
        </div>
        <button
          type="button"
          class="switch"
          :class="{ 'is-on': noticiasVisible }"
          role="switch"
          :aria-checked="noticiasVisible ? 'true' : 'false'"
          aria-label="Mostrar sección de Novedades en el sitio"
          :disabled="savingToggle"
          @click="toggleNoticias"
        >
          <span class="switch__knob"></span>
        </button>
      </div>

      <!-- v-show y no v-if: al cambiar de pestaña no se pierde la suscripcion
           ni lo que el usuario tenga a medio escribir. -->
      <ContentManager
        v-show="tab === 'noticias'"
        title="Novedades"
        singular="noticia"
        :api="noticiasApi"
        folder="noticias"
        :fields="noticiasFields"
        title-key="title"
        sub-key="excerpt"
        badge-key="tag"
        editor-base="/admin/novedades"
      />

      <ContentManager
        v-show="tab === 'cursos'"
        title="Programas"
        singular="programa"
        :api="cursosApi"
        folder="cursos"
        :fields="cursosFields"
        title-key="title"
        sub-key="description"
      />
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AdminLogin from '../components/admin/AdminLogin.vue'
import ContentManager from '../components/admin/ContentManager.vue'
import { authReady, cursosApi, currentUser, logout, noticiasApi, settingsApi } from '../lib/firebase'
import '../styles/admin.css'

const user = computed(() => currentUser.value)
const ready = computed(() => authReady.value)

const tab = ref('noticias')

// Novedades se edita en su propia pagina (NoticiaEditor), no en el modal:
// estos campos solo describen que mostrar en cada fila del listado.
// El campo "link" se quito a proposito: ahora toda novedad tiene su detalle
// en /novedades/:slug, asi que ya no hay a donde redirigir.
const noticiasFields = [
  { key: 'title', label: 'Título', type: 'text', required: true },
  { key: 'tag', label: 'Badge', type: 'text', required: true, placeholder: 'Sostenibilidad' },
  { key: 'excerpt', label: 'Texto', type: 'textarea', required: true },
]

const cursosFields = [
  { key: 'title', label: 'Título', type: 'text', required: true },
  { key: 'description', label: 'Texto', type: 'textarea', required: true },
]

function onLogout() {
  logout()
}

/* ─────── Interruptor de visibilidad de la sección Novedades ─────── */

const noticiasVisible = ref(true)
const savingToggle = ref(false)

let unsubscribeSettings = null

onMounted(() => {
  unsubscribeSettings = settingsApi.subscribe(
    (data) => {
      if (typeof data.noticiasVisible === 'boolean') noticiasVisible.value = data.noticiasVisible
    },
    (err) => console.error('No se pudieron cargar los ajustes:', err)
  )
})

onUnmounted(() => {
  if (unsubscribeSettings) unsubscribeSettings()
})

// Optimista: se pinta el cambio al toque y se revierte si el guardado falla.
async function toggleNoticias() {
  const next = !noticiasVisible.value
  noticiasVisible.value = next
  savingToggle.value = true
  try {
    await settingsApi.patch({ noticiasVisible: next })
  } catch (err) {
    console.error(err)
    noticiasVisible.value = !next
  } finally {
    savingToggle.value = false
  }
}
</script>
