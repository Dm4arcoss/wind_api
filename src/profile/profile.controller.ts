import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário', schema: {
    example: {
      id: 1,
      email: 'usuario@exemplo.com',
      name: 'João Silva',
      createdAt: '2025-06-07T11:30:00.000Z',
      updatedAt: '2025-06-07T11:30:00.000Z'
    }
  }})
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@CurrentUser() user) {
    return user;
  }
}