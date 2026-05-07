<template>
  <section
    id="que-hacemos"
    ref="sectionRef"
    class="qh"
    aria-labelledby="qh-heading"
    aria-label="Nuestros pilares"
  >
    <div class="qh__bg" aria-hidden="true">
      <img :src="pilarBg" alt="" class="qh__bg-img" />
      <div class="qh__bg-overlay" />
    </div>
    <div class="qh__side-veil" aria-hidden="true" />
    <div class="qh__shell">
      <div class="qh__layout">
        <div class="qh__intro-col" data-reveal>
          <div class="qh__brand">
            <span class="qh__brand-mark" aria-hidden="true" />
            <span class="qh__brand-text">NUESTROS PILARES</span>
          </div>
          <h2 id="qh-heading" class="qh__title">
            Formación, comunicación y estrategia para transformar organizaciones
          </h2>
          <a href="#contacto" class="qh__cta">
            <span class="qh__cta-label">Hablemos</span>
            <span class="qh__cta-icon" aria-hidden="true">
              <i class="pi pi-arrow-right"></i>
            </span>
          </a>
        </div>

        <div class="qh__list-col" data-reveal>
          <div class="qh__list" role="list">
            <article v-for="row in rows" :key="row.id" class="qh-item" data-reveal role="listitem">
              <div class="qh-item__head">
                <span class="qh-item__badge">{{ row.badge }}</span>
                <h3 class="qh-item__title">{{ row.title }}</h3>
              </div>
              <p class="qh-item__detail">{{ row.detail }}</p>
            </article>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import pilarBg from '../assets/imagenServicio4.png'
import { useScrollReveal } from '../composables/useScrollReveal'

const { sectionRef } = useScrollReveal()

const rows = [
  {
    id: 'formacion',
    badge: '01',
    title: 'Formación',
    detail:
      'Programas en sostenibilidad, inteligencia artificial, innovación y reconversión para líderes, equipos y comunidades.',
  },
  {
    id: 'comunicacion',
    badge: '02',
    title: 'Comunicación estratégica',
    detail:
      'Narrativas, posicionamiento, campañas y comunicación institucional para acompañar procesos de crecimiento y cambio.',
  },
  {
    id: 'estrategia',
    badge: '03',
    title: 'Estrategia y transformación',
    detail:
      'Diseño de agendas, proyectos e iniciativas para modernizar organizaciones y generar impacto real.',
  },
]
</script>

<style scoped>
.qh {
  --qh-ink: #ffffff;
  --qh-muted: rgba(255, 255, 255, 0.88);
  --qh-line: rgba(255, 255, 255, 0.22);
  --qh-year-bg: rgba(255, 255, 255, 0.14);

  position: relative;
  isolation: isolate;
  background: #151816;
  color: var(--qh-ink);
  box-sizing: border-box;
  overflow-x: clip;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.qh__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.qh__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

.qh__bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    linear-gradient(
      105deg,
      rgba(15, 22, 18, 0.58) 0%,
      rgba(15, 22, 18, 0.38) 48%,
      rgba(15, 22, 18, 0.52) 100%
    ),
    linear-gradient(to top, rgba(12, 18, 15, 0.72) 0%, transparent 52%);
}

/* Oscurece desde el borde derecho hacia el centro (debajo del contenido, z-index < shell) */
.qh__side-veil {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 24%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to left,
    rgba(0, 0, 0, 0.82) 0%,
    rgba(0, 0, 0, 0.5) 38%,
    rgba(0, 0, 0, 0.18) 68%,
    transparent 100%
  );
}

.qh__shell {
  position: relative;
  z-index: 2;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: clamp(1.35rem, 4vw, 2.5rem) var(--section-pad-x);
  box-sizing: border-box;
  min-width: 0;
}

.qh__layout {
  display: flex;
  flex-direction: column;
  gap: clamp(1.75rem, 4vw, 2.35rem);
  width: 100%;
}

.qh__intro-col {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}

.qh__list-col {
  position: relative;
  z-index: 0;
  min-width: 0;
}

@media (min-width: 961px) {
  .qh__shell {
    justify-content: center;
    padding-top: clamp(1rem, 3vh, 1.75rem);
    padding-bottom: clamp(1rem, 3vh, 1.75rem);
  }

  .qh__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: clamp(1.75rem, 4.5vw, 3.5rem);
    align-items: center;
  }

  .qh__list-col {
    padding-left: clamp(1rem, 2.5vw, 1.75rem);
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .qh__title {
    max-width: min(19rem, 100%);
    font-size: clamp(1.65rem, 3.2vw, 2.65rem);
  }
}

.qh__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(0.75rem, 1.8vw, 1rem);
}

.qh__brand-mark {
  position: relative;
  display: block;
  width: 0.875rem;
  height: 0.625rem;
  border: 1.5px solid var(--qh-ink);
  border-radius: 3px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.qh__brand-mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--qh-ink);
  transform: translate(-50%, -50%);
}

.qh__brand-text {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--qh-ink);
}

.qh__title {
  margin: 0;
  max-width: min(22rem, 100%);
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4.2vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.12;
  color: var(--qh-ink);
}

.qh__cta {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  margin-top: clamp(1.15rem, 2.4vw, 1.75rem);
  text-decoration: none;
  color: var(--qh-ink);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.09);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 0.35rem 0.35rem 0.35rem 1.1rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.01em;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.qh__cta:hover {
  border-color: rgba(255, 255, 255, 0.52);
  background: rgba(255, 255, 255, 0.14);
}

.qh__cta-label {
  padding-right: 0.65rem;
}

.qh__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 6px;
  background: #ffffff;
  color: var(--brand-01);
}

.qh__cta-icon .pi {
  font-size: 0.7rem;
}

.qh__list {
  display: flex;
  flex-direction: column;
  gap: clamp(1.35rem, 2.8vw, 1.85rem);
}

.qh-item {
  margin: 0;
  padding: 0;
  padding-bottom: clamp(1.25rem, 2.5vw, 1.65rem);
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
}

.qh-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.qh-item__head {
  display: flex;
  align-items: baseline;
  gap: clamp(0.75rem, 2vw, 1.15rem);
  margin-bottom: clamp(0.55rem, 1.2vw, 0.75rem);
}

.qh-item__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding: 0.35rem 0.5rem;
  border-radius: 8px;
  background: var(--qh-year-bg);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.82);
  font-variant-numeric: tabular-nums;
}

.qh-item__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.05rem, 1.75vw, 1.3rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: -0.02em;
  line-height: 1.22;
  color: var(--qh-ink);
}

.qh-item__detail {
  margin: 0;
  padding-left: calc(3rem + clamp(0.75rem, 2vw, 1.15rem));
  max-width: 36rem;
  font-family: var(--font-body);
  font-size: clamp(0.875rem, 1.2vw, 0.96875rem);
  font-weight: var(--font-w-regular);
  line-height: 1.62;
  color: var(--qh-muted);
}

@media (max-width: 960px) {
  .qh {
    min-height: 0;
    display: block;
  }

  .qh__side-veil {
    left: 0;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      transparent 18%,
      rgba(0, 0, 0, 0.38) 52%,
      rgba(0, 0, 0, 0.72) 100%
    );
  }

  .qh__shell {
    flex: none;
    padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  }

  .qh__layout {
    gap: clamp(1.5rem, 3.5vw, 2rem);
  }

  .qh__list-col {
    padding-left: 0;
  }

  .qh__title {
    max-width: min(22rem, 100%);
    font-size: clamp(1.85rem, 4.2vw, 3rem);
  }

  .qh-item__detail {
    padding-left: 0;
    max-width: none;
  }

  .qh-item__head {
    flex-wrap: wrap;
  }
}

</style>
