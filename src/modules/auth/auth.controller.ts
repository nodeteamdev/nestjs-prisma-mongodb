import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import ApiBaseResponses from '@decorators/api-base-response.decorator';
import { User } from '@prisma/client';
import Serialize from '@decorators/serialize.decorator';
import UserBaseEntity from '@modules/user/entities/user-base.entity';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import { SkipAuth } from '@modules/auth/skip-auth.guard';
import RefreshTokenDto from '@modules/auth/dto/refresh-token.dto';
import {
  AccessGuard,
  Actions,
  CaslUser,
  UseAbility,
  UserProxy,
} from '@modules/casl';
import { TokensEntity } from '@modules/auth/entities/tokens.entity';

@ApiTags('Auth')
@ApiBaseResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignUpDto })
  @Serialize(UserBaseEntity)
  @SkipAuth()
  @Post('sign-up')
  create(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.singUp(signUpDto);
  }

  @ApiBody({ type: SignInDto })
  @SkipAuth()
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<Auth.AccessRefreshTokens> {
    return this.authService.signIn(signInDto);
  }

  @ApiBody({ type: RefreshTokenDto })
  @SkipAuth()
  @Post('token/refresh')
  refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<Auth.AccessRefreshTokens | void> {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  @HttpCode(204)
  @UseAbility(Actions.delete, TokensEntity)
  async logout(@CaslUser() userProxy?: UserProxy<User>) {
    const { accessToken } = await userProxy.getMeta();
    const { id: userId } = await userProxy.get();

    return this.authService.logout(userId, accessToken);
  }
}
