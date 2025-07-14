import api from './api';

export function setupToken() {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default {
  async login(email, password) {
    try {
      console.log('Tentando fazer login com:', { email: email, password: '****' });
      
      // Remover dados de autenticação existentes
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
      // Verificar headers antes da requisição
      console.log('Headers antes do login:', api.defaults.headers);
      
      // Fazer requisição de login
      const response = await api.post('/auth/login', { email, password });
      console.log('Resposta do login:', response.data);
      
      const { access_token, user } = response.data;
      
      // Verificar se o token existe
      if (!access_token) {
        throw new Error('Token não recebido do servidor');
      }
      
      // Armazenar token e dados do usuário
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userId', user.id);
      
      // Configurar token no header da API
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Verificar se o token foi configurado corretamente
      console.log('Token configurado:', api.defaults.headers.common['Authorization']);
      
      // Verificar se o token foi salvo no localStorage
      const savedToken = localStorage.getItem('token');
      console.log('Token salvo no localStorage:', savedToken);
      
      return {
        success: true,
        user: user
      };
    } catch (error) {
      // Limpar dados de autenticação em caso de erro
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      
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
      console.log('🔧 Iniciando processo de registro...')
      console.log('Dados recebidos:', data)
      
      // Validar dados antes de enviar
      if (!data || !data.email || !data.password || !data.name) {
        console.error('❌ Dados incompletos:', { data })
        throw new Error('Dados incompletos. Por favor, preencha todos os campos.');
      }

      // Remover dados de autenticação existentes antes do registro
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');

      // Formatar dados para envio
      const registerData = {
        email: data.email.trim().toLowerCase(),
        password: data.password.trim(),
        name: data.name.trim(),
        role: 'CUSTOMER' // Sempre enviar como string
      };

      console.log('📝 Dados formatados:', registerData)

      // Garantir que não há campos extras
      const allowedFields = ['email', 'password', 'name', 'role'];
      const fieldsToRemove = Object.keys(registerData).filter(key => !allowedFields.includes(key));
      
      if (fieldsToRemove.length > 0) {
        console.warn('Campos não permitidos encontrados:', fieldsToRemove);
        fieldsToRemove.forEach(field => {
          delete registerData[field];
        });
      }

      console.log('📡 Enviando requisição para /auth/register...')
      console.log('Dados de registro final:', JSON.stringify(registerData, null, 2));

      // Fazer requisição de registro
      const response = await api.post('/auth/register', registerData);
      console.log('✅ Resposta do registro:', response.data)

      console.log('🔐 Fazendo login automático...')
      // Fazer login com as mesmas credenciais
      const loginResponse = await this.login(data.email, data.password);

      // Adicionar mensagem de sucesso
      loginResponse.message = 'Registro e login realizados com sucesso!';
      console.log('🎉 Registro e login concluídos com sucesso!')

      return loginResponse;
    } catch (error) {
      console.error('❌ Erro no registro:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      })
      
      // Extrair mensagem de erro específica
      let errorMessage = 'Erro ao registrar usuário';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos. Por favor, verifique suas informações.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Email já cadastrado';
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  },

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return !!token;
  },

  async getUserProfile() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Não autenticado');
      }
      
      // Verificar se o token está no header da API
      if (!api.defaults.headers.common['Authorization']) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Usar a rota correta do backend
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userId');
      throw error;
    }
  }
};
