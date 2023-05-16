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

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig, jwtConfig],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware(), createUserMiddleware()],
      },
    }),
    CaslModule.forRoot<Roles>({
      // Role to grant full access, optional
      superuserRole: Roles.ADMIN,
      // Function to get casl user from request
      // Optional, defaults to `(request) => request.user`
      getUserFromRequest: (request) => {
        return {
          id: '12',
          roles: [Roles.CUSTOMER],
        };
      },
    }),
    HealthModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
