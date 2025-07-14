import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user
  },

  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/auth/login', { email, password });
        this.token = response.data.access_token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('userId', this.user.id);
        await this.getUserProfile();
      } catch (error) {
        throw error;
      }
    },

    async logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
    },

    async register(userData) {
      try {
        const response = await api.post('/auth/register', userData);
        this.token = response.data.access_token;
        this.user = response.data.user;
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        localStorage.setItem('userId', this.user.id);
      } catch (error) {
        throw error;
      }
    },

    async getUserProfile() {
      try {
        // Verificar se temos um token válido
        if (!this.token) {
          throw new Error('Não autenticado');
        }

        // Verificar se o token está no header da API
        if (!api.defaults.headers.common['Authorization']) {
          api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
        }

        // Usar a rota correta do backend
        const response = await api.get('/auth/profile');
        this.user = response.data;
        localStorage.setItem('user', JSON.stringify(this.user));
        return response.data;
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        // Limpar dados do usuário se houver erro de autenticação
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.logout();
        }
        throw error;
      }
    }
  }
});
