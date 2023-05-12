import { Module } from '@nestjs/common';
import appConfig from '@config/app.config';
import { ConfigModule } from '@nestjs/config';
import swaggerConfig from '@config/swagger.config';
import HealthModule from '@modules/health/health.module';
import { PrismaModule } from '@providers/prisma/prisma.module';
import { UserModule } from '@modules/user/user.module';
import { loggingMiddleware } from '@providers/prisma';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, swaggerConfig],
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        middlewares: [loggingMiddleware()],
      },
    }),
    HealthModule,
    UserModule,
  ],
  providers: [],
})
export class AppModule {}
