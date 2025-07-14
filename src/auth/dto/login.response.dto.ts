import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from './user.enum';
import { UserResponseDto } from './user.response.dto';

export class LoginResponse {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token JWT do usuário' })
  access_token: string;

  @ApiProperty({ type: () => UserResponseDto })
  user: UserResponseDto;
}
