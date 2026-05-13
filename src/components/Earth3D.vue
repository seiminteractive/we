<template>
  <div ref="containerRef" class="earth3d" :class="{ 'is-loaded': loaded }">
    <div ref="mountRef" class="earth3d__mount" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import earthModelUrl from '../assets/earth3d.glb?url'

const containerRef = ref(null)
const mountRef = ref(null)
const loaded = ref(false)

let scene = null
let camera = null
let renderer = null
let earth = null
let rafId = 0
let resizeObs = null
let running = true

const state = {
  baseRotY: 0,
  scrollProg: 0,
  pointerX: 0,
  pointerY: 0,
  pointerXT: 0,
  pointerYT: 0,
  bobT: 0,
}

defineExpose({
  setScrollProgress(t) {
    state.scrollProg = t
  },
  setPointer(x, y) {
    state.pointerXT = x
    state.pointerYT = y
  },
})

function init() {
  const mount = mountRef.value
  if (!mount) return

  const w = mount.clientWidth || 600
  const h = mount.clientHeight || 600

  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(30, w / h, 0.1, 100)
  camera.position.set(0, 0.4, 6.2)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setSize(w, h)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  mount.appendChild(renderer.domElement)

  scene.add(new THREE.AmbientLight(0xffffff, 0.7))

  const sun = new THREE.DirectionalLight(0xffffff, 1.4)
  sun.position.set(4, 5, 5)
  scene.add(sun)

  const rim = new THREE.DirectionalLight(0x21dc99, 0.55)
  rim.position.set(-4, 1, -3)
  scene.add(rim)

  const fill = new THREE.DirectionalLight(0xfff1d6, 0.4)
  fill.position.set(0, -3, 2)
  scene.add(fill)

  const loader = new GLTFLoader()
  loader.load(
    earthModelUrl,
    (gltf) => {
      earth = gltf.scene
      const box = new THREE.Box3().setFromObject(earth)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z) || 1
      const scale = 2.1 / maxDim
      earth.scale.setScalar(scale)
      const center = box.getCenter(new THREE.Vector3())
      earth.position.sub(center.multiplyScalar(scale))
      scene.add(earth)
      loaded.value = true
    },
    undefined,
    (err) => {
      console.error('[Earth3D] load failed', err)
    }
  )

  resizeObs = new ResizeObserver(handleResize)
  resizeObs.observe(mount)

  animate()
}

function handleResize() {
  const mount = mountRef.value
  if (!mount || !renderer || !camera) return
  const w = mount.clientWidth
  const h = mount.clientHeight
  if (w <= 0 || h <= 0) return
  renderer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
}

function animate() {
  rafId = requestAnimationFrame(animate)
  if (!running) return

  state.pointerX += (state.pointerXT - state.pointerX) * 0.055
  state.pointerY += (state.pointerYT - state.pointerY) * 0.055
  state.bobT += 0.008

  if (earth) {
    state.baseRotY += 0.0022
    earth.rotation.y =
      state.baseRotY + state.scrollProg * Math.PI * 0.9 + state.pointerX * 0.30
    earth.rotation.x = -0.16 + state.scrollProg * 0.14 + state.pointerY * 0.14
    earth.position.y = Math.sin(state.bobT) * 0.08
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

function onVisibility() {
  running = !document.hidden
}

onMounted(() => {
  init()
  document.addEventListener('visibilitychange', onVisibility)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  document.removeEventListener('visibilitychange', onVisibility)
  if (resizeObs) resizeObs.disconnect()
  if (earth) {
    earth.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
        mats.forEach((m) => {
          Object.values(m).forEach((v) => {
            if (v && v.isTexture) v.dispose()
          })
          m.dispose()
        })
      }
    })
  }
  if (renderer) {
    renderer.dispose()
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement)
    }
  }
  scene = null
  camera = null
  renderer = null
  earth = null
})
</script>

<style scoped>
.earth3d {
  position: relative;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1);
  pointer-events: none;
}

.earth3d.is-loaded {
  opacity: 1;
}

.earth3d__mount {
  position: absolute;
  inset: 0;
}

.earth3d__mount :deep(canvas) {
  display: block;
  width: 100% !important;
  height: 100% !important;
}
</style>
