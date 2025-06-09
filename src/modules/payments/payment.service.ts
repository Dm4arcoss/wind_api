import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { Card } from './entities/card.entity';
import { Boleto } from './entities/boleto.entity';
import { Pix } from './entities/pix.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentMethod } from './payment.enum';
import { OrdersService } from '../../orders/orders.service';
import { OrderStatus } from '../../orders/order.enum';

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

    // Atualizar o status do pedido para pago
    await this.ordersService.update(orderId, {
      status: OrderStatus.PAID
    });

    return payment;
  }

  async updatePaymentStatus(paymentId: number, status: string): Promise<any> {
    const payment = await this.ordersService.findOne(paymentId);
    if (!payment) {
      throw new NotFoundException(`Pagamento com ID ${paymentId} não encontrado`);
    }

    payment.status = status;
    return payment;
  }
}
