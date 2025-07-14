import api from './api';

export default {
  _getHeaders() {
    const token = localStorage.getItem('token');
    return token ? {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : {};
  },

  count() {
    return api.get('/categories/count', this._getHeaders());
  },
  getAll() {
    return api.get('/categories', this._getHeaders());
  },
  getById(id) {
    return api.get(`/categories/${id}`, this._getHeaders());
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
