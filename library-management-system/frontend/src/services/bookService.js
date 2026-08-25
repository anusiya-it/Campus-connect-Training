import api from './api'

const bookService = {
  getAll: (search) => api.get('/books', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/books/${id}`),
  create: (book) => api.post('/books', book),
  update: (id, book) => api.put(`/books/${id}`, book),
  remove: (id) => api.delete(`/books/${id}`),
}

export default bookService
