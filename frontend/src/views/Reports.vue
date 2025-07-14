<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Relatórios
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Análises detalhadas e relatórios do sistema
        </p>
      </div>

      <!-- Filtros -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-6 transition-colors duration-300">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Filtros
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Período
            </label>
            <select
              v-model="filters.period"
              @change="loadReports"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="7">Últimos 7 dias</option>
              <option value="30">Últimos 30 dias</option>
              <option value="90">Últimos 90 dias</option>
              <option value="365">Último ano</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria
            </label>
            <select
              v-model="filters.category"
              @change="loadReports"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="">Todas as categorias</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status do Pedido
            </label>
            <select
              v-model="filters.orderStatus"
              @change="loadReports"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            >
              <option value="">Todos os status</option>
              <option value="PENDING">Pendente</option>
              <option value="PROCESSING">Processando</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregue</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              @click="exportReport"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <i class="fas fa-download"></i>
              <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Gerando relatórios...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
        <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
        <button
          @click="loadReports"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Relatórios -->
      <div v-else class="space-y-6">
        <!-- Resumo Executivo -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Receita Total</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(summary.totalRevenue) }}
                </p>
              </div>
              <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <i class="fas fa-dollar-sign text-green-600 dark:text-green-400 text-xl"></i>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center">
                <span class="text-sm text-green-600 dark:text-green-400">
                  <i class="fas fa-arrow-up mr-1"></i>
                  {{ summary.revenueGrowth }}%
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">vs período anterior</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Pedidos</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ summary.totalOrders }}
                </p>
              </div>
              <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <i class="fas fa-shopping-cart text-blue-600 dark:text-blue-400 text-xl"></i>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center">
                <span class="text-sm text-blue-600 dark:text-blue-400">
                  <i class="fas fa-arrow-up mr-1"></i>
                  {{ summary.orderGrowth }}%
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">vs período anterior</span>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Ticket Médio</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ formatCurrency(summary.averageTicket) }}
                </p>
              </div>
              <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <i class="fas fa-chart-line text-purple-600 dark:text-purple-400 text-xl"></i>
              </div>
            </div>
            <div class="mt-4">
              <div class="flex items-center">
                <span class="text-sm text-purple-600 dark:text-purple-400">
                  <i class="fas fa-arrow-up mr-1"></i>
                  {{ summary.ticketGrowth }}%
                </span>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">vs período anterior</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráficos -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Vendas por Período -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vendas por Período
            </h3>
            <div class="h-64 flex items-center justify-center">
              <div class="text-center">
                <i class="fas fa-chart-area text-4xl text-gray-400 mb-2"></i>
                <p class="text-gray-600 dark:text-gray-400">Gráfico de vendas</p>
              </div>
            </div>
          </div>

          <!-- Produtos Mais Vendidos -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top 5 Produtos
            </h3>
            <div class="space-y-3">
              <div
                v-for="(product, index) in topProducts"
                :key="product.id"
                class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div class="flex items-center space-x-3">
                  <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">
                      {{ product.name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ product.category }}
                    </div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="font-semibold text-gray-900 dark:text-white">
                    {{ product.quantity }} vendidos
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(product.revenue) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela Detalhada -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Relatório Detalhado
          </h3>
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pedidos
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Receita
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ticket Médio
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="item in detailedReport"
                  :key="item.date"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ formatDate(item.date) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {{ item.orders }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ formatCurrency(item.revenue) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatCurrency(item.averageTicket) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(item.status)">
                      {{ getStatusLabel(item.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import categoriesService from '../services/categories'
import dashboardService from '../services/dashboard'

// Estado do componente
const loading = ref(false)
const error = ref('')
const categories = ref([])

// Filtros
const filters = reactive({
  period: '30',
  category: '',
  orderStatus: ''
})

// Dados dos relatórios
const summary = ref({
  totalRevenue: 0,
  totalOrders: 0,
  averageTicket: 0,
  revenueGrowth: 0,
  orderGrowth: 0,
  ticketGrowth: 0
})

const topProducts = ref([])
const detailedReport = ref([])

// Carregar relatórios
const loadReports = async () => {
  loading.value = true
  error.value = ''

  try {
    // Carregar categorias se ainda não foram carregadas
    if (categories.value.length === 0) {
      const categoriesResult = await categoriesService.getAll()
      if (categoriesResult.success) {
        categories.value = categoriesResult.data
      }
    }

    // Simular dados de relatórios (em um sistema real, isso viria da API)
    await simulateReportData()

  } catch (err) {
    console.error('Erro ao carregar relatórios:', err)
    error.value = 'Erro ao carregar relatórios'
  } finally {
    loading.value = false
  }
}

// Simular dados de relatórios
const simulateReportData = async () => {
  // Aguardar um pouco para simular carregamento
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Dados simulados
  summary.value = {
    totalRevenue: 15420.50,
    totalOrders: 127,
    averageTicket: 121.42,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    ticketGrowth: 3.9
  }

  topProducts.value = [
    {
      id: 1,
      name: 'Smartphone XYZ',
      category: 'Eletrônicos',
      quantity: 45,
      revenue: 58410.00
    },
    {
      id: 2,
      name: 'Notebook Pro',
      category: 'Eletrônicos',
      quantity: 23,
      revenue: 34500.00
    },
    {
      id: 3,
      name: 'Fone de Ouvido Wireless',
      category: 'Acessórios',
      quantity: 67,
      revenue: 13400.00
    },
    {
      id: 4,
      name: 'Mouse Gamer',
      category: 'Acessórios',
      quantity: 34,
      revenue: 6800.00
    },
    {
      id: 5,
      name: 'Teclado Mecânico',
      category: 'Acessórios',
      quantity: 28,
      revenue: 5600.00
    }
  ]

  detailedReport.value = [
    {
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      orders: 18,
      revenue: 2180.50,
      averageTicket: 121.14,
      status: 'DELIVERED'
    },
    {
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      orders: 22,
      revenue: 2670.00,
      averageTicket: 121.36,
      status: 'DELIVERED'
    },
    {
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      orders: 15,
      revenue: 1820.75,
      averageTicket: 121.38,
      status: 'SHIPPED'
    },
    {
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      orders: 25,
      revenue: 3035.25,
      averageTicket: 121.41,
      status: 'PROCESSING'
    },
    {
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orders: 19,
      revenue: 2305.00,
      averageTicket: 121.32,
      status: 'PENDING'
    },
    {
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      orders: 28,
      revenue: 3409.00,
      averageTicket: 121.75,
      status: 'PENDING'
    }
  ]
}

// Exportar relatório
const exportReport = () => {
  // Simular exportação
  const data = {
    summary: summary.value,
    topProducts: topProducts.value,
    detailedReport: detailedReport.value,
    filters: filters,
    generatedAt: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `relatorio-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
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
    CANCELLED: 'Cancelado'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    PENDING: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full',
    PROCESSING: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full',
    SHIPPED: 'px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 rounded-full',
    DELIVERED: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full',
    CANCELLED: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full'
  }
  return classes[status] || classes.PENDING
}

// Lifecycle
onMounted(() => {
  loadReports()
})
</script> 