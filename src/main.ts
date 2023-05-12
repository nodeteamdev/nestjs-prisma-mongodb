import * as basicAuth from 'express-basic-auth';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  Logger,
  RequestMethod,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@modules/app/app.module';
import { VersioningOptions } from '@nestjs/common/interfaces/version-options.interface';
import { AllExceptionsFilter } from '@filters/all-exception.filter';
import { PrismaClientExceptionFilter } from '@providers/prisma/prisma-client-exception.filter';
import { ValidationExceptionFilter } from '@filters/validation-exception.filter';
import validationExceptionFactory from '@filters/validation-exception-factory';
import { BadRequestExceptionFilter } from '@filters/bad-request-exception.filter';
import { ThrottlerExceptionsFilter } from '@filters/throttler-exception.filter';
import { TransformInterceptor } from '@interceptors/transform.interceptor';

async function bootstrap(): Promise<{ port: number }> {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.get('app');
  const swaggerConfig = configService.get('swagger');

  {
    /**
     * Enable Logger
     */
    const options = appConfig.loggerLevel;
    app.useLogger(options);
  }

  {
    /**
     * Enable DTO Validation
     */
    const options = {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    };

    app.useGlobalPipes(
      new ValidationPipe({
        ...options,
        exceptionFactory: validationExceptionFactory,
      }),
    );
  }

  {
    /**
     * Set global prefix [api] for all routes
     */
    const options = {
      exclude: [{ path: '/', method: RequestMethod.GET }],
    };

    app.setGlobalPrefix('api', options);
  }

  {
    /**
     * Enable versioning for all routes
     */
    const options: VersioningOptions = {
      type: VersioningType.URI,
      defaultVersion: '1',
    };

    app.enableVersioning(options);
  }

  {
    /**
     * Setup Swagger API documentation
     */
    app.use(
      ['/docs'],
      basicAuth({
        challenge: true,
        users: {
          admin: swaggerConfig.password,
        },
      }),
    );

    const options = new DocumentBuilder()
      .setTitle('Api v1')
      .setDescription('Starter API v1')
      .setVersion('1.0')
      .addBearerAuth({ in: 'header', type: 'http' })
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document);
  }

  app.useGlobalInterceptors(new TransformInterceptor());

  {
    /**
     * Enable global filters
     */
    const { httpAdapter } = app.get(HttpAdapterHost);

    app.useGlobalFilters(
      new AllExceptionsFilter(),
      new BadRequestExceptionFilter(),
      new PrismaClientExceptionFilter(httpAdapter),
      new ValidationExceptionFilter(),
      new ThrottlerExceptionsFilter(),
    );
  }

  await app.listen(appConfig.port);

  return appConfig;
}

bootstrap().then((appConfig) => {
  Logger.log(`Listening on http://localhost:${appConfig.port}`, 'Bootstrap');
});
