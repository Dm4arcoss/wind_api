<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Categorias</h1>
      <router-link to="/dashboard/categories/new" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Nova Categoria
      </router-link>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-500 dark:bg-gray-700">
              <th class="px-6 py-3 text-left">Nome</th>
              <th class="px-6 py-3 text-left">Descrição</th>
              <th class="px-6 py-3 text-left">Produtos</th>
              <th class="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="category in categories" :key="category.id" class="border-b dark:border-gray-700">
              <td class="px-6 py-4">{{ category.name }}</td>
              <td class="px-6 py-4">{{ category.description }}</td>
              <td class="px-6 py-4">{{ category.productCount }}</td>
              <td class="px-6 py-4">
                <router-link :to="`/dashboard/categories/${category.id}/edit`" class="text-blue-500 hover:text-blue-700 mr-2">
                  Editar
                </router-link>
                <button @click="deleteCategory(category.id)" class="text-red-500 hover:text-red-700">
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
import categoriesService from '@/services/categories';
import productsService from '@/services/products';

export default {
  data() {
    return {
      categories: []
    };
  },
  async created() {
    await this.loadCategories();
  },
  methods: {
    async loadCategories() {
      try {
        const response = await categoriesService.getAll();
        const categories = response.data;
        
        // Carregar contagem de produtos para cada categoria
        for (const category of categories) {
          const products = await productsService.getAll(category.id);
          category.productCount = products.data.length;
        }
        
        this.categories = categories;
      } catch (error) {
        console.error('Erro ao carregar categorias:', error);
      }
    },
    async deleteCategory(id) {
      if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        try {
          await categoriesService.delete(id);
          await this.loadCategories();
        } catch (error) {
          console.error('Erro ao excluir categoria:', error);
        }
      }
    }
  }
};
</script>
