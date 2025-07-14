import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from './user.enum';

export class UserResponseDto {
  @ApiProperty({ example: 1, description: 'ID do usuário' })
  id: number;

  @ApiProperty({ example: 'usuario@exemplo.com', description: 'Email do usuário' })
  email: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ example: 'CUSTOMER', description: 'Tipo de usuário', enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: 'ACTIVE', description: 'Status do usuário', enum: UserStatus })
  status: UserStatus;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Data de criação' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z', description: 'Data de atualização' })
  updatedAt: Date;
}
