import { Injectable, NotFoundException, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { UserStatus, UserRole } from '../auth/dto/user.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
    // Verificar se o bcrypt está disponível
    if (!bcrypt) {
      throw new Error('Bcrypt não está disponível');
    }
  }

  async create(createUserDto: CreateUserDto) {
    try {
      console.log('Dados recebidos:', JSON.stringify(createUserDto, null, 2));
      
      // Validar o DTO
      const errors = await validate(createUserDto);
      if (errors.length > 0) {
        console.log('Erros de validação:', JSON.stringify(errors, null, 2));
        throw new BadRequestException(`Dados inválidos: ${errors.map(e => e.constraints).join(', ')}`);
      }

      // Verificar se o email já existe
      const existingUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email }
      });

      if (existingUser) {
        throw new BadRequestException('Este email já está em uso');
      }

      // Preparar os dados para enviar
      const userData = {
        name: createUserDto.name,
        email: createUserDto.email.toLowerCase(),
        password: await this.hashPassword(createUserDto.password),
        status: UserStatus.ACTIVE,
        role: UserRole.ADMIN  // Definir como admin por padrão
      };

      console.log('Dados para criação:', JSON.stringify(userData, null, 2));
      
      const result = await this.prisma.user.create({
        data: userData,
      });

      console.log('Usuário criado com sucesso:', result);
      return { success: true, data: result };

    } catch (error) {
      console.error('Erro detalhado:', error);
      if (error.code === 'P2002') {
        throw new ConflictException('Este email já está em uso');
      }
      throw new InternalServerErrorException('Erro ao criar usuário');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    // Aqui você pode implementar o hash da senha usando bcrypt ou outra biblioteca
    return password; // Por enquanto, retornando a senha sem hash
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async delete(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: parseInt(id) }
      });

      if (!user) {
        throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
      }

      await this.prisma.user.delete({
        where: { id: parseInt(id) }
      });

      return { success: true, message: 'Usuário deletado com sucesso' };
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw new InternalServerErrorException('Erro ao deletar usuário');
    }
  }
}
