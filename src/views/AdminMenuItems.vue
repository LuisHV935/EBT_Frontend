<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-light text-stone-800">Menú</h1>
      <button @click="abrirNuevo" class="inline-block bg-stone-800 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-stone-700 transition-colors">+ Nuevo item</button>
    </div>

    <div v-if="loading" class="text-stone-400 text-sm py-8 text-center">Cargando...</div>

    <div v-else-if="errorMsg" class="border border-red-200 bg-red-50 text-red-700 rounded-lg p-4 text-sm">{{ errorMsg }}</div>

    <div v-else class="border border-stone-200 rounded-lg overflow-hidden bg-white">
      <table class="w-full text-sm">
        <thead>
          <tr class="bg-stone-50 border-b border-stone-200">
            <th class="text-left px-4 py-3 font-medium text-stone-600">Nombre</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Categoría</th>
            <th class="text-left px-4 py-3 font-medium text-stone-600">Descripción</th>
            <th class="text-right px-4 py-3 font-medium text-stone-600">Acción</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-stone-100">
          <tr v-for="item in items" :key="item.id" class="hover:bg-stone-50 transition-colors">
            <td class="px-4 py-3 text-stone-800">{{ item.nombre }}</td>
            <td class="px-4 py-3">
              <span class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">{{ item.categoria }}</span>
            </td>
            <td class="px-4 py-3 text-stone-400 text-xs max-w-xs truncate">{{ item.descripcion || '—' }}</td>
            <td class="px-4 py-3 text-right">
              <button @click="editar(item)" class="text-stone-500 hover:text-stone-700 text-xs font-medium mr-3 transition-colors">Editar</button>
              <button @click="eliminar(item.id)" class="text-red-500 hover:text-red-700 text-xs font-medium transition-colors">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/30 flex items-center justify-center z-50" @click.self="cerrarModal">
      <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-stone-200">
        <h2 class="text-lg font-medium text-stone-800 mb-4">{{ editando ? 'Editar item' : 'Nuevo item' }}</h2>
        <form @submit.prevent="guardar" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Nombre</label>
            <input v-model="form.nombre" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Categoría</label>
            <select v-model="form.categoria" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
              <option value="CREMA">Crema</option>
              <option value="PASTA">Pasta</option>
              <option value="PLATO_FUERTE_POLLO">Plato fuerte — Pollo</option>
              <option value="PLATO_FUERTE_CERDO">Plato fuerte — Cerdo</option>
              <option value="ENSALADA">Ensalada</option>
              <option value="GUARNICION">Guarnición</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Descripción <span class="text-stone-400 font-normal">(opcional)</span></label>
            <textarea v-model="form.descripcion" rows="2" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" maxlength="500"></textarea>
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

const items = ref([])
const loading = ref(true)
const showModal = ref(false)
const editando = ref(null)
const form = ref({ nombre: '', categoria: 'CREMA', descripcion: '' })

function abrirNuevo() {
  editando.value = null
  form.value = { nombre: '', categoria: 'CREMA', descripcion: '' }
  showModal.value = true
}

function editar(item) {
  editando.value = item.id
  form.value = { nombre: item.nombre, categoria: item.categoria, descripcion: item.descripcion || '' }
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
      await api.put(`/menu-items/${editando.value}`, form.value)
    } else {
      await api.post('/menu-items', form.value)
    }
    await cargar()
    cerrarModal()
  } catch (e) {
    errorMsg.value = 'Error al guardar. Verifica que el backend esté corriendo.'
  }
}

async function eliminar(id) {
  if (!confirm('¿Eliminar este item del menú?')) return
  try {
    await api.delete(`/menu-items/${id}`)
    await cargar()
  } catch (e) {
    errorMsg.value = 'Error al eliminar.'
  }
}

async function cargar() {
  loading.value = true
  try {
    const { data } = await api.get('/menu-items')
    items.value = data
    errorMsg.value = ''
  } catch (e) {
    errorMsg.value = 'Error al cargar datos. ¿El backend está corriendo?'
  }
  loading.value = false
}

onMounted(cargar)
</script>
