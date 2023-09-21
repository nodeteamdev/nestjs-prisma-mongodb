import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenRepository } from '@modules/auth/token.repository';
import { PrismaService } from '@providers/prisma';
import { User } from '@prisma/client';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/auth/auth.permissions';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  INVALID_CREDENTIALS,
  USER_CONFLICT,
} from '@constants/errors.constants';
import appConfig from '@config/app.config';
import swaggerConfig from '@config/swagger.config';
import jwtConfig from '@config/jwt.config';
import s3Config from '@config/s3.config';
import sqsConfig from '@config/sqs.config';
function getSignUpData(): SignUpDto {
  return {
    email: faker.internet.email(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({ length: 12 }),
  };
}

function getStringHex() {
  return Buffer.from(faker.string.alphanumeric(12), 'utf-8').toString('hex');
}
describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let tokenRepository: TokenRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CaslModule.forFeature({ permissions }),
        JwtModule.register({}),
        ConfigModule.forRoot({
          load: [appConfig, swaggerConfig, jwtConfig, s3Config, sqsConfig],
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        TokenService,
        UserRepository,
        TokenRepository,
        JwtService,
        ConfigService,
        PrismaService,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    tokenService = module.get<TokenService>(TokenService);
    tokenRepository = module.get<TokenRepository>(TokenRepository);
  });

  it('AuthService - should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('UserRepository - should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('TokenService - should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  it('TokenRepository - should be defined', () => {
    expect(tokenRepository).toBeDefined();
  });

  describe('when calling the signUp method', () => {
    describe('and a valid dto is provided', () => {
      let userDataMock: Partial<User>;
      let signUpMock: SignUpDto;

      beforeEach(async () => {
        signUpMock = getSignUpData();
        userDataMock = {
          email: signUpMock.email,
          firstName: signUpMock.firstName,
          lastName: signUpMock.lastName,
          password: signUpMock.password,
          phone: null,
        };
      });

      it('should create a new User', async () => {
        const result = await authService.singUp(signUpMock);

        expect(
          Object.keys(userDataMock).every(
            (key: string) => result[key] === userDataMock[key],
          ),
        ).toBe(true);
      });
    });
    describe('and a dto with busy email is provided', () => {
      let signUpMock: SignUpDto;

      beforeEach(async () => {
        signUpMock = getSignUpData();
        await userRepository.create(signUpMock);
      });

      it('should throw conflict exception', async () => {
        await expect(authService.singUp(signUpMock)).rejects.toThrowError(
          new ConflictException(USER_CONFLICT),
        );
      });
    });
  });

  describe('when calling the signIn method', () => {
    describe('and a valid dto is provided', () => {
      let user: User;
      let signInDto: SignInDto;

      beforeEach(async () => {
        user = await userRepository.create(getSignUpData());
        signInDto = {
          email: user.email,
          password: user.password,
        };
      });

      it('should return tokens', async () => {
        const tokens: Auth.AccessRefreshTokens = await tokenService.sign({
          id: user.id,
          email: user.email,
          roles: user.roles,
        });

        jest
          .spyOn(authService, 'signIn')
          .mockImplementation(
            async (): Promise<Auth.AccessRefreshTokens> => tokens,
          );
        expect(await authService.signIn(signInDto)).toStrictEqual(tokens);
      });
    });

    describe('and a dto with not found user provided', () => {
      let signInDto: SignInDto;

      beforeEach(async () => {
        signInDto = {
          email: 'notfounduser@gmail.com',
          password: '123',
        };
      });

      it('should throw not found exception', async () => {
        await expect(authService.signIn(signInDto)).rejects.toThrowError(
          NotFoundException,
        );
      });
    });

    describe('and a dto with incorrect password provided', () => {
      let signUpDto: SignUpDto;

      beforeEach(async () => {
        signUpDto = getSignUpData();
        await userRepository.create(signUpDto);
      });

      it('should throw unauthorized exception', async () => {
        const invalidSignIn: SignInDto = {
          email: signUpDto.email,
          password: 'invalid_credentials',
        };

        await expect(authService.signIn(invalidSignIn)).rejects.toThrowError(
          new UnauthorizedException(INVALID_CREDENTIALS),
        );
      });
    });
  });

  describe('when calling the refreshToken method', () => {
    describe('and a valid refresh token provided', () => {
      let user: User;
      let signInDto: SignInDto;
      let tokens: Auth.AccessRefreshTokens;

      beforeEach(async () => {
        user = await userRepository.create(getSignUpData());
        signInDto = {
          email: user.email,
          password: user.password,
        };
        tokens = await authService.signIn(signInDto);
      });

      it('should return new tokens', async () => {
        const tokensMock = await tokenService.sign({
          id: user.id,
          email: user.email,
          roles: user.roles,
        });

        jest
          .spyOn(authService, 'refreshTokens')
          .mockImplementation(async (): Promise<Auth.AccessRefreshTokens> => {
            return tokensMock;
          });

        expect(
          await authService.refreshTokens(tokens.refreshToken),
        ).toStrictEqual(tokensMock);
      });
    });

    describe('and a invalid refresh token provided', () => {
      it('should throw unauthorized exception', async () => {
        const invalidRefreshToken = 'invalid_refresh_token';
        await expect(
          authService.refreshTokens(invalidRefreshToken),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });

    describe('and a previous refresh token provided', () => {
      let user: User;
      let signUpDto: SignUpDto;
      let previousTokens: Auth.AccessRefreshTokens;
      let signInDto: SignInDto;

      beforeEach(async () => {
        signUpDto = getSignUpData();
        user = await userRepository.create(signUpDto);
        signInDto = {
          email: user.email,
          password: user.password,
        };
        previousTokens = await authService.signIn(signInDto);
        await authService.refreshTokens(previousTokens.refreshToken);
      });

      it('should throw unauthorized exception', async () => {
        const invalidRefreshToken = 'invalid_refresh_token';
        await expect(
          authService.refreshTokens(invalidRefreshToken),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });
  });

  describe('when calling the logout method', () => {
    describe('and valid arguments are provided', () => {
      let user: User;
      let signInDto: SignInDto;
      let tokens: Auth.AccessRefreshTokens;

      beforeEach(async () => {
        user = await userRepository.create(getSignUpData());
        signInDto = {
          email: user.email,
          password: user.password,
        };
        tokens = await authService.signIn(signInDto);
      });

      it('should remove tokens from white list', async () => {
        await authService.logout(user.id, tokens.accessToken);
        const result = await tokenRepository.getAccessTokenFromWhitelist(
          tokens.accessToken,
        );
        expect(result).toBe(null);
      });
    });
  });
});
