import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Query, BadRequestException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get('count')
  @ApiOperation({ summary: 'Contar total de produtos' })
  @ApiOkResponse({ 
    description: 'Total de produtos retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 100 }
      }
    }
  })
  async count() {
    return this.productsService.count();
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filtrar por categoria', example: 1 })
  @ApiOkResponse({ 
    description: 'Lista de produtos retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Smartphone XYZ' },
          description: { type: 'string', example: 'Smartphone com 128GB de memória', nullable: true },
          price: { type: 'number', example: 1299.99 },
          stock: { type: 'number', example: 15 },
          imageUrl: { type: 'string', example: 'https://exemplo.com/imagem.jpg', nullable: true },
          createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          category: { 
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Eletrônicos' }
            }
          }
        }
      }
    }
  })
  async findAll(@Query('categoryId') categoryId?: string) {
    return this.productsService.findAll(categoryId ? parseInt(categoryId) : undefined);
  }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiBody({ type: CreateProductDto })
  @ApiOkResponse({ 
    description: 'Produto criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Smartphone XYZ' },
        description: { type: 'string', example: 'Smartphone com 128GB de memória', nullable: true },
        price: { type: 'number', example: 1299.99 },
        stock: { type: 'number', example: 15 },
        imageUrl: { type: 'string', example: 'https://exemplo.com/imagem.jpg', nullable: true },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
        category: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Eletrônicos' }
          }
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get('recent')
  @ApiOperation({ summary: 'Listar produtos recentes' })
  @ApiOkResponse({ 
    description: 'Lista de produtos recentes retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Smartphone XYZ' },
          description: { type: 'string', example: 'Smartphone com 128GB de memória', nullable: true },
          price: { type: 'number', example: 1299.99 },
          stock: { type: 'number', example: 15 },
          imageUrl: { type: 'string', example: 'https://exemplo.com/imagem.jpg', nullable: true },
          createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          category: { 
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Eletrônicos' }
            }
          }
        }
      }
    }
  })
  async getRecentProducts() {
    return this.productsService.getRecentProducts();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiOkResponse({ 
    description: 'Produto encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Smartphone XYZ' },
        description: { type: 'string', example: 'Smartphone com 128GB de memória', nullable: true },
        price: { type: 'number', example: 1299.99 },
        stock: { type: 'number', example: 15 },
        imageUrl: { type: 'string', example: 'https://exemplo.com/imagem.jpg', nullable: true },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
        category: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Eletrônicos' }
          }
        }
      }
    }
  })
  async findOne(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.productsService.findOne(parsedId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar produto' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ 
    description: 'Produto atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Smartphone XYZ' },
        description: { type: 'string', example: 'Smartphone com 128GB de memória', nullable: true },
        price: { type: 'number', example: 1299.99 },
        stock: { type: 'number', example: 15 },
        imageUrl: { type: 'string', example: 'https://exemplo.com/imagem.jpg', nullable: true },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
        category: { 
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Eletrônicos' }
          }
        }
      }
    }
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.productsService.update(parsedId, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir produto' })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiOkResponse({ 
    description: 'Produto excluído com sucesso'
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string) {
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new BadRequestException('ID inválido');
    }
    return this.productsService.remove(parsedId);
  }
}