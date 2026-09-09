<template>
  <figure class="ncar">
    <div class="ncar__viewport">
      <ul class="ncar__track" ref="trackRef" @scroll.passive="onScroll">
        <li v-for="(img, i) in images" :key="img.path || i" class="ncar__item">
          <img :src="img.url" :alt="img.caption || ''" class="ncar__img" loading="lazy" />
        </li>
      </ul>

      <template v-if="images.length > 1">
        <button
          class="ncar__nav ncar__nav--prev"
          type="button"
          aria-label="Imagen anterior"
          :disabled="current === 0"
          @click="goTo(current - 1)"
        >
          <i class="pi pi-arrow-left" aria-hidden="true"></i>
        </button>
        <button
          class="ncar__nav ncar__nav--next"
          type="button"
          aria-label="Imagen siguiente"
          :disabled="current === images.length - 1"
          @click="goTo(current + 1)"
        >
          <i class="pi pi-arrow-right" aria-hidden="true"></i>
        </button>
      </template>
    </div>

    <div v-if="images.length > 1" class="ncar__dots" role="tablist">
      <button
        v-for="(img, i) in images"
        :key="`dot-${i}`"
        type="button"
        class="ncar__dot"
        :class="{ 'is-active': i === current }"
        :aria-label="`Ir a la imagen ${i + 1}`"
        :aria-selected="i === current"
        @click="goTo(i)"
      />
    </div>

    <!-- El epigrafe acompaña a la imagen visible, no al bloque entero. -->
    <figcaption v-if="captionActual" class="ncar__caption">{{ captionActual }}</figcaption>
  </figure>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  images: { type: Array, default: () => [] },
})

const trackRef = ref(null)
const current = ref(0)

const captionActual = computed(() => props.images[current.value]?.caption || '')

function goTo(index) {
  const i = Math.max(0, Math.min(index, props.images.length - 1))
  const track = trackRef.value
  if (!track) return
  track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' })
  current.value = i
}

// El indice se deduce del scroll para que el swipe tactil actualice los dots.
function onScroll() {
  const track = trackRef.value
  if (!track || !track.clientWidth) return
  current.value = Math.round(track.scrollLeft / track.clientWidth)
}
</script>

<style scoped>
.ncar {
  margin: 0 0 clamp(1.5rem, 3vw, 2rem);
}

.ncar__viewport {
  position: relative;
  border-radius: clamp(14px, 1.6vw, 20px);
  overflow: hidden;
  background: #e3ddd0;
  box-shadow: 0 18px 46px rgba(21, 21, 22, 0.12);
}

.ncar__track {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
}

.ncar__track::-webkit-scrollbar {
  display: none;
}

.ncar__item {
  flex: 0 0 100%;
  scroll-snap-align: start;
}

.ncar__img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 68vh;
  object-fit: cover;
}

/* Los controles solo aparecen sobre la imagen, sin robarle protagonismo. */
.ncar__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(21, 21, 22, 0.42);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #fff;
  font-size: 0.78rem;
  cursor: pointer;
  opacity: 0.9;
  transition: background 0.25s ease, opacity 0.25s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.ncar__nav:hover:not(:disabled) {
  background: var(--brand-terracotta);
  border-color: var(--brand-terracotta);
}

.ncar__nav:disabled {
  opacity: 0.28;
  cursor: default;
}

.ncar__nav--prev { left: 0.8rem; }
.ncar__nav--next { right: 0.8rem; }

.ncar__nav--prev:hover:not(:disabled) { transform: translateY(-50%) translateX(-2px); }
.ncar__nav--next:hover:not(:disabled) { transform: translateY(-50%) translateX(2px); }

.ncar__dots {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.9rem;
}

.ncar__dot {
  width: 0.45rem;
  height: 0.45rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(21, 21, 22, 0.2);
  cursor: pointer;
  transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease;
}

.ncar__dot.is-active {
  width: 1.6rem;
  background: var(--brand-terracotta);
}

/* Epigrafe: credito discreto, alineado con el cuerpo del texto. */
.ncar__caption {
  margin: 0.9rem 0 0;
  padding-left: 0.9rem;
  border-left: 2px solid rgba(var(--accent-rgb), 0.35);
  font-family: var(--font-body);
  font-size: 0.82rem;
  line-height: 1.5;
  color: rgba(21, 21, 22, 0.55);
  text-wrap: pretty;
}

@media (prefers-reduced-motion: reduce) {
  .ncar__track { scroll-behavior: auto; }
}
</style>
