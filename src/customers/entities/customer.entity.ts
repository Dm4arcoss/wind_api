export interface Customer {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  orders?: any[];
  createdAt: Date;
  updatedAt: Date;
}
