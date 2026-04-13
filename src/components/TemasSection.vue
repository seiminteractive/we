<template>
  <section id="temas" ref="sectionRef" class="temas" aria-labelledby="temas-heading">
    <div class="temas__grain" aria-hidden="true" />

    <div class="temas__shell">
      <header class="temas__header" data-reveal>
        <div class="temas__brand">
          <span class="temas__brand-mark" aria-hidden="true" />
          <span class="temas__brand-text">TEMAS EN LOS QUE TRABAJAMOS</span>
        </div>
        <h2 id="temas-heading" class="temas__title">
          Experiencia y método para cada desafío institucional
        </h2>
      </header>

      <div class="temas__grid" role="list">
        <article class="temas-card temas-card--text temas-card--a" role="listitem" data-reveal>
          <h3 class="temas-card__title">Sostenibilidad</h3>
          <p class="temas-card__desc">
            Formación y estrategia para integrar sostenibilidad de manera realista y accionable.
          </p>
        </article>

        <article class="temas-card temas-card--text temas-card--b" role="listitem" data-reveal>
          <h3 class="temas-card__title">Inteligencia artificial</h3>
          <p class="temas-card__desc">
            Capacitaciones y programas para comprender, adoptar y aplicar IA en organizaciones.
          </p>
        </article>

        <article
          class="temas-card temas-card--compare temas-card--tall"
          role="listitem"
          aria-label="Innovación institucional: comparación visual"
          data-reveal
        >
          <div
            ref="compareRef"
            class="temas-compare"
            @pointerdown="onComparePointerDown"
          >
            <img
              :src="compareAfter"
              alt=""
              class="temas-compare__base"
              width="640"
              height="900"
              draggable="false"
            />
            <div
              class="temas-compare__before"
              :style="{ clipPath: `inset(0 ${100 - comparePct}% 0 0)` }"
            >
              <img
                :src="compareBefore"
                alt=""
                class="temas-compare__before-img"
                width="640"
                height="900"
                draggable="false"
              />
            </div>
            <div class="temas-card__media-gradient" aria-hidden="true" />
            <div
              class="temas-compare__handle"
              :style="{ left: `${comparePct}%` }"
            >
              <span class="temas-compare__line" aria-hidden="true" />
              <span class="temas-compare__knob" aria-hidden="true">
                <i class="pi pi-angle-left"></i>
                <i class="pi pi-angle-right"></i>
              </span>
            </div>
            <div class="temas-card__media-caption">
              <h3 class="temas-card__title temas-card__title--on-media">Innovación institucional</h3>
              <p class="temas-card__desc temas-card__desc--on-media">
                Herramientas para actualizar modelos, agendas y capacidades.
              </p>
            </div>
          </div>
        </article>

        <article class="temas-card temas-card--media temas-card--wide" role="listitem" data-reveal>
          <img
            :src="wideImage"
            alt=""
            class="temas-card__media-img"
            width="1200"
            height="640"
            loading="lazy"
          />
          <div class="temas-card__media-gradient" aria-hidden="true" />
          <div class="temas-card__media-caption">
            <h3 class="temas-card__title temas-card__title--on-media">Comunicación y narrativa</h3>
            <p class="temas-card__desc temas-card__desc--on-media">
              Diseño de mensajes, posicionamiento y campañas para construir relevancia.
            </p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onUnmounted, ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const { sectionRef } = useScrollReveal()
import imagenQueHacemos from '../assets/imagenQueHacemos.png'
import temaEnLosQueTrabajamosUno from '../assets/temaEnLosQueTrabajamosUno.png'
import temaEnLosQueTrabajamosDos from '../assets/temaEnLosQueTrabajamosDos.png'

const compareRef = ref(null)
const comparePct = ref(48)

const compareBefore = temaEnLosQueTrabajamosUno
const compareAfter = temaEnLosQueTrabajamosDos
const wideImage = imagenQueHacemos

let activePointer = false

function setPctFromClientX(clientX) {
  const el = compareRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const x = clientX - r.left
  comparePct.value = Math.min(100, Math.max(0, (x / r.width) * 100))
}

function onComparePointerDown(e) {
  const root = compareRef.value
  if (!root || !root.contains(e.target)) return
  e.preventDefault()
  activePointer = true
  root.setPointerCapture?.(e.pointerId)
  setPctFromClientX(e.clientX)

  const move = (ev) => {
    if (!activePointer) return
    setPctFromClientX(ev.clientX)
  }
  const up = () => {
    activePointer = false
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', up)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up)
  window.addEventListener('pointercancel', up)
}

onUnmounted(() => {
  activePointer = false
})
</script>

<style scoped>
.temas {
  --temas-bg: var(--section-bg);
  --temas-ink: #000000;
  --temas-muted: #666666;
  --temas-line: #e5e5e5;
  --temas-card: #ffffff;

  position: relative;
  background: var(--temas-bg);
  color: var(--temas-ink);
  box-sizing: border-box;
  overflow-x: clip;
}

.temas__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.4;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 80px 80px;
  mix-blend-mode: multiply;
}

.temas__shell {
  position: relative;
  z-index: 1;
  isolation: isolate;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-temas-bottom);
  box-sizing: border-box;
  min-width: 0;
}

.temas__header {
  margin-bottom: clamp(2.25rem, 4.5vw, 3.5rem);
  max-width: min(36rem, 100%);
}

.temas__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(0.85rem, 2vw, 1.15rem);
}

.temas__brand-mark {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--temas-ink);
  flex-shrink: 0;
}

.temas__brand-text {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--temas-ink);
}

.temas__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4vw, 3.1rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--temas-ink);
}

.temas__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  grid-template-rows: minmax(260px, auto) minmax(280px, auto);
  gap: clamp(1rem, 2vw, 1.35rem);
  align-items: stretch;
}

.temas-card {
  position: relative;
  margin: 0;
  border-radius: clamp(22px, 2.5vw, 30px);
  border: 1px solid var(--temas-line);
  background: var(--temas-card);
  box-sizing: border-box;
  overflow: hidden;
}

.temas-card--text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  padding: clamp(1.75rem, 3.2vw, 2.5rem);
  min-height: 0;
}

.temas-card--a {
  grid-column: 1;
  grid-row: 1;
}

.temas-card--b {
  grid-column: 2;
  grid-row: 1;
}

.temas-card--tall {
  grid-column: 3;
  grid-row: 1 / span 2;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.temas-card--wide {
  grid-column: 1 / span 2;
  grid-row: 2;
  padding: 0;
 min-height: clamp(240px, 32vw, 340px);
}

.temas-card__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.05rem, 1.65vw, 1.25rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--temas-ink);
}

.temas-card__desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 1.15vw, 0.9375rem);
  font-weight: var(--font-w-regular);
  line-height: 1.5;
  color: var(--temas-muted);
  max-width: 28rem;
}

.temas-card__media-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.temas-card__media-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.08) 45%,
    transparent 100%
  );
  pointer-events: none;
}

.temas-card__media-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: clamp(1.35rem, 3vw, 2.25rem);
  z-index: 2;
  pointer-events: none;
}

.temas-card__title--on-media {
  color: #fff;
 margin-bottom: 0.4rem;
}

.temas-card__desc--on-media {
  color: rgba(255, 255, 255, 0.9);
  max-width: 26rem;
}

.temas-card--media {
  position: relative;
}

.temas-card--compare {
  position: relative;
}

.temas-compare {
  position: relative;
  flex: 1 1 0;
  min-height: clamp(280px, 42vh, 520px);
  cursor: ew-resize;
  touch-action: none;
  user-select: none;
}

.temas-card--compare .temas-card__media-gradient {
  z-index: 2;
}

.temas-compare__base {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.temas-compare__before {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.temas-compare__before-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.temas-compare__handle {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  transform: translateX(-50%);
  z-index: 4;
  pointer-events: none;
}

.temas-compare__line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  margin-left: -1px;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.15);
}

.temas-compare__knob {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.05rem;
  color: var(--temas-ink);
  pointer-events: auto;
  cursor: ew-resize;
}

.temas-compare__knob .pi {
  font-size: 0.65rem;
  line-height: 1;
}

.temas-card--compare .temas-card__media-caption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: clamp(1.35rem, 3vw, 2.25rem);
  z-index: 3;
  pointer-events: none;
  background: none;
}

.temas-card--compare .temas-card__title--on-media,
.temas-card--compare .temas-card__desc--on-media {
  text-shadow: 0 1px 12px rgba(0, 0, 0, 0.35);
}

@media (max-width: 960px) {
  .temas__grid {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }

  .temas-card--a {
    grid-column: 1;
    grid-row: 1;
  }

  .temas-card--b {
    grid-column: 2;
    grid-row: 1;
  }

  .temas-card--wide {
    grid-column: 1 / -1;
    grid-row: 2;
    min-height: 260px;
  }

  .temas-card--tall {
    grid-column: 1 / -1;
    grid-row: 3;
  }

  .temas-compare {
    min-height: 300px;
  }
}

@media (max-width: 560px) {
  .temas__grid {
    grid-template-columns: 1fr;
  }

  .temas-card--a,
  .temas-card--b {
    grid-column: 1;
    grid-row: auto;
  }

  .temas-card--wide {
    grid-row: auto;
  }

  .temas-card--tall {
    grid-row: auto;
  }
}
</style>
