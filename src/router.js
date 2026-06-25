import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from './api.js'
import { useAuth } from './stores/auth.js'

import Inicio from './views/Inicio.vue'
import Catalogo from './views/Catalogo.vue'
import Solicitar from './views/Solicitar.vue'
import Login from './views/Login.vue'
import MisSolicitudes from './views/MisSolicitudes.vue'
import SolicitudDetalle from './views/SolicitudDetalle.vue'
import Admin from './views/Admin.vue'
import AdminSolicitudes from './views/AdminSolicitudes.vue'
import AdminSolicitudDetalle from './views/AdminSolicitudDetalle.vue'
import AdminGuisados from './views/AdminGuisados.vue'
import AdminMenuItems from './views/AdminMenuItems.vue'
import AdminSalsas from './views/AdminSalsas.vue'
import AdminClientes from './views/AdminClientes.vue'

const routes = [
  { path: '/', name: 'Inicio', component: Inicio },
  { path: '/catalogo', name: 'Catalogo', component: Catalogo },
  { path: '/solicitar', name: 'Solicitar', component: Solicitar },
  { path: '/login', name: 'Login', component: Login },
  { path: '/mis-solicitudes', name: 'MisSolicitudes', component: MisSolicitudes, meta: { requiresAuth: true } },
  { path: '/mis-solicitudes/:id', name: 'SolicitudDetalle', component: SolicitudDetalle, meta: { requiresAuth: true } },
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: '', name: 'AdminDashboard', component: AdminSolicitudes },
      { path: 'solicitudes/:id', name: 'AdminSolicitudDetalle', component: AdminSolicitudDetalle },
      { path: 'guisados', name: 'AdminGuisados', component: AdminGuisados },
      { path: 'menu-items', name: 'AdminMenuItems', component: AdminMenuItems },
      { path: 'salsas', name: 'AdminSalsas', component: AdminSalsas },
      { path: 'clientes', name: 'AdminClientes', component: AdminClientes },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    return next('/login')
  }
  if (to.meta.requiresAdmin) {
    const { auth, checkSession } = useAuth()
    const ok = await checkSession()
    if (!ok || (auth.role !== 'ADMIN' && auth.role !== 'USER')) {
      return next('/login')
    }
  }
  next()
})

export default router
