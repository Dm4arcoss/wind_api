<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Produtos</h1>
      <router-link to="/dashboard/products/new" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        <i class="fas fa-plus mr-2"></i>
        Novo Produto
      </router-link>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg p-4">
      <div class="mb-4">
        <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Categoria:
        </label>
        <select v-model="selectedCategory" @change="filterProducts" class="w-64 p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          <option value="">Todas as categorias</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-100 dark:bg-gray-700">
              <th class="px-6 py-3 text-left">Nome</th>
              <th class="px-6 py-3 text-left">Categoria</th>
              <th class="px-6 py-3 text-left">Preço</th>
              <th class="px-6 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" class="border-b dark:border-gray-700">
              <td class="px-6 py-4">{{ product.name }}</td>
              <td class="px-6 py-4">{{ product.categoryName }}</td>
              <td class="px-6 py-4">R$ {{ product.price }}</td>
              <td class="px-6 py-4">
                <router-link :to="`/dashboard/products/${product.id}/edit`" class="text-blue-500 hover:text-blue-700 mr-2">
                  Editar
                </router-link>
                <button @click="deleteProduct(product.id)" class="text-red-500 hover:text-red-700">
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

<script setup>
import { ref, onMounted } from 'vue';
import productsService from '@/services/products';
import categoriesService from '@/services/categories';
import ProductForm from './ProductForm.vue';

const products = ref([]);
const categories = ref([]);
const selectedCategory = ref('');

onMounted(async () => {
  await loadCategories();
  await loadProducts();
});

const loadCategories = async () => {
  try {
    const response = await categoriesService.getAll();
    categories.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
  }
};

const loadProducts = async () => {
  try {
    const response = await productsService.getAll(selectedCategory.value);
    products.value = response.data;
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
  }
};

const filterProducts = async () => {
  await loadProducts();
};

const deleteProduct = async (id) => {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    try {
      await productsService.delete(id);
      await loadProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
    }
  }
};
</script>
