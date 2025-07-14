<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-xl">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 transition-colors duration-300">
          {{ title }}
        </h3>
        <p class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          {{ formattedValue }}
        </p>
        <div v-if="trend" class="flex items-center mt-2">
          <span 
            :class="[
              'text-xs font-medium flex items-center',
              trend > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            ]"
          >
            <i 
              :class="[
                'mr-1',
                trend > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
              ]"
            ></i>
            {{ Math.abs(trend) }}%
          </span>
          <span class="text-xs text-gray-500 dark:text-gray-400 ml-2">vs mês anterior</span>
        </div>
      </div>
      <div 
        :class="[
          'p-4 rounded-full transition-all duration-300',
          colorClasses
        ]"
      >
        <i :class="[iconClass, 'text-xl']" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number, Object],
    required: true,
    default: 0
  },
  iconClass: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue',
    validator: (value) => ['blue', 'green', 'yellow', 'red', 'purple', 'orange', 'pink', 'indigo'].includes(value)
  },
  trend: {
    type: Number,
    default: null
  }
})

const formattedValue = computed(() => {
  if (typeof props.value === 'object' && props.value !== null) {
    if ('count' in props.value) {
      return props.value.count
    }
    if ('data' in props.value) {
      return props.value.data
    }
    return 0
  }
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('pt-BR')
  }
  return 0
})

const colorClasses = computed(() => {
  const colorMap = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
  }
  
  return colorMap[props.color] || colorMap.blue
})
</script>

<style scoped>
/* Animações suaves para hover */
.card:hover {
  transform: translateY(-2px);
}
</style>
