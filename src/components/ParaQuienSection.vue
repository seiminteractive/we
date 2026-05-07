<template>
  <section id="para-quien" ref="sectionRef" class="para" aria-labelledby="para-intro-heading">
    <div class="para__wash" aria-hidden="true" />
    <div class="para__glow para__glow--a" aria-hidden="true" />
    <div class="para__glow para__glow--b" aria-hidden="true" />
    <div class="para__grain" aria-hidden="true" />
    <div class="para__edge" aria-hidden="true" />

    <div class="para__shell">
      <header class="para__header" data-reveal>
        <div class="para__brand">
          <span class="para__brand-pill" aria-hidden="true" />
          <span class="para__brand-text">PARA QUIÉN</span>
        </div>
        <div class="para__headlines">
          <h2 id="para-intro-heading" class="para__intro">Trabajamos con</h2>
          <p class="para__deck">
            Diseñamos propuestas adaptadas a cada tipo de organización, entendiendo sus dinámicas,
            desafíos y oportunidades.
          </p>
        </div>
      </header>

      <ul class="para__audiences" role="list">
        <li v-for="item in audiences" :key="item.ix" class="para__audience" data-reveal>
          <article class="para__audience-card" tabindex="0">
            <div class="para__audience-media" aria-hidden="true">
              <img :src="item.image" alt="" class="para__audience-img" loading="lazy" />
            </div>
            <div class="para__audience-overlay" aria-hidden="true" />
            <div class="para__audience-inner">
              <span class="para__audience-ix" aria-hidden="true">{{ item.ix }}</span>
              <span class="para__audience-label">{{ item.label }}</span>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import imgEmpresas from '../assets/empresas.jpeg'
import imgGobiernos from '../assets/gobiernos.jpeg'
import imgOrganizaciones from '../assets/organizaciones.jpeg'
import { useScrollReveal } from '../composables/useScrollReveal'

const { sectionRef } = useScrollReveal()

const audiences = [
  { ix: '01', label: 'Empresas', image: imgEmpresas },
  { ix: '02', label: 'Gobiernos', image: imgGobiernos },
  { ix: '03', label: 'Organizaciones', image: imgOrganizaciones },
]
</script>

<style scoped>
.para {
  --ink: var(--brand-01);
  --surface: var(--section-bg);

  position: relative;
  color: var(--ink);
  box-sizing: border-box;
  overflow-x: clip;
  background: var(--surface);
}

.para__wash {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: transparent;
}

.para__glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(72px);
  opacity: 0;
}

/* Acentos solo con paleta marca: crema + coral suave */
.para__glow--a {
  width: min(42vw, 28rem);
  height: min(42vw, 28rem);
  top: -18%;
  right: -8%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--brand-06) 55%, transparent) 0%,
    transparent 68%
  );
}

.para__glow--b {
  width: min(36vw, 22rem);
  height: min(36vw, 22rem);
  bottom: -25%;
  left: 5%;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--brand-07) 22%, transparent) 0%,
    transparent 70%
  );
}

.para__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.11;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 80px 80px;
  mix-blend-mode: multiply;
}

.para__edge {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: none;
}

.para__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x);
  box-sizing: border-box;
  min-width: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 4vw, 2.85rem);
  align-items: start;
}

.para__header {
  display: flex;
  flex-direction: column;
  gap: clamp(1.15rem, 2.5vw, 1.65rem);
  max-width: min(46rem, 100%);
  min-width: 0;
}

.para__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.para__brand-pill {
  display: block;
  width: 1.375rem;
  height: 0.5rem;
  border-radius: 999px;
  background: var(--brand-01);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(21, 21, 22, 0.12);
}

.para__brand-text {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  white-space: nowrap;
}

.para__headlines {
  display: flex;
  flex-direction: column;
  gap: clamp(0.65rem, 1.4vw, 0.95rem);
}

.para__intro {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.35rem, 2.65vw, 2.05rem);
  font-weight: var(--font-w-semibold);
  letter-spacing: -0.028em;
  line-height: 1.12;
  color: var(--brand-01);
  text-wrap: balance;
}

.para__deck {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.98rem, 1.35vw, 1.125rem);
  font-weight: var(--font-w-regular);
  line-height: 1.58;
  letter-spacing: -0.012em;
  color: color-mix(in srgb, var(--brand-01) 72%, transparent);
  max-width: min(38rem, 100%);
  text-wrap: pretty;
}

.para__audiences {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(0.75rem, 1.65vw, 1.15rem);
  align-items: stretch;
  min-width: 0;
}

.para__audience {
  margin: 0;
  min-width: 0;
  display: flex;
}

.para__audience-card {
  flex: 1;
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: clamp(12px, 1.8vw, 18px);
  min-height: clamp(240px, 32vw, 380px);
  border: 1px solid color-mix(in srgb, var(--brand-01) 12%, transparent);
  box-shadow:
    0 18px 42px rgba(21, 21, 22, 0.1),
    0 6px 16px rgba(21, 21, 22, 0.05);
  outline: none;
  transition:
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.3s ease;
}

.para__audience-media {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.para__audience-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: scale(1.001);
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__audience-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    185deg,
    rgba(21, 21, 22, 0.12) 0%,
    transparent 38%,
    rgba(21, 21, 22, 0.38) 68%,
    rgba(21, 21, 22, 0.88) 100%
  );
}

.para__audience-inner {
  position: relative;
  z-index: 2;
  min-height: clamp(240px, 32vw, 380px);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: clamp(1rem, 2.2vw, 1.45rem) clamp(1rem, 2.2vw, 1.35rem);
  gap: 0.4rem;
  box-sizing: border-box;
}

.para__audience-card:hover,
.para__audience-card:focus-visible {
  transform: translateY(-6px);
  border-color: color-mix(in srgb, var(--brand-07) 35%, var(--brand-01) 65%);
  box-shadow:
    0 26px 52px rgba(21, 21, 22, 0.14),
    0 10px 24px rgba(21, 21, 22, 0.07),
    0 0 0 1px color-mix(in srgb, var(--brand-07) 14%, transparent);
}

.para__audience-card:hover .para__audience-img,
.para__audience-card:focus-visible .para__audience-img {
  transform: scale(1.07);
}

.para__audience-ix {
  display: block;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.35rem, 2.2vw, 1.75rem);
  font-weight: 200;
  line-height: 0.95;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.72);
  transition: color 0.28s ease;
}

.para__audience-card:hover .para__audience-ix,
.para__audience-card:focus-visible .para__audience-ix {
  color: rgba(255, 255, 255, 0.92);
}

.para__audience-label {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(1.05rem, 1.65vw, 1.42rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: #fff;
  overflow-wrap: break-word;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.35);
  transition: color 0.28s ease, transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__audience-card:hover .para__audience-label,
.para__audience-card:focus-visible .para__audience-label {
  color: #fff;
  transform: translateY(-1px);
}

@media (max-width: 960px) {
  .para__shell {
    gap: clamp(1.65rem, 3.5vw, 2rem);
  }

  .para__header {
    gap: clamp(1rem, 2.2vw, 1.35rem);
    max-width: none;
  }

  .para__deck {
    max-width: none;
  }

  .para__audiences {
    grid-template-columns: 1fr;
    gap: clamp(0.85rem, 2vw, 1rem);
  }

  .para__audience-card {
    min-height: clamp(200px, 42vw, 260px);
  }

  .para__audience-inner {
    min-height: clamp(200px, 42vw, 260px);
  }
}

@supports not (color: color-mix(in srgb, white 50%, black)) {
  .para__wash {
    background: transparent;
  }

  .para__glow--a {
    background: radial-gradient(circle, rgba(239, 219, 180, 0.38) 0%, transparent 68%);
  }

  .para__glow--b {
    background: radial-gradient(circle, rgba(218, 89, 51, 0.12) 0%, transparent 70%);
  }

  .para__audience-card:hover .para__audience-ix,
  .para__audience-card:focus-visible .para__audience-ix {
    color: rgba(255, 255, 255, 0.95);
  }

  .para__deck {
    color: rgba(21, 21, 22, 0.72);
  }
}
</style>
