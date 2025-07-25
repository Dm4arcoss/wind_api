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
  
  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Autenticação')
    .setDescription('API para autenticação de usuários com JWT')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('profile')
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
  app.enableCors();
  await app.listen(3001);
  
  console.log(`Aplicação rodando em: http://localhost:3001`);
  console.log(`Documentação Swagger: http://localhost:3001/api`);
}
bootstrap();