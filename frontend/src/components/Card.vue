<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ title }}</h3>
        <p class="text-3xl font-semibold text-gray-900 dark:text-white">{{ value }}</p>
      </div>
      <div class="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
        <i :class="iconClass" aria-hidden="true"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  iconClass: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
/* Estilos específicos do card */
</style>
