import { IsEmail, IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@exemplo.com', description: 'Email do usuário' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário (mínimo 6 caracteres)' })
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  @IsNotEmpty()
  name: string;
}