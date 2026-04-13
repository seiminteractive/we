<template>
  <section id="como-trabajamos" ref="sectionRef" class="cw" lang="es" aria-labelledby="cw-heading">
    <div class="cw__grain" aria-hidden="true" />

    <div class="cw__shell">
      <header class="cw__header" data-reveal>
        <div class="cw__brand">
          <span class="cw__brand-mark" aria-hidden="true" />
          <span class="cw__brand-text">CÓMO TRABAJAMOS</span>
        </div>
        <h2 id="cw-heading" class="cw__title">
          Un proceso ordenado, cercano y aplicado a tu realidad
        </h2>
      </header>

      <ol class="cw__timeline" role="list">
        <li v-for="(step, i) in steps" :key="step.id" class="cw__step" data-reveal>
          <div class="cw__step-track" aria-hidden="true">
            <span class="cw__node" />
          </div>
          <div class="cw__step-body">
            <span class="cw__ix">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="cw__step-title">{{ step.title }}</h3>
            <p class="cw__step-desc">{{ step.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'

const { sectionRef } = useScrollReveal()

const steps = [
  {
    id: 'diagnostico',
    title: 'Escuchamos y diagnosticamos',
    text: 'Entendemos el contexto, los desafíos y el momento de cada organización.',
  },
  {
    id: 'propuesta',
    title: 'Diseñamos una propuesta a medida',
    text: 'Adaptamos contenidos, estrategia y formato según el objetivo.',
  },
  {
    id: 'activamos',
    title: 'Activamos formación, comunicación o estrategia',
    text: 'Ponemos en marcha el trabajo con un enfoque aplicado y cercano.',
  },
  {
    id: 'acompanamos',
    title: 'Acompañamos el proceso de cambio',
    text: 'Buscamos que las ideas se conviertan en capacidades, posicionamiento y resultados.',
  },
]
</script>

<style scoped>
.cw {
  --cw-bg: var(--section-bg);
  --cw-ink: #151516;
  --cw-muted: #5a5a5a;
  --cw-line: #d8d8d8;

  position: relative;
  background: var(--cw-bg);
  color: var(--cw-ink);
  box-sizing: border-box;
  overflow-x: clip;
}

.cw__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.32;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 80px 80px;
  mix-blend-mode: multiply;
}

.cw__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  box-sizing: border-box;
  min-width: 0;
}

.cw__header {
  margin-bottom: clamp(3.25rem, 7vw, 4.75rem);
  max-width: min(42rem, 68%);
  padding-right: clamp(0.5rem, 3vw, 2rem);
}

.cw__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(1rem, 2.2vw, 1.35rem);
}

.cw__brand-mark {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  background: var(--cw-ink);
  flex-shrink: 0;
}

.cw__brand-text {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--cw-ink);
}

.cw__title {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.65rem, 3.5vw, 2.65rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.12;
  color: var(--cw-ink);
}

.cw__timeline {
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  column-gap: clamp(1.15rem, 2.4vw, 2rem);
  row-gap: 0;
  align-items: start;
  width: 100%;
  min-width: 0;
}

/* Línea horizontal completa, más presente */
.cw__timeline::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 0.5625rem;
  height: 2px;
  background: var(--cw-line);
  border-radius: 2px;
  pointer-events: none;
  opacity: 0.95;
}

.cw__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  min-width: 0;
  text-align: center;
}

.cw__step-track {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 1.125rem;
  flex-shrink: 0;
}

.cw__node {
  display: block;
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--cw-ink);
  flex-shrink: 0;
  box-shadow:
    0 0 0 4px var(--cw-bg),
    0 1px 3px rgba(21, 21, 22, 0.12);
  position: relative;
  z-index: 1;
}

.cw__step-body {
  min-width: 0;
  width: 100%;
  max-width: 16.5rem;
  margin: 0 auto;
  padding-top: clamp(1.15rem, 2.2vw, 1.65rem);
}

.cw__ix {
  display: block;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.2em;
  text-transform: none;
  color: #8a8a8a;
  margin-bottom: clamp(0.65rem, 1.4vw, 0.9rem);
  font-variant-numeric: tabular-nums;
}

.cw__step-title {
  margin: 0 0 clamp(0.65rem, 1.3vw, 0.95rem);
  font-family: var(--font-heading);
  font-size: clamp(0.95rem, 1.35vw, 1.2rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: -0.022em;
  line-height: 1.28;
  color: var(--cw-ink);
  text-wrap: balance;
}

.cw__step-desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 1.05vw, 0.9375rem);
  font-weight: var(--font-w-regular);
  line-height: 1.6;
  color: var(--cw-muted);
  text-wrap: balance;
  hyphens: auto;
}

@media (max-width: 720px) {
  .cw__header {
    max-width: 100%;
    margin-bottom: clamp(2.5rem, 6vw, 3.25rem);
  }

  .cw__timeline {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: clamp(1rem, 4vw, 1.35rem);
    row-gap: clamp(2rem, 5vw, 2.75rem);
  }

  .cw__timeline::before {
    display: none;
  }

  .cw__step {
    align-items: stretch;
    text-align: left;
    padding-top: 0;
    border-top: 2px solid var(--cw-line);
  }

  .cw__step-track {
    justify-content: flex-start;
    height: auto;
    padding-top: clamp(1.1rem, 2.5vw, 1.35rem);
    padding-bottom: 0.35rem;
  }

  .cw__node {
    box-shadow: 0 0 0 4px var(--cw-bg);
  }

  .cw__step-body {
    max-width: none;
    margin: 0;
    padding-top: 0;
  }

  .cw__ix {
    margin-bottom: 0.5rem;
    letter-spacing: 0.16em;
  }

  .cw__step-title {
    font-size: clamp(0.95rem, 3.6vw, 1.1rem);
    margin-bottom: 0.55rem;
  }

  .cw__step-desc {
    font-size: clamp(0.8125rem, 3.1vw, 0.9rem);
    line-height: 1.55;
  }
}
</style>
