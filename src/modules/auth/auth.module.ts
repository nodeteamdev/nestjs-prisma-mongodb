import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, TokenService, UserRepository, JwtService],
})
export class AuthModule {}
