# Frontend — Contexto Técnico

## Stack

| Componente | Tecnología |
|---|---|
| Framework | Vue 3 (Composition API, `<script setup>`) |
| Build tool | Vite 8 |
| Routing | vue-router 5 (HTML5 History mode) |
| HTTP | axios 1 |
| CSS | Tailwind CSS 4 (vía `@tailwindcss/vite`) |
| Lenguaje | JavaScript (no TypeScript) |

---

## Estructura de archivos

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── .env.production
├── public/
│   └── favicon.svg
└── src/
    ├── main.js              ← Entry point, router, axios config
    ├── App.vue              ← Root component (header nav + router-view)
    ├── style.css            ← @import "tailwindcss"
    ├── components/
    │   └── HelloWorld.vue   ← Scaffold boilerplate (no se usa)
    └── views/
        ├── Inicio.vue       ← Homepage
        ├── Catalogo.vue     ← Catálogo del menú
        ├── Solicitar.vue    ← Formulario de cotización
        ├── Login.vue        ← Login
        ├── Admin.vue        ← Panel admin (solicitudes)
        └── MisSolicitudes.vue ← Solicitudes del cliente
```

---

## Rutas

| Path | Componente | Nombre | Auth required | Descripción |
|---|---|---|---|---|
| `/` | Inicio | `Inicio` | No | Landing page |
| `/catalogo` | Catalogo | `Catalogo` | No | Menú completo |
| `/solicitar` | Solicitar | `Solicitar` | No | Formulario de cotización |
| `/login` | Login | `Login` | No | Inicio de sesión |
| `/admin` | Admin | `Admin` | Sí (auth header) | Dashboard de solicitudes recibidas |
| `/mis-solicitudes` | MisSolicitudes | `MisSolicitudes` | Sí (auth header) | Solicitudes del cliente |

### Route guard

```js
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !axios.defaults.headers.common['Authorization']) {
    next('/login')
  } else {
    next()
  }
})
```

El guard verifica si existe el header `Authorization` en axios. Si no hay, redirige a `/login`.

---

## Axios

Configuración en `main.js`:

```js
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api'
window.axios = axios  // Expuesto globalmente para acceso en vistas sin imports
```

- **Dev:** usa proxy de Vite (`/api` → `http://localhost:8080`)
- **Prod:** usa `VITE_API_URL` (definido en `.env.production` o variable de entorno de Vercel)
- El header `Authorization` se guarda en `axios.defaults.headers.common['Authorization']` como `Basic <base64>`
- Se accede como `window.axios` en todos los componentes (sin necesidad de import)

---

## Comunicación con Backend

### Endpoints consumidos

| Vista | Método | Path | Auth |
|---|---|---|---|
| Catalogo | GET | `/public/catalogo` | No |
| Solicitar | POST | `/public/solicitudes` | No |
| Login | GET | `/auth/me` | Basic (después de setear header) |
| Admin | GET | `/admin/solicitudes` | Basic |
| MisSolicitudes | GET | `/cliente/solicitudes` | Basic |

### Formato de requests

**Solicitar cotización (POST /public/solicitudes):**

```json
{
  "nombreContacto": "string",
  "telefono": "string",
  "email": "string",
  "password": "string (opcional)",
  "serviceType": "TAQUIZA | TRES_TIEMPOS | PLATO_VOLADO",
  "numberOfPeople": 1,
  "eventDate": "2026-07-15",
  "comentarios": "string",
  "includesTableware": false
}
```

**Nota:** El formulario actual NO envía `selectedGuisadoIds`, `selectedCremaId`, etc. Solo envía los campos básicos. Esto significa que los selectores de items del menú no están implementados en la UI.

**Login (GET /auth/me):**

- Header: `Authorization: Basic <btoa(username:password)>`
- Se envía después de loguearse para verificar credenciales y obtener rol

---

## Manejo de autenticación

### Login (`Login.vue`)

```js
const token = btoa(`${username.value}:${password.value}`)
window.axios.defaults.headers.common['Authorization'] = `Basic ${token}`
const { data } = await window.axios.get('/auth/me')
```

- Si el rol es ADMIN o USER → redirige a `/admin`
- Si el rol es CLIENTE → redirige a `/mis-solicitudes`
- Si falla → borra el header y muestra error

### Logout (`MisSolicitudes.vue`)

```js
delete window.axios.defaults.headers.common['Authorization']
router.push('/')
```

### Estado global de sesión

`App.vue` lee en `onMounted`:

```js
logueado.value = !!axios.defaults.headers.common['Authorization']
```

Esto controla la visibilidad de "Entrar" vs "Mis solicitudes" en el navbar.

---

## Vistas — Detalle

### `Inicio.vue`
- Hero section con título, descripción, y link "Ver menú"
- Sin lógica asíncrona

### `Catalogo.vue`
- Llama a `GET /public/catalogo` en `onMounted`
- Renderiza el array `servicios` (TAQUIZA, TRES_TIEMPOS, PLATO_VOLADO)
- Cada servicio muestra: tipo, descripción, precio referencia, items incluídos, categorías con items
- Estado `loading` mientras carga

### `Solicitar.vue`
- Formulario con campos: nombre, teléfono, email, password (opcional), tipo de servicio, número de personas, fecha del evento, comentarios
- No incluye selectores de guisados/cremas/platos fuertes/etc. (funcionalidad pendiente)
- Botón submit → `POST /public/solicitudes`
- Muestra mensaje de éxito o error
- En éxito, limpia el formulario

### `Login.vue`
- Formulario: usuario/email + contraseña
- Envía Basic Auth + verifica con `/auth/me`
- Redirige según rol
- Muestra error si credenciales inválidas

### `Admin.vue`
- Lista todas las solicitudes (`GET /admin/solicitudes`)
- Muestra: nombre, email, servicio, número de personas, fecha, estado
- Estados con colores: NUEVA (azul), CONTACTADA (amarillo), CONCRETADA (verde), DESCARTADA (rojo)
- No implementa: cambio de estado, detalle expandido, acciones

### `MisSolicitudes.vue`
- Lista solicitudes del cliente logueado (`GET /cliente/solicitudes`)
- Misma card layout que Admin pero filtrada por email
- Botón "Cerrar sesión" que borra el header y redirige
- Muestra "Aún no tienes solicitudes" si el array está vacío

---

## Estilos

- **Framework:** Tailwind CSS 4
- **Import:** `@import "tailwindcss"` en `style.css`
- **Paleta:** stone (fondos/neutral), amber (acento), red/green/yellow/blue (estados)
- **Layout:** max-w-6xl mx-auto para contenido centrado
- **Header:** bg-stone-900, texto blanco, links en hover amber-400

### Patrones de clase comunes

```
Contenedor página:    max-w-6xl mx-auto p-6
Card:                 bg-white rounded-xl shadow-sm border border-stone-200 p-6
Botón primario:       bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition
Input:                w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400
Estado badge:         text-xs font-medium px-2 py-1 rounded bg-{color}-100 text-{color}-700
```

---

## Configuración de Vite

`vite.config.js`:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
```

- Proxy solo activo en `vite dev` (puerto 5173)
- En producción (Vercel), el proxy no existe: se usa `VITE_API_URL`

---

## Variables de entorno

### `.env.production` (local, se sube al repo)

```
VITE_API_URL=https://tu-backend-en-render.onrender.com
```

### En Vercel

Se debe configurar como **Environment Variable** en el dashboard del proyecto:
- Name: `VITE_API_URL`
- Value: URL del backend en Render

---

## Dependencias (package.json)

| Paquete | Versión | Tipo | Propósito |
|---|---|---|---|
| vue | ^3.5.38 | prod | Framework |
| @tailwindcss/vite | ^4.3.1 | dev | Plugin Tailwind para Vite |
| @vitejs/plugin-vue | ^6.0.7 | dev | Plugin Vue para Vite |
| axios | ^1.18.1 | dev | HTTP client |
| tailwindcss | ^4.3.1 | dev | CSS utility framework |
| vite | ^8.1.0 | dev | Build tool |
| vue-router | ^5.1.0 | dev | SPA routing |

---

## Funcionalidad pendiente / Mejoras detectadas

1. **Selector de items del menú en Solicitar.vue:** El formulario no permite elegir guisados (TAQUIZA) ni crema/pasta/plato fuerte/ensalada/guarnición/salsa (3T/Plato Volado). Solo envía campos básicos.
2. **Cambio de estado en Admin.vue:** No hay UI para cambiar el status de una solicitud (PATCH).
3. **Detalle expandido en Admin:** No se puede ver el detalle completo de una solicitud (GET by ID).
4. **No hay manejo de expiración de sesión:** El header `Authorization` persiste hasta cerrar pestaña.
5. **HelloWorld.vue:** Componente boilerplate sin uso, se puede eliminar.
