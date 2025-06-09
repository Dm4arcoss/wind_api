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
      if (!this.token) return null;
      try {
        const response = await api.get('/users/me'); // Usando endpoint específico para o usuário atual
        // Como estamos autenticados, o backend deve retornar apenas o usuário atual
        this.user = response.data[0]; // Supondo que o backend retorne um array
        localStorage.setItem('user', JSON.stringify(this.user));
        return this.user;
      } catch (error) {
        throw error;
      }
    }
  }
});
