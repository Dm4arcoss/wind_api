<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Pedidos</h1>
      <div class="flex space-x-4">
        <select v-model="statusFilter" @change="filterOrders" class="p-2 border rounded">
          <option value="">Todos os status</option>
          <option value="PENDING">Pendente</option>
          <option value="PROCESSING">Em processamento</option>
          <option value="SHIPPED">Enviado</option>
          <option value="DELIVERED">Entregue</option>
          <option value="CANCELLED">Cancelado</option>
        </select>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-4">
      {{ error }}
    </div>

    <div v-else class="bg-white rounded-lg shadow p-4">
      <div v-if="orders.length === 0" class="text-center py-8 text-gray-500">
        Nenhum pedido encontrado
      </div>
      
      <div v-else class="overflow-x-auto">
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
            <tr v-for="order in filteredOrders" :key="order.id" class="border-b">
              <td class="px-6 py-4">{{ order.id }}</td>
              <td class="px-6 py-4">{{ order.customer?.name || 'Cliente não encontrado' }}</td>
              <td class="px-6 py-4">R$ {{ formatPrice(order.amount) }}</td>
              <td class="px-6 py-4">
                <span :class="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
              </td>
              <td class="px-6 py-4">{{ formatDate(order.createdAt) }}</td>
              <td class="px-6 py-4">
                <router-link :to="`/dashboard/orders/${order.id}`" class="text-blue-500 hover:text-blue-700 mr-2">
                  Ver detalhes
                </router-link>
                <template v-if="order.status === 'PENDING'">
                  <button @click="updateStatus(order.id, 'PROCESSING')" class="text-green-500 hover:text-green-700 mr-2">
                    Processar
                  </button>
                  <button @click="updateStatus(order.id, 'CANCELLED')" class="text-red-500 hover:text-red-700">
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

export default {
  data() {
    return {
      orders: [],
      statusFilter: '',
      isLoading: true,
      error: null
    };
  },
  computed: {
    filteredOrders() {
      if (!this.statusFilter) {
        return this.orders;
      }
      return this.orders.filter(order => order.status === this.statusFilter);
    }
  },
  async created() {
    await this.loadOrders();
  },
  methods: {
    async loadOrders() {
      try {
        console.log('🔧 Carregando pedidos...');
        this.isLoading = true;
        this.error = null;
        
        const response = await ordersService.getAll();
        console.log('✅ Resposta da API:', response);
        
        if (response && response.data) {
          this.orders = Array.isArray(response.data) ? response.data : [];
          console.log('📋 Pedidos carregados:', this.orders.length);
        } else {
          console.warn('⚠️ Resposta da API não contém dados válidos:', response);
          this.orders = [];
        }
      } catch (error) {
        console.error('❌ Erro ao carregar pedidos:', error);
        this.error = 'Erro ao carregar pedidos. Por favor, tente novamente.';
        this.orders = [];
      } finally {
        this.isLoading = false;
      }
    },
    
    async filterOrders() {
      // O filtro é feito via computed, não precisa recarregar
      console.log('🔍 Filtrando pedidos por status:', this.statusFilter);
    },
    
    async updateStatus(orderId, newStatus) {
      try {
        console.log('🔧 Atualizando status do pedido:', orderId, 'para:', newStatus);
        await ordersService.updateStatus(orderId, newStatus);
        await this.loadOrders();
      } catch (error) {
        console.error('❌ Erro ao atualizar status do pedido:', error);
        alert('Erro ao atualizar status do pedido. Por favor, tente novamente.');
      }
    },
    
    getStatusClass(status) {
      const classes = {
        'PENDING': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs',
        'PROCESSING': 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs',
        'SHIPPED': 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs',
        'DELIVERED': 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs',
        'CANCELLED': 'bg-red-100 text-red-800 px-2 py-1 rounded text-xs'
      };
      return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs';
    },
    
    getStatusLabel(status) {
      const labels = {
        'PENDING': 'Pendente',
        'PROCESSING': 'Em processamento',
        'SHIPPED': 'Enviado',
        'DELIVERED': 'Entregue',
        'CANCELLED': 'Cancelado'
      };
      return labels[status] || status;
    },
    
    formatDate(date) {
      if (!date) return 'Data não disponível';
      return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    formatPrice(price) {
      if (!price) return '0,00';
      return Number(price).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
  }
};
</script>
