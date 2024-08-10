import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { config, options } from 'libs/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    logger: ['fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  //Swagger
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  //Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  //Running Port
  const configService = app.get(ConfigService);
  const port = configService.get<number>('BACKEND_PORT');
  const logger = new Logger('APP');
  logger.verbose('RUNNING PORT ' + port);

  await app.listen(port);
}
bootstrap();
