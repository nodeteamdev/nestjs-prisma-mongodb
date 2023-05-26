import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_SKIP_AUTH_KEY } from '@modules/auth/skip-auth.guard';
import { TokenService } from '@modules/auth/token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private reflector: Reflector,
  ) {}

  /**
   * @desc Check if user is authenticated
   * @param context ExecutionContext
   * @returns Promise<boolean>
   *       true if user is authenticated
   *       false otherwise
   *       @throws UnauthorizedException
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    const isSkipAuth = this.reflector.getAllAndOverride<boolean>(
      IS_SKIP_AUTH_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isSkipAuth) {
      // 💡 See this condition
      return true;
    }

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      await this.tokenService.getAccessTokenFromWhitelist(token);

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('jwt.accessToken'),
      });
      request['user']._meta = {
        accessToken: token,
      };
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  /**
   * @desc Extract token from header
   * @param request Request
   * @returns string | undefined
   * @private
   */
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
