import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('dashboard')
@Controller('dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @ApiOperation({ summary: 'Obter resumo do dashboard' })
  @ApiOkResponse({ 
    description: 'Resumo do dashboard retornado com sucesso',
    schema: {
      type: 'object',
      properties: {
        stats: {
          type: 'object',
          properties: {
            productCount: { type: 'number', example: 120 },
            orderCount: { type: 'number', example: 34 },
            userCount: { type: 'number', example: 45 },
            revenue: { type: 'number', example: 6450.75 }
          }
        },
        recentProducts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Smartphone XYZ' },
              price: { type: 'number', example: 1299.99 },
              stock: { type: 'number', example: 15 },
              category: { 
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Eletrônicos' }
                }
              }
            }
          }
        },
        recentOrders: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              status: { type: 'string', example: 'pending' },
              total: { type: 'number', example: 1499.99 },
              createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
              user: { 
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'João Silva' }
                }
              }
            }
          }
        }
      }
    }
  })
  @Get()
  async getDashboard() {
    const [stats, recentProducts, recentOrders] = await Promise.all([
      this.dashboardService.getStats(),
      this.dashboardService.getRecentProducts(),
      this.dashboardService.getRecentOrders()
    ]);

    return {
      stats,
      recentProducts,
      recentOrders
    };
  }

  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  @ApiOkResponse({ 
    description: 'Estatísticas retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        productCount: { type: 'number', example: 120 },
        orderCount: { type: 'number', example: 34 },
        userCount: { type: 'number', example: 45 },
        revenue: { type: 'number', example: 6450.75 }
      }
    }
  })
  @Get('stats')
  getStats() {
    return this.dashboardService.getStats();
  }

  @ApiOperation({ summary: 'Obter produtos recentes' })
  @ApiOkResponse({ 
    description: 'Produtos recentes retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Smartphone XYZ' },
          price: { type: 'number', example: 1299.99 },
          stock: { type: 'number', example: 15 },
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
  @Get('recent-products')
  getRecentProducts() {
    return this.dashboardService.getRecentProducts();
  }

  @ApiOperation({ summary: 'Obter estatísticas de categorias' })
  @ApiOkResponse({ 
    description: 'Estatísticas de categorias retornadas com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Eletrônicos' },
          count: { type: 'number', example: 45 },
          percentage: { type: 'number', example: 38 },
          color: { type: 'string', example: 'bg-blue-500' }
        }
      }
    }
  })
  @Get('category-stats')
  getCategoryStats() {
    return this.dashboardService.getCategoryStats();
  }
  
  @ApiOperation({ summary: 'Obter produtos mais vendidos' })
  @ApiOkResponse({ 
    description: 'Produtos mais vendidos retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Smartphone XYZ' },
          price: { type: 'number', example: 1299.99 },
          totalSold: { type: 'number', example: 42 },
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
  @Get('top-selling')
  getTopSellingProducts() {
    return this.dashboardService.getTopSellingProducts();
  }
  
  @ApiOperation({ summary: 'Obter pedidos recentes' })
  @ApiOkResponse({ 
    description: 'Pedidos recentes retornados com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          status: { type: 'string', example: 'pending' },
          total: { type: 'number', example: 1499.99 },
          createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          user: { 
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'João Silva' }
            }
          },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                quantity: { type: 'number', example: 2 },
                product: {
                  type: 'object',
                  properties: {
                    name: { type: 'string', example: 'Smartphone XYZ' }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  @Get('recent-orders')
  getRecentOrders() {
    return this.dashboardService.getRecentOrders();
  }
  
  @ApiOperation({ summary: 'Obter estatísticas de pedidos por status' })
  @ApiOkResponse({ 
    description: 'Estatísticas de pedidos retornadas com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'pending' },
          count: { type: 'number', example: 12 },
          percentage: { type: 'number', example: 35 },
          color: { type: 'string', example: 'bg-yellow-500' }
        }
      }
    }
  })
  @Get('order-stats')
  getOrderStats() {
    return this.dashboardService.getOrderStats();
  }
}