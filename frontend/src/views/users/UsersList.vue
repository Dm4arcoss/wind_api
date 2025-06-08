<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800 dark:text-white">Usuários</h1>
      <router-link to="/dashboard/users/new" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        Novo Usuário
      </router-link>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Função</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="user in users" :key="user.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ user.name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ user.email }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{{ user.role || 'Usuário' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                <span :class="user.status === 'active' 
                  ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs' 
                  : 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs'">
                  {{ user.status === 'active' ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <router-link :to="`/dashboard/users/${user.id}/edit`" class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                  Editar
                </router-link>
                <button @click="deleteUser(user.id)" class="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import usersService from '@/services/users';

export default {
  name: 'UsersList',
  data() {
    return {
      users: [],
      loading: true
    };
  },
  async created() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      try {
        const response = await usersService.getAll();
        this.users = response.data;
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    },
    async deleteUser(id) {
      if (confirm('Tem certeza que deseja excluir este usuário?')) {
        try {
          await usersService.delete(id);
          await this.loadUsers();
        } catch (error) {
          console.error('Erro ao excluir usuário:', error);
        }
      }
    }
  }
};
</script>
