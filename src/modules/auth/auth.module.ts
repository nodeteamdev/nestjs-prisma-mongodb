import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';
import { TokenRepository } from '@modules/auth/token.repository';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/auth/auth.permissions';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [AuthController],
  providers: [AuthService, TokenService, UserRepository, TokenRepository],
})
export class AuthModule {}
