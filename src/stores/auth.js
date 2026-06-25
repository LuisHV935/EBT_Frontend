import { reactive } from 'vue'
import api, { setAuth, clearAuth, isAuthenticated } from '../api.js'

const auth = reactive({
  user: null,
  role: null,
  loading: false,
})

export function useAuth() {
  async function login(username, password) {
    setAuth(username, password)
    try {
      const { data } = await api.get('/auth/me')
      auth.user = data.username
      auth.role = data.role
      return data
    } catch {
      clearAuth()
      auth.user = null
      auth.role = null
      throw new Error('Credenciales inválidas')
    }
  }

  function logout() {
    clearAuth()
    auth.user = null
    auth.role = null
  }

  async function checkSession() {
    if (!isAuthenticated()) {
      auth.user = null
      auth.role = null
      return false
    }
    try {
      const { data } = await api.get('/auth/me')
      auth.user = data.username
      auth.role = data.role
      return true
    } catch {
      logout()
      return false
    }
  }

  return { auth, login, logout, checkSession }
}
