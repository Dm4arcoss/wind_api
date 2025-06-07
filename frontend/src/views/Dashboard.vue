<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
    <!-- Menu Lateral -->
    <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg fixed h-full transition-all" :class="{ '-ml-64': !sidebarOpen }">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">Produtos</h2>
        <button @click="toggleSidebar" class="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          <i class="fas fa-times"></i>
        </button>
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
        
        <router-link to="/dashboard/orders" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <i class="fas fa-shopping-cart w-5 mr-3"></i>
          Pedidos
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
    <div class="flex-1 ml-0 md:ml-64 transition-all">
      <!-- Cabeçalho -->
      <header class="bg-white dark:bg-gray-800 shadow-sm">
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center">
            <button @click="toggleSidebar" class="mr-4 text-gray-600 dark:text-gray-300 md:hidden">
              <i class="fas fa-bars"></i>
            </button>
            <h1 class="text-xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
          </div>
          
          <div class="flex items-center">
            <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 mr-3">
              <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
            </button>
            
            <div class="relative">
              <button @click="toggleUserMenu" class="flex items-center focus:outline-none">
                <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {{ userInitials }}
                </div>
                <span class="ml-2 text-gray-700 dark:text-gray-300 hidden md:block">{{ userName }}</span>
              </button>
              
              <div v-if="userMenuOpen" class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                <router-link to="/profile" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Perfil
                </router-link>
                <a @click="logout" class="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  Sair
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Conteúdo da Página -->
      <main class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-blue-500 bg-opacity-10">
                <i class="fas fa-box text-blue-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm">Total de Produtos</h3>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">120</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-500 bg-opacity-10">
                <i class="fas fa-shopping-cart text-green-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm">Pedidos</h3>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">34</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-500 bg-opacity-10">
                <i class="fas fa-users text-yellow-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm">Clientes</h3>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">45</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-red-500 bg-opacity-10">
                <i class="fas fa-chart-line text-red-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm">Receita</h3>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">R$ 6.450</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 lg:col-span-2">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Produtos Recentes</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produto</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Categoria</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Preço</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estoque</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                  <tr v-for="(product, index) in recentProducts" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <i class="fas fa-box text-gray-500 dark:text-gray-400"></i>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900 dark:text-white">{{ product.name }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-500 dark:text-gray-400">{{ product.category }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900 dark:text-white">R$ {{ product.price }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span :class="[
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        product.stock > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      ]">
                        {{ product.stock }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Categorias</h2>
            <div class="space-y-4">
              <div v-for="(category, index) in categories" :key="index" class="flex items-center">
                <div class="w-2 h-2 rounded-full" :class="category.color"></div>
                <div class="ml-3 flex-1">
                  <div class="flex items-center justify-between">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ category.name }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ category.count }}</div>
                  </div>
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                    <div class="h-1.5 rounded-full" :class="category.color" :style="{ width: category.percentage + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Dashboard',
  data() {
    return {
      sidebarOpen: true,
      userMenuOpen: false,
      isDarkMode: localStorage.getItem('theme') === 'dark',
      userName: '',
      recentProducts: [
        { name: 'Smartphone XYZ', category: 'Eletrônicos', price: '1.299,00', stock: 15 },
        { name: 'Notebook ABC', category: 'Computadores', price: '3.499,00', stock: 8 },
        { name: 'Fone de Ouvido', category: 'Acessórios', price: '199,00', stock: 23 },
        { name: 'Smart TV 50"', category: 'Eletrônicos', price: '2.799,00', stock: 5 },
        { name: 'Mouse Gamer', category: 'Periféricos', price: '149,00', stock: 30 }
      ],
      categories: [
        { name: 'Eletrônicos', count: 45, percentage: 38, color: 'bg-blue-500' },
        { name: 'Computadores', count: 27, percentage: 23, color: 'bg-green-500' },
        { name: 'Acessórios', count: 18, percentage: 15, color: 'bg-yellow-500' },
        { name: 'Periféricos', count: 12, percentage: 10, color: 'bg-red-500' },
        { name: 'Outros', count: 18, percentage: 15, color: 'bg-purple-500' }
      ]
    }
  },
  computed: {
    userInitials() {
      return this.userName.split(' ').map(name => name[0]).join('').toUpperCase();
    }
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    toggleUserMenu() {
      this.userMenuOpen = !this.userMenuOpen;
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      
      if (this.isDarkMode) {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
    async fetchUserProfile() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/login');
        return;
      }
      
      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        this.userName = response.data.name || 'Usuário';
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          this.$router.push('/login');
        }
      }
    }
  },
  mounted() {
    // Verificar se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      this.$router.push('/login');
    } else {
      this.fetchUserProfile();
    }
    
    // Ajustar o sidebar em telas menores
    if (window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
    
    // Fechar o menu do usuário ao clicar fora
    document.addEventListener('click', (e) => {
      if (this.userMenuOpen && !e.target.closest('.relative')) {
        this.userMenuOpen = false;
      }
    });
  }
}
</script>