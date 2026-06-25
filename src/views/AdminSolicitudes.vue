<template>
  <div>
    <h1 class="text-2xl font-light text-stone-800 mb-6">Solicitudes</h1>

    <div v-if="loading" class="text-stone-400 text-sm py-8 text-center">Cargando...</div>

    <div v-else-if="errorMsg" class="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4 text-sm">{{ errorMsg }}</div>

    <div v-else-if="solicitudes.length === 0" class="border border-stone-200 rounded-lg p-8 text-center bg-white">
      <p class="text-stone-400">No hay solicitudes registradas.</p>
    </div>

    <div v-else class="border border-stone-200 rounded-lg overflow-hidden bg-white">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-stone-50 border-b border-stone-200">
            <th class="text-left px-4 py-3 font-medium text-stone-600">Contacto</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Servicio</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Personas</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Fecha</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Estado</th>
            <th class="text-right px-4 py-3 font-medium text-stone-600">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="s in solicitudes" :key="s.id" class="hover:bg-stone-50 transition-colors">
            <td class="px-4 py-3">
              <p class="text-stone-800 font-medium">{{ s.nombreContacto }}</p>
              <p class="text-stone-400 text-xs">{{ s.email }}</p>
            </td>
            <td class="px-4 py-3 text-stone-600">{{ etiqueta(s.serviceType) }}</td>
            <td class="px-4 py-3 text-stone-600">{{ s.numberOfPeople }}</td>
            <td class="px-4 py-3 text-stone-500 text-xs">{{ formatDate(s.createdAt) }}</td>
            <td class="px-4 py-3">
              <span class="text-xs font-medium px-2 py-0.5 rounded"
                :class="{
                  'bg-blue-50 text-blue-700': s.status === 'NUEVA',
                  'bg-yellow-50 text-yellow-700': s.status === 'CONTACTADA',
                  'bg-green-50 text-green-700': s.status === 'CONCRETADA',
                  'bg-red-50 text-red-700': s.status === 'DESCARTADA',
                  'bg-stone-50 text-stone-600': !['NUEVA','CONTACTADA','CONCRETADA','DESCARTADA'].includes(s.status)
                }">{{ s.status }}</span>
            </td>
            <td class="px-4 py-3 text-right">
              <router-link :to="`/admin/solicitudes/${s.id}`"
                class="text-stone-500 hover:text-stone-700 text-xs font-medium transition-colors">
                Detalle
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api.js'

const solicitudes = ref([])
const loading = ref(true)

function etiqueta(tipo) {
  return { TAQUIZA: 'Taquiza', TRES_TIEMPOS: 'Tres tiempos', PLATO_VOLADO: 'Plato volado' }[tipo] || tipo
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const errorMsg = ref('')

onMounted(async () => {
  try {
    const { data } = await api.get('/admin/solicitudes')
    solicitudes.value = data
    errorMsg.value = ''
  } catch (e) {
    errorMsg.value = 'Error al cargar solicitudes. ¿El backend está corriendo?'
  }
  loading.value = false
})
</script>
