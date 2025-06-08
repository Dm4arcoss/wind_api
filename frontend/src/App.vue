<template>
  <div :class="themeClass">
    <div class="min-h-screen">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';

const isDarkMode = ref(false);
const authStore = useAuthStore();

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light');
};

const isLoggedIn = computed(() => authStore.isAuthenticated);

const themeClass = computed(() => isDarkMode.value ? 'dark' : '');

// Carregar tema salvo
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    isDarkMode.value = true;
    document.body.classList.add('dark');
  } else {
    isDarkMode.value = false;
    document.body.classList.remove('dark');
  }
});
</script>

<style>
/* Estilos de transição do menu */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Estilos do tema dark */
body.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dark .bg-white {
  background-color: #2d2d2d !important;
}

.dark .bg-gray-100 {
  background-color: #333 !important;
}

.dark .text-gray-800 {
  color: #ffffff !important;
}

.dark .text-gray-600 {
  color: #b3b3b3 !important;
}

.dark .text-gray-300 {
  color: #666 !important;
}

.dark .border {
  border-color: #444 !important;
}

.dark .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
}
/* Estilos de transição do menu */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Estilos do tema dark */
body.dark {
  background-color: #1a1a1a;
  color: #ffffff;
}

.dark .bg-white {
  background-color: #2d2d2d !important;
}

.dark .bg-gray-100 {
  background-color: #333 !important;
}

.dark .text-gray-800 {
  color: #ffffff !important;
}

.dark .text-gray-600 {
  color: #b3b3b3 !important;
}

.dark .text-gray-300 {
  color: #666 !important;
}

.dark .border {
  border-color: #444 !important;
}

.dark .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5) !important;
}

.dark .hover:bg-blue-600:hover {
  background-color: #3b82f6 !important;
}

.dark .hover:bg-blue-500:hover {
  background-color: #3b82f6 !important;
}

.dark .hover:bg-blue-600 {
  background-color: #2563eb !important;
}

.dark .bg-blue-500 {
  background-color: #3b82f6 !important;
}

.dark .hover:bg-gray-700:hover {
  background-color: #4b5563 !important;
}

.dark .hover:bg-gray-600:hover {
  background-color: #475569 !important;
}

.dark .hover:bg-gray-500:hover {
  background-color: #64748b !important;
}

.dark .text-blue-500 {
  color: #3b82f6 !important;
}

.dark .hover:text-blue-700:hover {
  color: #2563eb !important;
}

.dark .hover:text-blue-600:hover {
  color: #3b82f6 !important;
}

.dark .text-red-500 {
  color: #ef4444 !important;
}

.dark .hover:text-red-700:hover {
  color: #db2777 !important;
}

.dark .hover:text-red-600:hover {
  color: #dc2626 !important;
}
</style>