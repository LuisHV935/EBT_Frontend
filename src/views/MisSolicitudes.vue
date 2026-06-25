<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-light text-stone-800 mb-1">Mis solicitudes</h1>
        <p class="text-sm text-stone-500">Historial de cotizaciones solicitadas.</p>
      </div>
      <router-link to="/solicitar" class="inline-block bg-stone-800 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition-colors">
        Nueva solicitud
      </router-link>
    </div>

    <div v-if="loading" class="text-stone-400 text-sm py-12 text-center">Cargando...</div>

    <div v-else-if="solicitudes.length === 0"
      class="border border-stone-200 rounded-lg p-12 text-center bg-white">
      <p class="text-stone-400 mb-4">Aún no tienes solicitudes.</p>
      <router-link to="/solicitar" class="inline-block bg-stone-800 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition-colors">
        Solicitar cotización
      </router-link>
    </div>

    <div v-else class="space-y-3">
      <div v-for="s in solicitudes" :key="s.id"
        class="border border-stone-200 rounded-lg p-5 bg-white hover:border-stone-300 transition-colors cursor-pointer"
        @click="$router.push(`/mis-solicitudes/${s.id}`)">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-3 mb-1">
              <h3 class="font-medium text-stone-800">{{ etiqueta(s.serviceType) }}</h3>
              <span class="text-xs font-medium px-2 py-0.5 rounded"
                :class="{
                  'bg-blue-50 text-blue-700': s.status === 'NUEVA',
                  'bg-yellow-50 text-yellow-700': s.status === 'CONTACTADA',
                  'bg-green-50 text-green-700': s.status === 'CONCRETADA',
                  'bg-red-50 text-red-700': s.status === 'DESCARTADA',
                  'bg-stone-100 text-stone-600': !['NUEVA','CONTACTADA','CONCRETADA','DESCARTADA'].includes(s.status)
                }">{{ s.status }}</span>
            </div>
            <p class="text-sm text-stone-500">{{ s.numberOfPeople }} personas</p>
            <p v-if="s.eventDate" class="text-sm text-stone-400">{{ s.eventDate }}</p>
          </div>
          <span class="text-xs text-stone-400">{{ formatDate(s.createdAt) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api.js'

const router = useRouter()
const solicitudes = ref([])
const loading = ref(true)

function etiqueta(tipo) {
  return { TAQUIZA: 'Taquiza', TRES_TIEMPOS: 'Tres tiempos', PLATO_VOLADO: 'Plato volado' }[tipo] || tipo
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })
}

onMounted(async () => {
  try {
    const { data } = await api.get('/cliente/solicitudes')
    solicitudes.value = data
  } catch {
    router.push('/login')
  }
  loading.value = false
})
</script>
