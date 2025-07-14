import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserStatus, UserRole } from './dto/user.enum';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginResponse } from './dto/login.response.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { JWT_SECRET, JWT_EXPIRES_IN } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    if (!bcrypt) {
      throw new Error('Bcrypt não está disponível');
    }
  }

  async validateUser(email: string, pass: string): Promise<UserResponseDto> {
    try {
      console.log('Validando usuário:', email);
      
      const user = await this.prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        console.log('Usuário não encontrado:', email);
        throw new UnauthorizedException('Usuário não encontrado');
      }

      if (user.status !== UserStatus.ACTIVE) {
        console.log('Usuário inativo:', email);
        throw new UnauthorizedException('Usuário inativo');
      }

      const isPasswordValid = await bcrypt.compare(pass, user.password);
      if (!isPasswordValid) {
        console.log('Senha inválida para usuário:', email);
        throw new UnauthorizedException('Senha inválida');
      }

      console.log('Usuário validado com sucesso:', email);
      const { password, ...userData } = user;
      
      // Convert Prisma enums to DTO enums
      const userWithDtoEnums = {
        ...userData,
        role: userData.role as UserRole,
        status: userData.status as UserStatus
      };

      return userWithDtoEnums as UserResponseDto;
    } catch (error) {
      console.error('Erro na validação do usuário:', error);
      throw new UnauthorizedException(error.message || 'Erro ao validar usuário');
    }
  }

  async login(user: UserResponseDto): Promise<LoginResponse> {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || JWT_EXPIRES_IN
      }),
      user
    };
  }

  private generateToken(payload: any, options?: { secret?: string; expiresIn?: string }): string {
    return this.jwtService.sign(payload, {
      secret: options?.secret || process.env.JWT_SECRET || JWT_SECRET,
      expiresIn: options?.expiresIn || process.env.JWT_EXPIRES_IN || JWT_EXPIRES_IN
    });
  }

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    try {
      // Validar campos obrigatórios
      if (!registerDto.email || !registerDto.password || !registerDto.name) {
        throw new BadRequestException('Todos os campos são obrigatórios');
      }

      // Validar formato do email
      if (!registerDto.email.includes('@') || !registerDto.email.includes('.')) {
        throw new BadRequestException('Email inválido');
      }

      // Validar tamanho da senha
      if (registerDto.password.length < 6) {
        throw new BadRequestException('A senha deve ter no mínimo 6 caracteres');
      }

      // Verificar se o email já existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email: registerDto.email }
      });
      if (existingUser) {
        throw new ConflictException('Email já cadastrado');
      }

      // Criptografar senha
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);

      // Criar usuário
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: hashedPassword,
          name: registerDto.name,
          role: registerDto.role || UserRole.CUSTOMER,
          status: UserStatus.ACTIVE
        },
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

      // Convert Prisma enums to DTO enums
      const userWithDtoEnums = {
        ...user,
        role: user.role as UserRole,
        status: user.status as UserStatus
      };

      return userWithDtoEnums as UserResponseDto;
    } catch (error) {
      console.error('Erro durante registro:', error);
      throw new BadRequestException(error.message || 'Erro ao registrar usuário');
    }
  }
}