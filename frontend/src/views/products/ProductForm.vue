<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
    <div class="max-w-2xl mx-auto px-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
          </h1>
          <button
            @click="$router.push('/products')"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <!-- Debug Panel -->
        <div v-if="showDebug" class="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 class="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Debug Info:</h3>
          <div class="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <div>Token: {{ hasToken ? '✅ Presente' : '❌ Ausente' }}</div>
            <div>Form Válido: {{ isFormValid ? '✅ Sim' : '❌ Não' }}</div>
            <div>Loading: {{ isLoading ? '✅ Sim' : '❌ Não' }}</div>
            <div>Nome: "{{ form.name }}" ({{ form.name.length }} chars)</div>
            <div>Descrição: "{{ form.description }}" ({{ form.description.length }} chars)</div>
            <div>Preço: {{ form.price }} ({{ typeof form.price }})</div>
            <div>Estoque: {{ form.stock }} ({{ typeof form.stock }})</div>
            <div>Categoria: {{ form.categoryId || 'Não selecionada' }}</div>
            <div>Categorias carregadas: {{ categories.length }}</div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 mr-2"></i>
            <span class="text-red-800 dark:text-red-200">{{ error }}</span>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div class="flex items-center">
            <i class="fas fa-check-circle text-green-500 mr-2"></i>
            <span class="text-green-800 dark:text-green-200">{{ successMessage }}</span>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Nome do Produto -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Produto *
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': showErrors && !form.name.trim() }"
              placeholder="Digite o nome do produto"
              required
            />
            <p v-if="showErrors && !form.name.trim()" class="mt-1 text-sm text-red-600 dark:text-red-400">
              Nome é obrigatório
            </p>
          </div>

          <!-- Categoria -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categoria *
            </label>
            <select
              id="category"
              v-model="form.categoryId"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': showErrors && !form.categoryId }"
              required
            >
              <option value="">Selecione uma categoria</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
            <p v-if="showErrors && !form.categoryId" class="mt-1 text-sm text-red-600 dark:text-red-400">
              Categoria é obrigatória
            </p>
          </div>

          <!-- Preço e Estoque -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="price" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preço *
              </label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">R$</span>
                <input
                  id="price"
                  v-model.number="form.price"
                  type="number"
                  step="0.01"
                  min="0"
                  class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  :class="{ 'border-red-500': showErrors && (!form.price || form.price <= 0) }"
                  placeholder="0.00"
                  required
                />
              </div>
              <p v-if="showErrors && (!form.price || form.price <= 0)" class="mt-1 text-sm text-red-600 dark:text-red-400">
                Preço deve ser maior que zero
              </p>
            </div>

            <div>
              <label for="stock" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estoque *
              </label>
              <input
                id="stock"
                v-model.number="form.stock"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                :class="{ 'border-red-500': showErrors && (form.stock < 0 || form.stock === '') }"
                placeholder="0"
                required
              />
              <p v-if="showErrors && (form.stock < 0 || form.stock === '')" class="mt-1 text-sm text-red-600 dark:text-red-400">
                Estoque deve ser zero ou maior
              </p>
            </div>
          </div>

          <!-- URL da Imagem -->
          <div>
            <label for="imageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL da Imagem
            </label>
            <input
              id="imageUrl"
              v-model="form.imageUrl"
              type="url"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="https://exemplo.com/imagem.jpg"
            />
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Opcional - URL de uma imagem para o produto
            </p>
          </div>

          <!-- Descrição -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição *
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :class="{ 'border-red-500': showErrors && !form.description.trim() }"
              placeholder="Descreva o produto..."
              required
            ></textarea>
            <p v-if="showErrors && !form.description.trim()" class="mt-1 text-sm text-red-600 dark:text-red-400">
              Descrição é obrigatória
            </p>
          </div>

          <!-- Botões -->
          <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              @click="$router.push('/products')"
              class="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="!isFormValid || isLoading"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              <i v-if="isLoading" class="fas fa-spinner fa-spin mr-2"></i>
              {{ isLoading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Cadastrar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import productsService from '@/services/products'
import categoriesService from '@/services/categories'

const route = useRoute()
const router = useRouter()

// Estado do componente
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')
const showErrors = ref(false)
const showDebug = ref(false) // Set to true to show debug panel
const categories = ref([])
const isEditing = ref(false)

// Formulário
const form = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  imageUrl: '',
  categoryId: null
})

// Computed properties
const hasToken = computed(() => {
  const token = localStorage.getItem('token')
  return !!token
})

const isFormValid = computed(() => {
  return (
    hasToken.value &&
    form.name.trim().length > 0 &&
    form.description.trim().length > 0 &&
    form.categoryId !== null &&
    form.price > 0 &&
    form.stock >= 0
  )
})

// Watchers
watch(form, (newForm) => {
  console.log('🔍 Form changed:', newForm)
  if (showErrors.value) {
    validateForm()
  }
}, { deep: true })

// Methods
const validateForm = () => {
  console.log('🔍 Validating form...')
  const errors = []
  
  if (!form.name.trim()) errors.push('Nome é obrigatório')
  if (!form.description.trim()) errors.push('Descrição é obrigatória')
  if (!form.categoryId) errors.push('Categoria é obrigatória')
  if (!form.price || form.price <= 0) errors.push('Preço deve ser maior que zero')
  if (form.stock < 0) errors.push('Estoque deve ser zero ou maior')
  
  console.log('Validation errors:', errors)
  return errors.length === 0
}

const loadCategories = async () => {
  try {
    console.log('📂 Loading categories...')
    const response = await categoriesService.getAll()
    categories.value = response.data || []
    console.log('✅ Categories loaded:', categories.value.length)
  } catch (err) {
    console.error('❌ Error loading categories:', err)
    error.value = 'Erro ao carregar categorias. Tente novamente.'
  }
}

const loadProduct = async (id) => {
  try {
    console.log('📂 Loading product:', id)
    const response = await productsService.getById(id)
    const product = response.data
    
    // Preencher formulário
    form.name = product.name || ''
    form.description = product.description || ''
    form.price = product.price || 0
    form.stock = product.stock || 0
    form.imageUrl = product.imageUrl || ''
    form.categoryId = product.categoryId || null
    
    console.log('✅ Product loaded:', product)
  } catch (err) {
    console.error('❌ Error loading product:', err)
    error.value = 'Erro ao carregar produto. Tente novamente.'
  }
}

const handleSubmit = async () => {
  console.log('🚀 Submitting form...')
  
  if (!hasToken.value) {
    error.value = 'Você precisa estar logado para realizar esta ação.'
    return
  }
  
  showErrors.value = true
  
  if (!validateForm()) {
    error.value = 'Por favor, corrija os erros no formulário.'
    return
  }
  
  if (isLoading.value) return
  
  isLoading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const productData = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      imageUrl: form.imageUrl.trim() || null,
      categoryId: Number(form.categoryId)
    }
    
    console.log('📡 Sending product data:', productData)
    
    if (isEditing.value) {
      await productsService.update(route.params.id, productData)
      successMessage.value = 'Produto atualizado com sucesso!'
    } else {
      await productsService.create(productData)
      successMessage.value = 'Produto cadastrado com sucesso!'
    }
    
    console.log('✅ Product saved successfully')
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      router.push('/products')
    }, 2000)
    
  } catch (err) {
    console.error('❌ Error saving product:', err)
    
    if (err.response?.status === 401) {
      error.value = 'Sessão expirada. Faça login novamente.'
      router.push('/login')
    } else if (err.response?.status === 400) {
      error.value = err.response.data?.message || 'Dados inválidos. Verifique os campos.'
    } else if (err.response?.status === 404) {
      error.value = 'Produto não encontrado.'
    } else {
      error.value = err.message || 'Erro ao salvar produto. Tente novamente.'
    }
  } finally {
    isLoading.value = false
  }
}

// Lifecycle
onMounted(async () => {
  console.log('🎯 ProductForm mounted')
  
  try {
    await loadCategories()
    
    const productId = route.params.id
    if (productId) {
      isEditing.value = true
      await loadProduct(productId)
    }
  } catch (err) {
    console.error('❌ Error in initialization:', err)
  }
})
</script>