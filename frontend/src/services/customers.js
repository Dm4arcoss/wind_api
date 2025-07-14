import api from './api';

export default {
  getAll() {
    return api.get('/customers');
  },
  getById(id) {
    return api.get(`/customers/${id}`);
  },
  async create(customer) {
    try {
      console.log('🔧 Iniciando criação de cliente...');
      console.log('Dados recebidos:', customer);

      // Validar dados antes de enviar
      if (!customer.name || !customer.email || !customer.phone) {
        console.error('❌ Validação falhou: campos obrigatórios não preenchidos');
        throw new Error('Dados do cliente inválidos. Por favor, preencha todos os campos obrigatórios.');
      }

      // Remover espaços em branco
      const customerData = {
        name: customer.name.trim(),
        email: customer.email.trim().toLowerCase(),
        phone: customer.phone.trim(),
        address: customer.address?.trim() || ''
      };
      
      console.log('📝 Dados formatados:', customerData);

      // Obter o ID do usuário do token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Token não encontrado');
        throw new Error('Usuário não autenticado');
      }

      // Verificar se o token é válido e não expirou
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userId = decoded.sub;
      
      console.log('🔑 Token decodificado:', decoded);
      console.log('👤 UserId encontrado:', userId);

      // Verificar se o userId é um número válido
      if (!userId || isNaN(userId)) {
        console.error('❌ UserId inválido:', userId);
        throw new Error('ID do usuário inválido');
      }

      console.log('📡 Enviando requisição para criar cliente...');

      const response = await api.post('/customers', customerData);
      
      console.log('✅ Cliente criado com sucesso:', response.data);
      return response;
      
    } catch (error) {
      console.error('❌ Erro ao criar cliente:', error);
      
      // Extrair mensagem de erro específica
      let errorMessage = 'Erro ao criar cliente';
      
      if (error.response?.status === 409) {
        errorMessage = 'Um cliente com este email já existe';
      } else if (error.response?.status === 401) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Dados inválidos. Verifique os campos.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },
  async update(id, customer) {
    try {
      console.log('🔧 Atualizando cliente:', id);
      console.log('Dados:', customer);
      
      const response = await api.put(`/customers/${id}`, customer);
      console.log('✅ Cliente atualizado com sucesso');
      return response;
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error);
      throw error;
    }
  },
  async delete(id) {
    try {
      console.log('🗑️ Excluindo cliente:', id);
      
      const response = await api.delete(`/customers/${id}`);
      console.log('✅ Cliente excluído com sucesso');
      return response;
    } catch (error) {
      console.error('❌ Erro ao excluir cliente:', error);
      throw error;
    }
  }
}
