import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UserRepository } from '@modules/user/user.repository';
import {
  INVALID_CREDENTIALS,
  NOT_FOUND,
  USER_CONFLICT,
} from '@constants/errors.constants';
import { User } from '@prisma/client';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import { TokenService } from '@modules/auth/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * Create a new user
   * @param signUpDto
   * @returns User
   * @throws ConflictException
   */
  async singUp(signUpDto: SignUpDto): Promise<User> {
    const testUser: User = await this.userRepository.findOne({
      where: { email: signUpDto.email },
    });

    if (testUser) {
      // 409001: User with this email or phone already exists
      throw new ConflictException(USER_CONFLICT);
    }

    return this.userRepository.create(signUpDto);
  }

  /**
   * Sign in a user
   * @returns Auth.AccessRefreshTokens
   * @throws NotFoundException
   * @throws UnauthorizedException
   * @param signInDto
   */
  async signIn(signInDto: SignInDto): Promise<Auth.AccessRefreshTokens> {
    const testUser: User = await this.userRepository.findOne({
      where: {
        email: signInDto.email,
      },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!testUser) {
      // 404001: User not found
      throw new NotFoundException(NOT_FOUND);
    }

    if (
      !this.tokenService.isPasswordCorrect(
        signInDto.password,
        testUser.password,
      )
    ) {
      // 401001: Invalid credentials
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    return this.tokenService.sign({
      id: testUser.id,
      email: testUser.email,
    });
  }
}
