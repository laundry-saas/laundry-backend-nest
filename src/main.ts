import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get('PORT');
  console.log('Running on port ' + PORT);

  const config = new DocumentBuilder()
    .setTitle('LAUNDRY SAAS API DOC')
    .setDescription('The API documentation for Laundry SAAS')
    .setVersion('1.0')
    .addTag('Laundry SAAS')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(PORT);
}
bootstrap();
