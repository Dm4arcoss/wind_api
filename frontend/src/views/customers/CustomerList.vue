<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Clientes</h1>
      <router-link to="/dashboard/customers/new" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Novo Cliente
      </router-link>
    </div>

    <div class="bg-white rounded-lg shadow p-4">
      <div class="mb-4">
        <input
          v-model="searchQuery"
          @input="filterCustomers"
          placeholder="Buscar cliente..."
          class="w-64 p-2 border rounded"
        >
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-6 py-3 text-left">Nome</th>
              <th class="px-6 py-3 text-left">Email</th>
              <th class="px-6 py-3 text-left">Telefone</th>
              <th class="px-6 py-3 text-left">Pedidos</th>
              <th class="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in filteredCustomers" :key="customer.id" class="border-b">
              <td class="px-6 py-4">{{ customer.name }}</td>
              <td class="px-6 py-4">{{ customer.email }}</td>
              <td class="px-6 py-4">{{ customer.phone }}</td>
              <td class="px-6 py-4">{{ customer.orderCount }}</td>
              <td class="px-6 py-4">
                <router-link :to="`/dashboard/customers/${customer.id}/edit`" class="text-blue-500 hover:text-blue-700 mr-2">
                  Editar
                </router-link>
                <button @click="deleteCustomer(customer.id)" class="text-red-500 hover:text-red-700">
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
import customersService from '@/services/customers';
import ordersService from '@/services/orders';

export default {
  data() {
    return {
      customers: [],
      searchQuery: '',
      filteredCustomers: []
    };
  },
  async created() {
    await this.loadCustomers();
  },
  methods: {
    async loadCustomers() {
      try {
        const response = await customersService.getAll();
        const customers = response.data;
        
        // Carregar contagem de pedidos para cada cliente
        for (const customer of customers) {
          const orders = await ordersService.getCustomerOrders(customer.id);
          customer.orderCount = orders.data.length;
        }
        
        this.customers = customers;
        this.filteredCustomers = [...customers];
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      }
    },
    filterCustomers() {
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        customer.phone.includes(this.searchQuery)
      );
    },
    async deleteCustomer(id) {
      if (confirm('Tem certeza que deseja excluir este cliente?')) {
        try {
          await customersService.delete(id);
          await this.loadCustomers();
        } catch (error) {
          console.error('Erro ao excluir cliente:', error);
        }
      }
    }
  }
};
</script>
