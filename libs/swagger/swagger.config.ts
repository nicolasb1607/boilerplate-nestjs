import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('State.com')
  .setDescription(
    'Here you can find all the routes with their assiociated schemas.For route with a lock, please provide an JWT Bearer token by using the Authorize button',
  )
  .setVersion('3.0')
  .addBearerAuth()
  .build();

export const options: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};
