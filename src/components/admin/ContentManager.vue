<template>
  <div>
    <div class="mgr__head">
      <div>
        <h2>{{ title }}</h2>
        <span class="mgr__count">
          {{ items.length }} {{ items.length === 1 ? 'elemento' : 'elementos' }}
        </span>
      </div>
      <RouterLink v-if="editorBase" class="btn btn--dark" :to="`${editorBase}/nueva`">
        <i class="pi pi-plus"></i>
        Agregar
      </RouterLink>
      <button v-else class="btn btn--dark" type="button" @click="openCreate">
        <i class="pi pi-plus"></i>
        Agregar
      </button>
    </div>

    <p v-if="error" class="form-error">{{ error }}</p>

    <div v-if="loading" class="mgr__empty">Cargando…</div>

    <div v-else-if="items.length" class="mgr__list">
      <article v-for="item in items" :key="item.id" class="mgr__item">
        <img class="mgr__thumb" :src="item.image" alt="" />
        <div class="mgr__info">
          <span v-if="badgeKey && item[badgeKey]" class="mgr__badge">{{ item[badgeKey] }}</span>
          <p class="mgr__info-title">{{ item[titleKey] }}</p>
          <p class="mgr__info-sub">{{ item[subKey] }}</p>
        </div>
        <div class="mgr__actions">
          <RouterLink
            v-if="editorBase"
            class="btn btn--ghost btn--sm"
            :to="`${editorBase}/${item.id}`"
          >
            Editar
          </RouterLink>
          <button v-else class="btn btn--ghost btn--sm" type="button" @click="openEdit(item)">
            Editar
          </button>
          <button class="btn btn--danger btn--sm" type="button" @click="askDelete(item)">
            Borrar
          </button>
        </div>
      </article>
    </div>

    <div v-else class="mgr__empty">
      Todavía no hay contenido. Agregá el primero con el botón “Agregar”.
    </div>

    <!-- Alta / edición -->
    <div v-if="modalOpen && !editorBase" class="modal" @click.self="closeModal">
      <form class="modal__card" @submit.prevent="save">
        <h3 class="modal__title">
          {{ editing ? `Editar ${singular}` : `Nuevo ${singular}` }}
        </h3>

        <p v-if="formError" class="form-error">{{ formError }}</p>

        <div class="field">
          <label class="field__label">Imagen</label>
          <div class="field__drop">
            <img v-if="preview" class="field__preview" :src="preview" alt="" />
            <span v-else class="field__preview field__preview--empty">
              <i class="pi pi-image"></i>
            </span>
            <label class="btn btn--ghost btn--sm">
              {{ preview ? 'Cambiar imagen' : 'Subir imagen' }}
              <input type="file" accept="image/*" hidden @change="onFile" />
            </label>
          </div>
        </div>

        <div v-for="field in fields" :key="field.key" class="field">
          <label class="field__label" :for="`f-${field.key}`">{{ field.label }}</label>
          <textarea
            v-if="field.type === 'textarea'"
            :id="`f-${field.key}`"
            v-model.trim="form[field.key]"
            class="field__textarea"
            :placeholder="field.placeholder || ''"
          ></textarea>
          <!-- Siempre type="text", incluso para links: type="url" haria que el
               navegador rechace anclas internas validas como "#contacto". -->
          <input
            v-else
            :id="`f-${field.key}`"
            v-model.trim="form[field.key]"
            type="text"
            class="field__input"
            :placeholder="field.placeholder || ''"
          />
        </div>

        <div class="modal__actions">
          <button class="btn btn--ghost" type="button" :disabled="saving" @click="closeModal">
            Cancelar
          </button>
          <button class="btn btn--primary" type="submit" :disabled="saving">
            {{ saving ? 'Guardando…' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Confirmación de borrado -->
    <div v-if="pendingDelete" class="modal" @click.self="cancelDelete">
      <div class="modal__card modal__card--sm" role="alertdialog" aria-modal="true">
        <h3 class="modal__title">Borrar {{ singular }}</h3>
        <p class="modal__text">
          ¿Seguro que querés borrar “{{ pendingDelete[titleKey] }}”? Esta acción no se puede
          deshacer.
        </p>
        <div class="modal__actions">
          <button class="btn btn--ghost" type="button" :disabled="deleting" @click="cancelDelete">
            Cancelar
          </button>
          <button
            class="btn btn--danger btn--solid"
            type="button"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{ deleting ? 'Borrando…' : 'Borrar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { deleteImage, pathsDeImagenes, uploadImage } from '../../lib/firebase'

const props = defineProps({
  title: { type: String, required: true },
  singular: { type: String, required: true },
  api: { type: Object, required: true },
  folder: { type: String, required: true },
  fields: { type: Array, required: true },
  titleKey: { type: String, default: 'title' },
  subKey: { type: String, default: '' },
  badgeKey: { type: String, default: '' },
  // Si se define, Agregar/Editar navegan a esa ruta en vez de abrir el modal.
  editorBase: { type: String, default: '' },
})

const items = ref([])
const loading = ref(true)
const error = ref('')

let unsubscribe = null

onMounted(() => {
  unsubscribe = props.api.subscribe(
    (list) => {
      items.value = list
      loading.value = false
    },
    (err) => {
      error.value = 'No se pudo cargar el contenido. Revisá la conexión y las reglas de Firestore.'
      loading.value = false
      console.error(err)
    }
  )
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
  releasePreview()
})

/* ───────────────── Alta / edición ───────────────── */

const modalOpen = ref(false)
const editing = ref(null)
const saving = ref(false)
const formError = ref('')
const form = reactive({})
const file = ref(null)
const preview = ref('')

// Las previsualizaciones locales son blob: y hay que liberarlas a mano.
let previewObjectUrl = null
function releasePreview() {
  if (previewObjectUrl) {
    URL.revokeObjectURL(previewObjectUrl)
    previewObjectUrl = null
  }
}

function resetForm() {
  props.fields.forEach((f) => {
    form[f.key] = ''
  })
  file.value = null
  releasePreview()
  preview.value = ''
  formError.value = ''
}

function openCreate() {
  editing.value = null
  resetForm()
  modalOpen.value = true
}

function openEdit(item) {
  editing.value = item
  resetForm()
  props.fields.forEach((f) => {
    form[f.key] = item[f.key] ?? ''
  })
  preview.value = item.image || ''
  modalOpen.value = true
}

function closeModal() {
  if (saving.value) return
  releasePreview()
  modalOpen.value = false
}

function onFile(event) {
  const picked = event.target.files?.[0]
  if (!picked) return
  file.value = picked
  releasePreview()
  previewObjectUrl = URL.createObjectURL(picked)
  preview.value = previewObjectUrl
}

async function save() {
  formError.value = ''

  const incompleto = props.fields.find(
    (f) => f.required !== false && !String(form[f.key] || '').trim()
  )
  if (incompleto) {
    formError.value = `Completá el campo “${incompleto.label}”.`
    return
  }
  if (!editing.value && !file.value) {
    formError.value = 'Subí una imagen.'
    return
  }

  saving.value = true
  try {
    const payload = {}
    props.fields.forEach((f) => {
      payload[f.key] = String(form[f.key] || '').trim()
    })

    // Se sube recien al guardar: si el usuario cancela, no queda basura en Storage.
    if (file.value) {
      const { url, path } = await uploadImage(file.value, props.folder)
      payload.image = url
      payload.imagePath = path
    }

    if (editing.value) {
      const oldPath = editing.value.imagePath
      await props.api.update(editing.value.id, payload)
      // Recien despues de que el update salio bien se borra la imagen vieja.
      if (file.value && oldPath && oldPath !== payload.imagePath) {
        await deleteImage(oldPath)
      }
    } else {
      await props.api.create(payload)
    }

    releasePreview()
    modalOpen.value = false
  } catch (err) {
    console.error(err)
    formError.value = 'No se pudo guardar. Revisá la conexión y las reglas de Firebase.'
  } finally {
    saving.value = false
  }
}

/* ───────────────── Borrado ───────────────── */

const pendingDelete = ref(null)
const deleting = ref(false)

function askDelete(item) {
  pendingDelete.value = item
}

function cancelDelete() {
  if (deleting.value) return
  pendingDelete.value = null
}

async function confirmDelete() {
  const item = pendingDelete.value
  if (!item) return
  deleting.value = true
  try {
    // Una novedad con bloques tiene varias imagenes; borrar solo la portada
    // dejaria el resto huerfano en Storage para siempre.
    const paths = pathsDeImagenes(item)
    await props.api.remove(item.id, null)
    await Promise.all([...paths].map((path) => deleteImage(path)))
    pendingDelete.value = null
  } catch (err) {
    console.error(err)
    error.value = 'No se pudo borrar el elemento.'
  } finally {
    deleting.value = false
  }
}
</script>
