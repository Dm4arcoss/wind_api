import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { Card } from './entities/card.entity';
import { Boleto } from './entities/boleto.entity';
import { Pix } from './entities/pix.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentMethod } from './payment.enum';
import { OrdersService } from '../../orders/orders.service';
import { OrderStatus } from '../../orders/dto/order.enum';

@Injectable()
export class PaymentService {
  constructor(
    private ordersService: OrdersService
  ) {}

  async createPayment(createPaymentDto: CreatePaymentDto, userId: number): Promise<any> {
    const { orderId, method, amount, cardNumber, cardExpiry, cardCvc, cardBrand, boletoBarcode, boletoDueDate, boletoUrl, pixQrCode, pixKey, pixExpiresAt } = createPaymentDto;

    // Verificar se o pedido existe
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${orderId} não encontrado`);
    }

    // Verificar se o pedido já tem pagamento
    if (order.payment) {
      throw new BadRequestException('Este pedido já tem um pagamento associado');
    }

    // Verificar se o pedido pertence ao usuário
    if (order.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para criar um pagamento para este pedido');
    }

    // Criar o pagamento baseado no método
    let payment: any;
    switch (method) {
      case PaymentMethod.CREDIT:
        if (!cardNumber || !cardExpiry || !cardCvc || !cardBrand) {
          throw new BadRequestException('Dados do cartão são obrigatórios para pagamento com cartão de crédito');
        }
        payment = {
          orderId,
          userId,
          method,
          amount,
          status: 'pending',
          transactionId: null,
          metadata: null,
          card: {
            number: cardNumber,
            expiry: cardExpiry,
            cvc: cardCvc,
            brand: cardBrand
          }
        };
        break;

      case PaymentMethod.BOLETO:
        if (!boletoBarcode || !boletoDueDate || !boletoUrl) {
          throw new BadRequestException('Dados do boleto são obrigatórios para pagamento com boleto');
        }
        payment = {
          orderId,
          userId,
          method,
          amount,
          status: 'pending',
          transactionId: null,
          metadata: null,
          boleto: {
            barcode: boletoBarcode,
            dueDate: boletoDueDate,
            url: boletoUrl
          }
        };
        break;

      case PaymentMethod.PIX:
        if (!pixQrCode || !pixKey || !pixExpiresAt) {
          throw new BadRequestException('Dados do PIX são obrigatórios para pagamento com PIX');
        }
        payment = {
          orderId,
          userId,
          method,
          amount,
          status: 'pending',
          transactionId: null,
          metadata: null,
          pix: {
            qrCode: pixQrCode,
            pixKey,
            expiresAt: pixExpiresAt
          }
        };
        break;

      default:
        throw new BadRequestException('Método de pagamento inválido');
    }

    // Processar o pagamento imediatamente
    const processedPayment = await this.processPayment(payment);

    return processedPayment;
  }

  // Processar pagamento através do gateway
  async processPayment(payment: any): Promise<any> {
    console.log('🔄 Processando pagamento:', payment);

    try {
      let result;
      
      switch (payment.method) {
        case PaymentMethod.CREDIT:
          result = await this.processCreditCardPayment(payment);
          break;
        case PaymentMethod.PIX:
          result = await this.processPixPayment(payment);
          break;
        case PaymentMethod.BOLETO:
          result = await this.processBoletoPayment(payment);
          break;
        default:
          throw new BadRequestException('Método de pagamento não suportado');
      }

      // Atualizar o status do pedido baseado no resultado do pagamento
      if (result.status === 'completed') {
        await this.ordersService.update(payment.orderId, {
          status: OrderStatus.PAID
        });
        console.log('✅ Pedido marcado como pago');
      } else if (result.status === 'failed') {
        await this.ordersService.update(payment.orderId, {
          status: OrderStatus.CANCELLED
        });
        console.log('❌ Pedido cancelado devido a falha no pagamento');
      }

      return result;
    } catch (error) {
      console.error('❌ Erro ao processar pagamento:', error);
      throw error;
    }
  }

  // Simular processamento de cartão de crédito
  private async processCreditCardPayment(payment: any): Promise<any> {
    console.log('💳 Processando pagamento com cartão de crédito');
    
    // Simular validação do cartão
    const cardNumber = payment.card.number.replace(/\s/g, '');
    
    // Simular falha para cartões que terminam em 0000
    if (cardNumber.endsWith('0000')) {
      return {
        ...payment,
        status: 'failed',
        transactionId: null,
        metadata: {
          error: 'Cartão recusado pelo banco emissor',
          errorCode: 'CARD_DECLINED'
        },
        processedAt: new Date()
      };
    }

    // Simular processamento bem-sucedido
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      ...payment,
      status: 'completed',
      transactionId,
      metadata: {
        gateway: 'stripe',
        authorizationCode: `AUTH_${Math.random().toString(36).substr(2, 6)}`,
        last4: cardNumber.slice(-4),
        brand: payment.card.brand
      },
      processedAt: new Date()
    };
  }

  // Simular processamento de PIX
  private async processPixPayment(payment: any): Promise<any> {
    console.log('📱 Processando pagamento PIX');
    
    // Simular geração de QR Code e chave PIX
    const pixKey = payment.pix.pixKey || 'teste@exemplo.com';
    const qrCode = payment.pix.qrCode || this.generatePixQrCode(payment.amount, pixKey);
    
    return {
      ...payment,
      status: 'pending', // PIX fica pendente até confirmação
      transactionId: `PIX_${Date.now()}`,
      metadata: {
        qrCode,
        pixKey,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
        paymentUrl: `https://pix.example.com/pay/${Date.now()}`
      },
      processedAt: new Date()
    };
  }

  // Simular processamento de boleto
  private async processBoletoPayment(payment: any): Promise<any> {
    console.log('📄 Processando pagamento com boleto');
    
    // Gerar código de barras e linha digitável
    const barcode = payment.boleto.barcode || this.generateBoletoBarcode(payment.amount);
    const dueDate = payment.boleto.dueDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 dias
    
    return {
      ...payment,
      status: 'pending', // Boleto fica pendente até pagamento
      transactionId: `BOL_${Date.now()}`,
      metadata: {
        barcode,
        dueDate,
        paymentUrl: `https://boleto.example.com/pay/${Date.now()}`,
        instructions: 'Pague até a data de vencimento'
      },
      processedAt: new Date()
    };
  }

  // Gerar QR Code PIX
  private generatePixQrCode(amount: number, pixKey: string): string {
    // Simular geração de QR Code PIX
    return `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${amount.toFixed(2)}5802BR5913Teste Empresa6008Brasilia62070503***6304E2CA`;
  }

  // Gerar código de barras do boleto
  private generateBoletoBarcode(amount: number): string {
    // Simular geração de código de barras
    const base = '12345678901234567890123456789012345678901234';
    return base + Math.floor(amount * 100).toString().padStart(10, '0');
  }

  // Confirmar pagamento PIX (webhook simulado)
  async confirmPixPayment(paymentId: number): Promise<any> {
    console.log('✅ Confirmando pagamento PIX:', paymentId);
    
    const payment = await this.getPaymentById(paymentId, 1); // TODO: pegar userId correto
    
    if (payment.method !== PaymentMethod.PIX) {
      throw new BadRequestException('Este pagamento não é PIX');
    }

    if (payment.status !== 'pending') {
      throw new BadRequestException('Pagamento já foi processado');
    }

    // Simular confirmação do PIX
    const updatedPayment = {
      ...payment,
      status: 'completed',
      transactionId: `PIX_CONFIRMED_${Date.now()}`,
      metadata: {
        ...payment.metadata,
        confirmedAt: new Date(),
        confirmationCode: `CONF_${Math.random().toString(36).substr(2, 8)}`
      }
    };

    // Atualizar status do pedido
    await this.ordersService.update(payment.orderId, {
      status: OrderStatus.PAID
    });

    return updatedPayment;
  }

  // Confirmar pagamento de boleto (webhook simulado)
  async confirmBoletoPayment(paymentId: number): Promise<any> {
    console.log('✅ Confirmando pagamento de boleto:', paymentId);
    
    const payment = await this.getPaymentById(paymentId, 1); // TODO: pegar userId correto
    
    if (payment.method !== PaymentMethod.BOLETO) {
      throw new BadRequestException('Este pagamento não é boleto');
    }

    if (payment.status !== 'pending') {
      throw new BadRequestException('Pagamento já foi processado');
    }

    // Simular confirmação do boleto
    const updatedPayment = {
      ...payment,
      status: 'completed',
      transactionId: `BOL_CONFIRMED_${Date.now()}`,
      metadata: {
        ...payment.metadata,
        confirmedAt: new Date(),
        confirmationCode: `CONF_${Math.random().toString(36).substr(2, 8)}`
      }
    };

    // Atualizar status do pedido
    await this.ordersService.update(payment.orderId, {
      status: OrderStatus.PAID
    });

    return updatedPayment;
  }

  // Cancelar pagamento
  async cancelPayment(paymentId: number, userId: number): Promise<any> {
    console.log('❌ Cancelando pagamento:', paymentId);
    
    const payment = await this.getPaymentById(paymentId, userId);
    
    if (payment.status === 'completed') {
      throw new BadRequestException('Não é possível cancelar um pagamento já concluído');
    }

    const updatedPayment = {
      ...payment,
      status: 'cancelled',
      metadata: {
        ...payment.metadata,
        cancelledAt: new Date(),
        reason: 'Cancelado pelo usuário'
      }
    };

    // Atualizar status do pedido
    await this.ordersService.update(payment.orderId, {
      status: OrderStatus.CANCELLED
    });

    return updatedPayment;
  }

  // Reembolsar pagamento
  async refundPayment(paymentId: number, userId: number, amount?: number): Promise<any> {
    console.log('💰 Processando reembolso:', paymentId);
    
    const payment = await this.getPaymentById(paymentId, userId);
    
    if (payment.status !== 'completed') {
      throw new BadRequestException('Só é possível reembolsar pagamentos concluídos');
    }

    const refundAmount = amount || payment.amount;
    
    const refund = {
      paymentId,
      amount: refundAmount,
      status: 'pending',
      transactionId: `REFUND_${Date.now()}`,
      metadata: {
        originalPaymentId: paymentId,
        refundReason: 'Solicitação do cliente',
        requestedAt: new Date()
      }
    };

    // Simular processamento do reembolso
    const processedRefund = {
      ...refund,
      status: 'completed',
      metadata: {
        ...refund.metadata,
        processedAt: new Date(),
        refundCode: `REF_${Math.random().toString(36).substr(2, 8)}`
      }
    };

    return processedRefund;
  }

  async updatePaymentStatus(paymentId: number, status: string): Promise<any> {
    const payment = await this.ordersService.findOne(paymentId);
    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${paymentId} não encontrado`);
    }

    payment.status = status;
    return payment;
  }

  async getUserPayments(userId: number): Promise<any[]> {
    // Buscar todos os pedidos do usuário que têm pagamentos
    const orders = await this.ordersService.findByUser(userId);
    const payments: any[] = [];

    for (const order of orders) {
      if (order.payment) {
        payments.push({
          id: order.payment.id,
          orderId: order.id,
          userId: order.userId,
          method: order.payment.method,
          amount: order.payment.amount,
          status: order.payment.status,
          createdAt: order.payment.createdAt,
          updatedAt: order.payment.updatedAt,
          card: order.payment.card,
          pix: order.payment.pix,
          boleto: order.payment.boleto
        });
      }
    }

    return payments;
  }

  async getPaymentById(paymentId: number, userId: number): Promise<any> {
    // Buscar o pagamento pelo ID e verificar se pertence ao usuário
    const orders = await this.ordersService.findByUser(userId);
    
    for (const order of orders) {
      if (order.payment && order.payment.id === paymentId) {
        return {
          id: order.payment.id,
          orderId: order.id,
          userId: order.userId,
          method: order.payment.method,
          amount: order.payment.amount,
          status: order.payment.status,
          createdAt: order.payment.createdAt,
          updatedAt: order.payment.updatedAt,
          card: order.payment.card,
          pix: order.payment.pix,
          boleto: order.payment.boleto
        };
      }
    }

    throw new NotFoundException(`Pagamento com ID ${paymentId} não encontrado`);
  }

  async getPaymentsByOrder(orderId: number, userId: number): Promise<any[]> {
    // Verificar se o pedido pertence ao usuário
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${orderId} não encontrado`);
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar este pedido');
    }

    // Retornar o pagamento do pedido se existir
    if (order.payment) {
      return [{
        id: order.payment.id,
        orderId: order.id,
        userId: order.userId,
        method: order.payment.method,
        amount: order.payment.amount,
        status: order.payment.status,
        createdAt: order.payment.createdAt,
        updatedAt: order.payment.updatedAt,
        card: order.payment.card,
        pix: order.payment.pix,
        boleto: order.payment.boleto
      }];
    }

    return [];
  }
}
