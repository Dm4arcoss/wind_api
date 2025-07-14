<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Login</h1>
        <ThemeToggle />
      </div>
      
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 transition-colors duration-300">
        {{ error }}
      </div>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 dark:text-gray-300 mb-2 font-medium transition-colors duration-300">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            required
            autocomplete="username"
            placeholder="Seu email"
          />
        </div>
        
        <div class="mb-6">
          <label for="password" class="block text-gray-700 dark:text-gray-300 mb-2 font-medium transition-colors duration-300">Senha</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            required
            autocomplete="current-password"
            placeholder="Sua senha"
          />
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200 font-medium"
          :disabled="loading"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Entrando...
          </span>
          <span v-else>Entrar</span>
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Não tem uma conta? 
          <router-link to="/register" class="text-primary-600 hover:text-primary-700 hover:underline transition-colors duration-200 font-medium">
            Registre-se
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import auth from '../services/auth'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    console.log('✅ Iniciando processo de login...')
    console.log('✅ Email:', email.value)
    console.log('✅ Rota atual:', route.path)
    console.log('✅ Rota de redirecionamento:', route.query.redirect)
    
    // Remover headers existentes antes do login
    delete api.defaults.headers.common['Authorization']
    
    const result = await auth.login(email.value.trim().toLowerCase(), password.value)
    console.log('✅ Resultado do login:', result)
    
    if (result.success) {
      console.log('✅ Login bem-sucedido!')
      console.log('✅ Token:', localStorage.getItem('token'))
      console.log('✅ User ID:', localStorage.getItem('userId'))
      
      // Limpar a rota de redirecionamento após o login
      localStorage.removeItem('redirectAfterLogin')
      
      // Verificar se o token está no header da API
      if (!api.defaults.headers.common['Authorization']) {
        api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`
      }
      
      // Redirecionar para a rota anterior ou dashboard
      const from = route.query.redirect || '/dashboard'
      router.push({
        path: from,
        replace: true
      })
      
      // Limpar formulário
      email.value = ''
      password.value = ''
      error.value = ''
      return
    } else {
      error.value = result.message || 'Falha no login'
    }
  } catch (err) {
    console.error('Erro detalhado:', err.response?.data || err.message)
    
    let errorMessage = 'Erro ao fazer login'
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.response?.status === 401) {
      errorMessage = 'Credenciais inválidas'
    } else if (err.message) {
      errorMessage = err.message
    }
    
    error.value = errorMessage
  } finally {
    loading.value = false
  }
}
</script>