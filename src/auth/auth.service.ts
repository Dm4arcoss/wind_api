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
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: JWT_SECRET,
        expiresIn: JWT_EXPIRES_IN,
      }),
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
        name: registerDto.name,
      },
    });
    
    const { password, ...result } = user;
    return result;
  }
}