import api from './api';
import { clearTokenOnError } from './api';

// Função para configurar o token
const setupToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export default {
  async count() {
    try {
      console.log('🔧 Iniciando contagem de pedidos');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Não autenticado');
      }
      
      setupToken();
      const response = await api.get('/orders/count');
      console.log('✅ Contagem de pedidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Erro ao buscar contagem de pedidos:', error);
      
      if (error.response?.status === 401) {
        clearTokenOnError(error);
      }
      throw new Error('Erro ao buscar contagem de pedidos. Por favor, tente novamente.');
    }
  },

  async getAll() {
    try {
      console.log('🔧 Buscando lista de pedidos');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Não autenticado');
      }
      
      setupToken();
      const response = await api.get('/orders');
      console.log('✅ Lista de pedidos:', response.data);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar lista de pedidos:', error);
      
      if (error.response?.status === 401) {
        clearTokenOnError(error);
      }
      throw new Error('Erro ao buscar lista de pedidos. Por favor, tente novamente.');
    }
  },

  async getRecentOrders() {
    try {
      setupToken();
      const response = await api.get('/orders/recent');
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos recentes:', error);
      clearTokenOnError(error);
      throw error;
    }
  },

  async getById(id) {
    try {
      setupToken();
      const response = await api.get(`/orders/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar pedido:', error);
      clearTokenOnError(error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      setupToken();
      const response = await api.put(`/orders/${id}`, { status });
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar status do pedido:', error);
      clearTokenOnError(error);
      throw error;
    }
  },

  async getMyOrders() {
    try {
      setupToken();
      const response = await api.get('/orders/user/me');
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar meus pedidos:', error);
      clearTokenOnError(error);
      throw error;
    }
  },

  async getCustomerOrders(customerId) {
    try {
      setupToken();
      const response = await api.get(`/orders/customer/${customerId}`);
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos do cliente:', error);
      clearTokenOnError(error);
      throw error;
    }
  },

  async create(order) {
    try {
      setupToken();
      const response = await api.post('/orders', order);
      return response;
    } catch (error) {
      console.error('❌ Erro ao criar pedido:', error);
      clearTokenOnError(error);
      throw error;
    }
  },

  async getSalesData() {
    try {
      setupToken();
      const response = await api.get('/orders/order-stats');
      return response;
    } catch (error) {
      console.error('❌ Erro ao buscar dados de vendas:', error);
      clearTokenOnError(error);
      throw error;
    }
  }
}
