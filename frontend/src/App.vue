<template>
  <div :class="themeClass">
    <div class="flex h-screen bg-gray-100 dark:bg-gray-900">
      <!-- Menu Lateral -->
      <aside v-if="$route.path !== '/login'" class="w-64 bg-white dark:bg-gray-800 shadow-lg">
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">E-commerce</h2>
        </div>
        
        <nav class="mt-4">
          <div class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 uppercase">Menu</div>
          
          <router-link to="/dashboard" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <i class="fas fa-tachometer-alt w-5 mr-3"></i>
            Dashboard
          </router-link>
          
          <router-link to="/dashboard/products" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <i class="fas fa-box w-5 mr-3"></i>
            Produtos
          </router-link>
          
          <router-link to="/dashboard/categories" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <i class="fas fa-tags w-5 mr-3"></i>
            Categorias
          </router-link>
          
          <router-link to="/dashboard/customers" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <i class="fas fa-users w-5 mr-3"></i>
            Clientes
          </router-link>
          
          <router-link to="/dashboard/orders" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <i class="fas fa-shopping-cart w-5 mr-3"></i>
            Pedidos
          </router-link>
          <router-link to="/dashboard/orders/new" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <i class="fas fa-plus-circle w-5 mr-3"></i>
            Novo Pedido
          </router-link>
          
          <div class="px-4 py-2 mt-4 text-xs text-gray-500 dark:text-gray-400 uppercase">Configurações</div>
          
          <router-link to="/profile" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
            <i class="fas fa-user w-5 mr-3"></i>
            Perfil
          </router-link>
          
          <a @click="logout" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
            <i class="fas fa-sign-out-alt w-5 mr-3"></i>
            Sair
          </a>
        </nav>
      </aside>

      <!-- Conteúdo Principal -->
      <main class="flex-1 overflow-auto">
        <div class="p-6">
          <!-- Header -->
          <div v-if="$route.path !== '/login'" class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
              {{ $route.name === 'Dashboard' ? 'Dashboard' : $route.name }}
            </h1>
            <div class="flex items-center space-x-4">
              <button @click="toggleTheme" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'" aria-hidden="true"></i>
              </button>
              <div class="relative">
                <button @click="toggleUserMenu" class="flex items-center space-x-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition p-2">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ authStore.user?.name || 'Usuário' }}</span>
                  <i class="fas fa-user-circle text-gray-600 dark:text-gray-300"></i>
                </button>
                <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                  <div class="px-4 py-2">
                    <span class="text-sm text-gray-900 dark:text-white">{{ authStore.user?.email }}</span>
                  </div>
                  <div class="border-t border-gray-200 dark:border-gray-700"></div>
                  <router-link to="/profile" class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-0">
                    <i class="fas fa-edit text-gray-400 dark:text-gray-500"></i>
                    <span>Edit profile</span>
                  </router-link>
                  <div class="border-t border-gray-200 dark:border-gray-700"></div>
                  <button @click="logout" class="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" role="menuitem" tabindex="-1" id="user-menu-item-1">
                    <i class="fas fa-sign-out-alt text-gray-400 dark:text-gray-500"></i>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const isDarkMode = ref(false);
const userMenuOpen = ref(false);

onMounted(async () => {
  // Carregar perfil do usuário se estiver autenticado
  if (authStore.isAuthenticated) {
    try {
      await authStore.getUserProfile();
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error);
    }
  }

  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    isDarkMode.value = true;
  } else {
    isDarkMode.value = false;
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.body.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.body.classList.remove('dark');
  }
});

const userName = computed(() => authStore.user?.name || 'Usuário');
const userEmail = computed(() => authStore.user?.email || 'Usuário');

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value);
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
};

const logout = () => {
  authStore.logout();
  localStorage.removeItem('token');
  router.push('/login');
};

const isLoggedIn = computed(() => authStore.isAuthenticated);

// Carregar tema salvo
onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    isDarkMode.value = true;
  } else {
    isDarkMode.value = false;
  }
});

const themeClass = computed(() => isDarkMode.value ? 'dark' : '');

// Carregar tema salvo
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.body.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.body.classList.remove('dark');
  }
});
</script>

<style>
/* Estilos de transição do menu */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Estilos do tema dark */
body.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dark .bg-white {
  background-color: #2d2d2d !important;
}

.dark .bg-gray-100 {
  background-color: #333 !important;
}

.dark .text-gray-800 {
  color: #ffffff !important;
}

.dark .text-gray-600 {
  color: #b3b3b3 !important;
}

.dark .text-gray-300 {
  color: #666 !important;
}

.dark .border {
  border-color: #444 !important;
}

.dark .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
}
/* Estilos de transição do menu */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Estilos do tema dark */
body.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dark .bg-white {
  background-color: #2d2d2d !important;
}

.dark .bg-gray-100 {
  background-color: #333 !important;
}

.dark .text-gray-800 {
  color: #ffffff !important;
}

.dark .text-gray-600 {
  color: #b3b3b3 !important;
}

.dark .text-gray-300 {
  color: #666 !important;
}

.dark .border {
  border-color: #444 !important;
}

.dark .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
}

.dark .hover:bg-blue-600:hover {
  background-color: #3b82f6 !important;
}

.dark .hover:bg-blue-500:hover {
  background-color: #3b82f6 !important;
}

.dark .hover:bg-blue-600 {
  background-color: #2563eb !important;
}

.dark .bg-blue-500 {
  background-color: #3b82f6 !important;
}

.dark .hover:bg-gray-700:hover {
  background-color: #4b5563 !important;
}

.dark .hover:bg-gray-600:hover {
  background-color: #475569 !important;
}

.dark .hover:bg-gray-500:hover {
  background-color: #64748b !important;
}

.dark .text-blue-500 {
  color: #3b82f6 !important;
}

.dark .hover:text-blue-700:hover {
  color: #2563eb !important;
}

.dark .hover:text-blue-600:hover {
  color: #3b82f6 !important;
}

.dark .text-red-500 {
  color: #ef4444 !important;
}

.dark .hover:text-red-700:hover {
  color: #db2777 !important;
}

.dark .hover:text-red-600:hover {
  color: #dc2626 !important;
}
</style>