import api from './api'
import { setupToken } from './auth'

export default {
  // Processar pagamento
  async processPayment(paymentData) {
    setupToken()
    try {
      console.log('💳 Processando pagamento:', paymentData)
      
      const response = await api.post('/payments/process', paymentData)
      
      console.log('✅ Pagamento processado com sucesso:', response.data)
      return {
        success: true,
        data: response.data,
        message: 'Pagamento processado com sucesso'
      }
    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error.response?.data || error.message)
      
      let errorMessage = 'Erro ao processar pagamento'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.status === 400) {
        errorMessage = 'Dados de pagamento inválidos'
      } else if (error.response?.status === 404) {
        errorMessage = 'Pedido não encontrado'
      } else if (error.response?.status === 403) {
        errorMessage = 'Sem permissão para processar este pagamento'
      }
      
      return {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message
      }
    }
  },

  // Processar pagamento com cartão de crédito
  async processCreditCardPayment(orderId, amount, cardData) {
    setupToken();
    try {
      const response = await api.post('/payments/process', {
        orderId,
        method: 'credit',
        amount,
        cardNumber: cardData.number,
        cardExpiry: cardData.expiry,
        cardCvc: cardData.cvc,
        cardBrand: cardData.brand
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao processar pagamento com cartão:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento'
      };
    }
  },

  // Processar pagamento com boleto
  async processBoletoPayment(orderId, amount, boletoData) {
    setupToken();
    try {
      const response = await api.post('/payments/process', {
        orderId,
        method: 'boleto',
        amount,
        boletoBarcode: boletoData.barcode,
        boletoDueDate: boletoData.dueDate,
        boletoUrl: boletoData.url
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao processar pagamento com boleto:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento com boleto'
      };
    }
  },

  // Processar pagamento com PIX
  async processPixPayment(orderId, amount, pixData) {
    setupToken();
    try {
      const response = await api.post('/payments/process', {
        orderId,
        method: 'pix',
        amount,
        pixQrCode: pixData.qrCode,
        pixKey: pixData.key,
        pixExpiresAt: pixData.expiresAt
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao processar pagamento PIX:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao processar pagamento PIX'
      };
    }
  },

  // Gerar dados de pagamento (simulação)
  generatePaymentData(method, orderId, amount) {
    const baseData = {
      orderId,
      userId: parseInt(localStorage.getItem('userId')),
      method,
      amount
    }

    switch (method) {
      case 'credit':
        return {
          ...baseData,
          cardNumber: '4111111111111111',
          cardExpiry: '12/25',
          cardCvc: '123',
          cardBrand: 'visa'
        }
      
      case 'boleto':
        return {
          ...baseData,
          boletoBarcode: '12345678901234567890123456789012345678901234',
          boletoDueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          boletoUrl: 'https://boleto.example.com/123456789'
        }
      
      case 'pix':
        return {
          ...baseData,
          pixQrCode: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913Teste Empresa6008Brasilia62070503***6304E2CA',
          pixKey: 'teste@exemplo.com',
          pixExpiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
        }
      
      default:
        throw new Error('Método de pagamento inválido')
    }
  },

  // Validar dados do cartão
  validateCreditCard(cardData) {
    const errors = []
    
    if (!cardData.number || cardData.number.replace(/\s/g, '').length < 13) {
      errors.push('Número do cartão inválido')
    }
    
    if (!cardData.expiry || !/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
      errors.push('Data de expiração inválida (formato: MM/AA)')
    }
    
    if (!cardData.cvc || cardData.cvc.length < 3) {
      errors.push('CVC inválido')
    }
    
    if (!cardData.brand) {
      errors.push('Bandeira do cartão é obrigatória')
    }
    
    if (!cardData.name) {
      errors.push('Nome no cartão é obrigatório')
    }
    
    return {
      isValid: errors.length === 0,
      errors
    }
  },

  // Formatar número do cartão
  formatCardNumber(number) {
    const cleaned = number.replace(/\s/g, '')
    const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/)
    
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`
    }
    
    return cleaned.replace(/(\d{4})/g, '$1 ').trim()
  },

  // Detectar bandeira do cartão
  detectCardBrand(number) {
    const cleaned = number.replace(/\s/g, '')
    
    if (/^4/.test(cleaned)) return 'visa'
    if (/^5[1-5]/.test(cleaned)) return 'mastercard'
    if (/^3[47]/.test(cleaned)) return 'amex'
    if (/^6/.test(cleaned)) return 'elo'
    if (/^606282|^3841/.test(cleaned)) return 'hipercard'
    
    return ''
  },

  // Buscar pagamentos do usuário
  async getUserPayments() {
    setupToken();
    try {
      const response = await api.get('/payments/user');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar pagamentos'
      };
    }
  },

  // Buscar pagamento por ID
  async getPaymentById(paymentId) {
    setupToken();
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar pagamento:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar pagamento'
      };
    }
  },

  // Buscar pagamentos por pedido
  async getPaymentsByOrder(orderId) {
    setupToken();
    try {
      const response = await api.get(`/payments/order/${orderId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao buscar pagamentos do pedido:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao buscar pagamentos do pedido'
      };
    }
  },

  // Gerar dados mock para PIX
  generatePixData(amount) {
    return {
      qrCode: '00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426614174000520400005303986540510.005802BR5913Teste Empresa6008Brasilia62070503***6304E2CA',
      key: 'teste@exemplo.com',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
    };
  },

  // Gerar dados mock para boleto
  generateBoletoData(amount) {
    return {
      barcode: '12345678901234567890123456789012345678901234',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      url: 'https://boleto.example.com/123456789'
    };
  },

  // Confirmar pagamento PIX
  async confirmPixPayment(paymentId) {
    setupToken();
    try {
      const response = await api.post(`/payments/${paymentId}/confirm-pix`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao confirmar pagamento PIX:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao confirmar pagamento PIX'
      };
    }
  },

  // Confirmar pagamento de boleto
  async confirmBoletoPayment(paymentId) {
    setupToken();
    try {
      const response = await api.post(`/payments/${paymentId}/confirm-boleto`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao confirmar pagamento de boleto:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao confirmar pagamento de boleto'
      };
    }
  },

  // Cancelar pagamento
  async cancelPayment(paymentId) {
    setupToken();
    try {
      const response = await api.post(`/payments/${paymentId}/cancel`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao cancelar pagamento:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao cancelar pagamento'
      };
    }
  },

  // Reembolsar pagamento
  async refundPayment(paymentId, amount) {
    setupToken();
    try {
      const response = await api.post(`/payments/${paymentId}/refund`, { amount });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao reembolsar pagamento:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao reembolsar pagamento'
      };
    }
  },

  // Atualizar status do pagamento
  async updatePaymentStatus(paymentId, status) {
    setupToken();
    try {
      const response = await api.put(`/payments/${paymentId}/status`, { status });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erro ao atualizar status do pagamento:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao atualizar status do pagamento'
      };
    }
  }
} 