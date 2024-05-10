import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
  OAUTH_INVALID_RESPONSE,
  OAUTH_INVALID_STATE,
} from '@constants/errors.constants';
import { Oauth2Exception } from '@filters/oauth2.exception';
import { AuthService } from '@modules/auth/auth.service';
import { TokenService } from '@modules/auth/token.service';

@Injectable()
export class SocialRedirectGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { state } = request.query;

    if (!state) {
      throw new Oauth2Exception({ error: OAUTH_INVALID_RESPONSE });
    }

    const decodedState = this.tokenService.decodeJwtToken(state);

    if (!decodedState) {
      throw new Oauth2Exception({ error: OAUTH_INVALID_STATE });
    }

    return true;
  }
}
