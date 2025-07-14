<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Menu Lateral -->
      <aside v-if="$route.path !== '/login'" class="w-64 bg-white dark:bg-gray-800 shadow-lg border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-300">E-commerce</h2>
          <ThemeToggle />
        </div>
        
        <nav class="mt-4">
          <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Menu</div>
          
          <router-link to="/dashboard" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-tachometer-alt w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Dashboard
          </router-link>
          
          <router-link to="/dashboard/products" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-box w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Produtos
          </router-link>
          
          <router-link to="/dashboard/products/new" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-plus-circle w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Novo Produto
          </router-link>
          
          <router-link to="/dashboard/categories" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-tags w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Categorias
          </router-link>
          
          <router-link to="/dashboard/customers" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-users w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Clientes
          </router-link>
          
          <router-link to="/dashboard/orders" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-shopping-cart w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Pedidos
          </router-link>
          
          <router-link to="/dashboard/payments" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-credit-card w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Pagamentos
          </router-link>
          
          <router-link to="/dashboard/orders/new" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-plus-circle w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Novo Pedido
          </router-link>
          
          <div class="px-4 py-2 mt-4 text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">Configurações</div>
          
          <router-link to="/profile" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
            <i class="fas fa-user w-5 mr-3 text-gray-400 group-hover:text-primary-500 transition-colors duration-200"></i>
            Perfil
          </router-link>
          
          <button @click="logout" class="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group cursor-pointer">
            <i class="fas fa-sign-out-alt w-5 mr-3 text-gray-400 group-hover:text-red-500 transition-colors duration-200"></i>
            Sair
          </button>
        </nav>
      </aside>

      <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div class="p-6">
          <!-- Header -->
          <div v-if="$route.path !== '/login'" class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white transition-colors duration-300">
              {{ $route.meta.title || 'Dashboard' }}
            </h1>
            <div class="flex items-center space-x-4">
              <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <i class="fas fa-user-circle"></i>
                <span>{{ authStore.user?.email || 'Usuário' }}</span>
              </div>
            </div>
          </div>

          <!-- Conteúdo da página -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';
import ThemeToggle from './components/ThemeToggle.vue';

const authStore = useAuthStore();
const router = useRouter();

// Função para logout
const logout = () => {
  authStore.logout();
  localStorage.removeItem('token');
  router.push('/login');
};

const isLoggedIn = computed(() => authStore.isAuthenticated);
</script>

<style>
/* Estilos de transição */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Estilos globais para o tema */
* {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
}

/* Scrollbar customizada para tema escuro */
.dark ::-webkit-scrollbar {
  width: 8px;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 4px;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Scrollbar customizada para tema claro */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>