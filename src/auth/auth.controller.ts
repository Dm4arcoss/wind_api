import { Controller, Post, Body, UseGuards, Request, HttpCode, HttpStatus, Get, Query, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { LoginResponse } from './dto/login.response.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';
import { JWT_SECRET, JWT_EXPIRES_IN } from './constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly prisma: PrismaService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuário' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido', schema: {
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 1,
        email: 'usuario@exemplo.com',
        name: 'João Silva',
        role: 'CUSTOMER',
        status: 'ACTIVE'
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    try {
      console.log('Iniciando login para:', loginDto.email);
      
      const user = await this.authService.validateUser(loginDto.email, loginDto.password);
      if (!user) {
        throw new UnauthorizedException('Credenciais inválidas');
      }

      console.log('Usuário validado com sucesso:', user.id);
      
      // Use the auth service's login method to generate the token
      return this.authService.login(user);
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Verificar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @Get('check-user')
  async checkUser(@Query('email') email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) {
      return { exists: false };
    }
    return { exists: true, user };
  }

  @ApiOperation({ summary: 'Registrar usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso', schema: {
    example: {
      id: 1,
      email: 'usuario@exemplo.com',
      name: 'João Silva',
      role: 'CUSTOMER',
      status: 'ACTIVE'
    }
  }})
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já cadastrado' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<UserResponseDto> {
    console.log('Controller - Recebendo dados de registro:', registerDto);
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Validar token JWT' })
  @ApiResponse({ status: 200, description: 'Token válido', schema: {
    example: {
      valid: true,
      user: {
        id: 1,
        email: 'usuario@exemplo.com',
        role: 'CUSTOMER'
      }
    }
  }})
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  @Get('validate')
  async validateToken(@Request() req) {
    return {
      valid: true,
      user: req.user
    };
  }

  @ApiOperation({ summary: 'Obter perfil do usuário' })
  @ApiResponse({ status: 200, description: 'Perfil do usuário', schema: {
    example: {
      id: 1,
      email: 'usuario@exemplo.com',
      name: 'Usuário Exemplo',
      role: 'CUSTOMER'
    }
  }})
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  @Get('profile')
  async getProfile(@Request() req) {
    // Verificar se temos o payload do token
    if (!req.user || !req.user.sub) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    // O sub no payload do token é o id do usuário
    const user = await this.prisma.user.findUnique({
      where: { id: parseInt(req.user.sub) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    return user;
  }
}