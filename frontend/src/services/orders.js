import api from './api';

export default {
  getAll() {
    return api.get('/orders');
  },
  getById(id) {
    return api.get(`/orders/${id}`);
  },
  updateStatus(id, status) {
    return api.put(`/orders/${id}`, { status });
  },
  getMyOrders() {
    return api.get('/orders/user/me');
  },
  getCustomerOrders(customerId) {
    return api.get(`/orders/customer/${customerId}`);
  },
  create(order) {
    return api.post('/orders', order);
  }
}
