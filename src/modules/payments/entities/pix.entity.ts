export interface Pix {
  id: number;
  paymentId: number;
  payment?: any;
  qrCode: string;
  pixKey: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
