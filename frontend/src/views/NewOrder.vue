<template>
  <div class="p-6">
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div class="p-6">
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Criar Novo Pedido</h2>

        <!-- Loading e Erros -->
        <div v-if="isLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Carregando dados...</p>
        </div>

        <div v-if="hasError" class="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded relative mb-6">
          <strong class="font-bold">Erro!</strong>
          <span class="block sm:inline">Não foi possível carregar os dados. Por favor, tente novamente.</span>
        </div>

        <!-- Seleção de Cliente -->
        <div v-if="!isLoading && !hasError" class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cliente
          </label>
          <select v-model="selectedClient" class="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
            <option value="">Selecione um cliente</option>
            <option v-for="client in clients" :key="client.id" :value="client.id">
              {{ client.name }}
            </option>
          </select>
        </div>

        <!-- Lista de Produtos -->
        <div v-if="!isLoading && !hasError" class="mb-6">
          <div class="space-y-4">
            <!-- Dropdown de Produtos -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Selecione um Produto</label>
              <select v-model="selectedProduct" class="w-full p-2 border rounded">
                <option value="">Selecione um produto</option>
                <option v-for="product in filteredProducts" :key="product.id" :value="product">
                  {{ product.name }} - R$ {{ product.price.toFixed(2) }}
                </option>
              </select>
            </div>

            <!-- Quantidade -->
            <div v-if="selectedProduct">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantidade</label>
              <input v-model.number="productQuantity" type="number" min="1" class="w-full p-2 border rounded" />
            </div>

            <!-- Botão Adicionar -->
            <div v-if="selectedProduct" class="pt-4">
              <button 
                @click="addToCart(selectedProduct, productQuantity)" 
                class="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Adicionar ao Carrinho
              </button>
            </div>

            <!-- Lista de Produtos Selecionados -->
            <div v-if="cartItems.length > 0" class="mt-6">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Produtos no Carrinho</h3>
              <div class="space-y-3">
                <div v-for="item in cartItems" :key="item.productId" class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ item.product?.name || 'Produto não encontrado' }}</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-300">R$ {{ item.product?.price?.toFixed(2) || '0.00' }} x {{ item.quantity }}</p>
                  </div>
                  <div class="flex items-center space-x-2">
                    <button @click="updateQuantity(item.productId, -1)" class="p-1 rounded text-gray-500 hover:text-gray-700">
                      <i class="fas fa-minus"></i>
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.productId, 1)" class="p-1 rounded text-gray-500 hover:text-gray-700">
                      <i class="fas fa-plus"></i>
                    </button>
                    <button @click="removeProduct(item.productId)" class="p-1 rounded text-red-500 hover:text-red-700">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Carrinho -->
        <div class="mt-8">
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Carrinho</h3>
            <div v-if="cartItems.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
              Carrinho vazio
            </div>
            <div v-else class="space-y-4">
              <div v-for="(item, index) in cartItems" :key="item.id" class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <h4 class="font-medium text-gray-900 dark:text-white">{{ item.name }}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-300">R$ {{ (item.price * item.quantity).toFixed(2) }}</p>
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
                <button @click="removeItem(index)" class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex justify-between items-center">
                  <p class="text-gray-700 dark:text-gray-300">Total:</p>
                  <p class="font-medium text-gray-900 dark:text-white">R$ {{ total.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão de Finalizar Compra -->
        <div class="mt-8">
          <button 
            @click="finalizeOrder" 
            :disabled="!selectedClient || cartItems.length === 0"
            class="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useCustomersStore } from '../stores/customers'
import { useProductsStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import api from '@/services/api'

const customersStore = useCustomersStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const selectedClient = ref(null)
const selectedProduct = ref(null)
const productQuantity = ref(1)
const isLoading = ref(true)
const hasError = ref(false)

// Computeds
const clients = computed(() => customersStore.customers)
const filteredProducts = computed(() => productsStore.filteredProducts)
const cartItems = computed(() => cartStore.itemsWithProducts)
const total = computed(() => cartItems.value.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0))

// Computado para obter o nome do cliente selecionado
const getSelectedClientName = computed(() => {
  if (!selectedClient.value) return ''
  const client = clients.value.find(c => c.id === selectedClient.value)
  return client?.name || 'Cliente não encontrado'
})

// Funções do carrinho
const addToCart = () => {
  if (selectedProduct.value && productQuantity.value > 0) {
    cartStore.setProducts(productsStore.products) // Atualizar produtos no carrinho
    cartStore.addItem(selectedProduct.value.id, productQuantity.value)
    selectedProduct.value = null
    productQuantity.value = 1
  }
}

const updateQuantity = (productId, delta) => {
  const item = cartItems.value.find(item => item.productId === productId)
  if (item) {
    const newQuantity = item.quantity + delta
    if (newQuantity > 0) {
      cartStore.updateQuantity(productId, newQuantity)
    } else {
      cartStore.removeItem(productId)
    }
  }
}

const removeProduct = (productId) => {
  if (confirm('Tem certeza que deseja remover este produto?')) {
    cartStore.removeItem(productId)
  }
}

// Função para finalizar o pedido
const finalizeOrder = async () => {
  try {
    // Verificar se o usuário está logado
    const userId = localStorage.getItem('userId')
    if (!userId) {
      alert('Você precisa fazer login para criar um pedido. Redirecionando para a página de login...')
      // Redirecionar para login
      window.location.href = '/login'
      return
    }

    // Verificar se o userId é um número válido
    const userIdNumber = Number(userId)
    if (isNaN(userIdNumber)) {
      alert('ID do usuário inválido. Por favor, faça login novamente.')
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      window.location.href = '/login'
      return
    }

    if (!selectedClient.value || cartItems.value.length === 0) {
      alert('Por favor, selecione um cliente e adicione produtos ao carrinho')
      return
    }

    isLoading.value = true
    hasError.value = false

    // Criar o objeto de pedido com os produtos corretos
    const order = {
      userId: userIdNumber, // Usar o userId convertido
      customerId: Number(selectedClient.value),
      items: cartItems.value.map(item => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity)
      }))
    }

    // Verificar se todos os produtos existem antes de enviar
    const missingProducts = order.items.filter(item => {
      const product = productsStore.products.find(p => p.id === item.productId)
      return !product
    })

    if (missingProducts.length > 0) {
      alert('Alguns produtos não foram encontrados. Por favor, recarregue a página e tente novamente.')
      return
    }

    // Verificar se o estoque é suficiente
    const insufficientStock = order.items.some(item => {
      const product = productsStore.products.find(p => p.id === item.productId)
      return product && product.stock < item.quantity
    })

    if (insufficientStock) {
      alert('Estoque insuficiente para alguns produtos. Por favor, ajuste as quantidades.')
      return
    }

    const response = await api.post('/orders', order)
    console.log('Pedido criado:', response.data)

    alert('Pedido criado com sucesso!')
    cartStore.clearCart()
    selectedClient.value = ''
  } catch (error) {
    console.error('Erro ao criar pedido:', error)
    hasError.value = true
    
    // Tratamento de erros específicos
    if (error.response?.status === 400) {
      if (error.response.data?.message?.includes('estoque')) {
        alert('Estoque insuficiente para alguns produtos. Por favor, ajuste as quantidades.')
      } else {
        alert('Dados inválidos. Por favor, verifique as informações e tente novamente.')
      }
    } else if (error.response?.status === 404) {
      alert('Usuário, cliente ou produto não encontrado. Por favor, verifique as informações e tente novamente.')
    } else {
      alert('Erro ao criar pedido. Por favor, tente novamente.')
    }
    
    console.error('Detalhes do erro:', error.response?.data)
  } finally {
    isLoading.value = false
  }
}

// Carregar dados iniciais
onMounted(async () => {
  try {
    isLoading.value = true
    hasError.value = false
    await Promise.all([
      customersStore.fetchCustomers(),
      productsStore.fetchProducts()
    ])
  } catch (err) {
    hasError.value = true
    console.error('Erro ao carregar dados iniciais:', err)
  } finally {
    isLoading.value = false
  }
})

// Funções de carregamento
const load = async (store, action) => {
  try {
    isLoading.value = true
    hasError.value = false
    await store[action]()
  } catch (err) {
    hasError.value = true
    console.error(`Erro ao carregar ${action}:`, err)
  } finally {
    isLoading.value = false
  }
}

const fetchClients = () => load(customersStore, 'fetchCustomers')
const fetchProducts = () => load(productsStore, 'fetchProducts')
</script>
