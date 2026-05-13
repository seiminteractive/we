<template>
  <section id="quienes-somos" ref="sectionRef" class="about" aria-labelledby="about-statement">
    <div class="about__grain" aria-hidden="true" />

    <div class="about__shell">
      <!-- Fila 1: 4 columnas (marca | 01 | 02 | 03). Fila 2: img | texto (span 2) | rail → 03 y rail misma columna -->
      <div class="about__matrix">
        <div class="about__slot about__slot--brand">
          <div class="about__brand" data-reveal>
            <span class="about__brand-pill" aria-hidden="true" />
            <span class="about__brand-text">QUÉ HACEMOS</span>
          </div>
        </div>

        <article class="about__slot about__slot--p1 about__pillar" data-reveal>
          <span class="about__pillar-num">01</span>
          <p class="about__pillar-desc">
            Formación y capacitación aplicada para equipos que lideran cambio real.
          </p>
        </article>

        <article class="about__slot about__slot--p2 about__pillar" data-reveal>
          <span class="about__pillar-num">02</span>
          <p class="about__pillar-desc">
            Comunicación estratégica alineada al propósito y la reputación.
          </p>
        </article>

        <article class="about__slot about__slot--p3 about__pillar" data-reveal>
          <span class="about__pillar-num">03</span>
          <p class="about__pillar-desc">
            Diseño de transformación: procesos, cultura y gobernanza con visión de futuro.
          </p>
        </article>

        <figure
          class="about__slot about__slot--imgL about__photo about__photo--left"
          data-reveal
        >
          <img :src="imgLeft" alt="" width="260" height="260" loading="lazy" />
        </figure>

        <div class="about__slot about__slot--core about__core" data-reveal>
          <p id="about-statement" class="about__statement">
            WE es una plataforma de formación, comunicación estratégica y diseño de transformación
            que acompaña a organizaciones en una nueva etapa: más tecnológica, más sostenible y más
            exigente en términos de liderazgo. No trabajamos desde lo teórico. Trabajamos desde lo
            aplicado, lo institucional y lo estratégico.
          </p>
          <a href="#" class="about__cta">
            <span class="about__cta-label">Conocer más</span>
            <span class="about__cta-icon" aria-hidden="true">
              <i class="pi pi-arrow-right"></i>
            </span>
          </a>
        </div>

        <div class="about__slot about__slot--rail about__rail" data-reveal>
          <div class="about__caption">
            <i class="pi pi-sun about__caption-ico" aria-hidden="true" />
            <p class="about__caption-text">
              La tecnología y la <strong>naturaleza</strong><br />
              en la restauración
            </p>
          </div>
          <figure class="about__photo about__photo--right">
            <img :src="imgRight" alt="" width="220" height="165" loading="lazy" />
          </figure>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
import imgLeft from '../assets/imagenAboutUno.png'
import imgRight from '../assets/imagenAboutDos.png'

const { sectionRef } = useScrollReveal()
</script>

<style scoped>
.about {
  --bg: var(--section-bg);
  --ink: #ffffff;
  --num: rgba(255, 255, 255, 0.88);
  --caption: rgba(255, 255, 255, 0.82);

  position: relative;
  height: 100vh;
  min-height: 100vh;
  max-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  box-sizing: border-box;
  overflow: hidden;
}

.about__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.2;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 80px 80px;
  mix-blend-mode: multiply;
}

.about__shell {
  position: relative;
  z-index: 1;
  height: 100%;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 0;
  min-height: 0;
}

/* Col 1 acotada: `auto` + PNG grande inflaba el track y dejaba las `fr` en ~0px. */
.about__matrix {
  flex: 1 1 auto;
  min-height: 0;
  min-width: 0;
  width: 100%;
  display: grid;
  grid-template-columns:
    minmax(0, clamp(10.5rem, 17vw, 15.75rem))
    minmax(0, 0.82fr)
    minmax(0, 1.02fr)
    minmax(0, 0.78fr);
  grid-template-rows: auto minmax(0, 1fr);
  column-gap: clamp(1.35rem, 3vw, 2.5rem);
  row-gap: clamp(4.5rem, 14vh, 9.5rem);
  align-items: stretch;
}

.about__slot--brand {
  grid-column: 1;
  grid-row: 1;
  min-width: 0;
  align-self: start;
  padding-top: 0.2rem;
}

.about__slot--p1 {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  align-self: start;
}

.about__slot--p2 {
  grid-column: 3;
  grid-row: 1;
  min-width: 0;
  align-self: start;
}

.about__slot--p3 {
  grid-column: 4;
  grid-row: 1;
  min-width: 0;
  align-self: start;
}

.about__slot--imgL {
  grid-column: 1;
  grid-row: 2;
  min-width: 0;
  align-self: start;
  /* margin, no padding: el fondo gris de .about__photo no debe verse “arriba” de la imagen */
  margin-top: clamp(0.45rem, 1.35vh, 0.95rem);
  padding: 0;
}

.about__slot--core {
  grid-column: 2 / span 2;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  align-self: start;
  display: flex;
}

.about__slot--rail {
  grid-column: 4;
  grid-row: 2;
  min-width: 0;
  min-height: 0;
  align-self: center;
  display: flex;
}

.about__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.about__brand-pill {
  display: block;
  width: 1.375rem;
  height: 0.5rem;
  border-radius: 999px;
  background: #fff;
  flex-shrink: 0;
}

.about__brand-text {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  white-space: nowrap;
}

.about__pillar {
  margin: 0;
  min-width: 0;
}

/* Números + Inter (peso más marcado que el hairline) */
.about__pillar-num {
  display: block;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: clamp(1.4rem, 2.15vw, 1.95rem);
  font-weight: 500;
  line-height: 0.95;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--num);
  margin-bottom: 0.45rem;
}

.about__pillar-desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: var(--font-w-medium);
  line-height: 1.5;
  color: #fff;
  max-width: 100%;
}

.about__photo {
  margin: 0;
  overflow: hidden;
  background: #e5e5e5;
  box-shadow: 0 20px 50px rgba(21, 21, 22, 0.08);
}

.about__photo img {
  min-width: 0;
  max-width: 100%;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.about__photo--left {
  width: 100%;
  max-width: 100%;
  aspect-ratio: 3 / 4;
  max-height: min(18rem, 38vh);
  height: auto;
  border-radius: 24px;
  margin: 0;
  display: block;
  overflow: hidden;
}

.about__core {
  width: 100%;
  max-width: min(34rem, 100%);
  justify-self: center;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  min-height: 0;
  padding-top: clamp(0.45rem, 1.35vh, 0.95rem);
}

.about__statement {
  width: 100%;
  margin: 0 0 clamp(1.25rem, 2.5vh, 1.75rem);
  font-family: var(--font-body);
  font-size: clamp(1.12rem, 1.95vw, 1.42rem);
  font-weight: var(--font-w-regular);
  line-height: 1.48;
  letter-spacing: -0.015em;
  color: var(--ink);
  text-align: left;
}

.about__cta {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  width: fit-content;
  max-width: 100%;
  text-decoration: none;
  color: #fff;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.15rem 0.15rem 0.15rem 1.35rem;
  font-family: var(--font-body);
  font-size: 0.625rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.about__cta:hover {
  border-color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.14);
}

.about__cta-label {
  padding-right: 0.75rem;
}

.about__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

.about__cta-icon .pi {
  font-size: 0.72rem;
}

/* Columna derecha: leyenda pegada a la foto; bloque un poco más arriba que el pie de celda */
.about__rail {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  flex: 0 1 auto;
  min-height: 0;
  gap: 0.55rem;
  margin-top: 0;
}

.about__caption {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.4rem;
  text-align: left;
}

.about__caption-ico {
  font-size: 0.8rem;
  color: #fff;
  opacity: 0.85;
  flex-shrink: 0;
  margin-top: 0.06rem;
}

.about__caption-text {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-light);
  line-height: 1.45;
  color: #fff;
}

.about__caption-text strong {
  font-weight: var(--font-w-semibold);
  color: #fff;
}

.about__photo--right {
  width: 100%;
  max-width: 100%;
  flex-shrink: 0;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
}

@media (max-height: 700px) {
  .about__shell {
    justify-content: flex-start;
    padding-top: clamp(1.5rem, 2.5vh, 2.25rem);
  }

  .about__matrix {
    flex: 1 1 auto;
    max-height: none;
  }

  .about__pillar-num {
    font-size: clamp(1.4rem, 2.2vw, 1.85rem);
    margin-bottom: 0.3rem;
  }

  .about__statement {
    font-size: 1.125rem;
    line-height: 1.42;
  }

  .about__photo--left {
    margin-top: clamp(0.5rem, 2vh, 1rem);
    max-height: min(15rem, 32vh);
  }
}

@media (max-width: 960px) {
  .about {
    height: auto;
    min-height: min(100vh, 100dvh);
    max-height: none;
    overflow-x: clip;
    overflow-y: visible;
  }

  .about__shell {
    padding-bottom: clamp(3.5rem, 7vw, 4.75rem);
    justify-content: flex-start;
    padding-top: clamp(3rem, 6vh, 4.5rem);
  }

  .about__matrix {
    flex: 1 0 auto;
    max-height: none;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    row-gap: clamp(2.75rem, 7vw, 4rem);
  }

  .about__slot--brand,
  .about__slot--p1,
  .about__slot--p2,
  .about__slot--p3,
  .about__slot--imgL,
  .about__slot--core,
  .about__slot--rail {
    grid-column: 1;
    grid-row: auto;
  }

  .about__photo--left {
    margin-top: 0;
    max-width: 14rem;
  }

  .about__core {
    max-width: none;
    justify-self: stretch;
  }

  .about__rail {
    margin-top: 0;
    max-width: 16rem;
    justify-content: flex-start;
    flex: 0 1 auto;
  }
}
</style>
