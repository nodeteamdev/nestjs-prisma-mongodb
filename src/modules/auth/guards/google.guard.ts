import { URL } from 'url';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { TokenService } from '@modules/auth/token.service';

export function getOAuthStatePayload(request: Request) {
  const { userId } = request.query;

  return {
    ...(userId && { userId: parseInt((userId as string) || '', 10) }),
  };
}

export function buildCallbackUrl(context: ExecutionContext) {
  const req = context.switchToHttp().getRequest();
  const { originalUrl, port } = req;
  const portSuffix = port ? `:${port}` : '';
  const callbackURL = new URL(
    `https://${req.get('host')}${portSuffix}${originalUrl}`,
  );

  callbackURL.search = '';

  return callbackURL.href.includes('redirect')
    ? callbackURL.href
    : `${callbackURL.href}-redirect`;
}

@Injectable()
export class GoogleGuard extends AuthGuard('google') {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
  ) {
    super();
  }

  async getAuthenticateOptions(
    context: ExecutionContext,
  ): Promise<IAuthModuleOptions> {
    return {
      state: this.tokenService.createJwtAccessToken({
        payload: getOAuthStatePayload(context.switchToHttp().getRequest()),
      }),
      callbackURL: buildCallbackUrl(context),
    };
  }
}
