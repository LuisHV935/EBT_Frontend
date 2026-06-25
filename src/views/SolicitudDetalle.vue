<template>
  <div class="max-w-2xl">
    <div class="mb-6">
      <router-link to="/mis-solicitudes" class="text-sm text-stone-500 hover:text-stone-700 transition-colors">
        &larr; Mis solicitudes
      </router-link>
    </div>

    <div v-if="loading" class="text-stone-400 text-sm py-12 text-center">Cargando...</div>

    <div v-else-if="!solicitud" class="border border-stone-200 rounded-lg p-12 text-center bg-white">
      <p class="text-stone-400">Solicitud no encontrada.</p>
    </div>

    <div v-else class="border border-stone-200 rounded-lg bg-white">
      <div class="p-6 border-b border-stone-100">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-light text-stone-800">{{ etiqueta(solicitud.serviceType) }}</h1>
          <span class="text-sm font-medium px-3 py-1 rounded"
            :class="{
              'bg-blue-50 text-blue-700': solicitud.status === 'NUEVA',
              'bg-yellow-50 text-yellow-700': solicitud.status === 'CONTACTADA',
              'bg-green-50 text-green-700': solicitud.status === 'CONCRETADA',
              'bg-red-50 text-red-700': solicitud.status === 'DESCARTADA',
              'bg-stone-50 text-stone-600': !['NUEVA','CONTACTADA','CONCRETADA','DESCARTADA'].includes(solicitud.status)
            }">{{ solicitud.status }}</span>
        </div>
        <dl class="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Contacto</dt>
            <dd class="text-stone-700 mt-0.5">{{ solicitud.nombreContacto }}</dd>
          </div>
          <div>
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Correo</dt>
            <dd class="text-stone-700 mt-0.5">{{ solicitud.email }}</dd>
          </div>
          <div v-if="solicitud.telefono">
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Teléfono</dt>
            <dd class="text-stone-700 mt-0.5">{{ solicitud.telefono }}</dd>
          </div>
          <div>
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Personas</dt>
            <dd class="text-stone-700 mt-0.5">{{ solicitud.numberOfPeople }}</dd>
          </div>
          <div v-if="solicitud.eventDate">
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Fecha del evento</dt>
            <dd class="text-stone-700 mt-0.5">{{ solicitud.eventDate }}</dd>
          </div>
          <div>
            <dt class="text-stone-400 text-xs uppercase tracking-wider">Creada</dt>
            <dd class="text-stone-700 mt-0.5">{{ formatDate(solicitud.createdAt) }}</dd>
          </div>
        </dl>
      </div>

      <div v-if="solicitud.serviceType === 'TAQUIZA' && solicitud.selectedGuisados?.length" class="p-6 border-b border-stone-100">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider mb-3">Guisados seleccionados</h2>
        <div class="flex flex-wrap gap-2">
          <span v-for="g in solicitud.selectedGuisados" :key="g.id"
            class="text-sm bg-stone-100 text-stone-700 px-3 py-1 rounded-md">{{ g.nombre }}</span>
        </div>
      </div>

      <div v-if="solicitud.serviceType !== 'TAQUIZA'" class="p-6 border-b border-stone-100">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider mb-3">Menú seleccionado</h2>
        <dl class="space-y-2 text-sm">
          <div v-if="solicitud.selectedCrema" class="flex gap-2">
            <dt class="text-stone-400 w-24">Crema:</dt>
            <dd class="text-stone-700">{{ solicitud.selectedCrema.nombre }}</dd>
          </div>
          <div v-if="solicitud.selectedPasta" class="flex gap-2">
            <dt class="text-stone-400 w-24">Pasta:</dt>
            <dd class="text-stone-700">{{ solicitud.selectedPasta.nombre }}</dd>
          </div>
          <div v-if="solicitud.selectedPlatoFuerte" class="flex gap-2">
            <dt class="text-stone-400 w-24">Plato fuerte:</dt>
            <dd class="text-stone-700">{{ solicitud.selectedPlatoFuerte.nombre }}</dd>
          </div>
          <div v-if="solicitud.selectedEnsalada" class="flex gap-2">
            <dt class="text-stone-400 w-24">Ensalada:</dt>
            <dd class="text-stone-700">{{ solicitud.selectedEnsalada.nombre }}</dd>
          </div>
          <div v-if="solicitud.selectedGuarnicion" class="flex gap-2">
            <dt class="text-stone-400 w-24">Guarnición:</dt>
            <dd class="text-stone-700">{{ solicitud.selectedGuarnicion.nombre }}</dd>
          </div>
          <div v-if="solicitud.selectedSalsa" class="flex gap-2">
            <dt class="text-stone-400 w-24">Salsa:</dt>
            <dd class="text-stone-700">{{ solicitud.selectedSalsa.nombre }}</dd>
          </div>
          <div v-if="solicitud.includesTableware" class="flex gap-2">
            <dt class="text-stone-400 w-24">Loza:</dt>
            <dd class="text-stone-700">Incluye loza, vasos y cubiertos</dd>
          </div>
        </dl>
      </div>

      <div v-if="solicitud.comentarios" class="p-6 border-b border-stone-100">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider mb-2">Comentarios</h2>
        <p class="text-sm text-stone-600 whitespace-pre-wrap">{{ solicitud.comentarios }}</p>
      </div>

      <div v-if="solicitud.aguaFrescaVariety" class="p-6">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider mb-2">Agua fresca</h2>
        <p class="text-sm text-stone-600">{{ solicitud.aguaFrescaVariety }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api.js'

const route = useRoute()
const router = useRouter()
const solicitud = ref(null)
const loading = ref(true)

function etiqueta(tipo) {
  return { TAQUIZA: 'Taquiza', TRES_TIEMPOS: 'Tres tiempos', PLATO_VOLADO: 'Plato volado' }[tipo] || tipo
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  try {
    const { data } = await api.get(`/cliente/solicitudes`)
    solicitud.value = data.find(s => s.id === Number(route.params.id)) || null
  } catch {
    router.push('/login')
  }
  loading.value = false
})
</script>
