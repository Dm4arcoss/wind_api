<template>
  <div class="container mx-auto p-4">
    <div class="bg-gray-800 rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-4">
        {{ isEditing ? 'Editar Produto' : 'Novo Produto' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Nome:
          </label>
          <input
            v-model="product.name"
            type="text"
            class="w-full p-2 border rounded bg-gray-700 text-white"
            required
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Categoria:
          </label>
          <select
            v-model="product.categoryId"
            class="w-full p-2 border rounded bg-gray-700 text-white"
            required
          >
            <option value="">Selecione uma categoria</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-white text-sm font-bold mb-2">
            Preço:
          </label>
          <input
            v-model="product.price"
            type="number"
            step="0.01"
            class="w-full p-2 border rounded bg-gray-700 text-white"
            required
          >
        </div>

        <div>
          <label class="block text-white text-sm font-bold mb-2">
            Estoque:
          </label>
          <input
            v-model="product.stock"
            type="number"
            min="0"
            class="w-full p-2 border rounded bg-gray-700 text-white"
            required
          >
        </div>

        <div>
          <label class="block text-white text-sm font-bold mb-2">
            URL da Imagem:
          </label>
          <input
            v-model="product.imageUrl"
            type="url"
            class="w-full p-2 border rounded bg-gray-700 text-white"
          >
        </div>

        <div>
          <label class="block text-white text-sm font-bold mb-2">
            Descrição:
          </label>
          <textarea
            v-model="product.description"
            class="w-full p-2 border rounded bg-gray-700 text-white"
            rows="3"
            required
          ></textarea>
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.back()"
            class="px-4 py-2 text-white hover:text-gray-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="!hasToken || !isValidForm || isLoading"
            :class="{
              'bg-blue-500 text-white px-4 py-2 rounded': true,
              'hover:bg-blue-600': !isLoading,
              'bg-gray-400 cursor-not-allowed': isLoading || !isValidForm || !hasToken
            }"
          >
            <span v-if="isLoading">Salvando...</span>
            <span v-else>{{ isEditing ? 'Atualizar' : 'Salvar' }}</span>
          </button>
        </div>
      </form>
      
      <!-- Mensagem de erro -->
      <div v-if="error" class="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script>
import productsService from '@/services/products';
import categoriesService from '@/services/categories';

export default {
  data() {
    return {
      product: {
        name: '',
        description: '',
        price: '',
        stock: 1,
        imageUrl: '',
        categoryId: ''
      },
      categories: [],
      isEditing: false,
      error: null,
      isLoading: false
    };
  },
  computed: {
    hasToken() {
      return localStorage.getItem('token');
    },
    isValidForm() {
      return this.product.name && this.product.categoryId && this.product.price;
    }
  },
  async created() {
    await this.loadCategories();
    
    const id = this.$route.params.id;
    if (id) {
      this.isEditing = true;
      await this.loadProduct(id);
    }
  },
  methods: {
    async loadCategories() {
      try {
        const response = await categoriesService.getAll();
        this.categories = response.data;
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    },
    async loadProduct(id) {
      try {
        const response = await productsService.getById(id);
        this.product = response.data;
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      }
    },
    async handleSubmit() {
      // Verificar se tem token
      const token = localStorage.getItem('token');
      if (!token) {
        this.error = 'Você precisa estar logado para cadastrar produtos';
        return;
      }

      if (!this.isValidForm) {
        this.error = 'Por favor, preencha todos os campos obrigatórios';
        return;
      }

      try {
        this.isLoading = true;
        this.error = null;

        // Garantir que os dados estão no formato correto
        const productData = {
          name: this.product.name.trim(),
          description: this.product.description.trim(),
          price: parseFloat(this.product.price),
          stock: parseInt(this.product.stock),
          imageUrl: this.product.imageUrl.trim() || '',
          categoryId: parseInt(this.product.categoryId)
        };

        // Log detalhado dos dados
        console.log('Dados brutos:', this.product);
        console.log('Dados formatados:', productData);
        console.log('Token:', token);

        // Adicionar token manualmente para debug
        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        // Verificar se o token está sendo adicionado corretamente
        console.log('Configuração da requisição:', config);

        // Enviar dados sem usar JSON.stringify
        if (this.isEditing) {
          await productsService.update(this.$route.params.id, productData, config);
        } else {
          await productsService.create(productData, config);
        }

        this.$router.push('/dashboard/products');
      } catch (error) {
        console.error('Erro ao salvar produto:', error);
        // Tratar erros específicos
        if (error.response?.status === 400) {
          const errors = error.response?.data?.errors || [];
          if (errors.length > 0) {
            this.error = errors.join('\n');
          } else {
            this.error = error.response?.data?.message || 'Erro ao salvar o produto';
          }
        } else if (error.response?.status === 401) {
          this.error = 'Sessão expirada. Por favor, faça login novamente.';
        } else {
          this.error = 'Erro ao salvar o produto. Por favor, tente novamente.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
