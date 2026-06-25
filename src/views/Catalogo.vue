<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-light text-stone-800 mb-2">Menú</h1>
      <p class="text-stone-500 text-sm">Explora nuestras opciones de catering.</p>
    </div>

    <div v-if="loading" class="text-stone-400 text-sm">Cargando...</div>

    <div v-else class="space-y-10">
      <div v-for="s in catalogo.servicios" :key="s.tipo">
        <div class="border-b border-stone-200 pb-4 mb-6">
          <h2 class="text-2xl font-light text-stone-800">{{ etiqueta(s.tipo) }}</h2>
          <p class="text-sm text-stone-500 mt-1">{{ s.descripcion }}</p>
          <p class="text-xs text-amber-700 font-medium mt-1">{{ s.precioReferencia }}</p>
        </div>

        <div v-if="s.incluye" class="flex flex-wrap gap-2 mb-6">
          <span v-for="inc in s.incluye" :key="inc"
            class="text-xs bg-stone-100 text-stone-600 px-3 py-1 rounded-full">
            {{ inc }}
          </span>
        </div>

        <div v-for="cat in s.categorias" :key="cat.nombre" class="mb-5">
          <h3 class="text-sm font-medium text-stone-700 uppercase tracking-wider mb-2">{{ cat.nombre }}</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div v-for="item in cat.items" :key="item.id"
              class="border border-stone-200 rounded-md px-4 py-2.5 bg-white">
              <p class="text-sm text-stone-800">{{ item.nombre }}</p>
              <p v-if="item.descripcion" class="text-xs text-stone-400 mt-0.5">{{ item.descripcion }}</p>
            </div>
          </div>
        </div>

        <div v-if="s.tipo === 'TAQUIZA' && catalogo.salsas?.length" class="mt-6">
          <h3 class="text-sm font-medium text-stone-700 uppercase tracking-wider mb-2">Salsas</h3>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div v-for="salsa in catalogo.salsas" :key="salsa.id"
              class="border border-stone-200 rounded-md px-4 py-2.5 bg-white">
              <p class="text-sm text-stone-800">{{ salsa.nombre }}</p>
              <p v-if="salsa.tipo" class="text-xs text-stone-400 mt-0.5">Para: {{ salsa.tipo }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api.js'

const catalogo = ref({ servicios: [], salsas: [] })
const loading = ref(true)

function etiqueta(tipo) {
  return { TAQUIZA: 'Taquiza', TRES_TIEMPOS: 'Tres tiempos', PLATO_VOLADO: 'Plato volado' }[tipo] || tipo
}

onMounted(async () => {
  try {
    const { data } = await api.get('/public/catalogo')
    catalogo.value = data
  } catch {
    catalogo.value = { servicios: [], salsas: [] }
  }
  loading.value = false
})
</script>
