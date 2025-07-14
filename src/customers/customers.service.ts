import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, userId: number) {
    try {
      console.log('🔧 Service - Dados recebidos:', {
        customerData: createCustomerDto,
        userId
      });

      // Verificar se o usuário existe
      const userExists = await this.prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!userExists) {
        console.error('❌ Service - Usuário não encontrado:', userId);
        throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);
      }

      // Verificar se já existe um cliente para este usuário
      const existingCustomerByUserId = await this.prisma.customer.findUnique({
        where: { userId: userId }
      });

      if (existingCustomerByUserId) {
        console.log('ℹ️ Service - Cliente já existe para este usuário:', existingCustomerByUserId);
        return {
          ...existingCustomerByUserId,
          message: 'Cliente já existe para este usuário'
        };
      }

      // Verificar se já existe cliente com este email
      const existingCustomerByEmail = await this.prisma.customer.findUnique({
        where: { email: createCustomerDto.email }
      });

      if (existingCustomerByEmail) {
        console.error('❌ Service - Cliente já existe com este email:', existingCustomerByEmail);
        throw new ConflictException('Um cliente com este email já existe');
      }

      // Criar um objeto de dados com o userId
      const customerData = {
        name: createCustomerDto.name,
        email: createCustomerDto.email,
        phone: createCustomerDto.phone,
        address: createCustomerDto.address,
        userId: userId
      };

      console.log('🔧 Service - Criando novo cliente:', customerData);

      const newCustomer = await this.prisma.customer.create({
        data: customerData
      });

      console.log('✅ Service - Cliente criado com sucesso:', newCustomer);
      return newCustomer;
      
    } catch (error) {
      console.error('❌ Service - Erro ao criar cliente:', error);
      
      if (error.code === 'P2002') {
        console.error('❌ Service - Erro de constraint única:', error);
        if (error.meta?.target?.includes('userId')) {
          throw new ConflictException('Já existe um cliente para este usuário');
        } else if (error.meta?.target?.includes('email')) {
          throw new ConflictException('Um cliente com este email já existe');
        }
      }
      
      throw error;
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.customer.findUnique({
      where: { email }
    });
  }

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        user: true
      }
    });
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        user: true,
        orders: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      return await this.prisma.customer.update({
        where: { id },
        data: updateCustomerDto,
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Um cliente com este email já existe');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.customer.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
      }
      throw error;
    }
  }
}