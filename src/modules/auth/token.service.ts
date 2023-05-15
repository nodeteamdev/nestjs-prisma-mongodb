import { INVALID_TOKEN } from '@constants/errors.constants';
import { ConflictException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  sign(payload: string | Buffer | object): Auth.AccessRefreshTokens {
    return {
      accessToken: this.createJwtAccessToken(payload),
      refreshToken: this.createJwtRefreshToken(payload),
    };
  }

  isPasswordCorrect(dtoPassword: string, password: string): boolean {
    return bcrypt.compare(dtoPassword, password);
  }

  createJwtAccessToken(payload: string | Buffer | object): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('jwt.jwtExpAccessToken'),
      secret: this.configService.get<string>('jwt.accessToken'),
    });
  }

  createJwtRefreshToken(payload: string | Buffer | object): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<number>('jwt.jwtExpRefreshToken'),
      secret: this.configService.get<string>('jwt.refreshToken'),
    });
  }
}
