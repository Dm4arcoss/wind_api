<template>
  <canvas ref="chartCanvas" class="w-full h-full"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  options: {
    type: Object,
    required: true
  }
})

const chartCanvas = ref(null)
let chartInstance = null

const updateChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }
  
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: props.data,
      options: props.options
    })
  }
}

onMounted(() => {
  updateChart()
})

watch(() => props.data, () => {
  updateChart()
}, { deep: true })

watch(() => props.options, () => {
  updateChart()
}, { deep: true })

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
/* Estilos específicos do gráfico podem ser adicionados aqui */
</style>
