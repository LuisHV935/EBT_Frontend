<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-light text-stone-800">Clientes</h1>
      <button @click="abrirNuevo" class="inline-block bg-stone-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition-colors">+ Nuevo cliente</button>
    </div>

    <div v-if="loading" class="text-stone-400 text-sm py-8 text-center">Cargando...</div>

    <div v-else-if="errorMsg" class="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4 text-sm">{{ errorMsg }}</div>

    <div v-else class="border border-stone-200 rounded-lg overflow-hidden bg-white">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-stone-50 border-b border-stone-200">
            <th class="text-left px-4 py-3 font-medium text-stone-600">Nombre</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Email</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Teléfono</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Dirección</th>
            <th class="text-right px-4 py-3 font-medium text-stone-600">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="c in clientes" :key="c.id" class="hover:bg-stone-50 transition-colors">
            <td class="px-4 py-3 text-stone-800 font-medium">{{ c.nombre }}</td>
            <td class="px-4 py-3 text-stone-600">{{ c.email || '—' }}</td>
            <td class="px-4 py-3 text-stone-600">{{ c.telefono || '—' }}</td>
            <td class="px-4 py-3 text-stone-500 text-xs max-w-xs truncate">{{ c.direccion || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <button @click="editar(c)" class="text-stone-500 hover:text-stone-700 text-xs font-medium mr-3 transition-colors">Editar</button>
              <button @click="eliminar(c.id)" class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50" @click.self="cerrarModal">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-stone-200">
        <h2 class="text-lg font-medium text-stone-800 mb-4">{{ editando ? 'Editar cliente' : 'Nuevo cliente' }}</h2>
        <form @submit.prevent="guardar" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Nombre</label>
            <input v-model="form.nombre" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Teléfono</label>
            <input v-model="form.telefono" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Dirección</label>
            <input v-model="form.direccion" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
          </div>
          <div class="flex items-center justify-end gap-3 pt-2">
            <button type="button" @click="cerrarModal" class="text-sm text-stone-500 hover:text-stone-700 transition-colors">Cancelar</button>
            <button type="submit" class="bg-stone-800 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition-colors">
              {{ editando ? 'Guardar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api.js'

const clientes = ref([])
const loading = ref(true)
const showModal = ref(false)
const editando = ref(null)
const form = ref({ nombre: '', email: '', telefono: '', direccion: '' })

function abrirNuevo() {
  editando.value = null
  form.value = { nombre: '', email: '', telefono: '', direccion: '' }
  showModal.value = true
}

function editar(c) {
  editando.value = c.id
  form.value = { nombre: c.nombre, email: c.email || '', telefono: c.telefono || '', direccion: c.direccion || '' }
  showModal.value = true
}

function cerrarModal() {
  showModal.value = false
  editando.value = null
}

const errorMsg = ref('')

async function guardar() {
  try {
    if (editando.value) {
      await api.put(`/clientes/${editando.value}`, form.value)
    } else {
      await api.post('/clientes', form.value)
    }
    await cargar()
    cerrarModal()
  } catch (e) {
    errorMsg.value = 'Error al guardar. Verifica que el backend esté corriendo.'
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este cliente?')) return
  try {
    await api.delete(`/clientes/${id}`)
    await cargar()
  } catch (e) {
    errorMsg.value = 'Error al eliminar.'
  }
}

async function cargar() {
  loading.value = true
  try {
    const { data } = await api.get('/clientes')
    clientes.value = data
    errorMsg.value = ''
  } catch (e) {
    errorMsg.value = 'Error al cargar datos. ¿El backend está corriendo?'
  }
  loading.value = false
}

onMounted(cargar)
</script>
