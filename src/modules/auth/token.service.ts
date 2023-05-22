import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TokenRepository } from '@modules/auth/token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async sign(payload): Promise<Auth.AccessRefreshTokens> {
    const userId = payload.id;
    const accessToken = this.createJwtAccessToken(payload);
    const refreshToken = this.createJwtRefreshToken(payload);

    await Promise.all([
      this.tokenRepository.saveAccessTokenToWhitelist(userId, accessToken),
      this.tokenRepository.saveRefreshTokenToWhitelist(userId, accessToken),
    ]);

    return {
      accessToken,
      refreshToken,
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
