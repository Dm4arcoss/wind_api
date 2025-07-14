import { Controller, Get, Post, Body, Param, Put, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './dto/order.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('count')
  @ApiOperation({ summary: 'Contar pedidos' })
  @ApiOkResponse({ 
    description: 'Número total de pedidos retornados com sucesso',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 10 }
      }
    }
  })
  async count(@Request() req) {
    try {
      console.log('Contando pedidos para usuário:', req.user.id);
      const count = await this.ordersService.count();
      return { count };
    } catch (error) {
      console.error('Erro ao contar pedidos:', error);
      throw error;
    }
  }

  @Get('recent')
  @ApiOperation({ summary: 'Listar pedidos recentes' })
  @ApiOkResponse({ 
    description: 'Lista de pedidos recentes retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          status: { type: 'string', example: 'pending', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
          total: { type: 'number', example: 1299.99 },
          createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          customer: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 2 },
              name: { type: 'string', example: 'Maria Silva' }
            }
          }
        }
      }
    }
  })
  async getRecentOrders() {
    return this.ordersService.getRecentOrders();
  }

  @Get('order-stats')
  @ApiOperation({ summary: 'Obter estatísticas de pedidos por status' })
  @ApiOkResponse({ 
    description: 'Estatísticas de pedidos retornadas com sucesso',
    schema: {
      type: 'object',
      properties: {
        labels: { 
          type: 'array',
          items: { type: 'string' },
          example: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
        },
        values: { 
          type: 'array',
          items: { type: 'number' },
          example: [5, 3, 8, 12, 2]
        }
      }
    }
  })
  async getOrderStats() {
    return this.ordersService.getOrderStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiOkResponse({ 
    description: 'Pedido encontrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        status: { type: 'string', example: 'pending', enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              product: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: 'Smartphone XYZ' }
                }
              },
              quantity: { type: 'number', example: 1 },
              price: { type: 'number', example: 1299.99 }
            }
          }
        },
        total: { type: 'number', example: 1299.99 },
        createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
        customer: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            name: { type: 'string', example: 'Maria Silva' }
          }
        }
      }
    }
  })
  async findOne(@Param('id') id: number) {
    return this.ordersService.findOne(id);
  }

  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou estoque insuficiente' })
  @ApiResponse({ status: 404, description: 'Usuário, cliente ou produto não encontrado' })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    console.log('🔧 Controller - Dados recebidos:', createOrderDto);
    console.log('🔧 Controller - Usuário do token:', req.user);
    
    // Extrair userId do token se não foi enviado
    const userId = createOrderDto.userId || req.user.sub;
    console.log('🔧 Controller - UserId a ser usado:', userId);
    
    const orderData = {
      ...createOrderDto,
      userId: userId
    };
    
    console.log('🔧 Controller - Dados do pedido a serem enviados:', orderData);
    
    return this.ordersService.create(orderData);
  }

  @ApiOperation({ summary: 'Listar todos os pedidos do usuário' })
  @ApiOkResponse({ 
    description: 'Lista de pedidos retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          status: { type: 'string', example: 'pending', enum: Object.values(OrderStatus) },
          total: { type: 'number', example: 1499.99 },
          createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          user: { 
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'João Silva' },
              email: { type: 'string', example: 'joao@exemplo.com' }
            }
          },
          customer: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Cliente Exemplo' },
              email: { type: 'string', example: 'cliente@exemplo.com' }
            },
            nullable: true
          }
        }
      }
    }
  })
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @ApiOperation({ summary: 'Atualizar o status de um pedido' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiBody({ type: UpdateOrderDto })
  @ApiOkResponse({ description: 'Pedido atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(parseInt(id), updateOrderDto);
  }

  @ApiOperation({ summary: 'Listar pedidos do usuário atual' })
  @ApiOkResponse({ description: 'Lista de pedidos do usuário retornada com sucesso' })
  @Get('user/me')
  findMyOrders(@CurrentUser() user) {
    return this.ordersService.findByUser(user.id);
  }
  
  @ApiOperation({ summary: 'Listar pedidos de um cliente específico' })
  @ApiParam({ name: 'customerId', description: 'ID do cliente', example: 1 })
  @ApiOkResponse({ description: 'Lista de pedidos do cliente retornada com sucesso' })
  @Get('customer/:customerId')
  findCustomerOrders(@Param('customerId') customerId: string) {
    return this.ordersService.findByCustomer(parseInt(customerId));
  }
}