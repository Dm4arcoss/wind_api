<template>
  <div class="container mx-auto p-4">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pedido #{{ order.id }}</h1>
        <button @click="$router.back()" class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          Voltar
        </button>
      </div>

      <!-- Informações do Cliente -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Informações do Cliente</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold text-gray-700 dark:text-gray-300">Nome:</p>
            <p class="text-gray-900 dark:text-white">{{ order.customerName }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-700 dark:text-gray-300">Email:</p>
            <p class="text-gray-900 dark:text-white">{{ order.customerEmail }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-700 dark:text-gray-300">Telefone:</p>
            <p class="text-gray-900 dark:text-white">{{ order.customerPhone }}</p>
          </div>
          <div>
            <p class="font-semibold text-gray-700 dark:text-gray-300">Endereço:</p>
            <p class="text-gray-900 dark:text-white">{{ order.customerAddress }}</p>
          </div>
        </div>
      </div>

      <!-- Status do Pedido -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Status do Pedido</h2>
        <div class="flex items-center space-x-2">
          <span :class="getStatusClass(order.status)" class="px-2 py-1 rounded text-sm font-medium">
            {{ getStatusLabel(order.status) }}
          </span>
          <template v-if="order.status === 'pending'">
            <button @click="updateStatus('processing')" class="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
              Processar
            </button>
            <button @click="updateStatus('cancelled')" class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
              Cancelar
            </button>
          </template>
        </div>
      </div>

      <!-- Seção de Pagamento -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Pagamento</h2>
        
        <!-- Status do Pagamento -->
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="font-semibold text-gray-700 dark:text-gray-300">Status do Pagamento:</p>
              <span :class="getPaymentStatusClass(paymentStatus)" class="px-2 py-1 rounded text-sm font-medium">
                {{ getPaymentStatusLabel(paymentStatus) }}
              </span>
            </div>
            <div class="text-right">
              <p class="font-semibold text-gray-700 dark:text-gray-300">Valor Total:</p>
              <p class="text-xl font-bold text-green-600 dark:text-green-400">R$ {{ order.total }}</p>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="flex space-x-4">
          <!-- Botão para processar pagamento -->
          <button
            v-if="order.status !== 'cancelled' && paymentStatus !== 'completed'"
            @click="showPaymentForm = true"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
          >
            <i class="fas fa-credit-card mr-2"></i>
            Processar Pagamento
          </button>

          <!-- Botão para ver pagamentos -->
          <button
            v-if="paymentStatus === 'completed'"
            @click="viewPayments"
            class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            <i class="fas fa-eye mr-2"></i>
            Ver Pagamentos
          </button>

          <!-- Botão para cancelar pagamento -->
          <button
            v-if="paymentStatus === 'pending'"
            @click="cancelPayment"
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200"
          >
            <i class="fas fa-times mr-2"></i>
            Cancelar Pagamento
          </button>
        </div>

        <!-- Informações do Pagamento -->
        <div v-if="paymentInfo" class="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
          <h3 class="font-semibold mb-2 text-gray-900 dark:text-white">Informações do Pagamento</h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p class="text-gray-700 dark:text-gray-300"><strong>Método:</strong> {{ getMethodLabel(paymentInfo.method) }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Status:</strong> {{ getPaymentStatusLabel(paymentInfo.status) }}</p>
            </div>
            <div>
              <p class="text-gray-700 dark:text-gray-300"><strong>ID da Transação:</strong> {{ paymentInfo.transactionId || 'N/A' }}</p>
              <p class="text-gray-700 dark:text-gray-300"><strong>Data:</strong> {{ formatDate(paymentInfo.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Produtos do Pedido -->
      <div>
        <h2 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Produtos</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100 dark:bg-gray-700">
                <th class="px-6 py-3 text-left text-gray-900 dark:text-white">Produto</th>
                <th class="px-6 py-3 text-left text-gray-900 dark:text-white">Quantidade</th>
                <th class="px-6 py-3 text-left text-gray-900 dark:text-white">Preço Unitário</th>
                <th class="px-6 py-3 text-left text-gray-900 dark:text-white">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.productId" class="border-b border-gray-200 dark:border-gray-600">
                <td class="px-6 py-4 text-gray-900 dark:text-white">{{ item.productName }}</td>
                <td class="px-6 py-4 text-gray-900 dark:text-white">{{ item.quantity }}</td>
                <td class="px-6 py-4 text-gray-900 dark:text-white">R$ {{ item.price }}</td>
                <td class="px-6 py-4 text-gray-900 dark:text-white">R$ {{ item.subtotal }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="px-6 py-4 text-right font-bold text-gray-900 dark:text-white">
                  Total:
                </td>
                <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">
                  R$ {{ order.total }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Processamento de Pagamento -->
    <div v-if="showPaymentForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Processar Pagamento - Pedido #{{ order.id }}
            </h3>
            <button
              @click="showPaymentForm = false"
              class="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <i class="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <div class="p-6">
          <PaymentForm
            :orderId="order.id"
            :amount="order.total"
            @success="onPaymentSuccess"
            @cancel="showPaymentForm = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ordersService from '@/services/orders'
import customersService from '@/services/customers'
import paymentsService from '@/services/payments'
import PaymentForm from '@/components/PaymentForm.vue'

export default {
  name: 'OrderDetail',
  components: {
    PaymentForm
  },
  data() {
    return {
      order: {
        id: null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        status: '',
        items: [],
        total: 0
      },
      paymentStatus: '',
      paymentInfo: null,
      showPaymentForm: false
    }
  },
  async created() {
    const orderId = this.$route.params.id
    await this.loadOrder(orderId)
    await this.loadPaymentInfo(orderId)
  },
  methods: {
    async loadOrder(orderId) {
      try {
        const response = await ordersService.getById(orderId)
        const order = response.data
        
        // Carregar informações do cliente
        const customer = await customersService.getById(order.customerId)
        
        this.order = {
          ...order,
          customerName: customer.data.name,
          customerEmail: customer.data.email,
          customerPhone: customer.data.phone,
          customerAddress: customer.data.address
        }
      } catch (error) {
        console.error('Erro ao carregar pedido:', error)
      }
    },
    async loadPaymentInfo(orderId) {
      try {
        const response = await paymentsService.getPaymentsByOrder(orderId)
        if (response.success && response.data.length > 0) {
          this.paymentInfo = response.data[0]
          this.paymentStatus = this.paymentInfo.status
        } else {
          this.paymentStatus = 'pending'
        }
      } catch (error) {
        console.error('Erro ao carregar informações do pagamento:', error)
        this.paymentStatus = 'pending'
      }
    },
    async updateStatus(newStatus) {
      try {
        const orderId = this.$route.params.id
        await ordersService.updateStatus(orderId, newStatus)
        await this.loadOrder(orderId)
      } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error)
      }
    },
    async onPaymentSuccess(paymentData) {
      this.showPaymentForm = false
      this.paymentInfo = paymentData
      this.paymentStatus = paymentData.status
      
      // Atualizar status do pedido se o pagamento foi concluído
      if (paymentData.status === 'completed') {
        await this.updateStatus('completed')
      }
      
      alert('Pagamento processado com sucesso!')
    },
    getStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      }
      return classes[status] || ''
    },
    getStatusLabel(status) {
      const labels = {
        pending: 'Pendente',
        processing: 'Processando',
        completed: 'Concluído',
        cancelled: 'Cancelado'
      }
      return labels[status] || status
    },
    getPaymentStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
        cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
        failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      }
      return classes[status] || ''
    },
    getPaymentStatusLabel(status) {
      const labels = {
        pending: 'Pendente',
        completed: 'Completo',
        cancelled: 'Cancelado',
        failed: 'Falhou'
      }
      return labels[status] || status
    },
    getMethodLabel(method) {
      const labels = {
        credit: 'Cartão de Crédito',
        pix: 'PIX',
        boleto: 'Boleto'
      }
      return labels[method] || method
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    },
    async viewPayments() {
      this.$router.push('/payments')
    },
    async cancelPayment() {
      if (confirm('Tem certeza que deseja cancelar o pagamento?')) {
        try {
          if (this.paymentInfo && this.paymentInfo.id) {
            await paymentsService.cancelPayment(this.paymentInfo.id)
          }
          await this.loadPaymentInfo(this.order.id)
          alert('Pagamento cancelado com sucesso!')
        } catch (error) {
          console.error('Erro ao cancelar pagamento:', error)
          alert('Erro ao cancelar pagamento')
        }
      }
    }
  }
}
</script>
