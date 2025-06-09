import { PaymentMethod } from '../payment.enum';

export interface Payment {
  id: number;
  orderId: number;
  userId: number;
  method: PaymentMethod;
  amount: number;
  transactionId?: string;
  metadata?: any;
  card?: any;
  boleto?: any;
  pix?: any;
  createdAt: Date;
  updatedAt: Date;
}
