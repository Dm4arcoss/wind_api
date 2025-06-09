export interface Card {
  id: number;
  paymentId: number;
  payment?: any;
  number: string;
  expiry: string;
  cvc: string;
  brand: string;
  createdAt: Date;
  updatedAt: Date;
}
