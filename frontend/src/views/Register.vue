<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <h1 class="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Registrar</h1>
      
      <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 dark:text-gray-300 mb-2">Nome</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        
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
            minlength="6"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Mínimo de 6 caracteres</p>
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          :disabled="loading"
        >
          {{ loading ? 'Registrando...' : 'Registrar' }}
        </button>
      </form>
      
      <div class="mt-4 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Já tem uma conta? 
          <router-link to="/login" class="text-blue-600 hover:underline">Faça login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Register',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true
      this.error = ''
      
      try {
        await axios.post('http://localhost:3001/auth/register', {
          name: this.name,
          email: this.email,
          password: this.password
        })
        
        this.$router.push('/login?registered=true')
      } catch (err) {
        this.error = err.response?.data?.message || 'Erro ao registrar. Tente novamente.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>