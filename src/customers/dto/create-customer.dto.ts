import { IsNotEmpty, IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome do cliente' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'joao@exemplo.com', description: 'Email do cliente' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '(11) 98765-4321', description: 'Telefone do cliente' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'Rua Exemplo, 123', description: 'Endereço do cliente' })
  @IsOptional()
  @IsString()
  address?: string;
}