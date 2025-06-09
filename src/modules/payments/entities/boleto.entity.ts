export interface Boleto {
  id: number;
  paymentId: number;
  payment?: any;
  barcode: string;
  dueDate: Date;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}
