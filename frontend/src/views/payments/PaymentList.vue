<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
          Pagamentos
        </h1>
        <p class="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
          Gerencie todos os pagamentos do sistema
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <i class="fas fa-spinner fa-spin text-4xl text-primary-600 mb-4"></i>
        <p class="text-gray-600 dark:text-gray-400">Carregando pagamentos...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <i class="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i>
        <p class="text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
        <button
          @click="loadPayments"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
        >
          Tentar Novamente
        </button>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <!-- Filtros e Busca -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-300">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- Busca -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar
              </label>
              <input
                v-model="searchTerm"
                type="text"
                placeholder="Buscar por ID do pedido, método de pagamento..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              />
            </div>

            <!-- Filtro por Método -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Método
              </label>
              <select
                v-model="filterMethod"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              >
                <option value="">Todos</option>
                <option value="credit">Cartão de Crédito</option>
                <option value="pix">PIX</option>
                <option value="boleto">Boleto</option>
              </select>
            </div>

            <!-- Filtro por Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                v-model="filterStatus"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white transition-colors duration-200"
              >
                <option value="">Todos</option>
                <option value="pending">Pendente</option>
                <option value="completed">Concluído</option>
                <option value="failed">Falhou</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Lista de Pagamentos -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <!-- Header da Tabela -->
          <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Pagamentos ({{ filteredPayments.length }})
              </h3>
              <div class="flex space-x-2">
                <button
                  @click="loadPayments"
                  class="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <i class="fas fa-sync-alt mr-1"></i>
                  Atualizar
                </button>
              </div>
            </div>
          </div>

          <!-- Tabela -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pedido
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Método
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="payment in filteredPayments" :key="payment.id" class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      #{{ payment.orderId }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <i :class="getMethodIcon(payment.method)" class="mr-2"></i>
                      <span class="text-sm text-gray-900 dark:text-white">
                        {{ getMethodLabel(payment.method) }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ formatCurrency(payment.amount) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getStatusBadgeClass(payment.status)">
                      {{ getStatusLabel(payment.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ formatDate(payment.createdAt) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        @click="viewPayment(payment)"
                        class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                        title="Ver detalhes"
                      >
                        <i class="fas fa-eye"></i>
                      </button>
                      <button
                        @click="viewOrder(payment.orderId)"
                        class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
                        title="Ver pedido"
                      >
                        <i class="fas fa-shopping-cart"></i>
                      </button>
                      
                      <!-- Ações específicas por status -->
                      <template v-if="payment.status === 'pending'">
                        <button
                          v-if="payment.method === 'pix'"
                          @click="confirmPixPayment(payment.id)"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                          title="Confirmar PIX"
                        >
                          <i class="fas fa-check"></i>
                        </button>
                        <button
                          v-if="payment.method === 'boleto'"
                          @click="confirmBoletoPayment(payment.id)"
                          class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors duration-200"
                          title="Confirmar Boleto"
                        >
                          <i class="fas fa-check"></i>
                        </button>
                        <button
                          @click="cancelPayment(payment.id)"
                          class="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
                          title="Cancelar pagamento"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </template>
                      
                      <template v-if="payment.status === 'completed'">
                        <button
                          @click="refundPayment(payment.id)"
                          class="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 transition-colors duration-200"
                          title="Reembolsar"
                        >
                          <i class="fas fa-undo"></i>
                        </button>
                      </template>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredPayments.length === 0" class="text-center py-12">
              <i class="fas fa-credit-card text-4xl text-gray-400 mb-4"></i>
              <p class="text-gray-600 dark:text-gray-400">
                {{ searchTerm || filterMethod || filterStatus ? 'Nenhum pagamento encontrado com os filtros aplicados' : 'Nenhum pagamento encontrado' }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalhes do Pagamento -->
    <div v-if="selectedPayment" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Detalhes do Pagamento #{{ selectedPayment.id }}
            </h3>
            <button
              @click="selectedPayment = null"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <!-- Informações Gerais -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Pedido</label>
              <p class="text-sm text-gray-900 dark:text-white">#{{ selectedPayment.orderId }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor</label>
              <p class="text-sm font-medium text-gray-900 dark:text-white">{{ formatCurrency(selectedPayment.amount) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Método</label>
              <p class="text-sm text-gray-900 dark:text-white">{{ getMethodLabel(selectedPayment.method) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <span :class="getStatusBadgeClass(selectedPayment.status)">
                {{ getStatusLabel(selectedPayment.status) }}
              </span>
            </div>
          </div>

          <!-- Detalhes Específicos do Método -->
          <div v-if="selectedPayment.card" class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Dados do Cartão</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bandeira</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedPayment.card.brand }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Últimos 4 dígitos</label>
                <p class="text-sm text-gray-900 dark:text-white">**** {{ selectedPayment.card.number.slice(-4) }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedPayment.pix" class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Dados do PIX</h4>
            <div class="space-y-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Chave PIX</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ selectedPayment.pix.pixKey }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Expira em</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedPayment.pix.expiresAt) }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedPayment.boleto" class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">Dados do Boleto</h4>
            <div class="space-y-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Código de Barras</label>
                <p class="text-sm font-mono text-gray-900 dark:text-white">{{ selectedPayment.boleto.barcode }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Vencimento</label>
                <p class="text-sm text-gray-900 dark:text-white">{{ formatDate(selectedPayment.boleto.dueDate) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import paymentsService from '@/services/payments'

const router = useRouter()

// Estado
const loading = ref(false)
const error = ref('')
const payments = ref([])
const selectedPayment = ref(null)

// Filtros
const searchTerm = ref('')
const filterMethod = ref('')
const filterStatus = ref('')

// Computed
const filteredPayments = computed(() => {
  let filtered = payments.value

  // Filtro por busca
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    filtered = filtered.filter(payment => 
      payment.orderId.toString().includes(term) ||
      payment.method.toLowerCase().includes(term) ||
      payment.status.toLowerCase().includes(term)
    )
  }

  // Filtro por método
  if (filterMethod.value) {
    filtered = filtered.filter(payment => payment.method === filterMethod.value)
  }

  // Filtro por status
  if (filterStatus.value) {
    filtered = filtered.filter(payment => payment.status === filterStatus.value)
  }

  return filtered
})

// Métodos
const loadPayments = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const result = await paymentsService.getUserPayments()
    if (result.success) {
      payments.value = result.data
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Erro ao carregar pagamentos'
    console.error('Erro ao carregar pagamentos:', err)
  } finally {
    loading.value = false
  }
}

const viewPayment = (payment) => {
  selectedPayment.value = payment
}

const viewOrder = (orderId) => {
  router.push(`/dashboard/orders/${orderId}`)
}

// Utilitários
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

const getMethodLabel = (method) => {
  const labels = {
    credit: 'Cartão de Crédito',
    pix: 'PIX',
    boleto: 'Boleto'
  }
  return labels[method] || method
}

const getMethodIcon = (method) => {
  const icons = {
    credit: 'fas fa-credit-card text-blue-600',
    pix: 'fas fa-qrcode text-green-600',
    boleto: 'fas fa-barcode text-orange-600'
  }
  return icons[method] || 'fas fa-money-bill text-gray-600'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pendente',
    completed: 'Concluído',
    failed: 'Falhou',
    cancelled: 'Cancelado'
  }
  return labels[status] || status
}

const getStatusBadgeClass = (status) => {
  const classes = {
    pending: 'px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-full',
    completed: 'px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full',
    failed: 'px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400 rounded-full',
    cancelled: 'px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 rounded-full'
  }
  return classes[status] || classes.pending
}

// Confirmar pagamento PIX
const confirmPixPayment = async (paymentId) => {
  if (!confirm('Confirmar pagamento PIX?')) return
  
  try {
    const result = await paymentsService.confirmPixPayment(paymentId)
    if (result.success) {
      alert('Pagamento PIX confirmado com sucesso!')
      await loadPayments() // Recarregar lista
    } else {
      alert('Erro ao confirmar pagamento: ' + result.error)
    }
  } catch (err) {
    alert('Erro ao confirmar pagamento PIX')
    console.error('Erro ao confirmar PIX:', err)
  }
}

// Confirmar pagamento de boleto
const confirmBoletoPayment = async (paymentId) => {
  if (!confirm('Confirmar pagamento de boleto?')) return
  
  try {
    const result = await paymentsService.confirmBoletoPayment(paymentId)
    if (result.success) {
      alert('Pagamento de boleto confirmado com sucesso!')
      await loadPayments() // Recarregar lista
    } else {
      alert('Erro ao confirmar pagamento: ' + result.error)
    }
  } catch (err) {
    alert('Erro ao confirmar pagamento de boleto')
    console.error('Erro ao confirmar boleto:', err)
  }
}

// Cancelar pagamento
const cancelPayment = async (paymentId) => {
  if (!confirm('Tem certeza que deseja cancelar este pagamento?')) return
  
  try {
    const result = await paymentsService.cancelPayment(paymentId)
    if (result.success) {
      alert('Pagamento cancelado com sucesso!')
      await loadPayments() // Recarregar lista
    } else {
      alert('Erro ao cancelar pagamento: ' + result.error)
    }
  } catch (err) {
    alert('Erro ao cancelar pagamento')
    console.error('Erro ao cancelar pagamento:', err)
  }
}

// Reembolsar pagamento
const refundPayment = async (paymentId) => {
  const amount = prompt('Digite o valor do reembolso (deixe vazio para reembolso total):')
  if (amount === null) return // Usuário cancelou
  
  const refundAmount = amount ? parseFloat(amount) : null
  
  try {
    const result = await paymentsService.refundPayment(paymentId, refundAmount)
    if (result.success) {
      alert('Reembolso processado com sucesso!')
      await loadPayments() // Recarregar lista
    } else {
      alert('Erro ao processar reembolso: ' + result.error)
    }
  } catch (err) {
    alert('Erro ao processar reembolso')
    console.error('Erro ao reembolsar:', err)
  }
}

// Lifecycle
onMounted(() => {
  loadPayments()
})
</script> 