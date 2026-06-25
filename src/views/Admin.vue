<template>
  <div class="flex gap-8">
    <aside class="w-56 shrink-0">
      <nav class="space-y-1 sticky top-6">
        <router-link to="/admin"
          class="block px-4 py-2 text-sm rounded-md transition-colors"
          :class="$route.path === '/admin' ? 'bg-stone-100 text-stone-800 font-medium' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'">
          Solicitudes
        </router-link>
        <router-link to="/admin/guisados"
          class="block px-4 py-2 text-sm rounded-md transition-colors"
          :class="$route.path === '/admin/guisados' ? 'bg-stone-100 text-stone-800 font-medium' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'">
          Guisados
        </router-link>
        <router-link to="/admin/menu-items"
          class="block px-4 py-2 text-sm rounded-md transition-colors"
          :class="$route.path === '/admin/menu-items' ? 'bg-stone-100 text-stone-800 font-medium' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'">
          Menú
        </router-link>
        <router-link to="/admin/salsas"
          class="block px-4 py-2 text-sm rounded-md transition-colors"
          :class="$route.path === '/admin/salsas' ? 'bg-stone-100 text-stone-800 font-medium' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'">
          Salsas
        </router-link>
        <router-link to="/admin/clientes"
          class="block px-4 py-2 text-sm rounded-md transition-colors"
          :class="$route.path === '/admin/clientes' ? 'bg-stone-100 text-stone-800 font-medium' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'">
          Clientes
        </router-link>
      </nav>
    </aside>
    <div class="flex-1 min-w-0">
      <router-view />
    </div>
  </div>
</template>
