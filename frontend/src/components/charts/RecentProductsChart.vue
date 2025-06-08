<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Produtos Recentes</h3>
      <div class="flex items-center space-x-2">
        <button @click="toggleShowPrices" class="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white">
          {{ showPrices ? 'Ocultar Preços' : 'Mostrar Preços' }}
        </button>
      </div>
    </div>
    <canvas ref="chart" class="w-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Legend } from 'chart.js'
import api from '@/plugins/chart'

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend
)

const props = defineProps({
  recentProducts: {
    type: Array,
    required: true
  }
})

const chart = ref(null)
const showPrices = ref(true)

const updateChart = () => {
  if (!chart.value) return

  // Destruir o chart existente antes de criar um novo
  const ctx = chart.value.getContext('2d')
  if (ctx && ctx.chart) {
    ctx.chart.destroy()
  }

  const dates = props.recentProducts.map(product => new Date(product.createdAt).toLocaleDateString('pt-BR'))
  const prices = props.recentProducts.map(product => product.price)

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Preço dos Produtos Recentes',
        data: prices,
        fill: true,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return `R$ ${value.toFixed(2)}`
            }
          }
        }
      }
    }
  })
}

onMounted(() => {
  updateChart()
})

onUnmounted(() => {
  if (chart.value) {
    const ctx = chart.value.getContext('2d')
    if (ctx && ctx.chart) {
      ctx.chart.destroy()
    }
  }
})

watch(() => props.recentProducts, () => {
  updateChart()
}, { deep: true })

watch(showPrices, () => {
  updateChart()
})
</script>
