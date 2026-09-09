// Capa de acceso a Firebase: auth del panel /admin + datos de la landing.
// Reconstruida a partir del bundle de produccion recuperado (wecc-front 2026-07),
// con la config movida a variables de entorno (ver .env.example).
import { initializeApp } from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  updateDoc,
} from 'firebase/firestore'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage'
import { computed, ref } from 'vue'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Fallar temprano y claro: sin esto los errores de Firebase son cripticos.
const faltantes = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)
if (faltantes.length) {
  throw new Error(
    `Falta configuracion de Firebase (${faltantes.join(', ')}). ` +
      'Copia .env.example a .env.local y completa los valores.'
  )
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

/* ─────────────────────────── Auth ─────────────────────────── */

// undefined = todavia no sabemos; null = no hay sesion; objeto = usuario.
export const currentUser = ref(undefined)
export const authReady = ref(false)

let resolveAuthReady
const authReadyPromise = new Promise((res) => {
  resolveAuthReady = res
})

onAuthStateChanged(auth, (user) => {
  currentUser.value = user || null
  authReady.value = true
  resolveAuthReady()
})

/** Espera a que Firebase resuelva la sesion inicial (usada por el guard del router). */
export function waitForAuth() {
  return authReadyPromise
}

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()

/**
 * Login del panel. La comparacion de email es solo UX: la proteccion real
 * de los datos vive en firestore.rules / storage.rules.
 */
export async function signInAdmin(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  if (ADMIN_EMAIL && cred.user.email?.toLowerCase() !== ADMIN_EMAIL) {
    await signOut(auth)
    const err = new Error('not-admin')
    err.code = 'auth/not-admin'
    throw err
  }
  return cred.user
}

export function logout() {
  return signOut(auth)
}

export function authErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-email':
      return 'El mail no tiene un formato válido.'
    case 'auth/user-disabled':
      return 'Este usuario está deshabilitado.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Mail o contraseña incorrectos.'
    case 'auth/not-admin':
      return 'Esta cuenta no tiene permisos de administrador.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Probá de nuevo en unos minutos.'
    case 'auth/network-request-failed':
      return 'Error de conexión. Revisá tu internet.'
    default:
      return 'No se pudo iniciar sesión. Intentá de nuevo.'
  }
}

/* ────────────────────────── Storage ────────────────────────── */

/** Sube un File y devuelve { url, path }. El path se guarda para poder borrarlo despues. */
export async function uploadImage(file, folder) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const r = storageRef(storage, path)
  await uploadBytes(r, file)
  return { url: await getDownloadURL(r), path }
}

/** Borra un archivo de Storage. Silencia el "no existe" para que sea idempotente. */
export async function deleteImage(path) {
  if (!path) return
  try {
    await deleteObject(storageRef(storage, path))
  } catch (err) {
    if (err?.code !== 'storage/object-not-found') {
      console.warn('No se pudo borrar la imagen:', err)
    }
  }
}

/* ───────────────────────── Firestore ───────────────────────── */

function makeCollectionApi(name, { order = 'desc' } = {}) {
  const col = collection(db, name)
  const q = query(col, orderBy('createdAt', order))
  return {
    subscribe(next, onError) {
      return onSnapshot(
        q,
        (snap) => next(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        onError
      )
    },
    async fetch() {
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    },
    async create(data) {
      return addDoc(col, { ...data, createdAt: serverTimestamp() })
    },
    async update(id, data) {
      return updateDoc(doc(db, name, id), data)
    },
    async remove(id, imagePath) {
      await deleteImage(imagePath)
      return deleteDoc(doc(db, name, id))
    },
  }
}

// "cursos" es el nombre historico de la coleccion; en la UI se llama "Programas".
export const noticiasApi = makeCollectionApi('noticias', { order: 'desc' })
export const cursosApi = makeCollectionApi('cursos', { order: 'asc' })

const settingsDoc = doc(db, 'settings', 'site')

export const settingsApi = {
  subscribe(next, onError) {
    return onSnapshot(settingsDoc, (snap) => next(snap.exists() ? snap.data() : {}), onError)
  },
  async patch(data) {
    return setDoc(settingsDoc, data, { merge: true })
  },
}

const siteSettings = ref({})
let settingsStarted = false

/** Ajustes globales del sitio. Hoy solo controla la visibilidad de Novedades. */
export function useSiteSettings() {
  if (!settingsStarted) {
    settingsStarted = true
    settingsApi.subscribe(
      (data) => {
        siteSettings.value = data
      },
      (err) => console.error('No se pudieron cargar los ajustes:', err)
    )
  }
  return {
    settings: siteSettings,
    // Ausente = visible. Solo un false explicito oculta la seccion.
    noticiasVisible: computed(() => siteSettings.value.noticiasVisible !== false),
  }
}

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

/** Timestamp de Firestore -> "12 Jun 2026". */
export function formatDate(value) {
  if (!value) return ''
  const d = typeof value?.toDate === 'function' ? value.toDate() : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`
}

/* ─────────────────── Novedades: slug y detalle ─────────────────── */

/** "Paleson: identidad y estrategia" -> "paleson-identidad-y-estrategia" */
export function slugify(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // saca tildes
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
}

/**
 * Genera un slug libre para una noticia. Si ya existe, le agrega un sufijo
 * numerico. `ignorarId` evita que un documento choque consigo mismo al editarse.
 */
export async function generarSlugUnico(titulo, ignorarId = null) {
  const base = slugify(titulo) || 'novedad'
  const col = collection(db, 'noticias')
  for (let i = 0; i < 20; i++) {
    const candidato = i === 0 ? base : `${base}-${i + 1}`
    const snap = await getDocs(query(col, where('slug', '==', candidato), limit(1)))
    const ocupado = snap.docs.some((d) => d.id !== ignorarId)
    if (!ocupado) return candidato
  }
  // Caso extremo: se cae al id-like para no bloquear el guardado.
  return `${base}-${Date.now().toString(36)}`
}

/** Busca una noticia por slug y, si no aparece, prueba interpretarlo como id. */
export async function fetchNoticiaPorSlug(slug) {
  const col = collection(db, 'noticias')
  const snap = await getDocs(query(col, where('slug', '==', slug), limit(1)))
  if (!snap.empty) {
    const d = snap.docs[0]
    return { id: d.id, ...d.data() }
  }
  // Compatibilidad: las noticias viejas no tienen slug, se accede por id.
  const porId = await getDoc(doc(db, 'noticias', slug))
  return porId.exists() ? { id: porId.id, ...porId.data() } : null
}

export async function fetchNoticiaPorId(id) {
  const snap = await getDoc(doc(db, 'noticias', id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

/**
 * Todos los paths de Storage que usa una noticia: la portada y las imagenes
 * de cada bloque. La portada suele estar referenciada dos veces (como tapa y
 * dentro de un bloque), por eso se devuelve un Set: al comparar antes/despues
 * hay que borrar solo los paths que ya no aparecen en NINGUN lado.
 */
export function pathsDeImagenes(noticia) {
  const paths = new Set()
  if (noticia?.imagePath) paths.add(noticia.imagePath)
  for (const bloque of noticia?.blocks || []) {
    for (const img of bloque?.images || []) {
      if (img?.path) paths.add(img.path)
    }
  }
  return paths
}

/** Borra de Storage los archivos que dejaron de usarse. */
export async function limpiarHuerfanos(pathsAntes, pathsDespues) {
  const aBorrar = [...pathsAntes].filter((p) => !pathsDespues.has(p))
  await Promise.all(aBorrar.map((p) => deleteImage(p)))
  return aBorrar.length
}
