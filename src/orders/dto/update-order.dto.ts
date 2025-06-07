import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export class UpdateOrderDto {
  @ApiProperty({ 
    enum: OrderStatus, 
    example: OrderStatus.PROCESSING,
    description: 'Status do pedido',
    enumName: 'OrderStatus'
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}