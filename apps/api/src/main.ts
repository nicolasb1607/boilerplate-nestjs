import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { parseBoolean } from 'libs/shared/functions/shared.functions';
import { config, options } from 'libs/swagger/swagger.config';
import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule, {
    logger: ['fatal', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);

  //Swagger
  const enableSwagger = configService.get<string>('ENABLE_SWAGGER');
  if (parseBoolean(enableSwagger)) {
    const document = SwaggerModule.createDocument(app, config, options);
    SwaggerModule.setup('api', app, document);
  }

  //Validation Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  //Running Port
  const port = configService.get<number>('BACKEND_PORT');
  const logger = new Logger('APP');
  logger.verbose('RUNNING PORT ' + port);

  app.enableCors();

  await app.listen(port);
}
bootstrap();
