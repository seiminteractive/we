<template>
  <div class="login">
    <form class="login__card" @submit.prevent="onSubmit">
      <h1 class="login__brand">Admin</h1>
      <p class="login__sub">Ingresá con tu mail y contraseña.</p>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="field">
        <label class="field__label" for="email">Mail</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          class="field__input"
          autocomplete="email"
          required
        />
      </div>

      <div class="field">
        <label class="field__label" for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="field__input"
          autocomplete="current-password"
          required
        />
      </div>

      <button class="btn btn--primary login__btn" type="submit" :disabled="loading">
        {{ loading ? 'Ingresando…' : 'Ingresar' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { authErrorMessage, signInAdmin } from '../../lib/firebase'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await signInAdmin(email.value, password.value)
  } catch (err) {
    error.value = authErrorMessage(err?.code)
  } finally {
    loading.value = false
  }
}
</script>
