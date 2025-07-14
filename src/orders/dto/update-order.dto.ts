import { IsOptional, IsNumber, IsPositive, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '../../types/order-status';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty({
    description: 'ID do cliente',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiProperty({
    description: 'ID do endereço',
    example: 1
  })
  @IsNumber()
  @IsOptional()
  addressId?: number;

  @ApiProperty({
    description: 'Status do pedido',
    enum: ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'PAID'],
    example: 'PENDING'
  })
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    description: 'Valor total do pedido',
    example: 199.98
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  amount?: number;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        productId: {
          type: 'number',
          example: 1
        },
        quantity: {
          type: 'number',
          example: 2
        }
      }
    }
  })
  @IsArray()
  @IsOptional()
  items?: {
    productId: number;
    quantity: number;
  }[];
}