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
        
        <router-link to="/dashboard/users" class="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <i class="fas fa-users w-5 mr-3"></i>
          Usuários
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
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ recentProducts.length }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-green-500 bg-opacity-10">
                <i class="fas fa-tags text-green-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm">Categorias</h3>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">{{ categories.length }}</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-yellow-500 bg-opacity-10">
                <i class="fas fa-users text-yellow-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm">Usuários</h3>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">25</p>
              </div>
            </div>
          </div>
          
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-3 rounded-full bg-purple-500 bg-opacity-10">
                <i class="fas fa-shopping-cart text-purple-500 text-xl"></i>
              </div>
              <div class="ml-4">
                <h3 class="text-gray-500 dark:text-gray-400 text-sm">Pedidos</h3>
                <p class="text-2xl font-semibold text-gray-800 dark:text-white">42</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentProductsChart :recent-products="recentProducts" />
          <CategoryChart :categories="categories" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import productsService from '@/services/products'
import categoriesService from '@/services/categories'
import auth from '@/services/auth'
import api from '@/plugins/chart'
import profileService from '@/services/profile'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const sidebarOpen = ref(true)
const userMenuOpen = ref(false)
const isDarkMode = ref(false)
const userName = ref('')
const recentProducts = ref([])
const categories = ref([])
const loading = ref(true)

const userInitials = computed(() => {
  return userName.value.split(' ').map(name => name[0]).join('').toUpperCase()
})

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
}

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark')
  localStorage.setItem('darkMode', isDarkMode.value)
}

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const fetchUserProfile = async () => {
  try {
    if (!auth.isAuthenticated()) {
      router.push('/login')
    }
    const user = await profileService.getProfile()
    userName.value = user.name
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error)
    router.push('/login')
  }
}

const fetchRecentProducts = async () => {
  try {
    const products = await productsService.getRecentProducts()
    recentProducts.value = products
  } catch (error) {
    console.error('Erro ao buscar produtos recentes:', error)
  }
}

const fetchCategories = async () => {
  try {
    const cats = await categoriesService.getAll()
    categories.value = cats
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
  }
}

onMounted(async () => {
  try {
    // Carregar tema salvo
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      isDarkMode.value = savedDarkMode === 'true'
      document.documentElement.classList.toggle('dark', isDarkMode.value)
    }

    // Carregar dados
    await Promise.all([
      fetchUserProfile(),
      fetchRecentProducts(),
      fetchCategories()
    ])
    loading.value = false
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})
</script>
