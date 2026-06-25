<template>
  <header class="bg-stone-900 border-b border-stone-700">
    <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <router-link to="/" class="text-xl font-semibold text-white tracking-tight">
        Catering<span class="text-amber-500">.</span>
      </router-link>
      <nav class="flex items-center gap-1">
        <router-link to="/"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="$route.path === '/' ? 'text-amber-400 bg-stone-800' : 'text-stone-300 hover:text-white hover:bg-stone-800'">
          Inicio
        </router-link>
        <router-link to="/catalogo"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="$route.path === '/catalogo' ? 'text-amber-400 bg-stone-800' : 'text-stone-300 hover:text-white hover:bg-stone-800'">
          Menú
        </router-link>
        <router-link to="/solicitar"
          class="px-3 py-1.5 text-sm rounded-md transition-colors"
          :class="$route.path === '/solicitar' ? 'text-amber-400 bg-stone-800' : 'text-stone-300 hover:text-white hover:bg-stone-800'">
          Cotizar
        </router-link>
        <template v-if="auth.role === 'ADMIN' || auth.role === 'USER'">
          <router-link to="/admin"
            class="px-3 py-1.5 text-sm rounded-md transition-colors"
            :class="$route.path.startsWith('/admin') ? 'text-amber-400 bg-stone-800' : 'text-stone-300 hover:text-white hover:bg-stone-800'">
            Admin
          </router-link>
        </template>
        <template v-if="auth.role === 'CLIENTE'">
          <router-link to="/mis-solicitudes"
            class="px-3 py-1.5 text-sm rounded-md transition-colors"
            :class="$route.path.startsWith('/mis-solicitudes') ? 'text-amber-400 bg-stone-800' : 'text-stone-300 hover:text-white hover:bg-stone-800'">
            Mis solicitudes
          </router-link>
        </template>
        <div v-if="auth.user" class="ml-4 pl-4 border-l border-stone-600 flex items-center gap-3">
          <span class="text-sm text-stone-400">{{ auth.user }}</span>
          <button @click="handleLogout" class="text-sm text-stone-400 hover:text-red-400 transition-colors">Salir</button>
        </div>
        <router-link v-else to="/login"
          class="ml-4 px-4 py-1.5 text-sm bg-amber-600 text-white rounded-md hover:bg-amber-500 transition-colors">
          Entrar
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useAuth } from '../stores/auth.js'
import { useRouter } from 'vue-router'

const { auth, logout } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/')
}
</script>
