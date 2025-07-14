<template>
  <div class="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <div class="flex flex-col h-full">
      <!-- Logo -->
      <div class="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <router-link to="/dashboard" class="text-xl font-bold text-gray-800 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
          <i class="fas fa-store mr-2"></i>
          E-commerce
        </router-link>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <!-- Dashboard -->
        <router-link to="/dashboard" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.name === 'Dashboard'}"
        >
          <i class="fas fa-tachometer-alt w-5 h-5 mr-3"></i>
          Dashboard
        </router-link>

        <!-- Relatórios -->
        <router-link to="/dashboard/reports" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.name === 'Reports'}"
        >
          <i class="fas fa-chart-bar w-5 h-5 mr-3"></i>
          Relatórios
        </router-link>

        <!-- Divisor -->
        <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <!-- Produtos -->
        <router-link to="/dashboard/products" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.path.includes('/dashboard/products')}"
        >
          <i class="fas fa-box w-5 h-5 mr-3"></i>
          Produtos
        </router-link>

        <!-- Categorias -->
        <router-link to="/dashboard/categories" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.path.includes('/dashboard/categories')}"
        >
          <i class="fas fa-tags w-5 h-5 mr-3"></i>
          Categorias
        </router-link>

        <!-- Clientes -->
        <router-link to="/dashboard/customers" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.name === 'Customers'}"
        >
          <i class="fas fa-users w-5 h-5 mr-3"></i>
          Clientes
        </router-link>

        <!-- Pedidos -->
        <router-link to="/dashboard/orders" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.path.includes('/dashboard/orders')}"
        >
          <i class="fas fa-shopping-cart w-5 h-5 mr-3"></i>
          Pedidos
        </router-link>

        <!-- Pagamentos -->
        <router-link to="/dashboard/payments" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.path.includes('/dashboard/payments')}"
        >
          <i class="fas fa-credit-card w-5 h-5 mr-3"></i>
          Pagamentos
        </router-link>

        <!-- Novo Pedido -->
        <router-link to="/dashboard/orders/new" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.name === 'NewOrder'}"
        >
          <i class="fas fa-plus w-5 h-5 mr-3"></i>
          Novo Pedido
        </router-link>

        <!-- Divisor -->
        <div class="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        <!-- Usuários -->
        <router-link to="/dashboard/users" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.path.includes('/dashboard/users')}"
        >
          <i class="fas fa-user-cog w-5 h-5 mr-3"></i>
          Usuários
        </router-link>

        <!-- Perfil -->
        <router-link to="/profile" 
          class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          :class="{'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300': $route.name === 'Profile'}"
        >
          <i class="fas fa-user w-5 h-5 mr-3"></i>
          Perfil
        </router-link>
      </nav>

      <!-- Footer -->
      <div class="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-4 py-4">
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <ThemeToggle />
          
          <!-- Logout -->
          <button 
            @click="logout" 
            class="flex-1 text-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            <i class="fas fa-sign-out-alt mr-2"></i>
            Sair
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
  router.push('/login')
}
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
