<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      Processar Pagamento
    </h3>

    <form @submit.prevent="processPayment" class="space-y-4">
      <!-- Método de Pagamento -->
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Método de Pagamento
        </label>
        <select
          v-model="paymentData.method"
          @change="onMethodChange"
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          required
        >
          <option value="">Selecione um método</option>
          <option value="credit">Cartão de Crédito</option>
          <option value="pix">PIX</option>
          <option value="boleto">Boleto</option>
        </select>
      </div>

      <!-- Dados do Cartão de Crédito -->
      <div v-if="paymentData.method === 'credit'" class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Número do Cartão
            </label>
            <input
              v-model="paymentData.cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bandeira
            </label>
            <select
              v-model="paymentData.cardBrand"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Selecione</option>
              <option value="visa">Visa</option>
              <option value="mastercard">Mastercard</option>
              <option value="amex">American Express</option>
              <option value="elo">Elo</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Validade
            </label>
            <input
              v-model="paymentData.cardExpiry"
              type="text"
              placeholder="MM/AA"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CVV
            </label>
            <input
              v-model="paymentData.cardCvc"
              type="text"
              placeholder="123"
              maxlength="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div class="flex items-end">
            <button
              type="button"
              @click="generateTestCard"
              class="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
            >
              Teste
            </button>
          </div>
        </div>
      </div>

      <!-- Dados do PIX -->
      <div v-if="paymentData.method === 'pix'" class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Chave PIX
          </label>
          <input
            v-model="paymentData.pixKey"
            type="text"
            placeholder="exemplo@email.com"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              QR Code
            </label>
            <input
              v-model="paymentData.pixQrCode"
              type="text"
              placeholder="Código QR do PIX"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Expira em
            </label>
            <input
              v-model="paymentData.pixExpiresAt"
              type="datetime-local"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
      </div>

      <!-- Dados do Boleto -->
      <div v-if="paymentData.method === 'boleto'" class="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Código de Barras
          </label>
          <input
            v-model="paymentData.boletoBarcode"
            type="text"
            placeholder="Código de barras do boleto"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Data de Vencimento
            </label>
            <input
              v-model="paymentData.boletoDueDate"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL do Boleto
            </label>
            <input
              v-model="paymentData.boletoUrl"
              type="url"
              placeholder="https://boleto.example.com"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
        </div>
      </div>

      <!-- Botões -->
      <div class="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <span v-if="loading">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Processando...
          </span>
          <span v-else>
            <i class="fas fa-credit-card mr-2"></i>
            Processar Pagamento
          </span>
        </button>
      </div>
    </form>

    <!-- Resultado do Processamento -->
    <div v-if="paymentResult" class="mt-6 p-4 rounded-md" :class="paymentResult.success ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
      <div class="flex">
        <div class="flex-shrink-0">
          <i :class="paymentResult.success ? 'fas fa-check-circle text-green-400' : 'fas fa-exclamation-circle text-red-400'"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium" :class="paymentResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
            {{ paymentResult.success ? 'Pagamento Processado!' : 'Erro no Pagamento' }}
          </h3>
          <div class="mt-2 text-sm" :class="paymentResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
            <p>{{ paymentResult.message }}</p>
            <div v-if="paymentResult.data" class="mt-2 space-y-1">
              <p><strong>Status:</strong> {{ getStatusLabel(paymentResult.data.status) }}</p>
              <p v-if="paymentResult.data.transactionId"><strong>ID da Transação:</strong> {{ paymentResult.data.transactionId }}</p>
              <p v-if="paymentResult.data.metadata && paymentResult.data.metadata.qrCode"><strong>QR Code:</strong> {{ paymentResult.data.metadata.qrCode }}</p>
              <p v-if="paymentResult.data.metadata && paymentResult.data.metadata.barcode"><strong>Código de Barras:</strong> {{ paymentResult.data.metadata.barcode }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import paymentsService from '@/services/payments'

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['success', 'cancel'])

const loading = ref(false)
const paymentResult = ref(null)

const paymentData = reactive({
  method: '',
  cardNumber: '',
  cardExpiry: '',
  cardCvc: '',
  cardBrand: '',
  pixKey: '',
  pixQrCode: '',
  pixExpiresAt: '',
  boletoBarcode: '',
  boletoDueDate: '',
  boletoUrl: ''
})

const onMethodChange = () => {
  // Limpar dados quando mudar o método
  paymentData.cardNumber = ''
  paymentData.cardExpiry = ''
  paymentData.cardCvc = ''
  paymentData.cardBrand = ''
  paymentData.pixKey = ''
  paymentData.pixQrCode = ''
  paymentData.pixExpiresAt = ''
  paymentData.boletoBarcode = ''
  paymentData.boletoDueDate = ''
  paymentData.boletoUrl = ''
  paymentResult.value = null
}

const generateTestCard = () => {
  paymentData.cardNumber = '4111 1111 1111 1111'
  paymentData.cardExpiry = '12/25'
  paymentData.cardCvc = '123'
  paymentData.cardBrand = 'visa'
}

const processPayment = async () => {
  loading.value = true
  paymentResult.value = null

  try {
    const result = await paymentsService.processPayment({
      orderId: props.orderId,
      amount: props.amount,
      ...paymentData
    })

    if (result.success) {
      paymentResult.value = {
        success: true,
        message: 'Pagamento processado com sucesso!',
        data: result.data
      }
      emit('success', result.data)
    } else {
      paymentResult.value = {
        success: false,
        message: result.error || 'Erro ao processar pagamento'
      }
    }
  } catch (error) {
    paymentResult.value = {
      success: false,
      message: 'Erro interno ao processar pagamento'
    }
    console.error('Erro ao processar pagamento:', error)
  } finally {
    loading.value = false
  }
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
</script> 