<template>
  <div class="cortina" aria-hidden="true" ref="rootRef">
    <svg class="cortina__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path class="cortina__path" ref="pathRef" d="" />
    </svg>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { registrarCortina } from '../lib/transicion'

const rootRef = ref(null)
const pathRef = ref(null)

onMounted(() => {
  registrarCortina({ root: rootRef.value, path: pathRef.value })
})
</script>

<style scoped>
.cortina {
  position: fixed;
  inset: 0;
  z-index: 90;
  /* Nunca intercepta clicks: solo tapa mientras dura la transicion. */
  pointer-events: none;
  visibility: hidden;
}

.cortina__svg {
  display: block;
  width: 100%;
  height: 100%;
}

.cortina__path {
  fill: var(--brand-ink);
}
</style>
