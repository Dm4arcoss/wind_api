export interface User {
  id: number;
  email: string;
  password: string;
  name?: string;
  role: string;
  status: string;
  orders?: any[];
  payments?: any[];
  createdAt: Date;
  updatedAt: Date;
}
