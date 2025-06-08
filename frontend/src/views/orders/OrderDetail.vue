<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Pedido #{{ order.id }}</h1>
        <button @click="$router.back()" class="text-gray-700 hover:text-gray-900">
          Voltar
        </button>
      </div>

      <!-- Informações do Cliente -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Informações do Cliente</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-semibold">Nome:</p>
            <p>{{ order.customerName }}</p>
          </div>
          <div>
            <p class="font-semibold">Email:</p>
            <p>{{ order.customerEmail }}</p>
          </div>
          <div>
            <p class="font-semibold">Telefone:</p>
            <p>{{ order.customerPhone }}</p>
          </div>
          <div>
            <p class="font-semibold">Endereço:</p>
            <p>{{ order.customerAddress }}</p>
          </div>
        </div>
      </div>

      <!-- Status do Pedido -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Status do Pedido</h2>
        <div class="flex items-center space-x-2">
          <span :class="getStatusClass(order.status)">{{ order.status }}</span>
          <template v-if="order.status === 'pending'">
            <button @click="updateStatus('processing')" class="text-green-500 hover:text-green-700">
              Processar
            </button>
            <button @click="updateStatus('cancelled')" class="text-red-500 hover:text-red-700">
              Cancelar
            </button>
          </template>
        </div>
      </div>

      <!-- Produtos do Pedido -->
      <div>
        <h2 class="text-xl font-semibold mb-4">Produtos</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-gray-100">
                <th class="px-6 py-3 text-left">Produto</th>
                <th class="px-6 py-3 text-left">Quantidade</th>
                <th class="px-6 py-3 text-left">Preço Unitário</th>
                <th class="px-6 py-3 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.productId" class="border-b">
                <td class="px-6 py-4">{{ item.productName }}</td>
                <td class="px-6 py-4">{{ item.quantity }}</td>
                <td class="px-6 py-4">R$ {{ item.price }}</td>
                <td class="px-6 py-4">R$ {{ item.subtotal }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="px-6 py-4 text-right font-bold">
                  Total:
                </td>
                <td class="px-6 py-4 font-bold">
                  R$ {{ order.total }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
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
      order: {
        id: null,
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerAddress: '',
        status: '',
        items: [],
        total: 0
      }
    };
  },
  async created() {
    const orderId = this.$route.params.id;
    await this.loadOrder(orderId);
  },
  methods: {
    async loadOrder(orderId) {
      try {
        const response = await ordersService.getById(orderId);
        const order = response.data;
        
        // Carregar informações do cliente
        const customer = await customersService.getById(order.customerId);
        
        this.order = {
          ...order,
          customerName: customer.data.name,
          customerEmail: customer.data.email,
          customerPhone: customer.data.phone,
          customerAddress: customer.data.address
        };
      } catch (error) {
        console.error('Erro ao carregar pedido:', error);
      }
    },
    async updateStatus(newStatus) {
      try {
        const orderId = this.$route.params.id;
        await ordersService.updateStatus(orderId, newStatus);
        await this.loadOrder(orderId);
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
    }
  }
};
</script>
