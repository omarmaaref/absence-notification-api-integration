import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger:
      process.env['NODE_ENV'] === 'production'
        ? // production
          ['fatal', 'error', 'warn', 'log']
        : // developement
          ['fatal', 'error', 'warn', 'debug', 'verbose', 'log'],
  });
  /*
  // app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes unknown properties
      forbidNonWhitelisted: true, // throws if unknown props are present
      forbidUnknownValues: true, // If set to true, attempts to validate unknown objects fail immediately.
    })
  );*/

  // set port
  const port = process.env['SERVICE_PORT'] || 3000;
  let logMessage = `🚀 Application is running on: http://localhost:${port}`;

  // if GLOBAL_PREFIX is set use it
  if (process.env['GLOBAL_PREFIX']) {
    app.setGlobalPrefix(process.env['GLOBAL_PREFIX']);
    logMessage += `/${process.env['GLOBAL_PREFIX']}`;
  }
  // enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: process.env['API_PREFIX'],
    defaultVersion: `${process.env['API_VERSION']}`,
  });
  logMessage += `/${process.env['API_PREFIX']}${process.env['API_VERSION']}`;

  // if ENABLE_SWAGGER is set enable Swagger
  if (process.env['ENABLE_SWAGGER'] === 'true') {
    const config = new DocumentBuilder()
      .setTitle(process.env['SERVICE_NAME'] || 'Service')
      .setDescription('Microservice')
      .setVersion('0.0.0')
      // .addTag('Microservice')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document); // use 'api' path (root) for Swagger
  }

  // start listening
  await app.listen(port);

  app.set('query parser', 'extended');
  // patch
  //app.Logger.log(logMessage); // show logMessage
}

bootstrap();
