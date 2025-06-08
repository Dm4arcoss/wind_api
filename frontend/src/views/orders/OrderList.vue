<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Pedidos</h1>
      <div class="flex space-x-4">
        <select v-model="statusFilter" @change="filterOrders" class="p-2 border rounded">
          <option value="">Todos os status</option>
          <option value="pending">Pendente</option>
          <option value="processing">Em processamento</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow p-4">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-6 py-3 text-left">ID</th>
              <th class="px-6 py-3 text-left">Cliente</th>
              <th class="px-6 py-3 text-left">Total</th>
              <th class="px-6 py-3 text-left">Status</th>
              <th class="px-6 py-3 text-left">Data</th>
              <th class="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id" class="border-b">
              <td class="px-6 py-4">{{ order.id }}</td>
              <td class="px-6 py-4">{{ order.customerName }}</td>
              <td class="px-6 py-4">R$ {{ order.total }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)">{{ order.status }}</span>
              </td>
              <td class="px-6 py-4">{{ formatDate(order.createdAt) }}</td>
              <td class="px-6 py-4">
                <router-link :to="`/dashboard/orders/${order.id}`" class="text-blue-500 hover:text-blue-700 mr-2">
                  Ver detalhes
                </router-link>
                <template v-if="order.status === 'pending'">
                  <button @click="updateStatus(order.id, 'processing')" class="text-green-500 hover:text-green-700 mr-2">
                    Processar
                  </button>
                  <button @click="updateStatus(order.id, 'cancelled')" class="text-red-500 hover:text-red-700">
                    Cancelar
                  </button>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import ordersService from '@/services/orders';
import customersService from '@/services/customers';

export default {
  data() {
    return {
      orders: [],
      statusFilter: ''
    };
  },
  async created() {
    await this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        const response = await ordersService.getAll();
        const orders = response.data;
        
        // Carregar informações do cliente para cada pedido
        for (const order of orders) {
          const customer = await customersService.getById(order.customerId);
          order.customerName = customer.data.name;
        }
        
        this.orders = orders;
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
      }
    },
    async filterOrders() {
      await this.loadOrders();
    },
    async updateStatus(orderId, newStatus) {
      try {
        await ordersService.updateStatus(orderId, newStatus);
        await this.loadOrders();
      } catch (error) {
        console.error('Erro ao atualizar status do pedido:', error);
      }
    },
    getStatusClass(status) {
      const classes = {
        pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded',
        processing: 'bg-blue-100 text-blue-800 px-2 py-1 rounded',
        completed: 'bg-green-100 text-green-800 px-2 py-1 rounded',
        cancelled: 'bg-red-100 text-red-800 px-2 py-1 rounded'
      };
      return classes[status] || '';
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>
