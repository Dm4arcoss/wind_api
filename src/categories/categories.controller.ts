import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Criar uma nova categoria' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 409, description: 'Categoria com este nome já existe' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiOkResponse({ 
    description: 'Lista de categorias retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Eletrônicos' },
          createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          _count: {
            type: 'object',
            properties: {
              products: { type: 'number', example: 45 }
            }
          }
        }
      }
    }
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({ summary: 'Buscar uma categoria pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da categoria', example: 1 })
  @ApiOkResponse({ 
    description: 'Categoria encontrada',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Eletrônicos' },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Smartphone XYZ' },
              price: { type: 'number', example: 1299.99 }
            }
          }
        },
        _count: {
          type: 'object',
          properties: {
            products: { type: 'number', example: 45 }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(parseInt(id));
  }

  @ApiOperation({ summary: 'Atualizar uma categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria', example: 1 })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ description: 'Categoria atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({ status: 409, description: 'Categoria com este nome já existe' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(parseInt(id), updateCategoryDto);
  }

  @ApiOperation({ summary: 'Remover uma categoria' })
  @ApiParam({ name: 'id', description: 'ID da categoria', example: 1 })
  @ApiOkResponse({ description: 'Categoria removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(parseInt(id));
  }
}