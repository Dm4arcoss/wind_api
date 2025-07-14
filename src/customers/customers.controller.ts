import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('customers')
@Controller('customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiOperation({ summary: 'Criar um novo cliente' })
  @ApiBody({ type: CreateCustomerDto })
  @ApiResponse({ status: 201, description: 'Cliente criado com sucesso' })
  @ApiResponse({ status: 409, description: 'Cliente com este email já existe' })
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto, @Request() req) {
    console.log('🔧 Controller - Dados recebidos:', createCustomerDto);
    console.log('🔧 Controller - Usuário do token:', req.user);

    // Extrair userId do token JWT
    const userId = req.user?.sub;
    
    if (!userId) {
      console.error('❌ Controller - userId não encontrado no token');
      throw new Error('ID do usuário não encontrado no token');
    }

    console.log('🔧 Controller - UserId extraído:', userId);

    // Criar um novo objeto sem o userId (se vier no corpo)
    const customerData = {
      name: createCustomerDto.name,
      email: createCustomerDto.email,
      phone: createCustomerDto.phone,
      address: createCustomerDto.address
    };
    
    console.log('🔧 Controller - Dados do cliente a serem enviados:', customerData);
    
    return this.customersService.create(customerData, userId);
  }

  @ApiOperation({ summary: 'Buscar cliente por email' })
  @ApiResponse({ status: 200, description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.customersService.findByEmail(email);
  }

  @ApiOperation({ summary: 'Listar todos os clientes' })
  @ApiOkResponse({ 
    description: 'Lista de clientes retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'João Silva' },
          email: { type: 'string', example: 'joao@exemplo.com' },
          phone: { type: 'string', example: '(11) 98765-4321', nullable: true },
          address: { type: 'string', example: 'Rua Exemplo, 123', nullable: true },
          createdAt: { type: 'string', format: 'date-time', example: '2025-06-07T14:30:00Z' },
          _count: {
            type: 'object',
            properties: {
              orders: { type: 'number', example: 3 }
            }
          }
        }
      }
    }
  })
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @ApiOperation({ summary: 'Buscar um cliente pelo ID' })
  @ApiParam({ name: 'id', description: 'ID do cliente', example: 1 })
  @ApiOkResponse({ description: 'Cliente encontrado' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(parseInt(id));
  }

  @ApiOperation({ summary: 'Atualizar um cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente', example: 1 })
  @ApiBody({ type: UpdateCustomerDto })
  @ApiOkResponse({ description: 'Cliente atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @ApiResponse({ status: 409, description: 'Cliente com este email já existe' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customersService.update(parseInt(id), updateCustomerDto);
  }

  @ApiOperation({ summary: 'Remover um cliente' })
  @ApiParam({ name: 'id', description: 'ID do cliente', example: 1 })
  @ApiOkResponse({ description: 'Cliente removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Cliente não encontrado' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(parseInt(id));
  }
}