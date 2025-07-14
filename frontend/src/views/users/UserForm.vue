<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}
          </h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Nome -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nome Completo *
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Digite o nome completo"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.name }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email *
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="Digite o email"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.email }}
          </p>
        </div>

        <!-- Senha (apenas para criação) -->
        <div v-if="!isEdit">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Senha *
          </label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="Digite a senha"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirmação de senha (apenas para criação) -->
        <div v-if="!isEdit">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Confirmar Senha *
          </label>
          <input
            v-model="form.confirmPassword"
            type="password"
            required
            placeholder="Confirme a senha"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Role -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Função *
          </label>
          <select
            v-model="form.role"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.role }"
          >
            <option value="">Selecione uma função</option>
            <option value="ADMIN">Administrador</option>
            <option value="CUSTOMER">Cliente</option>
            <option value="MANAGER">Gerente</option>
          </select>
          <p v-if="errors.role" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.role }}
          </p>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status *
          </label>
          <select
            v-model="form.status"
            required
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.status }"
          >
            <option value="">Selecione um status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="SUSPENDED">Suspenso</option>
          </select>
          <p v-if="errors.status" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.status }}
          </p>
        </div>

        <!-- Telefone -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Telefone
          </label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="(11) 99999-9999"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.phone }"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Endereço -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Endereço
          </label>
          <textarea
            v-model="form.address"
            rows="3"
            placeholder="Digite o endereço completo"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
            :class="{ 'border-red-500': errors.address }"
          ></textarea>
          <p v-if="errors.address" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ errors.address }}
          </p>
        </div>

        <!-- Mensagem de erro geral -->
        <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          {{ error }}
        </div>

        <!-- Botões -->
        <div class="flex space-x-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <span v-if="loading" class="flex items-center justify-center">
              <i class="fas fa-spinner fa-spin mr-2"></i>
              Salvando...
            </span>
            <span v-else>
              {{ isEdit ? 'Atualizar' : 'Criar' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import usersService from '../../services/users'

const props = defineProps({
  user: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success'])

// Estado do componente
const loading = ref(false)
const error = ref('')
const errors = reactive({})

// Formulário
const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: '',
  status: 'ACTIVE',
  phone: '',
  address: ''
})

// Inicializar formulário
onMounted(() => {
  if (props.isEdit && props.user) {
    Object.assign(form, {
      name: props.user.name || '',
      email: props.user.email || '',
      role: props.user.role || '',
      status: props.user.status || 'ACTIVE',
      phone: props.user.phone || '',
      address: props.user.address || ''
    })
  }
})

// Validação
const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  errors.role = ''
  errors.status = ''
  errors.phone = ''
  errors.address = ''

  let isValid = true

  // Nome
  if (!form.name.trim()) {
    errors.name = 'Nome é obrigatório'
    isValid = false
  } else if (form.name.trim().length < 2) {
    errors.name = 'Nome deve ter pelo menos 2 caracteres'
    isValid = false
  }

  // Email
  if (!form.email.trim()) {
    errors.email = 'Email é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email inválido'
    isValid = false
  }

  // Senha (apenas para criação)
  if (!props.isEdit) {
    if (!form.password) {
      errors.password = 'Senha é obrigatória'
      isValid = false
    } else if (form.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres'
      isValid = false
    }

    if (!form.confirmPassword) {
      errors.confirmPassword = 'Confirmação de senha é obrigatória'
      isValid = false
    } else if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Senhas não coincidem'
      isValid = false
    }
  }

  // Role
  if (!form.role) {
    errors.role = 'Função é obrigatória'
    isValid = false
  }

  // Status
  if (!form.status) {
    errors.status = 'Status é obrigatório'
    isValid = false
  }

  // Telefone (opcional, mas se preenchido deve ser válido)
  if (form.phone && !/^\(\d{2}\) \d{4,5}-\d{4}$/.test(form.phone)) {
    errors.phone = 'Telefone deve estar no formato (11) 99999-9999'
    isValid = false
  }

  return isValid
}

// Formatar telefone
const formatPhone = (value) => {
  const cleaned = value.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return value
}

// Handle submit
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true
  error.value = ''

  try {
    const userData = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      role: form.role,
      status: form.status,
      phone: form.phone || null,
      address: form.address || null
    }

    // Adicionar senha apenas para criação
    if (!props.isEdit) {
      userData.password = form.password
    }

    let result

    if (props.isEdit) {
      result = await usersService.update(props.user.id, userData)
    } else {
      result = await usersService.create(userData)
    }

    if (result.success) {
      emit('success', result.data)
    } else {
      error.value = result.message
    }
  } catch (err) {
    console.error('Erro ao salvar usuário:', err)
    error.value = 'Erro interno ao salvar usuário'
  } finally {
    loading.value = false
  }
}

// Watch para formatar telefone
import { watch } from 'vue'

watch(() => form.phone, (newValue) => {
  if (newValue) {
    form.phone = formatPhone(newValue)
  }
})
</script>
