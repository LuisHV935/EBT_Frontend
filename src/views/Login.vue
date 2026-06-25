<template>
  <div class="max-w-sm mx-auto mt-16">
    <h1 class="text-2xl font-light text-stone-800 mb-8 text-center">Iniciar sesión</h1>
    <form @submit.prevent="handleLogin" class="border border-stone-200 rounded-lg p-6 bg-white space-y-4">
      <div>
        <label class="block text-sm font-medium text-stone-600 mb-1">Usuario o correo</label>
        <input v-model="username" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow" autocomplete="username">
      </div>
      <div>
        <label class="block text-sm font-medium text-stone-600 mb-1">Contraseña</label>
        <input v-model="password" type="password" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow" autocomplete="current-password">
      </div>
      <button type="submit" :disabled="loading"
        class="w-full bg-stone-800 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
      <p v-if="error" class="text-red-600 text-xs text-center">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '../stores/auth.js'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    const data = await login(username.value, password.value)
    if (data.role === 'ADMIN' || data.role === 'USER') {
      router.push(route.query.redirect || '/admin')
    } else {
      router.push(route.query.redirect || '/mis-solicitudes')
    }
  } catch {
    error.value = 'Usuario o contraseña incorrectos'
  }
  loading.value = false
}
</script>
