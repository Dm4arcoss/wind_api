import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto, userId: number) {
    try {
      return await this.prisma.customer.create({
        data: {
          ...createCustomerDto,
          user: {
            connect: { id: userId }
          }
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Um cliente com este email já existe');
      }
      throw error;
    }
  }

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
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