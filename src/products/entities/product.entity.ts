export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category?: any;
  categoryId: number;
  orderItems?: any[];
  createdAt: Date;
  updatedAt: Date;
}
