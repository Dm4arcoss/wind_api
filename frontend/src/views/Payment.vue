<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
    <div class="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-8">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Resumo do Pedido</h1>

      <!-- Resumo do Pedido -->
      <div class="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded">
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">Cliente</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ customerName }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="text-gray-600 dark:text-gray-300">Total</span>
          <span class="font-medium text-gray-900 dark:text-white">R$ {{ total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Formulário de Pagamento -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Forma de Pagamento</h2>
        
        <!-- Seleção de Pagamento -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Escolha a forma de pagamento</label>
          <div class="flex space-x-4">
            <label class="flex items-center space-x-2">
              <input type="radio" v-model="paymentMethod" value="credit" class="form-radio">
              <span class="text-gray-700 dark:text-gray-300">Cartão de Crédito</span>
            </label>
            <label class="flex items-center space-x-2">
              <input type="radio" v-model="paymentMethod" value="boleto" class="form-radio">
              <span class="text-gray-700 dark:text-gray-300">Boleto</span>
            </label>
          </div>
        </div>

        <!-- Formulário de Cartão -->
        <div v-if="paymentMethod === 'credit'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Número do Cartão</label>
            <input v-model="cardNumber" type="text" placeholder="1234 5678 9012 3456" 
                   class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Validade</label>
              <input v-model="cardExpiry" type="text" placeholder="MM/AA" 
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVC</label>
              <input v-model="cardCvc" type="text" placeholder="123" 
                     class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
            </div>
          </div>
        </div>

        <!-- Formulário de Boleto -->
        <div v-if="paymentMethod === 'boleto'" class="space-y-4">
          <p class="text-gray-600 dark:text-gray-300">O boleto será gerado após a confirmação do pagamento.</p>
        </div>

        <!-- Botão de Pagamento -->
        <button @click="processPayment" 
                :disabled="isLoading" 
                class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50">
          {{ isLoading ? 'Processando...' : 'Finalizar Pagamento' }}
        </button>
      </div>

      <!-- Mensagem de Status -->
      <div v-if="statusMessage" class="mt-4 p-4 rounded" :class="statusClass">
        {{ statusMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../services/api';

const paymentMethod = ref('credit');
const cardNumber = ref('');
const cardExpiry = ref('');
const cardCvc = ref('');
const isLoading = ref(false);
const statusMessage = ref('');
const statusClass = ref('');

// Dados do pedido (você deve passar esses dados como props)
const props = defineProps({
  customerName: String,
  total: Number
});

const processPayment = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  statusMessage.value = '';

  try {
    const paymentData = {
      method: paymentMethod.value,
      amount: props.total,
      customer: props.customerName
    };

    if (paymentMethod.value === 'credit') {
      paymentData.card = {
        number: cardNumber.value,
        expiry: cardExpiry.value,
        cvc: cardCvc.value
      };
    }

    const response = await api.post('/payments/process', paymentData);

    if (response.data.success) {
      statusClass.value = 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300';
      statusMessage.value = `Pagamento realizado com sucesso! ID da transação: ${response.data.transactionId}`;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    statusClass.value = 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300';
    statusMessage.value = error.message || 'Erro ao processar pagamento. Por favor, tente novamente.';
  } finally {
    isLoading.value = false;
  }
};
</script>
