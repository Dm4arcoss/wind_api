<template>
  <div class="container mx-auto p-4">
    <div class="bg-gray-800 rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-4">
        {{ isEditing ? 'Editar Categoria' : 'Nova Categoria' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Nome:
          </label>
          <input
            v-model="category.name"
            type="text"
            class="w-full p-2 border rounded bg-gray-700 text-white"
            required
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Descrição:
          </label>
          <textarea
            v-model="category.description"
            class="w-full p-2 border rounded bg-gray-700 text-white"
            rows="3"
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
            :disabled="!isValidForm || isLoading"
            :class="{
              'bg-blue-600 text-white px-4 py-2 rounded': true,
              'hover:bg-blue-700': !isLoading,
              'bg-gray-400 cursor-not-allowed': isLoading || !isValidForm
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
import categoriesService from '@/services/categories';

export default {
  data() {
    return {
      category: {
        name: '',
        description: ''
      },
      isEditing: false,
      error: null,
      isLoading: false
    };
  },
  async created() {
    const id = this.$route.params.id;
    if (id) {
      this.isEditing = true;
      await this.loadCategory(id);
    }
  },
  computed: {
    isValidForm() {
      return this.category.name.trim() !== '';
    }
  },
  methods: {
    async loadCategory(id) {
      try {
        const response = await categoriesService.getById(id);
        this.category = response.data;
      } catch (error) {
        console.error('Erro ao carregar categoria:', error);
        this.error = error.response?.data?.message || 'Erro ao carregar a categoria';
      }
    },
    async handleSubmit() {
      if (!this.isValidForm) {
        this.error = 'Por favor, preencha o nome da categoria';
        return;
      }

      try {
        this.isLoading = true;
        this.error = null;

        // Garantir que os dados estão no formato correto
        const categoryData = {
          name: this.category.name.trim()
        };

        // Log para debug
        console.log('Dados enviados:', categoryData);

        // Verificar se temos um token de autenticação
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Você precisa estar logado para cadastrar categorias';
          return;
        }

        if (this.isEditing) {
          await categoriesService.update(this.$route.params.id, categoryData);
        } else {
          await categoriesService.create(categoryData);
        }

        this.$router.push('/dashboard/categories');
      } catch (error) {
        console.error('Erro ao salvar categoria:', error);
        // Verificar o tipo de erro
        if (error.response?.status === 401) {
          this.error = 'Sessão expirada. Por favor, faça login novamente.';
        } else if (error.response?.status === 400) {
          // Extrair erros específicos da API
          const errors = error.response?.data?.errors || [];
          if (errors.length > 0) {
            this.error = errors.join('\n');
          } else {
            this.error = error.response?.data?.message || 'Erro ao salvar a categoria';
          }
        } else {
          this.error = 'Erro ao salvar a categoria. Por favor, tente novamente.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
