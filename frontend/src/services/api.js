import axios from 'axios';

const API_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Função para configurar o token nos headers
const setupToken = () => {
  const token = localStorage.getItem('token');
  console.log('Token atual:', token);
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Token configurado no header:', api.defaults.headers.common['Authorization']);
  } else {
    console.log('Nenhum token encontrado no localStorage');
    delete api.defaults.headers.common['Authorization'];
  }
};

// Configurar token inicialmente
setupToken();

// Interceptor de requisição para garantir que o token esteja sempre atualizado
api.interceptors.request.use(
  (config) => {
    console.log('🌐 Requisição sendo enviada:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      headers: config.headers
    })
    setupToken();
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error)
    return Promise.reject(error);
  }
);

// Interceptor de resposta para lidar com erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log('✅ Resposta recebida:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    })
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      data: error.response?.data,
      message: error.message
    })
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpar dados de autenticação
      clearTokenOnError(error);
      
      // Redirecionar para login
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Função para limpar token em caso de erro
export const clearTokenOnError = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }
};

export default api;
