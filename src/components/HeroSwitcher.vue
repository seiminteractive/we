<template>
  <Teleport to="body">
  <div class="heroSw" :class="{ 'heroSw--open': open }">
    <div v-if="open" class="heroSw__panel" role="dialog" aria-label="Elegir versión del Hero">
      <p class="heroSw__title">Elegí una propuesta de Hero</p>
      <div class="heroSw__options">
        <button
          v-for="opt in options"
          :key="opt.value"
          type="button"
          class="heroSw__option"
          :class="{ 'heroSw__option--active': modelValue === opt.value, 'heroSw__option--disabled': opt.disabled }"
          :disabled="opt.disabled"
          @click="select(opt.value)"
        >
          <span class="heroSw__option-num">0{{ opt.index }}</span>
          <span class="heroSw__option-body">
            <span class="heroSw__option-name">{{ opt.label }}</span>
            <span class="heroSw__option-desc">{{ opt.desc }}</span>
          </span>
          <span v-if="modelValue === opt.value" class="heroSw__option-check" aria-hidden="true">
            <i class="pi pi-check"></i>
          </span>
        </button>
      </div>
    </div>

    <button
      type="button"
      class="heroSw__fab"
      :aria-expanded="open"
      aria-label="Cambiar versión del Hero"
      @click="open = !open"
    >
      <i :class="['pi', open ? 'pi-times' : 'pi-th-large']" aria-hidden="true"></i>
      <span class="heroSw__fab-label">Hero {{ currentIndex }}/3</span>
    </button>
  </div>
  </Teleport>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])

const open = ref(false)

const options = [
  { value: 'minimal', index: 1, label: 'Centrado claro', desc: 'Composición central, fondo pastel' },
  { value: 'original', index: 2, label: 'Imagen inmersiva', desc: 'Foto de fondo + glass cards' },
  { value: 'editorial', index: 3, label: 'Editorial con stats', desc: 'Header en pills + stats abajo' },
]

const currentIndex = computed(() => {
  const found = options.find((o) => o.value === props.modelValue)
  return found ? found.index : 1
})

function select(value) {
  emit('update:modelValue', value)
  open.value = false
}
</script>

<style scoped>
.heroSw {
  position: fixed;
  right: clamp(1rem, 2vw, 1.5rem);
  bottom: clamp(1rem, 2vw, 1.5rem);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  font-family: var(--font-body, system-ui, sans-serif);
}

.heroSw__panel {
  width: min(20rem, 92vw);
  background: rgba(21, 21, 22, 0.92);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  padding: 1rem;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 8px 18px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  animation: heroSwIn 0.22s ease both;
}

@keyframes heroSwIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.heroSw__title {
  margin: 0 0 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  padding: 0 0.25rem;
}

.heroSw__options {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.heroSw__option {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0.7rem 0.85rem;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.heroSw__option:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.1);
}

.heroSw__option--active {
  background: rgba(33, 220, 153, 0.12);
  border-color: rgba(33, 220, 153, 0.4);
}

.heroSw__option--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.heroSw__option-num {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  min-width: 1.5rem;
}

.heroSw__option--active .heroSw__option-num {
  color: #21dc99;
}

.heroSw__option-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
  min-width: 0;
}

.heroSw__option-name {
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: -0.005em;
}

.heroSw__option-desc {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.35;
}

.heroSw__option-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.4rem;
  height: 1.4rem;
  border-radius: 50%;
  background: #21dc99;
  color: #151516;
}

.heroSw__option-check .pi {
  font-size: 0.7rem;
  font-weight: 700;
}

.heroSw__fab {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  background: #151516;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 999px;
  padding: 0.75rem 1.1rem 0.75rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  cursor: pointer;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28), 0 4px 10px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s ease, background 0.2s ease;
}

.heroSw__fab:hover {
  transform: translateY(-1px);
  background: #21dc99;
  color: #151516;
}

.heroSw__fab .pi {
  font-size: 0.95rem;
}

.heroSw__fab-label {
  font-variant-numeric: tabular-nums;
}

@media (max-width: 520px) {
  .heroSw__fab-label {
    display: none;
  }

  .heroSw__fab {
    padding: 0.75rem 0.9rem;
  }
}
</style>
