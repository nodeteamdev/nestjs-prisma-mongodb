import { Injectable } from '@nestjs/common';
import { PrismaService } from '@providers/prisma';
import { ConfigService } from '@nestjs/config';
import { TokenWhiteList } from '.prisma/client';

@Injectable()
export class TokenRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  saveAccessTokenToWhitelist(
    userId: string,
    accessToken: string,
  ): Promise<TokenWhiteList> {
    const jwtConfig = this.configService.get('jwt');
    const expiredAt = new Date(Date.now() + jwtConfig.jwtExpAccessToken);

    return this.prisma.tokenWhiteList.create({
      data: {
        userId: userId,
        accessToken,
        refreshToken: null,
        expiredAt,
      },
    });
  }

  saveRefreshTokenToWhitelist(
    userId: string,
    refreshToken: string,
  ): Promise<TokenWhiteList> {
    const jwtConfig = this.configService.get('jwt');
    const expiredAt = new Date(Date.now() + jwtConfig.jwtExpRefreshToken);

    return this.prisma.tokenWhiteList.create({
      data: {
        userId: userId,
        accessToken: null,
        refreshToken,
        expiredAt,
      },
    });
  }
}
