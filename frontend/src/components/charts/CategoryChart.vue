<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Produtos por Categoria</h3>
    <canvas ref="chart" class="w-full"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Title, Legend } from 'chart.js'
import api from '@/plugins/chart'

Chart.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Title,
  Legend
)

const props = defineProps({
  categories: {
    type: Array,
    required: true
  }
})

const chart = ref(null)

const updateChart = () => {
  if (!chart.value) return

  // Destruir o chart existente antes de criar um novo
  const ctx = chart.value.getContext('2d')
  if (ctx && ctx.chart) {
    ctx.chart.destroy()
  }

  const labels = props.categories.map(category => category.name)
  const data = props.categories.map(category => category.products?.length || 0)

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Número de Produtos',
        data,
        backgroundColor: generateColors(data.length),
        borderRadius: 4,
        borderSkipped: false
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
              return `${value} produtos`
            }
          }
        }
      }
    }
  })
}

const generateColors = (count) => {
  const colors = []
  for (let i = 0; i < count; i++) {
    const hue = (i / count) * 360
    colors.push(`hsl(${hue}, 70%, 50%)`)
  }
  return colors
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

watch(() => props.categories, () => {
  updateChart()
}, { deep: true })
</script>
