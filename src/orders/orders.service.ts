import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderStatus } from './order.enum';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    const { customerId, items } = createOrderDto;
    const userId = createOrderDto.userId;

    // Verificar se o cliente existe (se fornecido)
    if (customerId) {
      const customer = await this.prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true }
      });

      if (!customer) {
        throw new NotFoundException(`Cliente com ID ${customerId} não encontrado`);
      }
    }

    // Buscar produtos e verificar estoque
    const productIds = items.map(item => item.productId);
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('Um ou mais produtos não foram encontrados');
    }

    // Calcular total do pedido
    let total = 0;
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      
      if (!product) {
        throw new NotFoundException(`Produto com ID ${item.productId} não encontrado`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Produto ${product.name} não tem estoque suficiente`);
      }

      total += item.price * item.quantity;
    }

    // Criar o pedido
    return this.prisma.order.create({
      data: {
        userId,
        customerId: customerId || null,
        total,
        status: OrderStatus.PENDING,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          }))
        }
      },
      include: {
        items: true,
        user: true,
        customer: true
      }
    });
  }

  async findAll(): Promise<any[]> {
    return this.prisma.order.findMany({
      include: {
        items: true,
        user: true,
        customer: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findOne(id: number): Promise<any> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
        customer: true
      }
    });

    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<any> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
  }

  async findByUser(userId: number): Promise<any[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
  
  async findByCustomer(customerId: number): Promise<any[]> {
    return this.prisma.order.findMany({
      where: { customerId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}