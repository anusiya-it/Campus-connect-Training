import axios from 'axios'

// In dev, Vite proxies /api to http://localhost:8080 (see vite.config.js).
// In production, set VITE_API_BASE_URL to your deployed backend URL.
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Normalize error messages so components can show a single friendly string
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'
    return Promise.reject({ ...error, friendlyMessage: message })
  }
)

export default api
