import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      delete api.defaults.headers.common['Authorization']
      sessionStorage.removeItem('auth_token')
    }
    return Promise.reject(err)
  }
)

const stored = sessionStorage.getItem('auth_token')
if (stored) {
  api.defaults.headers.common['Authorization'] = `Basic ${stored}`
}

export function setAuth(username, password) {
  const token = btoa(`${username}:${password}`)
  api.defaults.headers.common['Authorization'] = `Basic ${token}`
  sessionStorage.setItem('auth_token', token)
}

export function clearAuth() {
  delete api.defaults.headers.common['Authorization']
  sessionStorage.removeItem('auth_token')
}

export function isAuthenticated() {
  return !!api.defaults.headers.common['Authorization']
}

export default api
