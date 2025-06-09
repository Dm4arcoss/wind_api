import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export class UpdateOrderDto {
  @ApiProperty({ 
    enum: OrderStatus, 
    example: OrderStatus.PAID,
    description: 'Status do pedido',
    enumName: 'OrderStatus'
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}