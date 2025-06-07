import { Controller, Get, Post, Body, Param, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, OrderStatus } from './dto/update-order.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({ status: 201, description: 'Pedido criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos ou estoque insuficiente' })
  @ApiResponse({ status: 404, description: 'Usuário, cliente ou produto não encontrado' })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @ApiOperation({ summary: 'Listar todos os pedidos' })
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

  @ApiOperation({ summary: 'Buscar um pedido pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do pedido', example: 1 })
  @ApiOkResponse({ description: 'Pedido encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(parseInt(id));
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