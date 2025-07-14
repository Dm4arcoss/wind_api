import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async count() {
    try {
      console.log('📊 Counting products...');
      const count = await this.prisma.product.count();
      console.log('✅ Products count:', count);
      return { count };
    } catch (error) {
      console.error('❌ Error counting products:', error);
      throw error;
    }
  }

  async create(createProductDto: CreateProductDto) {
    try {
      console.log('🔧 Creating product...');
      console.log('Product data:', createProductDto);
      
      // Validar dados de entrada
      this._validateCreateProductData(createProductDto);

      // Verificar se a categoria existe
      const category = await this.prisma.category.findUnique({
        where: { id: createProductDto.categoryId }
      });
      
      if (!category) {
        console.error('❌ Category not found:', createProductDto.categoryId);
        throw new NotFoundException(`Categoria com ID ${createProductDto.categoryId} não encontrada`);
      }

      console.log('✅ Category found:', category.name);

      // Preparar dados para criação
      const productData: any = {
        name: createProductDto.name.trim(),
        description: createProductDto.description.trim(),
        price: parseFloat(createProductDto.price.toString()),
        stock: parseInt(createProductDto.stock.toString()),
        categoryId: parseInt(createProductDto.categoryId.toString())
      };

      // Adicionar imageUrl se existir
      if (createProductDto.imageUrl && createProductDto.imageUrl.trim()) {
        productData.imageUrl = createProductDto.imageUrl.trim();
      }

      console.log('📡 Creating product with data:', productData);

      const product = await this.prisma.product.create({
        data: productData,
        include: {
          category: true,
        },
      });

      console.log('✅ Product created successfully:', product.id);
      return product;
      
    } catch (error) {
      console.error('❌ Error creating product:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao criar produto. Verifique os dados e tente novamente.');
    }
  }

  async findAll(categoryId?: number) {
    try {
      console.log('📂 Loading products...', categoryId ? `Category: ${categoryId}` : 'All categories');
      
      const where = categoryId ? { categoryId } : {};
      
      const products = await this.prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      console.log('✅ Products loaded:', products.length);
      return products;
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
      throw error;
    }
  }

  async getRecentProducts() {
    try {
      console.log('📂 Loading recent products...');
      
      const products = await this.prisma.product.findMany({
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5 // Limitar a 5 produtos recentes
      });

      console.log('✅ Recent products loaded:', products.length);
      return products;
      
    } catch (error) {
      console.error('❌ Error loading recent products:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      console.log('📂 Loading product by ID:', id);
      
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });

      if (!product) {
        console.error('❌ Product not found:', id);
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }

      console.log('✅ Product loaded:', product.id);
      return product;
      
    } catch (error) {
      console.error('❌ Error loading product:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      console.log('🔧 Updating product:', id);
      console.log('Update data:', updateProductDto);
      
      // Validar dados de entrada
      this._validateUpdateProductData(updateProductDto);

      // Verificar se o produto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        console.error('❌ Product not found for update:', id);
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }

      // Verificar se a categoria existe (se foi alterada)
      if (updateProductDto.categoryId && updateProductDto.categoryId !== existingProduct.categoryId) {
        const category = await this.prisma.category.findUnique({
          where: { id: updateProductDto.categoryId }
        });
        
        if (!category) {
          console.error('❌ Category not found for update:', updateProductDto.categoryId);
          throw new NotFoundException(`Categoria com ID ${updateProductDto.categoryId} não encontrada`);
        }
      }

      // Preparar dados para atualização
      const updateData: any = {};
      
      if (updateProductDto.name !== undefined) {
        updateData.name = updateProductDto.name.trim();
      }
      if (updateProductDto.description !== undefined) {
        updateData.description = updateProductDto.description.trim();
      }
      if (updateProductDto.price !== undefined) {
        updateData.price = parseFloat(updateProductDto.price.toString());
      }
      if (updateProductDto.stock !== undefined) {
        updateData.stock = parseInt(updateProductDto.stock.toString());
      }
      if (updateProductDto.categoryId !== undefined) {
        updateData.categoryId = parseInt(updateProductDto.categoryId.toString());
      }
      if (updateProductDto.imageUrl !== undefined) {
        updateData.imageUrl = updateProductDto.imageUrl?.trim() || null;
      }

      console.log('📡 Updating product with data:', updateData);

      const product = await this.prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
        },
      });

      console.log('✅ Product updated successfully:', product.id);
      return product;
      
    } catch (error) {
      console.error('❌ Error updating product:', error);
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Erro ao atualizar produto. Verifique os dados e tente novamente.');
    }
  }

  async remove(id: number) {
    try {
      console.log('🗑️ Deleting product:', id);
      
      // Verificar se o produto existe
      const existingProduct = await this.prisma.product.findUnique({
        where: { id }
      });

      if (!existingProduct) {
        console.error('❌ Product not found for deletion:', id);
        throw new NotFoundException(`Produto com ID ${id} não encontrado`);
      }

      await this.prisma.product.delete({
        where: { id },
      });

      console.log('✅ Product deleted successfully:', id);
      return { message: 'Produto excluído com sucesso' };
      
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Erro ao excluir produto. Tente novamente.');
    }
  }

  // Validação para criação de produto
  private _validateCreateProductData(data: CreateProductDto) {
    console.log('🔍 Validating create product data...');
    
    if (!data.name || !data.name.trim()) {
      throw new BadRequestException('Nome do produto é obrigatório');
    }

    if (!data.description || !data.description.trim()) {
      throw new BadRequestException('Descrição do produto é obrigatória');
    }

    if (!data.price || isNaN(data.price) || data.price <= 0) {
      throw new BadRequestException('Preço deve ser um número maior que zero');
    }

    if (data.stock === undefined || data.stock === null || isNaN(data.stock) || data.stock < 0) {
      throw new BadRequestException('Estoque deve ser um número não negativo');
    }

    if (!data.categoryId || isNaN(data.categoryId) || data.categoryId <= 0) {
      throw new BadRequestException('Categoria é obrigatória');
    }

    console.log('✅ Create product data validation passed');
  }

  // Validação para atualização de produto
  private _validateUpdateProductData(data: UpdateProductDto) {
    console.log('🔍 Validating update product data...');
    
    if (data.name !== undefined && (!data.name || !data.name.trim())) {
      throw new BadRequestException('Nome do produto é obrigatório');
    }

    if (data.description !== undefined && (!data.description || !data.description.trim())) {
      throw new BadRequestException('Descrição do produto é obrigatória');
    }

    if (data.price !== undefined && (isNaN(data.price) || data.price <= 0)) {
      throw new BadRequestException('Preço deve ser um número maior que zero');
    }

    if (data.stock !== undefined && (isNaN(data.stock) || data.stock < 0)) {
      throw new BadRequestException('Estoque deve ser um número não negativo');
    }

    if (data.categoryId !== undefined && (isNaN(data.categoryId) || data.categoryId <= 0)) {
      throw new BadRequestException('Categoria é obrigatória');
    }

    console.log('✅ Update product data validation passed');
  }
}