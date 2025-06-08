<template>
  <div ref="chartContainer" class="w-full h-full"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Chart from 'chart.js/auto'

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

const chartContainer = ref(null)
let chartInstance = null

onMounted(() => {
  if (chartContainer.value) {
    chartInstance = new Chart(chartContainer.value, {
      type: 'line',
      data: props.data,
      options: props.options
    })
  }
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>

<style scoped>
/* Estilos específicos do gráfico podem ser adicionados aqui */
</style>
