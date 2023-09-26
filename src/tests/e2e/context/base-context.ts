import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { AppModule } from '@modules/app/app.module';
import { ConfigModule } from '@nestjs/config';
import validationExceptionFactory from '@filters/validation-exception-factory';
import TestService from '@tests/e2e/test.service';
import { AdminUserInterface } from '@tests/e2e/interfaces/admin-user.interface';
import { IMakeRequest } from '@tests/e2e/interfaces/make-request.interface';
import makeRequest from '@tests/e2e/common/make-request';

class BaseContext {
  private _app!: INestApplication;

  private _module!: TestingModule;

  private _server!: Server;

  private _connection!: PrismaClient;

  public service!: TestService;

  public globalAdmin!: AdminUserInterface;

  public request!: IMakeRequest;

  async init() {
    this._module = await Test.createTestingModule({
      imports: [AppModule, ConfigModule],
    }).compile();

    const options = {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
    };

    this._app = this._module.createNestApplication().useGlobalPipes(
      new ValidationPipe({
        ...options,
        exceptionFactory: validationExceptionFactory,
      }),
    );

    this._connection = new PrismaClient();

    await this._app.init();

    this._server = this._app.getHttpServer();

    this.request = makeRequest(this._server);

    this.service = new TestService(this._app, this._connection);

    this.globalAdmin = await this.service.createGlobalAdmin();
  }
}

export default BaseContext;
