import api from './api'

const memberService = {
  getAll: (search) => api.get('/members', { params: search ? { search } : {} }),
  getById: (id) => api.get(`/members/${id}`),
  create: (member) => api.post('/members', member),
  update: (id, member) => api.put(`/members/${id}`, member),
  remove: (id) => api.delete(`/members/${id}`),
}

export default memberService
