import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, UserRepository],
})
export class AuthModule {}
