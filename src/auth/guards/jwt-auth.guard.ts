import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    console.log('Request headers:', request.headers);
    
    const token = this.extractTokenFromHeader(request);
    console.log('Token extraído:', token);
    
    if (!token) {
      throw new UnauthorizedException('Token não fornecido');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      console.log('Payload do token:', payload);
      
      // Validate token expiration
      if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
        throw new UnauthorizedException('Token expirado');
      }

      request.user = payload;
      console.log('Usuário injetado no request:', request.user);
      return true;
    } catch (error) {
      console.error('Erro ao validar token:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return undefined;
    }

    const [type, token] = authHeader.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
