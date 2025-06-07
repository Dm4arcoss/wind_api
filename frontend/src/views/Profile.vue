<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="container mx-auto px-4 py-8">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Meu Perfil</h1>
          <button 
            @click="logout" 
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Sair
          </button>
        </div>
        
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-300">Carregando...</p>
        </div>
        
        <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>
        
        <div v-else-if="user" class="space-y-4">
          <div class="border-b dark:border-gray-700 pb-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">ID</p>
            <p class="text-gray-800 dark:text-white">{{ user.id }}</p>
          </div>
          
          <div class="border-b dark:border-gray-700 pb-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">Nome</p>
            <p class="text-gray-800 dark:text-white">{{ user.name }}</p>
          </div>
          
          <div class="border-b dark:border-gray-700 pb-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p class="text-gray-800 dark:text-white">{{ user.email }}</p>
          </div>
          
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Criado em</p>
            <p class="text-gray-800 dark:text-white">{{ formatDate(user.createdAt) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Profile',
  data() {
    return {
      user: null,
      loading: true,
      error: ''
    }
  },
  mounted() {
    this.fetchUserProfile()
  },
  methods: {
    async fetchUserProfile() {
      const token = localStorage.getItem('token')
      
      if (!token) {
        this.$router.push('/login')
        return
      }
      
      try {
        const response = await axios.get('http://localhost:3001/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        this.user = response.data
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          this.$router.push('/login')
        } else {
          this.error = 'Erro ao carregar perfil. Tente novamente.'
        }
      } finally {
        this.loading = false
      }
    },
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
    }
  }
}
</script>