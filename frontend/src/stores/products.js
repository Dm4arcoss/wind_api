import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
    retryCount: 0,
    MAX_RETRIES: 3
  }),

  actions: {
    async fetchProducts(categoryId = null) {
      this.loading = true;
      this.error = null;

      try {
        console.log('Tentando carregar produtos...');
        const response = await api.get('/products', {
          params: { categoryId }
        });
        console.log('Resposta do servidor:', response.data);
        console.log('Tipo de dados:', typeof response.data);
        
        this.products = response.data.map(product => ({
          ...product,
          price: Number(product.price) || 0,
          stock: Number(product.stock) || 0
        }));
        console.log('Produtos carregados:', this.products);
        this.retryCount = 0;
      } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Dados:', error.response.data);
        }
        if (this.retryCount < this.MAX_RETRIES) {
          this.retryCount++;
          console.log(`Tentativa ${this.retryCount} de ${this.MAX_RETRIES}`);
          setTimeout(() => this.fetchProducts(categoryId), 1000);
        } else {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },

    searchProducts(query) {
      return this.products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  getters: {
    filteredProducts: (state) => {
      return state.products;
    }
  }
});
