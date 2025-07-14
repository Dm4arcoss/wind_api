import api from './api';
import { setupToken } from './auth';

export default {
  // Resumo completo do dashboard
  async getDashboard() {
    setupToken();
    try {
      const response = await api.get('/dashboard');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao carregar dashboard'
      };
    }
  },

  // Estatísticas gerais
  async getStats() {
    setupToken();
    try {
      const response = await api.get('/dashboard/stats');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao carregar estatísticas'
      };
    }
  },

  // Produtos recentes
  async getRecentProducts() {
    setupToken();
    try {
      const response = await api.get('/dashboard/recent-products');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos recentes:', error);
      throw error;
    }
  },

  // Estatísticas de categorias
  async getCategoryStats() {
    setupToken();
    try {
      const response = await api.get('/dashboard/category-stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de categorias:', error);
      throw error;
    }
  },

  // Produtos mais vendidos
  async getTopSellingProducts() {
    setupToken();
    try {
      const response = await api.get('/dashboard/top-selling');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error);
      throw error;
    }
  },

  // Pedidos recentes
  async getRecentOrders() {
    setupToken();
    try {
      const response = await api.get('/dashboard/recent-orders');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pedidos recentes:', error);
      throw error;
    }
  },

  // Estatísticas de pedidos por status
  async getOrderStats() {
    setupToken();
    try {
      const response = await api.get('/dashboard/order-stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de pedidos:', error);
      throw error;
    }
  },

  // Estatísticas de pedidos (endpoint alternativo)
  async getOrdersStats() {
    setupToken();
    try {
      const response = await api.get('/orders/order-stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de pedidos:', error);
      throw error;
    }
  }
};
