<template>
  <section
    id="para-quien"
    ref="sectionRef"
    class="para"
    :class="{ 'has-expanded': Boolean(activeIx) }"
    aria-labelledby="para-intro-heading"
  >
    <div class="para__shell">
      <header class="para__intro" data-reveal>
        <h2 id="para-intro-heading" class="para__intro-title">
          Trabajamos con organizaciones que buscan liderar el futuro.
        </h2>
        <a href="#que-hacemos" class="para__intro-cta">Explorar servicios</a>
      </header>

      <ul ref="columnsRef" class="para__columns" role="list">
        <li v-for="item in audiences" :key="item.ix" class="para__col-wrap" data-reveal>
          <article
            class="para__col"
            tabindex="0"
            :aria-label="item.label"
            :class="{
              'is-active': activeIx === item.ix,
              'is-inactive': activeIx && activeIx !== item.ix,
            }"
            @click="handleColumnClick(item.ix)"
            @keydown.enter.prevent="handleColumnClick(item.ix)"
            @keydown.space.prevent="handleColumnClick(item.ix)"
          >
            <div class="para__media" aria-hidden="true">
              <img :src="item.image" alt="" class="para__img" loading="lazy" />
            </div>
            <div class="para__veil" aria-hidden="true" />

            <div class="para__bottom">
              <span class="para__ix">{{ item.ix }}</span>
              <h3 class="para__title">{{ item.label }}</h3>
            </div>

            <div class="para__details" :class="{ 'is-visible': activeIx === item.ix }">
              <p class="para__details-kicker">{{ item.kicker }}</p>
              <p class="para__details-text">{{ item.detail }}</p>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue'
import imgEmpresas from '../assets/empresas.jpeg'
import imgGobiernos from '../assets/gobiernos.jpeg'
import imgOrganizaciones from '../assets/organizaciones.jpeg'
import { useScrollReveal } from '../composables/useScrollReveal'
import { gsap } from '../lib/gsap'

const { sectionRef } = useScrollReveal()
const columnsRef = ref(null)
const activeIx = ref(null)
let widthTween

function isMobileViewport() {
  return window.matchMedia('(max-width: 960px)').matches
}

function animateColumns(nextActiveIx) {
  const columnsEl = columnsRef.value
  if (!columnsEl) return

  const wraps = Array.from(columnsEl.querySelectorAll('.para__col-wrap'))
  if (!wraps.length) return

  const expandedWidth = 100
  const collapsedWidth = 0
  const defaultWidth = 100 / wraps.length

  widthTween?.kill()

  const tl = gsap.timeline({
    defaults: { duration: 0.62, ease: 'power2.out' },
  })

  wraps.forEach((wrap, index) => {
    const ix = audiences[index]?.ix
    const width = nextActiveIx ? (ix === nextActiveIx ? expandedWidth : collapsedWidth) : defaultWidth

    tl.to(
      wrap,
      {
        width: `${width}%`,
      },
      0
    )

    tl.to(
      wrap,
      {
        opacity: nextActiveIx && ix !== nextActiveIx ? 0 : 1,
        duration: 0.42,
      },
      0
    )
  })

  widthTween = tl
}

function handleColumnClick(ix) {
  if (isMobileViewport()) return
  const nextActiveIx = activeIx.value === ix ? null : ix
  activeIx.value = nextActiveIx
  nextTick(() => animateColumns(nextActiveIx))
}

const audiences = [
  {
    ix: '01',
    label: 'Empresas',
    image: imgEmpresas,
    kicker: 'Escala y posicionamiento',
    detail:
      'Acompanamos a equipos de liderazgo en estrategia, comunicacion e innovacion aplicada para crecer con foco y diferenciacion.',
  },
  {
    ix: '02',
    label: 'Gobiernos',
    image: imgGobiernos,
    kicker: 'Transformacion publica',
    detail:
      'Disenamos soluciones para gestionar complejidad, fortalecer capacidades institucionales y mejorar la implementacion de politicas.',
  },
  {
    ix: '03',
    label: 'Organizaciones',
    image: imgOrganizaciones,
    kicker: 'Impacto y sostenibilidad',
    detail:
      'Impulsamos procesos de evolucion organizacional, articulacion y narrativa para ampliar alcance y generar resultados medibles.',
  },
]

onBeforeUnmount(() => {
  widthTween?.kill()
  widthTween = null
})
</script>

<style scoped>
.para {
  position: relative;
  background: transparent;
  color: #1a1a1a;
  overflow: clip;
  min-height: 100vh;
  min-height: 100dvh;
  height: 100vh;
  height: 100dvh;
}

.para__shell {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.para__columns {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  height: 100%;
  border-top: 1px solid rgba(26, 26, 26, 0.12);
  border-bottom: 1px solid rgba(26, 26, 26, 0.12);
}

.para__col-wrap {
  margin: 0;
  min-width: 0;
  width: 33.333%;
  flex: 0 0 auto;
  height: 100%;
  overflow: hidden;
}

.para__col {
  position: relative;
  height: 100%;
  padding: clamp(1rem, 2vw, 1.3rem);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: transparent;
  border-right: 1px solid rgba(26, 26, 26, 0.12);
  isolation: isolate;
  outline: none;
  transition: background-color 0.6s ease;
  cursor: pointer;
}

.para__intro {
  position: absolute;
  z-index: 4;
  top: clamp(4rem, 11vh, 7rem);
  right: 2rem;
  width: min(46vw, 34rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(0.85rem, 1.2vw, 1.15rem);
  pointer-events: none;
}

.para__intro-title {
  margin: 0;
  max-width: min(31rem, 100%);
  font-family: var(--font-heading);
  font-size: clamp(1.75rem, 3vw, 2.7rem);
  line-height: 1.02;
  letter-spacing: -0.016em;
  text-transform: uppercase;
  color: #1c1c1f;
  text-wrap: balance;
  transition: color 0.35s ease;
}

.para.has-expanded .para__intro-cta {
  color: rgba(24, 24, 24, 0.88);
  border-color: rgba(24, 24, 24, 0.35);
  background: transparent;
}

.para.has-expanded .para__intro-cta:hover {
  border-color: rgba(24, 24, 24, 0.55);
  background: rgba(255, 255, 255, 0.45);
}

.para__intro-cta {
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(2.1rem, 2.5vw, 2.5rem);
  padding: 0.22rem clamp(0.9rem, 1.25vw, 1.2rem);
  border: 1.5px solid rgba(24, 24, 24, 0.35);
  border-radius: 999px;
  text-decoration: none;
  font-family: var(--font-body);
  font-size: clamp(0.66rem, 0.74vw, 0.75rem);
  line-height: 1;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.035em;
  text-transform: uppercase;
  color: rgba(24, 24, 24, 0.88);
  transition: border-color 0.28s ease, background-color 0.28s ease;
}

.para__intro-cta:hover {
  border-color: rgba(24, 24, 24, 0.55);
  background: rgba(255, 255, 255, 0.45);
}

.para__col-wrap:first-child .para__col {
  border-left: 1px solid rgba(26, 26, 26, 0.12);
}

.para__media {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
  transform: translate3d(0, 0, 0);
  transform-origin: center center;
  transition:
    left 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    top 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    height 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    border-radius 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.72s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.72s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0;
  transform: scale(1.06);
  filter: saturate(0.88) contrast(0.95);
  transition:
    opacity 0.68s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.68s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__veil {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(15, 15, 15, 0.1) 0%,
    rgba(15, 15, 15, 0.04) 35%,
    rgba(15, 15, 15, 0.58) 100%
  );
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__bottom {
  position: relative;
  z-index: 2;
}

.para__bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.para__ix {
  font-family: var(--font-body);
  font-size: clamp(1.55rem, 2.1vw, 1.85rem);
  line-height: 0.98;
  font-weight: 200;
  letter-spacing: -0.03em;
  color: rgba(26, 26, 26, 0.6);
  font-variant-numeric: tabular-nums;
  transition: color 0.35s ease;
}

.para__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(2.05rem, 2.95vw, 2.55rem);
  line-height: 0.98;
  letter-spacing: -0.018em;
  color: #1c1c1c;
  transition: color 0.35s ease;
}

.para__col:hover .para__img,
.para__col:focus-visible .para__img {
  opacity: 1;
  transform: scale(1);
  filter: saturate(1) contrast(1);
}

.para__col:hover .para__veil,
.para__col:focus-visible .para__veil {
  opacity: 1;
}

.para__col.is-active .para__img,
.para__col.is-active .para__veil {
  opacity: 1;
  transform: scale(1);
  filter: saturate(1) contrast(1);
}

.para__col.is-active {
  background: transparent;
}

.para__col.is-active .para__media {
  left: clamp(1.5rem, 4.5vw, 4.5rem);
  top: 50%;
  transform: translate3d(0, -47%, 0);
  width: min(45vw, 47rem);
  height: min(68vh, 39rem);
  border-radius: clamp(14px, 1.8vw, 24px);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.38),
    0 10px 30px rgba(0, 0, 0, 0.22);
}

.para__col.is-active .para__media::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(13, 16, 20, 0.12) 0%,
    rgba(13, 16, 20, 0.06) 42%,
    rgba(13, 16, 20, 0.32) 100%
  );
  pointer-events: none;
}

.para__col.is-active .para__img {
  opacity: 0.92;
  transform: scale(1.015);
  filter: saturate(0.92) contrast(0.9);
}

.para__col.is-active .para__veil {
  opacity: 0.04;
}

.para__col:hover .para__ix,
.para__col:hover .para__title,
.para__col:focus-visible .para__ix,
.para__col:focus-visible .para__title {
  color: #1c1c1c;
}

.para__col.is-active .para__ix,
.para__col.is-active .para__title {
  color: #1c1c1c;
}

.para__details {
  position: absolute;
  z-index: 2;
  right: clamp(1.2rem, 2.2vw, 2.6rem);
  bottom: clamp(1.4rem, 2.6vw, 2.8rem);
  width: min(30rem, 44vw);
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition:
    opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__details.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.para__col.is-active .para__details.is-visible {
  padding: clamp(0.9rem, 1.6vw, 1.35rem);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(9, 11, 14, 0.34);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.para__details-kicker {
  margin: 0 0 0.35rem;
  font-family: var(--font-body);
  font-size: clamp(0.78rem, 0.88vw, 0.95rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(24, 24, 24, 0.9);
}

.para__details-text {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.95rem, 1.15vw, 1.2rem);
  line-height: 1.5;
  color: rgba(24, 24, 24, 0.9);
  max-width: 40ch;
}

@media (max-width: 960px) {
  .para {
    min-height: auto;
    height: auto;
  }

  .para__shell {
    padding: var(--section-pad-y) var(--section-pad-x);
  }

  .para__columns {
    flex-direction: column;
    height: auto;
  }

  .para__col-wrap {
    width: 100% !important;
    opacity: 1 !important;
  }

  .para__col {
    min-height: clamp(18rem, 54vw, 25rem);
    border-left: 1px solid rgba(26, 26, 26, 0.12);
    height: auto;
  }

  .para__intro {
    position: relative;
    top: auto;
    left: auto;
    width: 100%;
    margin-bottom: clamp(1rem, 3.5vw, 1.75rem);
    pointer-events: auto;
  }

  .para__intro-title {
    max-width: none;
    font-size: clamp(1.7rem, 6.8vw, 2.45rem);
  }

  .para__details {
    position: relative;
    right: auto;
    bottom: auto;
    width: 100%;
    margin-top: 1rem;
    opacity: 1;
    transform: none;
  }

  .para__details-kicker,
  .para__details-text {
    color: rgba(24, 24, 24, 0.88);
  }
}
</style>
