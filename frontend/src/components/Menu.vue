<template>
  <div class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4">
        <router-link to="/dashboard" class="text-xl font-bold text-gray-800 dark:text-white">
          E-commerce
        </router-link>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 px-2 py-4 space-y-1">
        <!-- Produtos -->
        <router-link to="/dashboard/products" 
          class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{'bg-gray-100 dark:bg-gray-700': $route.path.includes('/dashboard/products')}"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Produtos
        </router-link>

        <!-- Categorias -->
        <router-link to="/dashboard/categories" 
          class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{'bg-gray-100 dark:bg-gray-700': $route.path.includes('/dashboard/categories')}"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Categorias
        </router-link>

        <!-- Clientes -->
        <router-link to="/dashboard/customers" 
          class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{'bg-gray-100 dark:bg-gray-700': $route.name === 'Customers'}"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span class="ml-3">Clientes</span>
        </router-link>

        <!-- Pedidos -->
        <router-link to="/dashboard/orders" 
          class="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="{'bg-gray-100 dark:bg-gray-700': $route.path.includes('/dashboard/orders')}"
        >
          <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 11-1.732 2.899L15 14.76a4 4 0 011.732-2.899l1.391-4.723a3 3 0 01.017-3.002L19.114 4a3 3 0 111.992 2.998L21 10M7 10v4a3 3 0 002.122 2.57l.878.81" />
          </svg>
          Pedidos
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div class="flex items-center space-x-4">
          <button @click="logout" class="flex-1 text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            Sair
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.router-link-active {
  background-color: #f3f4f6;
  color: #1f2937;
}

.router-link-active.dark {
  background-color: #334155;
  color: #f3f4f6;
}
</style>
