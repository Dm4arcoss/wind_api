import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

// Tipos personalizados para o status do pedido
type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const VALID_ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

function validateOrderStatus(status: string): OrderStatus {
  if (!VALID_ORDER_STATUSES.includes(status as OrderStatus)) {
    throw new BadRequestException('Status inválido. Valores permitidos: ' + VALID_ORDER_STATUSES.join(', '));
  }
  return status as OrderStatus;
}

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async count(): Promise<number> {
    return this.prisma.order.count();
  }

  async getRecentOrders(): Promise<any[]> {
    return this.prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Últimos 7 dias
        },
        status: {
          not: 'CANCELLED'
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5,
      include: {
        customer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async getOrderStats(): Promise<{ labels: string[], values: number[] }> {
    // Buscar estatísticas de pedidos por status
    const stats = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true
    });

    // Criar array de labels (status)
    const labels = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    
    // Inicializar valores com zeros
    const values = new Array(5).fill(0);

    // Preencher valores com dados reais
    if (stats) {
      stats.forEach(stat => {
        const index = labels.indexOf(stat.status);
        if (index !== -1) {
          values[index] = stat._count;
        }
      });
    }

    return {
      labels,
      values
    };
  }

  async create(createOrderDto: CreateOrderDto): Promise<any> {
    console.log('🔧 Service - Dados recebidos:', createOrderDto);
    
    const { customerId, items, addressId, amount, userId } = createOrderDto;
    const productIds = items.map(item => item.productId);

    console.log('🔧 Service - ProductIds:', productIds);
    console.log('🔧 Service - CustomerId:', customerId);
    console.log('🔧 Service - AddressId:', addressId);
    console.log('🔧 Service - Amount:', amount);
    console.log('🔧 Service - UserId:', userId);

    // Verificar se o usuário existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      console.error('❌ Service - Usuário não encontrado:', userId);
      throw new NotFoundException(`Usuário com ID ${userId} não encontrado`);
    }

    // Verificar se o cliente existe
    const customer = await this.prisma.customer.findUnique({
      where: { id: customerId }
    });
    
    if (!customer) {
      console.error('❌ Service - Cliente não encontrado:', customerId);
      throw new NotFoundException(`Cliente com ID ${customerId} não encontrado`);
    }

    // Verificar se o endereço existe
    const address = await this.prisma.address.findUnique({
      where: { id: addressId }
    });
    
    if (!address) {
      console.error('❌ Service - Endereço não encontrado:', addressId);
      throw new NotFoundException(`Endereço com ID ${addressId} não encontrado`);
    }

    const products = await this.prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      }
    });

    console.log('🔧 Service - Produtos encontrados:', products.length);

    if (products.length !== productIds.length) {
      console.error('❌ Service - Produtos não encontrados. Esperados:', productIds.length, 'Encontrados:', products.length);
      throw new NotFoundException('Um ou mais produtos não foram encontrados');
    }

    // Verificar estoque
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product && product.stock < item.quantity) {
        console.error('❌ Service - Estoque insuficiente para produto:', product.name, 'Estoque:', product.stock, 'Solicitado:', item.quantity);
        throw new BadRequestException(`Estoque insuficiente para o produto ${product.name}`);
      }
    }

    console.log('🔧 Service - Criando pedido...');

    // Garantir que userId seja um número
    if (!userId) {
      console.error('❌ Service - UserId é obrigatório');
      throw new BadRequestException('UserId é obrigatório');
    }

    const order = await this.prisma.order.create({
      data: {
        customerId,
        userId: userId as number,
        addressId,
        amount,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                }
              }
            }
          }
        }
      }
    });

    console.log('✅ Service - Pedido criado com sucesso:', order.id);
    return order;
  }

  async findAll(): Promise<any[]> {
    try {
      console.log('🔧 Service - Buscando todos os pedidos...');
      
      const orders = await this.prisma.order.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      
      console.log('✅ Service - Pedidos encontrados:', orders.length);
      return orders;
    } catch (error) {
      console.error('❌ Service - Erro ao buscar pedidos:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      console.log('Buscando pedido com ID:', id);
      
      // Converter id para número
      const orderId = Number(id);
      if (isNaN(orderId)) {
        throw new BadRequestException('ID inválido');
      }

      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: {
          user: true,
          customer: true
        }
      });

      if (!order) {
        console.log('Pedido não encontrado:', orderId);
        throw new NotFoundException('Pedido não encontrado');
        throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
      }

      return order;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw new BadRequestException('Erro ao buscar pedido');
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<any> {
    try {
      console.log('🔧 Service - Atualizando pedido:', id);
      console.log('🔧 Service - Dados de atualização:', updateOrderDto);
      
      const { status: orderStatus, ...data } = updateOrderDto;
      const status = orderStatus ? validateOrderStatus(orderStatus) : undefined;

      const updateData = {
        status,
        ...(data && {
          userId: data.userId,
          customerId: data.customerId,
          addressId: data.addressId,
          amount: data.amount,
          items: data.items && {
            create: data.items.map(item => ({
              productId: item.productId,
              quantity: item.quantity
            }))
          }
        })
      };

      console.log('🔧 Service - Dados para atualização:', updateData);

      const order = await this.prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  stock: true,
                  category: {
                    select: {
                      id: true,
                      name: true,
                      slug: true
                    }
                  }
                }
              }
            }
          }
        }
      });

      console.log('✅ Service - Pedido atualizado com sucesso');
      return order;
    } catch (error) {
      console.error('❌ Service - Erro ao atualizar pedido:', error);
      throw error;
    }
  }

  async findByUser(userId: number): Promise<any[]> {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                }
              }
            }
          }
        }
      }
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
            role: true,
            status: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stock: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }
}