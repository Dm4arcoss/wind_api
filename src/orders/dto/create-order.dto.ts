import { IsNotEmpty, IsNumber, IsArray, ValidateNested, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty({ example: 1, description: 'ID do produto' })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 2, description: 'Quantidade do produto' })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 9.99, description: 'Preço do produto' })
  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1, description: 'ID do cliente (opcional)', required: false })
  @IsNumber()
  @IsOptional()
  customerId?: number;

  @ApiProperty({ type: [OrderItemDto], description: 'Itens do pedido' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}