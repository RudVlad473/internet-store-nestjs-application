import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  config();

  //enable global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  //

  //enable cookie parser
  app.use(cookieParser());
  //

  //enable swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Internet store application')
    .setDescription('The Internet store API description')
    .setVersion('1.0')
    .addTag('internet-store')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  //

  await app.listen(process.env.PORT);
}
bootstrap();
