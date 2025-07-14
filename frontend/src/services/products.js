import api from './api';

export default {
  _getHeaders() {
    const token = localStorage.getItem('token');
    return token ? {
      headers: {
        Authorization: `Bearer ${token}`
      }
    } : {};
  },

  async count() {
    try {
      console.log('📊 Counting products...')
      const response = await api.get('/products/count', this._getHeaders());
      console.log('✅ Products count:', response.data)
      return response;
    } catch (error) {
      console.error('❌ Error counting products:', error)
      throw error;
    }
  },

  async getAll(categoryId = null) {
    try {
      const url = categoryId ? `/products?categoryId=${categoryId}` : '/products';
      console.log('📂 Loading products:', url)
      const response = await api.get(url, this._getHeaders());
      console.log('✅ Products loaded:', response.data?.length || 0)
      return response;
    } catch (error) {
      console.error('❌ Error loading products:', error)
      throw error;
    }
  },

  async getById(id) {
    try {
      console.log('📂 Loading product by ID:', id)
      const response = await api.get(`/products/${id}`, this._getHeaders());
      console.log('✅ Product loaded:', response.data)
      return response;
    } catch (error) {
      console.error('❌ Error loading product:', error)
      throw error;
    }
  },

  async getRecentProducts() {
    try {
      console.log('📂 Loading recent products...')
      const response = await api.get('/products/recent', this._getHeaders());
      console.log('✅ Recent products loaded:', response.data?.length || 0)
      return response;
    } catch (error) {
      console.error('❌ Error loading recent products:', error)
      throw error;
    }
  },

  async create(productData) {
    try {
      console.log('🔧 Creating product...')
      console.log('Product data:', productData)
      
      // Validação dos dados
      this._validateProductData(productData);
      
      // Preparar dados para envio
      const dataToSend = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: Number(productData.price),
        stock: Number(productData.stock),
        categoryId: Number(productData.categoryId)
      };
      
      // Adicionar imageUrl se existir
      if (productData.imageUrl && productData.imageUrl.trim()) {
        dataToSend.imageUrl = productData.imageUrl.trim();
      }
      
      console.log('📡 Sending product data:', dataToSend)
      
      const response = await api.post('/products', dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          ...this._getHeaders().headers
        }
      });
      
      console.log('✅ Product created successfully:', response.data)
      return response;
      
    } catch (error) {
      console.error('❌ Error creating product:', error)
      this._handleProductError(error, 'criar');
    }
  },

  async update(id, productData) {
    try {
      console.log('🔧 Updating product:', id)
      console.log('Product data:', productData)
      
      // Validação dos dados
      this._validateProductData(productData);
      
      // Preparar dados para envio
      const dataToSend = {
        name: productData.name.trim(),
        description: productData.description.trim(),
        price: Number(productData.price),
        stock: Number(productData.stock),
        categoryId: Number(productData.categoryId)
      };
      
      // Adicionar imageUrl se existir
      if (productData.imageUrl && productData.imageUrl.trim()) {
        dataToSend.imageUrl = productData.imageUrl.trim();
      }
      
      console.log('📡 Sending update data:', dataToSend)
      
      const response = await api.put(`/products/${id}`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
          ...this._getHeaders().headers
        }
      });
      
      console.log('✅ Product updated successfully:', response.data)
      return response;
      
    } catch (error) {
      console.error('❌ Error updating product:', error)
      this._handleProductError(error, 'atualizar');
    }
  },

  async delete(id) {
    try {
      console.log('🗑️ Deleting product:', id)
      const response = await api.delete(`/products/${id}`, this._getHeaders());
      console.log('✅ Product deleted successfully')
      return response;
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      this._handleProductError(error, 'excluir');
    }
  },

  _validateProductData(productData) {
    console.log('🔍 Validating product data...')
    
    if (!productData || typeof productData !== 'object') {
      throw new Error('Dados do produto inválidos');
    }

    const requiredFields = ['name', 'description', 'price', 'stock', 'categoryId'];
    const missingFields = requiredFields.filter(field => {
      const value = productData[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      throw new Error(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
    }

    // Validar nome
    if (!productData.name.trim()) {
      throw new Error('Nome do produto é obrigatório');
    }

    // Validar descrição
    if (!productData.description.trim()) {
      throw new Error('Descrição do produto é obrigatória');
    }

    // Validar preço
    const price = Number(productData.price);
    if (isNaN(price) || price <= 0) {
      throw new Error('Preço deve ser um número maior que zero');
    }

    // Validar estoque
    const stock = Number(productData.stock);
    if (isNaN(stock) || stock < 0) {
      throw new Error('Estoque deve ser um número não negativo');
    }

    // Validar categoria
    const categoryId = Number(productData.categoryId);
    if (isNaN(categoryId) || categoryId <= 0) {
      throw new Error('Categoria é obrigatória');
    }

    console.log('✅ Product data validation passed')
  },

  _handleProductError(error, action) {
    console.error(`❌ Error ${action} product:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config
    });

    // Extrair mensagem de erro específica
    let errorMessage = `Erro ao ${action} produto`;
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.status === 401) {
      errorMessage = 'Sessão expirada. Faça login novamente.';
    } else if (error.response?.status === 400) {
      errorMessage = 'Dados inválidos. Verifique os campos.';
    } else if (error.response?.status === 404) {
      errorMessage = 'Produto não encontrado.';
    } else if (error.response?.status === 403) {
      errorMessage = 'Você não tem permissão para realizar esta ação.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    throw new Error(errorMessage);
  }
}
