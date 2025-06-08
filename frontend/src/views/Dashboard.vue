<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <!-- Menu Lateral -->
    <aside class="w-64 bg-white dark:bg-gray-800 shadow-lg fixed h-full">
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
    <div class="ml-64">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <!-- Cards de Estatísticas -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Produtos</h3>
                <p class="text-3xl font-semibold text-gray-900 dark:text-white">{{ totalProducts }}</p>
              </div>
              <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <i class="fas fa-box text-blue-600 dark:text-blue-400"></i>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Categorias</h3>
                <p class="text-3xl font-semibold text-gray-900 dark:text-white">{{ totalCategories }}</p>
              </div>
              <div class="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <i class="fas fa-tags text-green-600 dark:text-green-400"></i>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Pedidos</h3>
                <p class="text-3xl font-semibold text-gray-900 dark:text-white">{{ stats.totalOrders }}</p>
              </div>
              <div class="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                <i class="fas fa-shopping-cart text-yellow-600 dark:text-yellow-400"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="mt-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Vendas por Mês</h3>
            <div class="h-64">
              <line-chart :data="salesData" :options="chartOptions" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LineChart from '@/components/charts/LineChart.vue'
import axios from 'axios'
import productsService from '@/services/products'
import categoriesService from '@/services/categories'
import ordersService from '@/services/orders'
import auth from '@/services/auth'
import profileService from '@/services/profile'

const router = useRouter()
const sidebarOpen = ref(true)
const userMenuOpen = ref(false)
const isDarkMode = ref(false)
const userName = ref('')
const recentProducts = ref([])
const categories = ref([])
const recentOrders = ref([])
const loading = ref(true)

// Inicializar stats no início
const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  totalOrders: 0
})

const userInitials = computed(() => {
  if (!userName.value) return 'US'
  return userName.value.split(' ').map(name => name[0]).join('').toUpperCase()
})

const totalProducts = computed(() => {
  return recentProducts.value.length
})

const totalCategories = computed(() => {
  return categories.value.length
})

const totalUsers = computed(() => {
  return 25 // Valor fixo por enquanto
})

const totalOrders = computed(() => {
  return recentOrders.value.length
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

const salesData = ref({
  labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
  datasets: [{
    label: 'Vendas',
    data: [12, 19, 3, 5, 2, 3],
    borderColor: '#4F46E5',
    tension: 0.4
  }]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top'
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
})

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
    const response = await productsService.getRecentProducts()
    console.log('Resposta produtos:', response)
    recentProducts.value = response.data || []
  } catch (error) {
    console.error('Erro ao buscar produtos recentes:', error)
    recentProducts.value = []
  }
}

const fetchRecentOrders = async () => {
  try {
    const response = await ordersService.getMyOrders()
    console.log('Pedidos carregados:', response)
    recentOrders.value = response.data || []
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    recentOrders.value = []
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoriesService.getAll()
    console.log('Resposta categorias:', response)
    categories.value = response.data || []
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    categories.value = []
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
      fetchCategories(),
      fetchRecentOrders()
    ])
    loading.value = false
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
})
</script>
