import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuração de arquivos estáticos
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  // Configuração do CORS mais específica
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Produtos')
    .setDescription('API para gerenciamento de produtos, categorias, pedidos e clientes')
    .setVersion('1.0')
    .addTag('auth', 'Autenticação de usuários')
    .addTag('profile', 'Perfil do usuário')
    .addTag('products', 'Gerenciamento de produtos')
    .addTag('categories', 'Gerenciamento de categorias')
    .addTag('orders', 'Gerenciamento de pedidos')
    .addTag('customers', 'Gerenciamento de clientes')
    .addTag('dashboard', 'Estatísticas e dados para o dashboard')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));
  app.use(cookieParser());
  
  await app.listen(3001);
  
  console.log(`Aplicação rodando em: http://localhost:3001`);
  console.log(`Documentação Swagger: http://localhost:3001/api`);
}
bootstrap();