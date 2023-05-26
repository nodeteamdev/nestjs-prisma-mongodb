import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'breakout',
  accessToken: process.env.ACCESS_TOKEN || 'accessToken_breakout',
  refreshToken: process.env.REFRESH_TOKEN || 'refreshToken_breakout',
  jwtExpAccessToken: process.env.ACCESS_TOKEN_EXP || 1000 * 60 * 5, // 5m
  jwtExpRefreshToken: process.env.REFRESH_TOKEN_EXP || 1000 * 60 * 60 * 24, // 1d
  jwtLinkExpAccessToken: process.env.LINK_TOKEN_EXP || 1000 * 60 * 60 * 24 * 2, // 2d
}));
