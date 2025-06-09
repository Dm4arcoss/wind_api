import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    total: 0,
    loading: false,
    error: null,
    products: []
  }),

  getters: {
    itemsWithProducts: (state) => {
      return state.items.map(item => {
        const product = state.products.find(p => p.id === item.productId);
        return {
          ...item,
          product: product || { name: 'Produto não encontrado', price: 0 }
        };
      });
    },

    getItemCount: (state) => {
      return state.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    getCartItems: (state) => {
      return state.items;
    }
  },

  actions: {
    async addItem(productId, quantity = 1) {
      const existingItem = this.items.find(item => item.productId === productId);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ productId, quantity });
      }

      this.calculateTotal();
      this.saveToStorage();
    },

    removeItem(productId) {
      this.items = this.items.filter(item => item.productId !== productId);
      this.calculateTotal();
      this.saveToStorage();
    },

    updateQuantity(productId, quantity) {
      const item = this.items.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
        this.calculateTotal();
        this.saveToStorage();
      }
    },

    clearCart() {
      this.items = [];
      this.total = 0;
      this.saveToStorage();
    },

    calculateTotal() {
      this.total = this.items.reduce((sum, item) => {
        const product = this.products.find(p => p.id === item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0);
    },

    saveToStorage() {
      localStorage.setItem('cart', JSON.stringify(this.items));
    },

    loadFromStorage() {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          this.items = JSON.parse(storedCart);
          this.calculateTotal();
        } catch (error) {
          console.error('Erro ao carregar carrinho do localStorage:', error);
          this.items = [];
        }
      } else {
        this.items = [];
      }
    },

    setProducts(products) {
      this.products = products;
      // Atualizar os produtos nos itens do carrinho
      this.items = this.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        return {
          ...item,
          product: product || { name: 'Produto não encontrado', price: 0 }
        };
      });
      this.calculateTotal();
    },

    async validateStock(productId, quantity) {
      // Implementar validação de estoque
      return true;
    }
  }
});
