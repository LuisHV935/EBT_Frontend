<template>
  <div>
    <section class="py-20 text-center">
      <h1 class="text-5xl font-light text-stone-800 mb-4 tracking-tight">
        Catering para eventos
      </h1>
      <p class="text-lg text-stone-500 max-w-lg mx-auto mb-10 leading-relaxed">
        Taquiza, tres tiempos o plato volado. Servicio profesional para toda ocasión.
      </p>
      <div class="flex items-center justify-center gap-4">
        <router-link to="/catalogo" class="inline-block bg-stone-800 text-white px-8 py-3 rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium">
          Ver menú
        </router-link>
        <router-link to="/solicitar" class="inline-block border border-stone-300 text-stone-700 px-8 py-3 rounded-lg hover:bg-stone-100 transition-colors text-sm font-medium">
          Solicitar cotización
        </router-link>
      </div>
    </section>

    <section class="grid md:grid-cols-3 gap-8 mt-8">
      <div v-for="item in servicios" :key="item.title" class="border border-stone-200 rounded-lg p-6 bg-white">
        <h3 class="font-semibold text-stone-800 mb-2">{{ item.title }}</h3>
        <p class="text-sm text-stone-500 leading-relaxed mb-3">{{ item.desc }}</p>
        <p class="text-xs text-amber-700 font-medium">{{ item.price }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
const servicios = [
  {
    title: 'Taquiza',
    desc: 'Guisados, tortillas, salsas y aguas frescas. Ideal para eventos informales.',
    price: 'Desde $110 por persona',
  },
  {
    title: 'Tres tiempos',
    desc: 'Entrada, plato fuerte con guarniciones y postre. Servicio completo.',
    price: 'Desde $500 por persona',
  },
  {
    title: 'Plato volado',
    desc: 'Entrada, plato fuerte y postre en empaques biodegradables.',
    price: 'Desde $500 por persona',
  },
]
</script>
