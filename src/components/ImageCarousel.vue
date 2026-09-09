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
  margin: 0;
}

.ncar__viewport {
  position: relative;
}

.ncar__track {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  border-radius: clamp(14px, 1.4vw, 20px);
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
  max-height: 70vh;
  object-fit: cover;
  background: #ebe7df;
}

.ncar__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.6rem;
  height: 2.6rem;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 1px solid rgba(28, 26, 24, 0.12);
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(6px);
  color: var(--brand-ink);
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, opacity 0.2s ease;
}

.ncar__nav:hover:not(:disabled) {
  background: var(--brand-terracotta);
  color: #fff;
}

.ncar__nav:disabled {
  opacity: 0.35;
  cursor: default;
}

.ncar__nav--prev {
  left: 0.75rem;
}

.ncar__nav--next {
  right: 0.75rem;
}

.ncar__dots {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 0.85rem;
}

.ncar__dot {
  width: 0.5rem;
  height: 0.5rem;
  padding: 0;
  border: none;
  border-radius: 999px;
  background: rgba(28, 26, 24, 0.2);
  cursor: pointer;
  transition: width 0.3s ease, background 0.3s ease;
}

.ncar__dot.is-active {
  width: 1.5rem;
  background: var(--brand-terracotta);
}

.ncar__caption {
  margin: 0.85rem 0 0;
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(28, 26, 24, 0.6);
  text-align: center;
}

@media (prefers-reduced-motion: reduce) {
  .ncar__track {
    scroll-behavior: auto;
  }
}
</style>
