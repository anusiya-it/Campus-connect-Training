import api from './api'

const transactionService = {
  getAll: () => api.get('/transactions'),
  getById: (id) => api.get(`/transactions/${id}`),
  getOverdue: () => api.get('/transactions/overdue'),
  issue: (payload) => api.post('/transactions/issue', payload),
  returnBook: (id, payload) => api.put(`/transactions/${id}/return`, payload || {}),
}

export default transactionService
