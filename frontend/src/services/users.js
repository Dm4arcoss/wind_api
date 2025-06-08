import api from './api';

export default {
  getAll() {
    return api.get('/users');
  },
  getById(id) {
    return api.get(`/users/${id}`);
  },
  create(userData, config = {}) {
    try {
      // Garantir que os dados estão no formato correto
      const user = {
        name: userData.name.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: 'admin',
        status: 'active'
      };

      console.log('Enviando dados:', JSON.stringify(user, null, 2));
      
      return api.post('/users', user, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(response => {
        console.log('Resposta do servidor:', response.data);
        return response.data;
      }).catch(error => {
        console.error('Erro na requisição:', error);
        throw error;
      });
    } catch (error) {
      console.error('Erro ao preparar dados:', error);
      throw error;
    }
  },
  update(id, user, config = {}) {
    return api.put(`/users/${id}`, user, config);
  },
  delete(id) {
    return api.delete(`/users/${id}`);
  }
};
