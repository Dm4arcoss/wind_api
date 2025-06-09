<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
    <!-- Cards de Estatísticas -->
    <Card
      title="Total de Produtos"
      :value="totalProducts"
      iconClass="fas fa-box text-blue-600 dark:text-blue-400"
    />

    <Card
      title="Total de Categorias"
      :value="totalCategories"
      iconClass="fas fa-tags text-green-600 dark:text-green-400"
    />

    <Card
      title="Total de Pedidos"
      :value="stats.totalOrders"
      iconClass="fas fa-shopping-cart text-yellow-600 dark:text-yellow-400"
    />
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
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Card from './Card.vue'
import LineChart from '@/components/charts/LineChart.vue'
import axios from 'axios'
import productsService from '@/services/products'
import categoriesService from '@/services/categories'
import ordersService from '@/services/orders'
import auth from '@/services/auth'
import profileService from '@/services/profile'

const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  totalOrders: 0
})

const recentProducts = ref([])
const categories = ref([])
const recentOrders = ref([])
const loading = ref(true)

const totalProducts = computed(() => {
  return recentProducts.value.length
})

const totalCategories = computed(() => {
  return categories.value.length
})

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

const fetchRecentProducts = async () => {
  try {
    const response = await productsService.getRecentProducts()
    recentProducts.value = response.data || []
  } catch (error) {
    console.error('Erro ao buscar produtos recentes:', error)
    recentProducts.value = []
  }
}

const fetchRecentOrders = async () => {
  try {
    const response = await ordersService.getMyOrders()
    recentOrders.value = response.data || []
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error)
    recentOrders.value = []
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoriesService.getAll()
    categories.value = response.data || []
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    categories.value = []
  }
}

onMounted(async () => {
  try {
    // Carregar dados
    await Promise.all([
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

<style scoped>
/* Estilos específicos do dashboard */
</style>
