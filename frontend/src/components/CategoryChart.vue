<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold text-gray-800 dark:text-white">Distribuição de Produtos por Categoria</h2>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        {{ totalProducts }} produtos
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
  categories: {
    type: Array,
    required: true
  }
})

const chartRef = ref(null)

const chartData = computed(() => {
  const labels = props.categories.map(category => category.name)
  const data = props.categories.map(category => category.products?.length || 0)
  
  return {
    labels,
    datasets: [
      {
        label: 'Número de Produtos',
        data,
        backgroundColor: generateColors(data.length),
        borderRadius: 4,
        borderSkipped: false
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

const totalProducts = computed(() => {
  return props.categories.reduce((sum, category) => sum + (category.products?.length || 0), 0)
})

function generateColors(count) {
  const colors = []
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360
    colors.push(`hsl(${hue}, 70%, 50%)`)
  }
  return colors
}

onMounted(() => {
  if (chartRef.value) {
    const ctx = chartRef.value.getContext('2d')
    const chart = new Chart(ctx, {
      type: 'bar',
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
