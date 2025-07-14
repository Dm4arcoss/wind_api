<template>
  <div v-if="!isLoading && !error" class="min-h-screen p-6">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <Card
        title="Total de Produtos"
        :value="stats.value.totalProducts || 0"
        iconClass="fas fa-box text-blue-600 dark:text-blue-400"
      />

      <Card
        title="Total de Categorias"
        :value="stats.value.totalCategories || 0"
        iconClass="fas fa-tags text-green-600 dark:text-green-400"
      />

      <Card
        title="Total de Pedidos"
        :value="stats.value.totalOrders || 0"
        iconClass="fas fa-shopping-cart text-yellow-600 dark:text-yellow-400"
      />
    </div>

    <div class="mt-6">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Vendas por Mês</h3>
        <div class="h-64">
          <line-chart v-if="chartOptions.value.data" :data="chartOptions.value.data" :options="chartOptions.value.options" />
        </div>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="min-h-screen p-6">
    <div class="bg-red-100 dark:bg-red-900 rounded-lg p-6">
      <p class="text-red-700 dark:text-red-300">{{ error }}</p>
    </div>
  </div>
  <div v-else class="min-h-screen p-6">
    <div class="flex justify-center items-center min-h-screen">
      <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Card from './Card.vue'
import LineChart from '@/components/charts/LineChart.vue'
import ordersService from '@/services/orders'
import productsService from '@/services/products'
import categoriesService from '@/services/categories'

// Inicializar variáveis de estado
const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  totalOrders: 0
})

const chartOptions = ref({
  data: null,
  options: {
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
  }
})

const recentProducts = ref([])
const recentOrders = ref([])
const allCategories = ref([])
const isLoading = ref(true)
const error = ref(null)

// Funções auxiliares
const loadWithRetry = async (fn, name) => {
  try {
    return await fn();
  } catch (error) {
    console.error(`Erro ao carregar ${name}:`, error);
    error.value = error.message;
    throw error;
  }
};

// Funções de busca
const fetchTotals = async () => {
  try {
    const [productsCount, categoriesCount, ordersCount] = await Promise.all([
      productsService.count(),
      categoriesService.count(),
      ordersService.count()
    ]);
    stats.value = {
      totalProducts: productsCount,
      totalCategories: categoriesCount,
      totalOrders: ordersCount
    };
  } catch (error) {
    throw error;
  }
};

const fetchRecentProducts = async () => {
  try {
    recentProducts.value = await productsService.getRecentProducts();
  } catch (error) {
    throw error;
  }
};

const fetchRecentOrders = async () => {
  try {
    recentOrders.value = await ordersService.getRecentOrders();
  } catch (error) {
    throw error;
  }
};

const fetchCategories = async () => {
  try {
    allCategories.value = await categoriesService.getAll();
  } catch (error) {
    throw error;
  }
};

const fetchSalesData = async () => {
  try {
    const salesData = await ordersService.getSalesData();
    if (salesData && salesData.labels && salesData.values) {
      chartOptions.value.data = {
        labels: salesData.labels,
        datasets: [{
          label: 'Vendas',
          data: salesData.values,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    } else {
      chartOptions.value.data = null;
      throw new Error('Dados de vendas inválidos');
    }
  } catch (error) {
    console.error('Erro ao buscar dados de vendas:', error);
    error.value = error.message;
    throw error;
  }
};

// Carregamento inicial
onMounted(async () => {
  try {
    isLoading.value = true;
    await Promise.all([
      fetchTotals(),
      fetchRecentProducts(),
      fetchRecentOrders(),
      fetchCategories(),
      fetchSalesData()
    ]);
  } catch (error) {
    console.error('Erro ao carregar dados do dashboard:', error);
    error.value = error.message;
  } finally {
    isLoading.value = false;
  }
});

// Limpar dados ao desmontar
onBeforeUnmount(() => {
  stats.value = {
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0
  };
  chartOptions.value = {
    data: null,
    options: {
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
    }
  };
  recentProducts.value = [];
  recentOrders.value = [];
  allCategories.value = [];
  error.value = null;
});
</script>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
/* Estilos específicos do dashboard */
</style>
