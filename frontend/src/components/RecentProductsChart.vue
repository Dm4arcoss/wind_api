<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Produtos Recentes</h2>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        Últimos 7 dias
      </div>
    </div>
    <div class="h-64">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Chart } from 'chart.js'

const props = defineProps({
  recentProducts: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)

const chartData = computed(() => {
  const dates = props.recentProducts.map(product => new Date(product.createdAt).toLocaleDateString('pt-BR'))
  const values = props.recentProducts.map(product => product.price)
  
  return {
    labels: dates,
    datasets: [
      {
        label: 'Preço dos Produtos Recentes',
        data: values,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.4,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(59, 130, 246)'
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: 'rgba(17, 24, 39, 0.7)',
        font: {
          size: 12
        }
      }
    },
    x: {
      ticks: {
        color: 'rgba(17, 24, 39, 0.7)',
        font: {
          size: 12
        }
      }
    }
  }
}

onMounted(() => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'line',
      data: chartData.value,
      options: chartOptions
    })
  }
})

onUnmounted(() => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d')
    const chart = Chart.getChart(ctx)
    if (chart) {
      chart.destroy()
    }
  }
})
</script>

