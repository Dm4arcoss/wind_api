<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold">Test Component</h1>
    <p class="mt-4">Este é um componente de teste para verificar a renderização.</p>
    <button @click="testFunction" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      Testar Função
    </button>
  </div>
</template>

<script>
export default {
  name: 'Test',
  methods: {
    testFunction() {
      console.log('Test function called!');
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
