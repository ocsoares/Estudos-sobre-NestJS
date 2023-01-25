import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/app';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api'); // Todas os Controllers dessa aplicação INTEIRA vai começar com /api !!
    app.useGlobalPipes(new ValidationPipe()); // Habilita as Verificações do Body da Aplicação !!

    await app.listen(PORT);
}

bootstrap();
