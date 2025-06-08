import api from './api';

export default {
  getAll(categoryId = null) {
    return api.get(`/products${categoryId ? `?categoryId=${categoryId}` : ''}`);
  },
  getById(id) {
    return api.get(`/products/${id}`);
  },
  getRecentProducts() {
    return api.get('/products/recent');
  },
  create(product, config = {}) {
    // Adicionar token se não existir
    if (!config.headers?.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
    }
    return api.post('/products', product, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    });
  },
  update(id, product, config = {}) {
    // Adicionar token se não existir
    if (!config.headers?.Authorization) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
    }
    return api.put(`/products/${id}`, product, {
      headers: {
        'Content-Type': 'application/json'
      },
      ...config
    });
  },
  delete(id) {
    return api.delete(`/products/${id}`);
  }
}
