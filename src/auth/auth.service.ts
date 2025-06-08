import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { JWT_SECRET, JWT_EXPIRES_IN } from './constants';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {
    // Verificar se o bcrypt está disponível
    if (!bcrypt) {
      throw new Error('Bcrypt não está disponível');
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    console.log('Tentando validar usuário:', email);
    
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    console.log('Usuário encontrado:', user ? 'Sim' : 'Não');
    
    if (!user) {
      console.log('Usuário não encontrado');
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Verificações do usuário
    console.log('Informações do usuário:', {
      id: user.id,
      email: user.email,
      status: user.status,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

    if (user.status !== 'active') {
      console.log('Usuário inativo - Status:', user.status);
      throw new UnauthorizedException('Usuário inativo');
    }

    // Verificação de senha
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    console.log('Senha correta:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Senha incorreta');
      throw new UnauthorizedException('Senha incorreta');
    }

    // Retorna dados do usuário sem a senha
    const { password, ...userData } = user;
    console.log('Usuário validado com sucesso');
    return userData;
  }

  async login(user: any) {
    console.log('Iniciando login para usuário:', user.email);
    
    if (!user || !user.id || !user.email) {
      console.error('Dados do usuário inválidos');
      throw new UnauthorizedException('Dados do usuário inválidos');
    }

    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role
    };

    console.log('Payload do token:', payload);
    
    const token = this.jwtService.sign(payload, {
      secret: JWT_SECRET,
      expiresIn: JWT_EXPIRES_IN,
    });

    console.log('Token gerado com sucesso');
    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status
      }
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
    
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        role: 'user',
        status: 'active',
        name: registerDto.name || ''
      },
    });
    
    return this.login(user);
  }
}