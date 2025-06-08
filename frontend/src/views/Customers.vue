<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Clientes</h1>
        <button @click="showCreateModal = true" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Novo Cliente
        </button>
      </div>

      <!-- Tabela de Clientes -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telefone</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Endereço</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pedidos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="customer in customers" :key="customer.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 dark:text-white">{{ customer.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-300">{{ customer.email }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-300">{{ customer.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-300">{{ customer.address }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500 dark:text-gray-300">{{ customer._count?.orders || 0 }} pedidos</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button @click="editCustomer(customer)" class="text-indigo-600 hover:text-indigo-900 mr-2">
                    Editar
                  </button>
                  <button @click="deleteCustomer(customer.id)" class="text-red-600 hover:text-red-900">
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal de Criação/Edição -->
      <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-96">
          <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            {{ editingCustomer ? 'Editar Cliente' : 'Novo Cliente' }}
          </h2>
          <form @submit.prevent="saveCustomer">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                <input
                  v-model="form.phone"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Endereço</label>
                <textarea
                  v-model="form.address"
                  rows="3"
                  class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <div class="flex justify-end space-x-3">
                <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  Cancelar
                </button>
                <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Salvar
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import customersService from '../services/customers';
import { ref, onMounted } from 'vue';

const customers = ref([]);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingCustomer = ref(null);
const form = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
});

const loadCustomers = async () => {
  try {
    const response = await customersService.getAll();
    customers.value = response.data;
  } catch (error) {
    alert('Erro ao carregar clientes');
    console.error('Erro ao carregar clientes:', error);
  }
};

const createCustomer = async () => {
  try {
    await customersService.create(form.value);
    alert('Cliente criado com sucesso');
    closeModal();
    loadCustomers();
  } catch (error) {
    alert('Erro ao criar cliente');
    console.error('Erro ao criar cliente:', error);
  }
};

const updateCustomer = async () => {
  try {
    await customersService.update(editingCustomer.value.id, form.value);
    alert('Cliente atualizado com sucesso');
    closeModal();
    loadCustomers();
  } catch (error) {
    alert('Erro ao atualizar cliente');
    console.error('Erro ao atualizar cliente:', error);
  }
};

const deleteCustomer = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

  try {
    await customersService.delete(id);
    alert('Cliente excluído com sucesso');
    loadCustomers();
  } catch (error) {
    alert('Erro ao excluir cliente');
    console.error('Erro ao excluir cliente:', error);
  }
};

const editCustomer = (customer) => {
  editingCustomer.value = customer;
  form.value = { ...customer };
  showEditModal.value = true;
};

const saveCustomer = () => {
  if (editingCustomer.value) {
    updateCustomer();
  } else {
    createCustomer();
  }
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  editingCustomer.value = null;
  form.value = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };
};

onMounted(() => {
  loadCustomers();
});
</script>
