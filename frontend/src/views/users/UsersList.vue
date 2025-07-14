<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Gerenciar Usuários
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mt-1">
            Gerencie todos os usuários do sistema
          </p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <i class="fas fa-plus"></i>
          <span>Novo Usuário</span>
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Buscar
          </label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome ou email..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            v-model="filters.status"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
            <option value="SUSPENDED">Suspenso</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Role
          </label>
          <select
            v-model="filters.role"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-all duration-200"
          >
            <option value="">Todos</option>
            <option value="ADMIN">Administrador</option>
            <option value="CUSTOMER">Cliente</option>
            <option value="MANAGER">Gerente</option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="loadUsers"
            class="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <i class="fas fa-search"></i>
            <span>Filtrar</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-8 text-center">
      <i class="fas fa-spinner fa-spin text-3xl text-primary-600 mb-4"></i>
      <p class="text-gray-600 dark:text-gray-400">Carregando usuários...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-8 text-center">
      <i class="fas fa-exclamation-triangle text-3xl text-red-600 mb-4"></i>
      <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
      <button
        @click="loadUsers"
        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
      >
        Tentar Novamente
      </button>
    </div>

    <!-- Tabela -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Usuário
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Criado em
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-for="user in filteredUsers" :key="user.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <i class="fas fa-user text-primary-600 dark:text-primary-400"></i>
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ user.name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ user.email }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getRoleBadgeClass(user.role)">
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusBadgeClass(user.status)">
                {{ getStatusLabel(user.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(user.createdAt) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="editUser(user)"
                  class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  @click="toggleUserStatus(user)"
                  :class="user.status === 'ACTIVE' ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'"
                  class="transition-colors duration-200"
                >
                  <i :class="user.status === 'ACTIVE' ? 'fas fa-pause' : 'fas fa-play'"></i>
                </button>
                <button
                  @click="deleteUser(user)"
                  class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="filteredUsers.length === 0 && !loading" class="p-8 text-center">
        <i class="fas fa-users text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Nenhum usuário encontrado</p>
      </div>
    </div>

    <!-- Paginação -->
    <div v-if="filteredUsers.length > 0" class="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Mostrando {{ filteredUsers.length }} de {{ users.length }} usuários
        </div>
      </div>
    </div>
  </div>

  <!-- Modal de criação/edição -->
  <UserForm
    v-if="showCreateModal || showEditModal"
    :user="editingUser"
    :is-edit="showEditModal"
    @close="closeModal"
    @success="onUserSuccess"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import usersService from '../../services/users'
import UserForm from './UserForm.vue'

// Estado do componente
const users = ref([])
const loading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUser = ref(null)

// Filtros
const filters = ref({
  search: '',
  status: '',
  role: ''
})

// Computed
const filteredUsers = computed(() => {
  let filtered = users.value

  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    )
  }

  if (filters.value.status) {
    filtered = filtered.filter(user => user.status === filters.value.status)
  }

  if (filters.value.role) {
    filtered = filtered.filter(user => user.role === filters.value.role)
  }

  return filtered
})

// Métodos
const loadUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const result = await usersService.getAll()
    
    if (result.success) {
      users.value = result.data
    } else {
      error.value = result.message
    }
  } catch (err) {
    console.error('Erro ao carregar usuários:', err)
    error.value = 'Erro ao carregar usuários'
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  editingUser.value = { ...user }
  showEditModal.value = true
}

const deleteUser = async (user) => {
  if (!confirm(`Tem certeza que deseja deletar o usuário "${user.name}"?`)) {
    return
  }

  try {
    const result = await usersService.delete(user.id)
    
    if (result.success) {
      await loadUsers()
      // Mostrar notificação de sucesso
    } else {
      error.value = result.message
    }
  } catch (err) {
    console.error('Erro ao deletar usuário:', err)
    error.value = 'Erro ao deletar usuário'
  }
}

const toggleUserStatus = async (user) => {
  const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  
  try {
    const result = await usersService.updateStatus(user.id, newStatus)
    
    if (result.success) {
      await loadUsers()
      // Mostrar notificação de sucesso
    } else {
      error.value = result.message
    }
  } catch (err) {
    console.error('Erro ao alterar status:', err)
    error.value = 'Erro ao alterar status do usuário'
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUser.value = null
}

const onUserSuccess = () => {
  closeModal()
  loadUsers()
}

// Utilitários
const getRoleBadgeClass = (role) => {
  const classes = {
    ADMIN: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full',
    CUSTOMER: 'px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 rounded-full',
    MANAGER: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full'
  }
  return classes[role] || classes.CUSTOMER
}

const getRoleLabel = (role) => {
  const labels = {
    ADMIN: 'Administrador',
    CUSTOMER: 'Cliente',
    MANAGER: 'Gerente'
  }
  return labels[role] || role
}

const getStatusBadgeClass = (status) => {
  const classes = {
    ACTIVE: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full',
    INACTIVE: 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded-full',
    SUSPENDED: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full'
  }
  return classes[status] || classes.INACTIVE
}

const getStatusLabel = (status) => {
  const labels = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    SUSPENDED: 'Suspenso'
  }
  return labels[status] || status
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>
