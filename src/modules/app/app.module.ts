import { Module } from '@nestjs/common';
import appConfig from '@config/app.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import swaggerConfig from '@config/swagger.config';
import HealthModule from '@modules/health/health.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { UserModule } from '@modules/user/user.module';
import {
  loggingMiddleware,
  createUserMiddleware,
  PrismaService,
} from '@providers/prisma';
import { AuthModule } from '@modules/auth/auth.module';
import jwtConfig from '@config/jwt.config';
import { CaslModule } from '@modules/casl';
import { Roles } from '@modules/app/app.roles';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@modules/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { authenticate } from '@providers/adminjs/auth';
import s3Config from '@config/s3.config';
import sqsConfig from '@config/sqs.config';

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
    import('@adminjs/nestjs').then(async ({ AdminModule }) => {
      const { Database, Resource } = await import('@adminjs/prisma');
      const { AdminJS } = await import('adminjs');

      AdminJS.registerAdapter({ Database, Resource });

      return AdminModule.createAdminAsync({
        useFactory: async (prisma: PrismaService) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const dmmf = await prisma._getDmmf();

          return {
            adminJsOptions: {
              rootPath: '/admin',
              resources: [
                {
                  resource: { model: dmmf.modelMap.User, client: prisma },
                  options: {},
                },
              ],
            },
            auth: {
              authenticate,
              cookieName: 'adminjs',
              cookiePassword: 'secret',
            },
            sessionOptions: {
              resave: true,
              saveUninitialized: true,
              secret: 'secret',
            },
          };
        },
        inject: [PrismaService],
      });
    }),
    HealthModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
