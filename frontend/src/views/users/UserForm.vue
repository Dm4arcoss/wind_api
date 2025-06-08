<template>
  <div class="p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        {{ isEditing ? 'Editar Usuário' : 'Novo Usuário' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
          <input v-model="user.name" type="text" required
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 shadow-sm">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input v-model="user.email" type="email" required
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 shadow-sm">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Senha</label>
          <input v-model="user.password" type="password" required
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 shadow-sm">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirme a Senha</label>
          <input v-model="user.confirmPassword" type="password" required
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 shadow-sm">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Função</label>
          <select v-model="user.role" required
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 shadow-sm">
            <option value="">Selecione uma função</option>
            <option value="admin">Administrador</option>
            <option value="user">Usuário</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
          <select v-model="user.status" required
            class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-blue-500 focus:ring-blue-500 shadow-sm">
            <option value="active">Ativo</option>
            <option value="inactive">Inativo</option>
          </select>
        </div>

        <div class="flex justify-end space-x-3">
          <button type="button" @click="cancel"
            class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancelar
          </button>
          <button type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            :class="{ 'opacity-50 cursor-not-allowed': loading }">
            {{ isEditing ? 'Salvar' : 'Criar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import usersService from '@/services/users';

export default {
  name: 'UserForm',
  props: {
    id: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      isEditing: false,
      loading: false
    };
  },
  async created() {
    if (this.id) {
      this.isEditing = true;
      await this.loadUser();
    }
  },
  methods: {
    async loadUser() {
      try {
        const response = await usersService.getById(this.id);
        this.user = response.data;
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        this.$router.push('/dashboard/users');
      }
    },
    async handleSubmit() {
      if (this.loading) return; // Evitar múltiplos envios
      
      try {
        this.loading = true;
        
        // Validar e preparar dados
        const userData = await this.validateAndPrepareData();
        
        // Salvar usuário
        try {
          if (this.isEditing) {
            await usersService.update(this.id, userData);
            this.$toast.success('Usuário atualizado com sucesso!');
          } else {
            const result = await usersService.create(userData);
            if (result && result.success) {
              this.$toast.success('Usuário criado com sucesso!');
            } else {
              throw new Error('Erro ao criar usuário');
            }
          }
          this.$router.push('/dashboard/users');
        } catch (error) {
          console.error('Erro detalhado:', error);
          let errorMessage = 'Erro ao salvar usuário';
          
          if (error.response) {
            errorMessage = error.response.data?.message || error.response.data || 'Erro desconhecido';
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.$toast.error(errorMessage);
        } finally {
          this.loading = false;
        }

        // Redirecionar para a lista de usuários
        this.$router.push('/dashboard/users');

      } catch (error) {
        console.error('Erro detalhado:', error);
        let errorMessage = 'Erro ao salvar usuário';
        
        if (error.response) {
          errorMessage = error.response.data?.message || error.response.data || 'Erro desconhecido';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.$toast.error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    validateAndPrepareData() {
      // Validar os dados antes de enviar
      try {
        if (!this.user.name || this.user.name.trim() === '') {
          throw new Error('O nome é obrigatório');
        }

        if (!this.user.email || this.user.email.trim() === '') {
          throw new Error('O email é obrigatório');
        }

        if (!this.user.password || this.user.password.trim() === '') {
          throw new Error('A senha é obrigatória');
        }

        if (this.user.password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }

        // Validar formato do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.user.email)) {
          throw new Error('Formato de email inválido');
        }

        // Preparar os dados para enviar
        const userData = {
          name: this.user.name.trim(),
          email: this.user.email.trim().toLowerCase(),
          password: this.user.password,
          status: 'active',
          role: 'admin'
        };

        console.log('Dados enviados:', JSON.stringify(userData, null, 2));
        return userData;

        console.log('Dados enviados:', JSON.stringify(userData, null, 2));
        return userData;

      } catch (error) {
        alert(error.message);
        throw error;
      }
    },
    cancel() {
      this.$router.push('/dashboard/users');
    }
  }
};
</script>
