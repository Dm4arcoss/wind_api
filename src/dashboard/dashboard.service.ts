import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      productCount,
      orderCount,
      userCount,
      revenue
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.order.count(),
      this.prisma.user.count(),
      this.prisma.order.aggregate({
        where: { status: 'DELIVERED' },
        _sum: { amount: true }
      })
    ]);

    return {
      productCount,
      orderCount,
      userCount,
      revenue: revenue._sum.amount || 0
    };
  }

  async getRecentProducts() {
    return this.prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
  }

  async getCategoryStats() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { product: true }
        }
      }
    });

    const totalProducts = await this.prisma.product.count();

    return categories.map(category => {
      const count = category._count.product;
      const percentage = totalProducts > 0 ? Math.round((count / totalProducts) * 100) : 0;
      
      // Atribuir uma cor com base no ID da categoria (para manter consistência visual)
      const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-purple-500'];
      const colorIndex = (category.id - 1) % colors.length;
      
      return {
        id: category.id,
        name: category.name,
        count,
        percentage,
        color: colors[colorIndex]
      };
    });
  }
  
  async getTopSellingProducts() {
    const orderItems = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });
    
    const productIds = orderItems.map(item => item.productId);
    
    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds }
      },
      include: {
        category: true
      }
    });
    
    return orderItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...product,
        totalSold: item._sum.quantity
      };
    });
  }
  
  async getRecentOrders() {
    return this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }
  
  async getOrderStats() {
    const ordersByStatus = await this.prisma.order.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });
    
    const statuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const colors = ['bg-yellow-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500'];
    
    const totalOrders = ordersByStatus.reduce((sum, item) => sum + item._count.id, 0);
    
    return statuses.map((status, index) => {
      const statusData = ordersByStatus.find(item => item.status === status);
      const count = statusData ? statusData._count.id : 0;
      const percentage = totalOrders > 0 ? Math.round((count / totalOrders) * 100) : 0;
      
      return {
        status,
        count,
        percentage,
        color: colors[index]
      };
    });
  }
}