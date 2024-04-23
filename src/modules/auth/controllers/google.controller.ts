import { Controller, Query, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ISocialUser } from '@modules/auth/interfaces/social-user.interface';
import { SocialRedirect } from '@modules/auth/decorators/social-redirect.decorator';
import { GoogleOAuth2 } from '@modules/auth/decorators/google-oauth2.decorator';
import { AuthSocialService } from '@modules/auth/auth-social.service';
import { SkipAuth } from '@modules/auth/guards/skip-auth.guard';

@ApiTags('Auth-Social-Google')
@Controller('auth-google')
export class GoogleController {
  constructor(protected readonly authSocialService: AuthSocialService) {}

  @SkipAuth()
  @GoogleOAuth2('sign-in', 'Sign-in user.')
  signIn() {
    return 'OK';
  }

  @SkipAuth()
  @GoogleOAuth2('sign-up', 'Sign-up user.')
  signUp() {
    return 'OK';
  }

  @SkipAuth()
  @SocialRedirect('sign-in')
  @GoogleOAuth2()
  signInRedirect(@Request() { user }: { user: ISocialUser }) {
    return this.authSocialService.signIn(user);
  }

  @SkipAuth()
  @SocialRedirect('sign-up')
  @GoogleOAuth2()
  signUpRedirect(@Request() { user }: { user: ISocialUser }) {
    return this.authSocialService.signUpAGoogle(user);
  }
}
