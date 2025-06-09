<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">Carrinho</h3>
      <button @click="clearCart" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
        Limpar Carrinho
      </button>
    </div>

    <div v-if="cartItems.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
      Carrinho vazio
    </div>

    <div v-else class="space-y-4">
      <div v-for="(item, index) in cartItems" :key="item.id" class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
        <div class="flex items-center">
          <div class="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded mr-4 flex items-center justify-center">
            <i class="fas fa-box text-gray-400 dark:text-gray-300 text-xl"></i>
          </div>
          <div>
            <h4 class="font-medium text-gray-900 dark:text-white">{{ item.name }}</h4>
            <p class="text-sm text-gray-600 dark:text-gray-300">R$ {{ item.price.toFixed(2) }}</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <button @click="decreaseQuantity(index)" class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            <i class="fas fa-minus text-gray-600 dark:text-gray-300"></i>
          </button>
          <span class="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-gray-800 dark:text-gray-200">
            {{ item.quantity }}
          </span>
          <button @click="increaseQuantity(index)" class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600">
            <i class="fas fa-plus text-gray-600 dark:text-gray-300"></i>
          </button>
        </div>
        <div>
          <p class="text-sm text-gray-600 dark:text-gray-300">
            R$ {{ (item.price * item.quantity).toFixed(2) }}
          </p>
        </div>
        <button @click="removeItem(index)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div v-if="cartItems.length > 0" class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
      <div class="flex justify-between items-center">
        <p class="text-gray-700 dark:text-gray-300">Total:</p>
        <p class="font-medium text-gray-900 dark:text-white">R$ {{ total.toFixed(2) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const cartItems = ref([])

const total = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const addProduct = (product) => {
  const existingItem = cartItems.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.value.push({
      ...product,
      quantity: 1
    })
  }
}

const removeItem = (index) => {
  cartItems.value.splice(index, 1)
}

const clearCart = () => {
  cartItems.value = []
}

const increaseQuantity = (index) => {
  cartItems.value[index].quantity += 1
}

const decreaseQuantity = (index) => {
  if (cartItems.value[index].quantity > 1) {
    cartItems.value[index].quantity -= 1
  }
}

// Expor as funções para uso no componente pai
const emit = defineEmits(['createOrder'])

const createOrder = async (clientId) => {
  if (cartItems.value.length === 0) {
    alert('Adicione produtos ao carrinho antes de criar o pedido')
    return
  }

  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        client_id: clientId,
        items: cartItems.value.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        }))
      })
    })

    if (!response.ok) {
      throw new Error('Erro ao criar pedido')
    }

    const order = await response.json()
    clearCart()
    emit('createOrder', order)
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    alert('Erro ao criar pedido. Tente novamente.')
  }
}

// Definir as propriedades que serão usadas
const props = defineProps({
  products: {
    type: Array,
    required: true
  }
})

// Definir as funções que serão usadas
const addToCart = (product) => {
  addProduct(product)
}
</script>
