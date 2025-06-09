import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsPositive, ValidateIf } from 'class-validator';
import { PaymentMethod } from '../payment.enum';

export class CreatePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsString()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.CREDIT)
  cardNumber?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.CREDIT)
  cardExpiry?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.CREDIT)
  cardCvc?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.CREDIT)
  cardBrand?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.BOLETO)
  boletoBarcode?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.BOLETO)
  boletoDueDate?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.BOLETO)
  boletoUrl?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.PIX)
  pixQrCode?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.PIX)
  pixKey?: string;

  @IsOptional()
  @IsString()
  @ValidateIf((dto) => dto.method === PaymentMethod.PIX)
  pixExpiresAt?: string;
}
