export const ORDER_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

export type OrderUpdateInput = {
  status?: OrderStatus;
  userId?: number;
  customerId?: number;
  addressId?: number;
  amount?: number;
  items?: {
    create?: Array<{
      productId: number;
      quantity: number;
      price: number;
    }>;
  };
};
