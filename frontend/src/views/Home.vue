<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-white">API de Autenticação</h1>
        <div class="flex items-center gap-3">
          <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
            <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
          </button>
          <div v-if="isLoggedIn" class="flex gap-3">
            <router-link to="/dashboard" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">
              Dashboard
            </router-link>
            <router-link to="/profile" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Meu Perfil
            </router-link>
            <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
              Sair
            </button>
          </div>
          <div v-else class="flex gap-3">
            <router-link to="/login" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login
            </router-link>
            <router-link to="/register" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Registrar
            </router-link>
          </div>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Bem-vindo ao Sistema</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Este é um sistema de autenticação com JWT. Use as opções acima para navegar.
        </p>
        <div v-if="isLoggedIn" class="bg-green-100 dark:bg-green-900 p-4 rounded">
          <p class="text-green-800 dark:text-green-200">
            Você está logado! Acesse o Dashboard para gerenciar seus produtos.
          </p>
        </div>
      </div>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Documentação da API</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">
          Acesse a documentação Swagger para testar os endpoints da API.
        </p>
        <a href="/api" target="_blank" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition inline-block">
          Abrir Swagger UI
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isLoggedIn: false,
      isDarkMode: localStorage.getItem('theme') === 'dark'
    }
  },
  mounted() {
    this.checkLoginStatus()
    this.applyTheme()
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      this.isLoggedIn = !!token
    },
    logout() {
      localStorage.removeItem('token')
      this.isLoggedIn = false
      this.$router.push('/login')
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode
      
      if (this.isDarkMode) {
        document.body.classList.remove('light-mode')
        document.body.classList.add('dark-mode')
        localStorage.setItem('theme', 'dark')
      } else {
        document.body.classList.remove('dark-mode')
        document.body.classList.add('light-mode')
        localStorage.setItem('theme', 'light')
      }
    },
    applyTheme() {
      if (this.isDarkMode) {
        document.body.classList.remove('light-mode')
        document.body.classList.add('dark-mode')
      } else {
        document.body.classList.remove('dark-mode')
        document.body.classList.add('light-mode')
      }
    }
  }
}
</script>