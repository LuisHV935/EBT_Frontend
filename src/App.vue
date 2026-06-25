<template>
  <div class="min-h-screen bg-stone-50 text-stone-800">
    <Header />
    <main class="max-w-6xl mx-auto px-6 py-10">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Header from './components/Header.vue'
import { useAuth } from './stores/auth.js'

const { checkSession } = useAuth()

onMounted(() => {
  checkSession()
})
</script>
