export interface OrderItem {
  id: number;
  orderId: number;
  order?: any;
  productId: number;
  product?: any;
  quantity: number;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
