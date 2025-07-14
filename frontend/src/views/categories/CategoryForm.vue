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
        const name = this.category.name.trim();
        const slug = name.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');

        const categoryData = {
          name: name,
          slug: slug,
          description: this.category.description.trim()
        };

        // Log detalhado para debug
        console.log('=== Início do processo de envio ===');
        console.log('Token:', localStorage.getItem('token'));
        console.log('Dados brutos:', this.category);
        console.log('Dados formatados:', categoryData);
        console.log('É edição:', this.isEditing);
        console.log('ID:', this.$route.params.id);

        // Verificar se o nome está vazio
        if (!name) {
          this.error = 'O nome da categoria não pode estar vazio';
          return;
        }

        // Verificar se o slug está vazio
        if (!slug) {
          this.error = 'Não foi possível gerar o slug da categoria. Por favor, use apenas letras e números no nome.';
          return;
        }

        // Verificar se temos um token de autenticação
        const token = localStorage.getItem('token');
        console.log('=== Verificação de autenticação ===');
        console.log('Token encontrado:', !!token);
        console.log('Token:', token);
        
        if (!token) {
          this.error = 'Você precisa estar logado para cadastrar categorias';
          return;
        }

        // Verificar se o token está válido e se o usuário tem permissão
        try {
          // Configurar token para esta requisição
          this.$axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await this.$axios.get(`${API_URL}/auth/validate`);
          
          // Verificar se o usuário tem permissão para criar categorias
          const user = response.data;
          console.log('Usuário:', user);
          
          if (!user.role || user.role !== 'CUSTOMER') {
            this.error = 'Você não tem permissão para criar categorias';
            return;
          }
          
          console.log('Token válido:', response.data);
        } catch (error) {
          console.error('Erro ao salvar categoria:', error);
          if (error.response?.status === 401) {
            this.error = 'Sessão expirada. Por favor, faça login novamente.';
          } else if (error.response?.status === 400) {
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

        // Remover qualquer propriedade não utilizada
        Object.keys(categoryData).forEach(key => {
          if (key !== 'name' && key !== 'slug') {
            delete categoryData[key];
          }
        });

        console.log('Payload final:', categoryData);
        console.log('Propriedades:', Object.keys(categoryData));
        console.log('JSON:', JSON.stringify(categoryData));

        if (this.isEditing) {
          console.log('=== Iniciando atualização ===');
          console.log('ID:', this.$route.params.id);
          console.log('Payload:', categoryData);
          const updateResponse = await categoriesService.update(this.$route.params.id, categoryData);
          console.log('Resposta da atualização:', updateResponse);
        } else {
          console.log('=== Iniciando criação ===');
          console.log('Payload:', categoryData);
          const createResponse = await categoriesService.create(categoryData);
          console.log('Resposta da criação:', createResponse);
        }

        // Verificar se o nome está vazio
        if (!categoryData.name) {
          this.error = 'O nome da categoria não pode estar vazio';
          return;
        }

        if (this.isEditing) {
          console.log('=== Iniciando atualização ===');
          console.log('ID:', this.$route.params.id);
          console.log('Payload:', categoryData);
          const updateResponse = await categoriesService.update(this.$route.params.id, categoryData);
          console.log('Resposta da atualização:', updateResponse);
        } else {
          console.log('=== Iniciando criação ===');
          console.log('Payload:', categoryData);
          const createResponse = await categoriesService.create(categoryData);
          console.log('Resposta da criação:', createResponse);
        }

        this.$router.push('/dashboard/categories');
      } catch (error) {
        console.error('=== Erro detalhado ===');
        console.error('Status:', error.response?.status);
        console.error('Dados da resposta:', error.response?.data);
        console.error('Mensagem:', error.response?.data?.message);
        console.error('Erros:', error.response?.data?.errors);
        console.error('Erro completo:', error);

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
