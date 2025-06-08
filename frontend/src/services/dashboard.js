import api from './api';

export default {
  getStats() {
    return api.get('/dashboard/stats');
  },
  getRecentProducts() {
    return api.get('/dashboard/recent-products');
  },
  getCategoryStats() {
    return api.get('/dashboard/category-stats');
  },
  getTopSellingProducts() {
    return api.get('/dashboard/top-selling');
  },
  getRecentOrders() {
    return api.get('/dashboard/recent-orders');
  },
  getOrderStats() {
    return api.get('/dashboard/order-stats');
  }
}
