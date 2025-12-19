import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  // Serve /uploads folder globally
  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.enableCors({ origin: true, credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const port = process.env.PORT as any 
  await app.listen(port);

  console.log(`Server running: http://localhost:8000`);
  console.log(`Uploads: http://localhost:8000/uploads/<filename>`);
}
bootstrap();
