import api from './api';

export default {
  async login(email, password) {
    try {
      console.log('Tentando fazer login com:', { email: email, password: '****' });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('Resposta do login:', response.data);
      
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        success: true,
        user: user
      };
    } catch (error) {
      console.error('Erro detalhado:', error.response?.data || error.message);
      
      let errorMessage = 'Erro ao fazer login';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = 'Credenciais inválidas';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },

  async register(data) {
    try {
      const response = await api.post('/auth/register', data);
      const { token } = response.data;
      localStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  },

  async logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return false;

      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  }
};
