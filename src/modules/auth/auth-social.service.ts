import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '@modules/user/user.service';
import { SocialRepository } from '@modules/auth/social.repository';
import { TokenService } from '@modules/auth/token.service';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '@modules/auth/auth.service';
import { SOCIAL_ACCOUNT_NOT_FOUND } from '@constants/errors.constants';
import AccessRefreshTokens = Auth.AccessRefreshTokens;
import { ISocialUser } from '@modules/auth/interfaces/social-user.interface';

@Injectable()
export class AuthSocialService {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly socialRepository: SocialRepository,
    private readonly authService: AuthService,
  ) {}

  async signUpAGoogle(
    socialUserData: ISocialUser,
  ): Promise<AccessRefreshTokens> {
    const socialUser = await this.socialRepository.getSocialAccountByProviderId(
      socialUserData.providerId,
    );

    if (socialUser) {
      return this.tokenService.sign({ id: socialUser.userId });
    }

    const user = await this.authService.singUp({
      email: socialUserData.email,
      firstName: socialUserData.name,
      password: '',
      lastName: '',
    });

    await this.socialRepository.create({
      provider: 'google',
      providerId: socialUserData.providerId,
      name: socialUserData.name,
      user: {
        connect: {
          id: user.id,
        },
      },
    });

    return this.tokenService.sign({ id: user.id });
  }

  async signIn(user: ISocialUser): Promise<AccessRefreshTokens> {
    const socialUser = await this.socialRepository.getSocialAccountByProviderId(
      user.providerId,
    );

    if (!socialUser) {
      throw new NotFoundException(SOCIAL_ACCOUNT_NOT_FOUND);
    }

    return this.tokenService.sign({ id: socialUser.userId });
  }
}
