import { IsNotEmpty, IsNumber, IsArray, ValidateNested, Min, IsPositive, IsOptional } from 'class-validator';
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
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do usuário',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  userId?: number;

  @ApiProperty({
    description: 'ID do cliente',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  customerId: number;

  @ApiProperty({
    description: 'ID do endereço',
    example: 1
  })
  @IsNumber()
  @IsPositive()
  addressId: number;

  @ApiProperty({
    description: 'Valor total do pedido',
    example: 199.98
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({ type: OrderItemDto, isArray: true, description: 'Itens do pedido' })
  @IsArray()
  @ValidateNested()
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}