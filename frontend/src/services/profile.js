import api from './api'

const setupToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }
}

export default {
  // Obter perfil do usuário autenticado
  async getProfile() {
    setupToken()
    try {
      console.log('👤 Buscando perfil do usuário...')
      const response = await api.get('/profile')
      console.log('✅ Perfil encontrado:', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Erro ao buscar perfil:', error.response?.data || error.message)
      return {
        success: false,
        message: 'Erro ao buscar perfil',
        error: error.response?.data || error.message
      }
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(profileData) {
    setupToken()
    try {
      console.log('👤 Atualizando perfil:', profileData)
      
      const response = await api.put('/profile', profileData)
      
      console.log('✅ Perfil atualizado com sucesso:', response.data)
      return {
        success: true,
        data: response.data,
        message: 'Perfil atualizado com sucesso'
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar perfil:', error.response?.data || error.message)
      
      let errorMessage = 'Erro ao atualizar perfil'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados inválidos'
      } else if (error.response?.status === 409) {
        errorMessage = 'Email já está em uso'
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      }
    }
  },

  // Alterar senha
  async changePassword(passwordData) {
    setupToken()
    try {
      console.log('🔐 Alterando senha...')
      
      const response = await api.put('/profile/password', passwordData)
      
      console.log('✅ Senha alterada com sucesso')
      return {
        success: true,
        message: 'Senha alterada com sucesso'
      }
    } catch (error) {
      console.error('❌ Erro ao alterar senha:', error.response?.data || error.message)
      
      let errorMessage = 'Erro ao alterar senha'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Senha atual incorreta'
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      }
    }
  },

  // Upload de avatar
  async uploadAvatar(file) {
    setupToken()
    try {
      console.log('📷 Fazendo upload do avatar...')
      
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await api.post('/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      console.log('✅ Avatar enviado com sucesso:', response.data)
      return {
        success: true,
        data: response.data,
        message: 'Avatar atualizado com sucesso'
      }
    } catch (error) {
      console.error('❌ Erro ao enviar avatar:', error.response?.data || error.message)
      
      let errorMessage = 'Erro ao enviar avatar'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Arquivo inválido'
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      }
    }
  },

  // Obter configurações do usuário
  async getSettings() {
    setupToken()
    try {
      console.log('⚙️ Buscando configurações...')
      const response = await api.get('/profile/settings')
      console.log('✅ Configurações encontradas:', response.data)
      return {
        success: true,
        data: response.data
      }
    } catch (error) {
      console.error('❌ Erro ao buscar configurações:', error.response?.data || error.message)
      return {
        success: false,
        message: 'Erro ao buscar configurações',
        error: error.response?.data || error.message
      }
    }
  },

  // Atualizar configurações do usuário
  async updateSettings(settings) {
    setupToken()
    try {
      console.log('⚙️ Atualizando configurações:', settings)
      
      const response = await api.put('/profile/settings', settings)
      
      console.log('✅ Configurações atualizadas com sucesso:', response.data)
      return {
        success: true,
        data: response.data,
        message: 'Configurações atualizadas com sucesso'
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar configurações:', error.response?.data || error.message)
      
      let errorMessage = 'Erro ao atualizar configurações'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      }
    }
  }
}
