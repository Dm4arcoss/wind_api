<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto p-6">
      <!-- Header da Dashboard -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Dashboard
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
          Visão geral do sistema e estatísticas
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Carregando dashboard...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
        <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
        <button
          @click="loadDashboard"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-else class="space-y-6">
        <!-- Cards de Estatísticas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Total de Produtos"
            :value="stats.productCount || 0"
            iconClass="fas fa-box"
            color="blue"
            :loading="loadingStats"
          />
          <Card
            title="Total de Pedidos"
            :value="stats.orderCount || 0"
            iconClass="fas fa-shopping-cart"
            color="green"
            :loading="loadingStats"
          />
          <Card
            title="Total de Usuários"
            :value="stats.userCount || 0"
            iconClass="fas fa-users"
            color="purple"
            :loading="loadingStats"
          />
          <Card
            title="Receita Total"
            :value="formatCurrency(stats.revenue || 0)"
            iconClass="fas fa-dollar-sign"
            color="yellow"
            :loading="loadingStats"
          />
        </div>

        <!-- Gráficos e Tabelas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Estatísticas de Categorias -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Produtos por Categoria
            </h3>
            <div v-if="loadingCategoryStats" class="text-center py-8">
              <i class="fas fa-spinner fa-spin text-2xl text-primary-600 mb-2"></i>
              <p class="text-gray-600 dark:text-gray-400">Carregando...</p>
            </div>
            <div v-else-if="categoryStats.length === 0" class="text-center py-8">
              <i class="fas fa-chart-pie text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-600 dark:text-gray-400">Nenhuma categoria encontrada</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="category in categoryStats"
                :key="category.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: category.color }"
                  ></div>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ category.name }}
                  </span>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ category.count }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ category.percentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Estatísticas de Pedidos -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pedidos por Status
            </h3>
            <div v-if="loadingOrderStats" class="text-center py-8">
              <i class="fas fa-spinner fa-spin text-2xl text-primary-600 mb-2"></i>
              <p class="text-gray-600 dark:text-gray-400">Carregando...</p>
            </div>
            <div v-else-if="orderStats.length === 0" class="text-center py-8">
              <i class="fas fa-chart-bar text-4xl text-gray-400 mb-2"></i>
              <p class="text-gray-600 dark:text-gray-400">Nenhum pedido encontrado</p>
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="stat in orderStats"
                :key="stat.status"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-4 h-4 rounded-full"
                    :style="{ backgroundColor: stat.color }"
                  ></div>
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ getStatusLabel(stat.status) }}
                  </span>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ stat.count }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ stat.percentage }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Produtos Mais Vendidos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Produtos Mais Vendidos
          </h3>
          <div v-if="loadingTopSelling" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-primary-600 mb-2"></i>
            <p class="text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
          <div v-else-if="topSellingProducts.length === 0" class="text-center py-8">
            <i class="fas fa-trophy text-4xl text-gray-400 mb-2"></i>
            <p class="text-gray-600 dark:text-gray-400">Nenhum produto vendido ainda</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Produto
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Preço
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vendidos
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="product in topSellingProducts"
                  :key="product.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ product.name }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ product.category?.name || 'Sem categoria' }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(product.price) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ product.totalSold || 0 }} unidades
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pedidos Recentes -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pedidos Recentes
          </h3>
          <div v-if="loadingRecentOrders" class="text-center py-8">
            <i class="fas fa-spinner fa-spin text-2xl text-primary-600 mb-2"></i>
            <p class="text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
          <div v-else-if="recentOrders.length === 0" class="text-center py-8">
            <i class="fas fa-shopping-bag text-4xl text-gray-400 mb-2"></i>
            <p class="text-gray-600 dark:text-gray-400">Nenhum pedido recente</p>
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="order in recentOrders"
              :key="order.id"
              class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div class="flex items-center space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <i class="fas fa-shopping-cart text-primary-600 dark:text-primary-400"></i>
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    Pedido #{{ order.id }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ order.user?.name || 'Cliente não identificado' }}
                  </div>
                </div>
              </div>
              <div class="text-right">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ formatCurrency(order.total) }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ formatDate(order.createdAt) }}
                </div>
                <span :class="getStatusBadgeClass(order.status)">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Card from '@/components/Card.vue'
import dashboardService from '@/services/dashboard'

// Estado do componente
const loading = ref(false)
const error = ref('')
const loadingStats = ref(false)
const loadingCategoryStats = ref(false)
const loadingOrderStats = ref(false)
const loadingTopSelling = ref(false)
const loadingRecentOrders = ref(false)

// Dados
const stats = ref({})
const categoryStats = ref([])
const orderStats = ref([])
const topSellingProducts = ref([])
const recentOrders = ref([])
const recentProducts = ref([])

// Carregar dashboard
const loadDashboard = async () => {
  loading.value = true
  error.value = ''

  try {
    // Carregar resumo completo do dashboard
    const dashboardResult = await dashboardService.getDashboard()
    if (dashboardResult.success) {
      const { stats: dashboardStats, recentProducts: dashboardRecentProducts, recentOrders: dashboardRecentOrders } = dashboardResult.data
      
      // Atualizar estatísticas
      stats.value = dashboardStats || {}
      
      // Atualizar produtos recentes
      recentProducts.value = dashboardRecentProducts || []
      
      // Atualizar pedidos recentes
      recentOrders.value = dashboardRecentOrders || []
    } else {
      error.value = dashboardResult.error
    }

    // Carregar estatísticas de categorias
    loadingCategoryStats.value = true
    const categoryResult = await dashboardService.getCategoryStats()
    if (categoryResult.success) {
      categoryStats.value = categoryResult.data || []
    }

    // Carregar estatísticas de pedidos
    loadingOrderStats.value = true
    const orderStatsResult = await dashboardService.getOrderStats()
    if (orderStatsResult.success) {
      orderStats.value = orderStatsResult.data || []
    }

    // Carregar produtos mais vendidos
    loadingTopSelling.value = true
    const topSellingResult = await dashboardService.getTopSellingProducts()
    if (topSellingResult.success) {
      topSellingProducts.value = topSellingResult.data || []
    }

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err)
    error.value = 'Erro ao carregar dados do dashboard'
  } finally {
    loading.value = false
    loadingStats.value = false
    loadingCategoryStats.value = false
    loadingOrderStats.value = false
    loadingTopSelling.value = false
    loadingRecentOrders.value = false
  }
}

// Utilitários
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

const getStatusLabel = (status) => {
  const labels = {
    PENDING: 'Pendente',
    PROCESSING: 'Processando',
    SHIPPED: 'Enviado',
    DELIVERED: 'Entregue',
    CANCELLED: 'Cancelado',
    PAID: 'Pago'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    PENDING: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full',
    PROCESSING: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full',
    SHIPPED: 'px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full',
    DELIVERED: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full',
    CANCELLED: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full',
    PAID: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full'
  }
  return classes[status] || classes.PENDING
}

// Lifecycle
onMounted(() => {
  loadDashboard()
})
</script>
