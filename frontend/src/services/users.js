import api from './api';

const setupToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export default {
  // Listar todos os usuários
  async getAll() {
    setupToken();
    try {
      console.log('👥 Buscando todos os usuários...');
      const response = await api.get('/users');
      console.log('✅ Usuários encontrados:', response.data.length);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erro ao buscar usuários:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Erro ao buscar usuários',
        error: error.response?.data || error.message
      };
    }
  },

  // Criar novo usuário
  async create(userData) {
    setupToken();
    try {
      console.log('👤 Criando novo usuário:', userData);
      
      const response = await api.post('/users', userData);
      
      console.log('✅ Usuário criado com sucesso:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Usuário criado com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error.response?.data || error.message);
      
      let errorMessage = 'Erro ao criar usuário';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email já cadastrado';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Buscar usuário por ID
  async getById(id) {
    setupToken();
    try {
      console.log('👤 Buscando usuário por ID:', id);
      const response = await api.get(`/users/${id}`);
      console.log('✅ Usuário encontrado:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erro ao buscar usuário:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Erro ao buscar usuário',
        error: error.response?.data || error.message
      };
    }
  },

  // Atualizar usuário
  async update(id, userData) {
    setupToken();
    try {
      console.log('👤 Atualizando usuário:', id, userData);
      
      const response = await api.put(`/users/${id}`, userData);
      
      console.log('✅ Usuário atualizado com sucesso:', response.data);
      return {
        success: true,
        data: response.data,
        message: 'Usuário atualizado com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error.response?.data || error.message);
      
      let errorMessage = 'Erro ao atualizar usuário';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado';
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Deletar usuário
  async delete(id) {
    setupToken();
    try {
      console.log('👤 Deletando usuário:', id);
      
      const response = await api.delete(`/users/${id}`);
      
      console.log('✅ Usuário deletado com sucesso');
      return {
        success: true,
        message: 'Usuário deletado com sucesso'
      };
    } catch (error) {
      console.error('❌ Erro ao deletar usuário:', error.response?.data || error.message);
      
      let errorMessage = 'Erro ao deletar usuário';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuário não encontrado';
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      };
    }
  },

  // Buscar usuário por email
  async getByEmail(email) {
    setupToken();
    try {
      console.log('👤 Buscando usuário por email:', email);
      const response = await api.get(`/users/email/${email}`);
      console.log('✅ Usuário encontrado:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erro ao buscar usuário por email:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Erro ao buscar usuário',
        error: error.response?.data || error.message
      };
    }
  },

  // Atualizar status do usuário
  async updateStatus(id, status) {
    return this.update(id, { status });
  },

  // Atualizar role do usuário
  async updateRole(id, role) {
    return this.update(id, { role });
  },

  // Buscar usuários por role
  async getByRole(role) {
    setupToken();
    try {
      console.log('👥 Buscando usuários por role:', role);
      const response = await api.get(`/users/role/${role}`);
      console.log('✅ Usuários encontrados:', response.data.length);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Erro ao buscar usuários por role:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Erro ao buscar usuários',
        error: error.response?.data || error.message
      };
    }
  }
};
