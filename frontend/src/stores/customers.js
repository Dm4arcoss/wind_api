import { defineStore } from 'pinia';
import api from '../services/api';

export const useCustomersStore = defineStore('customers', {
  state: () => ({
    customers: [],
    loading: false,
    error: null,
    retryCount: 0,
    MAX_RETRIES: 3
  }),

  actions: {
    async fetchCustomers() {
      this.loading = true;
      this.error = null;

      try {
        const response = await api.get('/customers');
        this.customers = response.data;
        this.retryCount = 0;
      } catch (error) {
        if (this.retryCount < this.MAX_RETRIES) {
          this.retryCount++;
          setTimeout(() => this.fetchCustomers(), 1000);
        } else {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },

    searchCustomers(query) {
      return this.customers.filter(customer => 
        customer.name.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  getters: {
    filteredCustomers: (state) => {
      return state.customers;
    }
  }
});
