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
    HealthModule,
    UserModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
