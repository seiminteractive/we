<template>
  <section
    id="que-hacemos"
    ref="sectionRef"
    class="qh"
    aria-labelledby="qh-heading"
    aria-label="Nuestros pilares"
  >
    <div class="qh__shell">
      <header class="qh__header">
        <div class="qh__intro" data-reveal>
          <div class="qh__brand">
            <span class="qh__brand-mark" aria-hidden="true" />
            <span class="qh__brand-text">NUESTROS PILARES</span>
          </div>
          <h2 id="qh-heading" class="qh__title">
            Formación, comunicación y estrategia para transformar organizaciones
          </h2>
        </div>
        <a href="#" class="qh__cta" data-reveal>
          <span class="qh__cta-label">Hablemos</span>
          <span class="qh__cta-icon" aria-hidden="true">
            <i class="pi pi-arrow-right"></i>
          </span>
        </a>
      </header>

      <div class="qh__list" role="list">
        <article
          v-for="row in rows"
          :key="row.id"
          class="qh-row"
          data-reveal
          :class="{ 'qh-row--open': openId === row.id }"
          role="listitem"
        >
          <button
            type="button"
            class="qh-row__trigger"
            :aria-expanded="openId === row.id"
            :aria-controls="`qh-panel-${row.id}`"
            :id="`qh-trigger-${row.id}`"
            @click="toggle(row.id)"
          >
            <div class="qh-row__left">
              <span class="qh-row__badge">{{ row.badge }}</span>
              <h3 class="qh-row__title">{{ row.title }}</h3>
            </div>
            <span class="qh-row__action" aria-hidden="true">
              <i class="pi pi-arrow-right"></i>
            </span>
          </button>

          <div
            :id="`qh-panel-${row.id}`"
            class="qh-row__panel"
            role="region"
            :aria-labelledby="`qh-trigger-${row.id}`"
          >
            <div class="qh-row__panel-inner">
              <p class="qh-row__detail">{{ row.detail }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const { sectionRef } = useScrollReveal()

const openId = ref(null)

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

function toggle(id) {
  openId.value = openId.value === id ? null : id
}
</script>

<style scoped>
.qh {
  --qh-bg: var(--section-bg);
  --qh-ink: #000000;
  --qh-muted: #666666;
  --qh-line: #e5e5e5;
  --qh-year-bg: #ebebeb;
  --qh-action-bg: #f0f0f0;

  position: relative;
  background: var(--qh-bg);
  color: var(--qh-ink);
  box-sizing: border-box;
  overflow-x: clip;
}

.qh__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  box-sizing: border-box;
  min-width: 0;
}

.qh__header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: clamp(2.25rem, 4.5vw, 3.25rem);
}

.qh__intro {
  flex: 1 1 min(100%, 40rem);
  min-width: 0;
}

.qh__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(0.75rem, 1.8vw, 1rem);
}

/* Icono tipo referencia: rectángulo redondeado con punto centrado */
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
  max-width: min(20rem, 100%);
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
  text-decoration: none;
  color: var(--qh-ink);
  border-radius: 8px;
  border: 1px solid var(--qh-line);
  background: #ffffff;
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
  border-color: #cfcfcf;
  background: #fafafa;
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
  background: var(--qh-ink);
  color: #fff;
}

.qh__cta-icon .pi {
  font-size: 0.7rem;
}

.qh__list {
  border-top: 1px solid var(--qh-line);
}

.qh-row {
  margin: 0;
  border-bottom: 1px solid var(--qh-line);
}

.qh-row__trigger {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: clamp(0.85rem, 2vw, 1.5rem);
  padding: clamp(1.5rem, 2.8vw, 2.15rem) 0;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;
  box-sizing: border-box;
  transition: background-color 0.35s ease;
}

.qh-row__trigger:hover {
  background-color: rgba(255, 255, 255, 0.45);
}

.qh-row__trigger:focus-visible {
  outline: 2px solid var(--brand-07);
  outline-offset: 2px;
}

.qh-row__left {
  display: flex;
  align-items: center;
  gap: clamp(0.85rem, 2vw, 1.35rem);
  flex: 1 1 auto;
  min-width: 0;
}

.qh-row__badge {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3.25rem;
  padding: 0.4rem 0.55rem;
  border-radius: 8px;
  background: var(--qh-year-bg);
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.02em;
  color: var(--qh-muted);
  font-variant-numeric: tabular-nums;
}

.qh-row__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1rem, 1.65vw, 1.25rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: -0.02em;
  line-height: 1.25;
  color: var(--qh-ink);
}

.qh-row__action {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 8px;
  border: 1px solid var(--qh-line);
  background: var(--qh-action-bg);
  color: var(--qh-ink);
  pointer-events: none;
  transition:
    background-color 0.35s cubic-bezier(0.33, 1, 0.68, 1),
    border-color 0.35s ease,
    transform 0.35s cubic-bezier(0.33, 1, 0.68, 1);
}

.qh-row__trigger:hover .qh-row__action {
  background: #e8e8e8;
  border-color: #dcdcdc;
}

.qh-row--open .qh-row__action {
  background: var(--qh-ink);
  border-color: var(--qh-ink);
  color: #fff;
}

.qh-row__action .pi {
  font-size: 0.75rem;
  transition: transform 0.5s cubic-bezier(0.33, 1, 0.68, 1);
}

.qh-row--open .qh-row__action .pi {
  transform: rotate(90deg);
}

.qh-row__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.55s cubic-bezier(0.33, 1, 0.68, 1);
}

.qh-row--open .qh-row__panel {
  grid-template-rows: 1fr;
}

.qh-row__panel-inner {
  min-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-8px);
  transition:
    opacity 0.45s cubic-bezier(0.33, 1, 0.68, 1) 0.04s,
    transform 0.55s cubic-bezier(0.33, 1, 0.68, 1) 0.02s;
}

.qh-row--open .qh-row__panel-inner {
  opacity: 1;
  transform: translateY(0);
}

.qh-row__detail {
  margin: 0;
  padding: 0 0 clamp(1.35rem, 2.5vw, 1.85rem);
  max-width: 52rem;
  font-family: var(--font-body);
  font-size: clamp(0.875rem, 1.15vw, 0.96875rem);
  font-weight: var(--font-w-regular);
  line-height: 1.6;
  color: var(--qh-muted);
}

@media (max-width: 780px) {
  .qh-row__trigger {
    flex-wrap: wrap;
  }

  .qh-row__left {
    flex: 1 1 calc(100% - 3.5rem);
  }

  .qh-row__action {
    margin-left: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .qh-row__panel,
  .qh-row__panel-inner,
  .qh-row__action .pi,
  .qh-row__trigger {
    transition-duration: 0.01ms;
  }
}
</style>