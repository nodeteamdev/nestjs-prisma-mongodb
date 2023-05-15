import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import ApiBaseResponses from '@decorators/api-base-response.decorator';
import { User } from '@prisma/client';
import Serialize from '@decorators/serialize.decorator';
import UserBaseEntity from '@modules/user/entities/user-base.entity';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';

@ApiTags('Auth')
@ApiBaseResponses()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: SignUpDto })
  @Serialize(UserBaseEntity)
  @Post('sign-up')
  create(@Body() signUpDto: SignUpDto): Promise<User> {
    return this.authService.singUp(signUpDto);
  }

  @ApiBody({ type: SignInDto })
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<Auth.AccessRefreshTokens> {
    return this.authService.signIn(signInDto);
  }
}
