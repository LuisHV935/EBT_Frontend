<template>
  <div class="max-w-3xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-light text-stone-800 mb-2">Solicitar cotización</h1>
      <p class="text-stone-500 text-sm">Completa los datos y elige las opciones de tu evento.</p>
    </div>

    <form @submit.prevent="enviar" class="space-y-6">
      <div class="border border-stone-200 rounded-lg p-6 bg-white space-y-4">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider">Datos de contacto</h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Nombre</label>
            <input v-model="form.nombreContacto" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Teléfono</label>
            <input v-model="form.telefono" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">Correo electrónico</label>
          <input v-model="form.email" type="email" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">Contraseña <span class="text-stone-400 font-normal">(opcional — para dar seguimiento)</span></label>
          <input v-model="form.password" type="password" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
        </div>
      </div>

      <div class="border border-stone-200 rounded-lg p-6 bg-white space-y-4">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider">Detalles del evento</h2>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">Tipo de servicio</label>
          <select v-model="form.serviceType" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow" @change="onServiceChange">
            <option value="">Seleccionar...</option>
            <option value="TAQUIZA">Taquiza</option>
            <option value="TRES_TIEMPOS">Tres tiempos</option>
            <option value="PLATO_VOLADO">Plato volado</option>
          </select>
        </div>
        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Número de personas</label>
            <input v-model.number="form.numberOfPeople" type="number" min="1" required class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
          </div>
          <div>
            <label class="block text-sm font-medium text-stone-600 mb-1">Fecha del evento</label>
            <input v-model="form.eventDate" type="date" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
          </div>
        </div>
      </div>

      <div v-if="form.serviceType === 'TAQUIZA'" class="border border-stone-200 rounded-lg p-6 bg-white space-y-4">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider">Selección de guisados</h2>
        <p class="text-xs text-stone-400">Elige uno o más guisados.</p>
        <div v-for="cat in guisadosPorCategoria" :key="cat.categoria" class="space-y-2">
          <h3 class="text-sm font-medium text-stone-600 capitalize">{{ cat.categoria.toLowerCase() }}</h3>
          <div class="flex flex-wrap gap-2">
            <button type="button" v-for="g in cat.items" :key="g.id"
              @click="toggleGuisado(g.id)"
              :class="selectedGuisadoIds.includes(g.id)
                ? 'px-3 py-1.5 text-sm border border-stone-800 rounded-md bg-stone-800 text-white cursor-pointer transition-colors'
                : 'px-3 py-1.5 text-sm border border-stone-300 rounded-md bg-white text-stone-600 hover:border-stone-400 cursor-pointer transition-colors'">
              {{ g.nombre }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="form.serviceType === 'TRES_TIEMPOS' || form.serviceType === 'PLATO_VOLADO'"
        class="border border-stone-200 rounded-lg p-6 bg-white space-y-4">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider">Selección del menú</h2>

        <div v-for="campo in camposMenu" :key="campo.key" class="space-y-1">
          <label class="block text-sm font-medium text-stone-600 mb-1">{{ campo.label }}</label>
          <select v-model="campo.value" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
            <option :value="null">Seleccionar...</option>
            <option v-for="item in campo.items" :key="item.id" :value="item.id">
              {{ item.nombre }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input v-model="form.includesTableware" type="checkbox" id="incluyeLoza"
            class="rounded border-stone-300 text-stone-700 focus:ring-stone-400">
          <label for="incluyeLoza" class="text-sm text-stone-600">Incluir loza, vasos y cubiertos</label>
        </div>
      </div>

      <div class="border border-stone-200 rounded-lg p-6 bg-white space-y-4">
        <h2 class="text-sm font-medium text-stone-700 uppercase tracking-wider">Adicionales</h2>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">Agua fresca</label>
          <input v-model="form.aguaFrescaVariety" placeholder="Ej: Jamaica, Horchata, Limón" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow">
        </div>
        <div>
          <label class="block text-sm font-medium text-stone-600 mb-1">Comentarios</label>
          <textarea v-model="form.comentarios" rows="3" class="w-full border border-stone-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-stone-400 transition-shadow" maxlength="2000"></textarea>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <p v-if="exito" class="text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-2 text-sm">{{ exito }}</p>
        <p v-if="error" class="text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-2 text-sm">{{ error }}</p>
        <button type="submit" :disabled="enviando"
          class="ml-auto bg-stone-800 text-white rounded-md px-8 py-2.5 text-sm font-medium hover:bg-stone-700 disabled:opacity-50 transition-colors">
          {{ enviando ? 'Enviando...' : 'Enviar solicitud' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import api from '../api.js'

const form = reactive({
  nombreContacto: '', telefono: '', email: '', password: '', direccion: '',
  serviceType: '', numberOfPeople: 1, eventDate: '', comentarios: '',
  includesTableware: false, aguaFrescaVariety: '',
})
const selectedGuisadoIds = ref([])
const guisados = ref([])
const menuItems = ref([])
const salsas = ref([])
const enviando = ref(false)
const exito = ref('')
const error = ref('')

const guisadosPorCategoria = computed(() => {
  const cats = {}
  for (const g of guisados.value) {
    if (!cats[g.categoria]) cats[g.categoria] = { categoria: g.categoria, items: [] }
    cats[g.categoria].items.push(g)
  }
  return Object.values(cats)
})

const itemsPorCategoria = computed(() => {
  const cats = {}
  for (const item of menuItems.value) {
    if (!cats[item.categoria]) cats[item.categoria] = []
    cats[item.categoria].push(item)
  }
  return cats
})

const camposMenu = computed(() => [
  { key: 'crema', label: 'Crema', value: form.selectedCremaId, items: itemsPorCategoria.value['CREMA'] || [] },
  { key: 'pasta', label: 'Pasta', value: form.selectedPastaId, items: itemsPorCategoria.value['PASTA'] || [] },
  { key: 'platoFuerte', label: 'Plato fuerte', value: form.selectedPlatoFuerteId, items: [...(itemsPorCategoria.value['PLATO_FUERTE_POLLO'] || []), ...(itemsPorCategoria.value['PLATO_FUERTE_CERDO'] || [])] },
  { key: 'ensalada', label: 'Ensalada', value: form.selectedEnsaladaId, items: itemsPorCategoria.value['ENSALADA'] || [] },
  { key: 'guarnicion', label: 'Guarnición', value: form.selectedGuarnicionId, items: itemsPorCategoria.value['GUARNICION'] || [] },
  { key: 'salsa', label: 'Salsa', value: form.selectedSalsaId, items: salsas.value },
])

function toggleGuisado(id) {
  const idx = selectedGuisadoIds.value.indexOf(id)
  if (idx === -1) selectedGuisadoIds.value.push(id)
  else selectedGuisadoIds.value.splice(idx, 1)
}

function onServiceChange() {
  selectedGuisadoIds.value = []
  form.selectedCremaId = null
  form.selectedPastaId = null
  form.selectedPlatoFuerteId = null
  form.selectedSalsaId = null
  form.selectedEnsaladaId = null
  form.selectedGuarnicionId = null
  form.includesTableware = false
}

async function enviar() {
  exito.value = ''
  error.value = ''
  enviando.value = true

  const payload = {
    nombreContacto: form.nombreContacto,
    telefono: form.telefono || null,
    email: form.email,
    password: form.password || null,
    serviceType: form.serviceType,
    numberOfPeople: form.numberOfPeople,
    eventDate: form.eventDate || null,
    comentarios: form.comentarios || null,
    includesTableware: form.includesTableware,
    aguaFrescaVariety: form.aguaFrescaVariety || null,
  }

  if (form.serviceType === 'TAQUIZA') {
    payload.selectedGuisadoIds = selectedGuisadoIds.value
    payload.selectedCremaId = null
    payload.selectedPastaId = null
    payload.selectedPlatoFuerteId = null
    payload.selectedSalsaId = null
    payload.selectedEnsaladaId = null
    payload.selectedGuarnicionId = null
  } else {
    payload.selectedGuisadoIds = []
    payload.selectedCremaId = form.selectedCremaId || null
    payload.selectedPastaId = form.selectedPastaId || null
    payload.selectedPlatoFuerteId = form.selectedPlatoFuerteId || null
    payload.selectedSalsaId = form.selectedSalsaId || null
    payload.selectedEnsaladaId = form.selectedEnsaladaId || null
    payload.selectedGuarnicionId = form.selectedGuarnicionId || null
  }

  try {
    await api.post('/public/solicitudes', payload)
    exito.value = 'Solicitud enviada con éxito. Recibirás un correo con los detalles.'
    Object.assign(form, {
      nombreContacto: '', telefono: '', email: '', password: '', direccion: '',
      serviceType: '', numberOfPeople: 1, eventDate: '', comentarios: '',
      includesTableware: false, aguaFrescaVariety: '',
    })
    selectedGuisadoIds.value = []
    form.selectedCremaId = null
    form.selectedPastaId = null
    form.selectedPlatoFuerteId = null
    form.selectedSalsaId = null
    form.selectedEnsaladaId = null
    form.selectedGuarnicionId = null
  } catch (e) {
    error.value = 'Error al enviar la solicitud. Verifica los campos e intenta de nuevo.'
  }
  enviando.value = false
}

onMounted(async () => {
  try {
    const [g, m, s] = await Promise.all([
      api.get('/public/guisados'),
      api.get('/public/menu-items'),
      api.get('/public/salsas'),
    ])
    guisados.value = g.data
    menuItems.value = m.data
    salsas.value = s.data
  } catch {
    try {
      const { data } = await api.get('/public/catalogo')
      const items = []
      for (const svc of data.servicios) {
        for (const cat of svc.categorias) {
          for (const item of cat.items) {
            if (!items.find(i => i.id === item.id)) items.push(item)
          }
        }
      }
      menuItems.value = items
      salsas.value = data.salsas || []
    } catch {}
  }
})
</script>
