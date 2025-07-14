<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 transition-colors duration-300">
    <div class="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Registrar</h1>
        <ThemeToggle />
      </div>
      
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 transition-colors duration-300">
        {{ error }}
      </div>
      
      <!-- Debug info -->
      <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-lg mb-4 text-xs transition-colors duration-300">
        <strong>Debug:</strong><br>
        Nome: "{{ name }}" ({{ name.length }} chars)<br>
        Email: "{{ email }}" ({{ email.length }} chars)<br>
        Senha: "{{ password.length }} chars"<br>
        Loading: {{ loading }}<br>
        Form válido: {{ isFormValid }}
      </div>
      
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 dark:text-gray-300 mb-2 font-medium transition-colors duration-300">Nome</label>
          <input 
            type="text" 
            id="name" 
            v-model="name" 
            @input="validateForm"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            required
            placeholder="Seu nome completo"
          />
        </div>
        
        <div class="mb-4">
          <label for="email" class="block text-gray-700 dark:text-gray-300 mb-2 font-medium transition-colors duration-300">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            @input="validateForm"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            required
            placeholder="seu@email.com"
          />
        </div>
        
        <div class="mb-6">
          <label for="password" class="block text-gray-700 dark:text-gray-300 mb-2 font-medium transition-colors duration-300">Senha</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            @input="validateForm"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            required
            minlength="6"
            placeholder="Mínimo 6 caracteres"
          />
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 transition-colors duration-300">Mínimo de 6 caracteres</p>
        </div>
        
        <button 
          type="submit" 
          class="w-full py-2 px-4 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 font-medium"
          :class="buttonClasses"
          :disabled="!isFormValid || loading"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Registrando...
          </span>
          <span v-else>Registrar</span>
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Já tem uma conta? 
          <router-link to="/login" class="text-primary-600 hover:text-primary-700 hover:underline transition-colors duration-200 font-medium">
            Faça login
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggle from '../components/ThemeToggle.vue'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const isFormValid = ref(false)

const buttonClasses = computed(() => {
  if (loading.value) {
    return 'bg-gray-400 text-white cursor-not-allowed'
  }
  if (isFormValid.value) {
    return 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'
  }
  return 'bg-gray-400 text-white cursor-not-allowed'
})

const validateForm = () => {
  console.log('🔍 Validando formulário...')
  console.log('Nome:', name.value, 'Length:', name.value.length)
  console.log('Email:', email.value, 'Length:', email.value.length)
  console.log('Senha:', password.value.length)
  
  const nameValid = name.value.trim().length >= 2
  const emailValid = email.value.includes('@') && email.value.includes('.') && email.value.length > 5
  const passwordValid = password.value.length >= 6
  
  console.log('Validações:', { nameValid, emailValid, passwordValid })
  
  isFormValid.value = nameValid && emailValid && passwordValid
  console.log('Formulário válido:', isFormValid.value)
}

const handleRegister = async () => {
  console.log('🚀 Iniciando registro...')
  console.log('Dados do formulário:', {
    name: name.value,
    email: email.value,
    password: password.value.length + ' chars'
  })
  
  loading.value = true
  error.value = ''
  
  // Validar campos antes de enviar
  if (!name.value || !email.value || !password.value) {
    error.value = 'Por favor, preencha todos os campos.'
    loading.value = false
    return
  }

  // Validar formato do email
  if (!email.value.includes('@') || !email.value.includes('.')) {
    error.value = 'Por favor, insira um email válido.'
    loading.value = false
    return
  }

  // Validar tamanho da senha
  if (password.value.length < 6) {
    error.value = 'A senha deve ter no mínimo 6 caracteres.'
    loading.value = false
    return
  }

  // Validar nome
  if (name.value.length < 2) {
    error.value = 'O nome deve ter no mínimo 2 caracteres.'
    loading.value = false
    return
  }

  // Remover espaços extras do nome
  const trimmedName = name.value.trim()
  if (trimmedName.length < 2) {
    error.value = 'O nome deve ter no mínimo 2 caracteres após remover espaços.'
    loading.value = false
    return
  }

  try {
    console.log('📡 Enviando requisição de registro...')
    
    // Usar o serviço de autenticação
    const auth = await import('@/services/auth.js')
    const response = await auth.default.register({
      name: trimmedName,
      email: email.value.trim().toLowerCase(),
      password: password.value
    })
    
    console.log('✅ Resposta do registro:', response)
    
    // Limpar campos após registro bem-sucedido
    name.value = ''
    email.value = ''
    password.value = ''
    validateForm()
    
    // Redirecionar para login
    router.push('/login?registered=true')
  } catch (err) {
    console.error('❌ Erro no registro:', err)
    error.value = err.message || 'Erro ao registrar. Tente novamente.'
  } finally {
    loading.value = false
  }
}

// Validar formulário na inicialização
validateForm()
</script>