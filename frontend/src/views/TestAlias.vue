<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold">Teste de Alias</h1>
    <p>Este componente testa se o alias @ está funcionando.</p>
  </div>
</template>

<script>
import customersService from '@/services/customers';

export default {
  name: 'TestAlias',
  created() {
    console.log('Alias está funcionando:', customersService);
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
</style>
