import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'usuario@exemplo.com', description: 'Email do usuário' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha do usuário (mínimo 6 caracteres)' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  @IsNotEmpty()
  name: string;
}