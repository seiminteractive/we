<template>
  <section id="contacto" ref="sectionRef" class="fcta" aria-labelledby="fcta-heading">
    <div class="fcta__grain" aria-hidden="true" />

    <div class="fcta__shell">
      <div class="fcta__layout">
        <figure class="fcta__media" data-reveal>
          <img
            :src="ctaImage"
            alt=""
            class="fcta__img"
            width="360"
            height="450"
            loading="lazy"
          />
        </figure>

        <div class="fcta__content" data-reveal>
          <div class="fcta__brand">
            <span class="fcta__brand-mark" aria-hidden="true" />
            <span class="fcta__brand-text">CONTACTO</span>
          </div>
          <h2 id="fcta-heading" class="fcta__title">
            Hablemos sobre la transformación de tu organización
          </h2>
          <p class="fcta__text">
            Si querés desarrollar capacidades, fortalecer tu comunicación o diseñar una estrategia
            para una nueva etapa, en WE podemos acompañarte.
          </p>
          <a href="#" class="fcta__cta">
            <span class="fcta__cta-label">Agendar reunión</span>
            <span class="fcta__cta-icon" aria-hidden="true">
              <i class="pi pi-arrow-right"></i>
            </span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
import imagenCta from '../assets/imagenCta.png'

const { sectionRef } = useScrollReveal()

const ctaImage = imagenCta
</script>

<style scoped>
.fcta {
  --fcta-bg: var(--section-bg);
  --fcta-ink: #ffffff;
  --fcta-muted: rgba(255, 255, 255, 0.88);
  --fcta-line: rgba(255, 255, 255, 0.55);

  position: relative;
  background: var(--fcta-bg);
  color: var(--fcta-ink);
  box-sizing: border-box;
  overflow-x: clip;
}

.fcta__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.32;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 80px 80px;
  mix-blend-mode: multiply;
}

.fcta__shell {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-y) var(--section-pad-x) var(--section-pad-y-after);
  box-sizing: border-box;
  min-width: 0;
}

.fcta__layout {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: clamp(1.75rem, 4.5vw, 3.25rem);
  width: 100%;
}

.fcta__media {
  margin: 0;
  flex: 0 0 auto;
  width: clamp(13.5rem, 28vw, 20rem);
  max-width: 100%;
}

.fcta__img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border-radius: clamp(18px, 2.2vw, 26px);
  border: none;
  background: #ebebeb;
  box-shadow: 0 16px 40px rgba(21, 21, 22, 0.07);
}

.fcta__content {
  flex: 1 1 0%;
  min-width: 0;
  max-width: min(34rem, 100%);
  margin-left: auto;
  text-align: left;
}

.fcta__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: clamp(0.75rem, 1.8vw, 1rem);
}

.fcta__brand-mark {
  position: relative;
  display: block;
  width: 0.875rem;
  height: 0.625rem;
  border: 1.5px solid var(--fcta-ink);
  border-radius: 3px;
  box-sizing: border-box;
  flex-shrink: 0;
}

.fcta__brand-mark::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--fcta-ink);
  transform: translate(-50%, -50%);
}

.fcta__brand-text {
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #fff;
}

.fcta__title {
  margin: 0 0 clamp(1rem, 2vw, 1.35rem);
  max-width: none;
  font-family: var(--font-heading);
  font-size: clamp(1.85rem, 4.2vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.12;
  color: #fff;
}

.fcta__text {
  margin: 0 0 clamp(1.5rem, 2.8vw, 2rem);
  max-width: none;
  font-family: var(--font-body);
  font-size: clamp(0.9375rem, 1.35vw, 1.0625rem);
  font-weight: var(--font-w-regular);
  line-height: 1.55;
  color: var(--fcta-muted);
}

.fcta__cta {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  border-radius: 8px;
  border: 1px solid var(--fcta-line);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.35rem 0.35rem 0.35rem 1.1rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: var(--font-w-medium);
  letter-spacing: 0.01em;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.fcta__cta:hover {
  border-color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.14);
}

.fcta__cta-label {
  padding-right: 0.65rem;
}

.fcta__cta-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.22);
  color: #fff;
}

.fcta__cta-icon .pi {
  font-size: 0.72rem;
}

@media (max-width: 720px) {
  .fcta__layout {
    flex-direction: column;
    align-items: stretch;
  }

  .fcta__media {
    width: min(17rem, 72%);
    align-self: center;
    order: -1;
  }

  .fcta__content {
    flex: none;
    width: 100%;
    max-width: none;
    margin-left: 0;
  }

  .fcta__cta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
