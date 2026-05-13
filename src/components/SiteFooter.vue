<template>
  <footer ref="sectionRef" class="foot" aria-label="Pie de página">
    <div class="foot__grain" aria-hidden="true" />

    <div class="foot__shell">
      <div class="foot__grid">
        <div class="foot__col foot__col--brand" data-reveal>
          <a href="/" class="foot__brand">
            <img
              :src="logoBlanco"
              alt="WE Plus"
              class="foot__logo"
              width="120"
              height="32"
            />
          </a>
          <p class="foot__tagline">
            Formación, comunicación estratégica y diseño de transformación para organizaciones que
            lideran el cambio.
          </p>
        </div>

        <div class="foot__col" data-reveal>
          <h2 class="foot__heading">Explorar</h2>
          <ul class="foot__list" role="list">
            <li><a href="#quienes-somos" class="foot__link">Quiénes somos</a></li>
            <li><a href="#que-hacemos" class="foot__link">Qué hacemos</a></li>
            <li><a href="#servicios" class="foot__link">Servicios</a></li>
            <li><a href="#temas" class="foot__link">Temas</a></li>
          </ul>
        </div>

        <div class="foot__col" data-reveal>
          <h2 class="foot__heading">Más</h2>
          <ul class="foot__list" role="list">
            <li><a href="#para-quien" class="foot__link">Para quién</a></li>
            <li><a href="#como-trabajamos" class="foot__link">Cómo trabajamos</a></li>
            <li><a href="#contacto" class="foot__link">Contacto</a></li>
          </ul>
        </div>

        <div class="foot__col foot__col--contact" data-reveal>
          <h2 class="foot__heading">Escribinos</h2>
          <a href="mailto:hola@weplus.com" class="foot__mail">hola@weplus.com</a>
          <p class="foot__hint">Respondemos en breve para coordinar una primera conversación.</p>
          <div class="foot__social" aria-label="Redes sociales">
            <a href="#" class="foot__social-btn" aria-label="LinkedIn">
              <i class="pi pi-linkedin" aria-hidden="true"></i>
            </a>
            <a href="#" class="foot__social-btn" aria-label="Instagram">
              <i class="pi pi-instagram" aria-hidden="true"></i>
            </a>
            <a href="#" class="foot__social-btn" aria-label="YouTube">
              <i class="pi pi-youtube" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>

      <div class="foot__rule" aria-hidden="true" />

      <div class="foot__bar" data-reveal>
        <p class="foot__legal">© {{ year }} WE Plus. Todos los derechos reservados.</p>
        <div class="foot__legal-links">
          <a href="#" class="foot__legal-link">Política de privacidad</a>
          <span class="foot__dot" aria-hidden="true">·</span>
          <a href="#" class="foot__legal-link">Términos de uso</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useScrollReveal } from '../composables/useScrollReveal'
import logoBlanco from '../assets/logoBlanco.png'

const { sectionRef } = useScrollReveal()

const year = new Date().getFullYear()
</script>

<style scoped>
.foot {
  --foot-bg: transparent;
  --foot-ink: #000000;
  --foot-muted: #000000;
  --foot-line: #000000;

  position: relative;
  background: var(--foot-bg);
  color: var(--foot-muted);
  box-sizing: border-box;
  overflow-x: clip;
  border-top: 1px solid #000000;
}

.foot__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.22;
  background-image: url('https://grainy-gradients.vercel.app/noise.svg');
  background-repeat: repeat;
  background-size: 80px 80px;
  mix-blend-mode: multiply;
}

.foot__shell {
  position: relative;
  z-index: 1;
  max-width: var(--layout-content-max);
  margin: 0 auto;
  padding: var(--section-pad-footer-y) var(--section-pad-x)
    var(--section-pad-footer-y-bottom);
  box-sizing: border-box;
  min-width: 0;
}

.foot__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) repeat(3, minmax(0, 1fr));
  gap: clamp(1.75rem, 4vw, 2.75rem);
  align-items: start;
}

.foot__col--brand {
  padding-right: clamp(0.5rem, 2vw, 1.5rem);
}

.foot__brand {
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.foot__brand:hover {
  opacity: 0.82;
}

.foot__logo {
  display: block;
  height: clamp(1.35rem, 3vw, 1.6rem);
  width: auto;
  opacity: 0.98;
  filter: brightness(0) saturate(100%);
}

.foot__tagline {
  margin: 0;
  max-width: 22rem;
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: var(--font-w-regular);
  line-height: 1.55;
  color: var(--foot-muted);
}

.foot__heading {
  margin: 0 0 1rem;
  font-family: var(--font-body);
  font-size: 0.6875rem;
  font-weight: var(--font-w-semibold);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #000000;
}

.foot__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.foot__link {
  font-family: var(--font-body);
  font-size: 0.8125rem;
  font-weight: var(--font-w-medium);
  color: var(--foot-muted);
  text-decoration: none;
  letter-spacing: 0.01em;
  transition: color 0.2s ease;
}

.foot__link:hover {
  color: #000000;
}

.foot__col--contact .foot__mail {
  display: inline-block;
  margin-bottom: 0.65rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: var(--font-w-semibold);
  color: #000000;
  text-decoration: none;
  letter-spacing: 0.01em;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.foot__col--contact .foot__mail:hover {
  border-bottom-color: #000000;
}

.foot__hint {
  margin: 0 0 1.15rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-regular);
  line-height: 1.45;
  color: #000000;
  max-width: 16rem;
}

.foot__social {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.foot__social-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  border: 1px solid var(--foot-line);
  background: rgba(255, 255, 255, 0.08);
  color: #000000;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.foot__social-btn:hover {
  border-color: #000000;
  background: rgba(255, 255, 255, 0.16);
}

.foot__social-btn .pi {
  font-size: 0.85rem;
}

.foot__rule {
  height: 1px;
  background: var(--foot-line);
  margin: clamp(2rem, 4vw, 2.75rem) 0 clamp(1.25rem, 2.5vw, 1.75rem);
}

.foot__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem 1.5rem;
}

.foot__legal {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-regular);
  line-height: 1.45;
  color: #000000;
}

.foot__legal-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem 0.5rem;
}

.foot__dot {
  color: #000000;
  user-select: none;
}

.foot__legal-link {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: var(--font-w-medium);
  color: #000000;
  text-decoration: none;
  transition: color 0.2s ease;
}

.foot__legal-link:hover {
  color: #000000;
}

@media (max-width: 960px) {
  .foot__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .foot__col--brand {
    grid-column: 1 / -1;
    padding-right: 0;
  }
}

@media (max-width: 560px) {
  .foot__grid {
    grid-template-columns: 1fr;
  }

  .foot__bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
