import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';
import { TokenRepository } from '@modules/auth/token.repository';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/auth/auth.permissions';
import { GoogleController } from '@modules/auth/controllers/google.controller';
import { AuthSocialService } from '@modules/auth/auth-social.service';
import { GoogleStrategy } from '@modules/auth/strategies/google.strategy';
import { UserService } from '@modules/user/user.service';
import { SocialRepository } from '@modules/auth/social.repository';

@Module({
  imports: [CaslModule.forFeature({ permissions })],
  controllers: [AuthController, GoogleController],
  providers: [
    GoogleStrategy,
    AuthService,
    TokenService,
    UserRepository,
    TokenRepository,
    AuthSocialService,
    UserService,
    SocialRepository,
  ],
})
export class AuthModule {}
