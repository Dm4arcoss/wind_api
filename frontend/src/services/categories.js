import api from './api';

export default {
  getAll() {
    return api.get('/categories');
  },
  getById(id) {
    return api.get(`/categories/${id}`);
  },
  create(category) {
    return api.post('/categories', JSON.stringify(category), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  update(id, category) {
    return api.put(`/categories/${id}`, JSON.stringify(category), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  delete(id) {
    return api.delete(`/categories/${id}`);
  }
}
