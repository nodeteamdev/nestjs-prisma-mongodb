import { Module } from '@nestjs/common';
import appConfig from '@config/app.config';
import { ConfigModule } from '@nestjs/config';
import swaggerConfig from '@config/swagger.config';
import HealthModule from '@modules/health/health.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { UserModule } from '@modules/user/user.module';
import { loggingMiddleware, createUserMiddleware } from '@providers/prisma';
import { AuthModule } from '@modules/auth/auth.module';
import jwtConfig from '@config/jwt.config';
import { CaslModule } from '@modules/casl';
import { Roles } from '@modules/app/app.roles';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@modules/auth/auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import s3Config from '@config/s3.config';
import sqsConfig from '@config/sqs.config';
import { TokenService } from '@modules/auth/token.service';
import { TokenRepository } from '@modules/auth/token.repository';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig, jwtConfig, s3Config, sqsConfig],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(), createUserMiddleware()],
      },
    }),
    JwtModule.register({
      global: true,
    }),
    CaslModule.forRoot<Roles>({
      // Role to grant full access, optional
      superuserRole: Roles.admin,
    }),
    HealthModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    TokenService,
    JwtService,
    TokenRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
