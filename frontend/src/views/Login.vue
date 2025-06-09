<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Login</h1>
        <button @click="toggleTheme" class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <i class="fas" :class="isDarkMode ? 'fa-sun' : 'fa-moon'"></i>
        </button>
      </div>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <div class="mb-6">
          <label for="password" class="block text-gray-700 dark:text-gray-300 mb-2">Senha</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Não tem uma conta? 
          <router-link to="/register" class="text-blue-600 hover:underline">Registre-se</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
      isDarkMode: localStorage.getItem('theme') === 'dark'
    }
  },
  mounted() {
    this.applyTheme()
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''
      
      try {
        console.log('Tentando fazer login com:', {
          email: this.email,
          password: '****'
        })
        
        const response = await api.post('/auth/login', {
          email: this.email.trim().toLowerCase(),
          password: this.password
        })
        
        console.log('Resposta do login:', response.data)
        
        if (response.data.access_token) {
          localStorage.setItem('token', response.data.access_token)
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user))
            localStorage.setItem('userId', response.data.user.id)  // Salvando o userId
          }
          this.$router.push('/')
        } else {
          throw new Error('Token não recebido')
        }
      } catch (err) {
        console.error('Erro detalhado:', err)
        
        let errorMessage = 'Erro ao fazer login'
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message
        } else if (err.response?.status === 401) {
          errorMessage = 'Credenciais inválidas'
        } else if (err.message) {
          errorMessage = err.message
        }
        
        this.error = errorMessage
      } finally {
        this.loading = false
      }
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