<template>
  <div class="container mx-auto p-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h1 class="text-2xl font-bold mb-4">
        {{ isEditing ? 'Editar Cliente' : 'Novo Cliente' }}
      </h1>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Nome:
          </label>
          <input
            v-model="customer.name"
            type="text"
            class="w-full p-2 border rounded"
            required
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <input
            v-model="customer.email"
            type="email"
            class="w-full p-2 border rounded"
            required
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Telefone:
          </label>
          <input
            v-model="customer.phone"
            type="tel"
            class="w-full p-2 border rounded"
            required
          >
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            Endereço:
          </label>
          <textarea
            v-model="customer.address"
            class="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>

        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2">
            CPF/CNPJ:
          </label>
          <input
            v-model="customer.document"
            type="text"
            class="w-full p-2 border rounded"
            required
          >
        </div>

        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$router.back()"
            class="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {{ isEditing ? 'Atualizar' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import customersService from '@/services/customers';

export default {
  data() {
    return {
      customer: {
        name: '',
        email: '',
        phone: '',
        address: '',
        document: ''
      },
      isEditing: false
    };
  },
  async created() {
    const id = this.$route.params.id;
    if (id) {
      this.isEditing = true;
      await this.loadCustomer(id);
    }
  },
  methods: {
    async loadCustomer(id) {
      try {
        const response = await customersService.getById(id);
        this.customer = response.data;
      } catch (error) {
        console.error('Erro ao carregar cliente:', error);
      }
    },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await customersService.update(this.$route.params.id, this.customer);
        } else {
          await customersService.create(this.customer);
        }
        this.$router.push('/dashboard/customers');
      } catch (error) {
        console.error('Erro ao salvar cliente:', error);
      }
    }
  }
};
</script>
