<template>
  <div class="logo-we" role="img" aria-label="We">
    <img :src="logoPng" alt="" class="logo-we__img" />
  </div>
</template>

<script setup>
import logoPng from '../assets/logoBlancoDefinitivo.png'

function prepareReveal() {}
function playReveal() {}
function addRevealToTimeline() {}
function showInstant() {}

defineExpose({ prepareReveal, playReveal, addRevealToTimeline, showInstant })
</script>

<style scoped>
.logo-we {
  display: block;
  height: clamp(1.75rem, 4.2vw, 2.35rem);
  line-height: 0;
}

.logo-we__img {
  display: block;
  height: 100%;
  width: auto;
  object-fit: contain;
}
</style>
