<template>
  <section id="para-quien" ref="sectionRef" class="para" aria-labelledby="para-intro-heading">
    <div class="para__wash" aria-hidden="true" />
    <div class="para__glow para__glow--a" aria-hidden="true" />
    <div class="para__glow para__glow--b" aria-hidden="true" />
    <div class="para__grain" aria-hidden="true" />
    <div class="para__edge" aria-hidden="true" />

    <div class="para__shell">
      <div class="para__col para__col--meta" data-reveal>
        <div class="para__brand">
          <span class="para__brand-pill" aria-hidden="true" />
          <span class="para__brand-text">PARA QUIÉN</span>
        </div>
        <h2 id="para-intro-heading" class="para__intro">Trabajamos con</h2>
      </div>

      <ul class="para__audiences" role="list">
        <li class="para__audience" data-reveal>
          <span class="para__audience-ix" aria-hidden="true">01</span>
          <span class="para__audience-label">Empresas</span>
        </li>
        <li class="para__audience" data-reveal>
          <span class="para__audience-ix" aria-hidden="true">02</span>
          <span class="para__audience-label">Gobiernos</span>
        </li>
        <li class="para__audience" data-reveal>
          <span class="para__audience-ix" aria-hidden="true">03</span>
          <span class="para__audience-label">Organizaciones</span>
        </li>
      </ul>

      <div class="para__col para__col--lead" data-reveal>
        <span class="para__lead-rule" aria-hidden="true" />
        <p class="para__lead">
          Diseñamos propuestas adaptadas a cada tipo de organización, entendiendo sus dinámicas,
          desafíos y oportunidades.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'

const { sectionRef } = useScrollReveal()
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
  grid-template-columns: minmax(0, 10.5rem) minmax(0, 1.7fr) minmax(0, min(22rem, 30vw));
  gap: clamp(1.75rem, 3.5vw, 3rem);
  align-items: center;
}

.para__col--meta {
  display: flex;
  flex-direction: column;
  gap: clamp(0.65rem, 1.5vw, 0.95rem);
  padding-right: clamp(0.5rem, 2vw, 1rem);
  border-right: 1px solid color-mix(in srgb, var(--brand-01) 9%, transparent);
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

.para__intro {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(0.92rem, 1.2vw, 1.08rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.22;
  color: var(--brand-01);
  text-wrap: balance;
}

.para__audiences {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  column-gap: clamp(2rem, 5vw, 3.5rem);
  row-gap: 0;
  align-items: start;
  min-width: 0;
}

/* Sin cards: hueco amplio entre columnas para que no se superpongan los títulos */
.para__audience {
  position: relative;
  margin: 0;
  min-width: 0;
  padding: 0.15rem 0 0.35rem;
  border-right: 1px solid color-mix(in srgb, var(--brand-01) 8%, transparent);
}

.para__audience:last-child {
  border-right: none;
}

.para__audience::after {
  content: '';
  display: block;
  height: 2px;
  margin-top: 0.65rem;
  max-width: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--brand-07) 0%, var(--brand-01) 100%);
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.para__audience:hover::after,
.para__audience:focus-within::after {
  transform: scaleX(1);
}

.para__audience-ix {
  display: block;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.55rem);
  font-weight: 200;
  line-height: 0.95;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--brand-04);
  margin-bottom: 0.35rem;
  transition: color 0.25s ease;
}

.para__audience:hover .para__audience-ix,
.para__audience:focus-within .para__audience-ix {
  color: color-mix(in srgb, var(--brand-05) 65%, var(--brand-04));
}

.para__audience-label {
  display: block;
  font-family: var(--font-heading);
  font-size: clamp(1rem, 1.55vw, 1.35rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.18;
  color: var(--brand-01);
  overflow-wrap: break-word;
  transition: color 0.25s ease;
}

.para__audience:hover .para__audience-label,
.para__audience:focus-within .para__audience-label {
  color: var(--brand-05);
}

.para__col--lead {
  display: flex;
  align-items: flex-start;
  gap: clamp(1rem, 2vw, 1.35rem);
  min-width: 0;
  padding-left: clamp(0.25rem, 1vw, 0.5rem);
}

.para__lead-rule {
  flex-shrink: 0;
  width: 3px;
  margin-top: 0.35em;
  min-height: 3.25rem;
  border-radius: 999px;
  background: linear-gradient(
    180deg,
    var(--brand-07) 0%,
    color-mix(in srgb, var(--brand-07) 35%, transparent) 55%,
    color-mix(in srgb, var(--brand-01) 12%, transparent) 100%
  );
  box-shadow: 0 0 14px color-mix(in srgb, var(--brand-07) 22%, transparent);
}

.para__lead {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.9rem, 1.25vw, 1.05rem);
  font-weight: var(--font-w-regular);
  line-height: 1.55;
  letter-spacing: -0.01em;
  color: color-mix(in srgb, var(--brand-01) 82%, transparent);
}

@media (max-width: 960px) {
  .para__shell {
    grid-template-columns: 1fr;
    gap: clamp(1.35rem, 3vw, 1.75rem);
    align-items: stretch;
  }

  .para__col--meta {
    border-right: none;
    padding-right: 0;
    padding-bottom: clamp(0.75rem, 2vw, 1rem);
    border-bottom: 1px solid color-mix(in srgb, var(--brand-01) 8%, transparent);
  }

  .para__audiences {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .para__audience {
    border-right: none;
    padding: clamp(0.85rem, 2vh, 1rem) 0;
    border-bottom: 1px solid color-mix(in srgb, var(--brand-01) 7%, transparent);
  }

  .para__audience:last-child {
    border-bottom: none;
    padding-bottom: 0.15rem;
  }

  .para__col--lead {
    padding-left: 0;
    padding-top: clamp(0.35rem, 1vw, 0.5rem);
    border-top: 1px solid color-mix(in srgb, var(--brand-01) 6%, transparent);
  }

  .para__lead-rule {
    min-height: 2.5rem;
  }
}

@media (min-width: 961px) and (max-width: 1100px) {
  .para__shell {
    grid-template-columns: minmax(0, 10rem) minmax(0, 1.35fr) minmax(0, 18rem);
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

  .para__col--meta {
    border-right-color: rgba(21, 21, 22, 0.08);
  }

  .para__audience {
    border-right-color: rgba(21, 21, 22, 0.08);
  }

  .para__audience:hover .para__audience-ix,
  .para__audience:focus-within .para__audience-ix {
    color: #8a8a8a;
  }

  .para__lead {
    color: rgba(21, 21, 22, 0.82);
  }

  .para__lead-rule {
    background: linear-gradient(180deg, var(--brand-07) 0%, rgba(218, 89, 51, 0.28) 55%, rgba(21, 21, 22, 0.1) 100%);
    box-shadow: 0 0 14px rgba(218, 89, 51, 0.14);
  }
}
</style>
