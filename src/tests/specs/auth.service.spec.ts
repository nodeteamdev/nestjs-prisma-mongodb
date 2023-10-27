import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenRepository } from '@modules/auth/token.repository';
import { PrismaService } from '@providers/prisma';
import { Prisma, User } from '@prisma/client';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/auth/auth.permissions';
import { SignInDto } from '@modules/auth/dto/sign-in.dto';
import {
  ConflictException,
  INestApplication,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  INVALID_CREDENTIALS,
  NOT_FOUND,
  USER_CONFLICT,
} from '@constants/errors.constants';
import appConfig from '@config/app.config';
import swaggerConfig from '@config/swagger.config';
import jwtConfig from '@config/jwt.config';
import s3Config from '@config/s3.config';
import sqsConfig from '@config/sqs.config';
import { createUsers, getSignUpData } from '@tests/common/user.mock.functions';
import mockTokenService from '@tests/mocks/token.service.mock';
import mockUserRepository from '@tests/mocks/user.repository.mock';
describe('AuthService', () => {
  let module: TestingModule;

  let authService: AuthService;
  let userRepository: UserRepository;
  let tokenService: TokenService;
  let tokenRepository: TokenRepository;

  beforeAll(async () => {
    module = await Test.createTestingModule({
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
        { provide: TokenService, useValue: mockTokenService },
        { provide: UserRepository, useValue: mockUserRepository },
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
        userDataMock = createUsers(1)[0];
        signUpMock = {
          email: userDataMock.email,
          firstName: userDataMock.firstName,
          lastName: userDataMock.lastName,
          password: userDataMock.password,
        };

        mockUserRepository.create.mockReturnValueOnce(userDataMock);
      });

      it('should create a new User', async () => {
        const result = await authService.singUp(signUpMock);

        expect(result).toBe(userDataMock);
      });
    });
    describe('and a dto with busy email is provided', () => {
      let signUpMock: SignUpDto;

      beforeEach(async () => {
        signUpMock = getSignUpData();

        mockUserRepository.findOne.mockReturnValueOnce({});
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
      let userDataMock: User;
      let signInDto: SignInDto;
      let tokensMock: Auth.AccessRefreshTokens;

      beforeEach(async () => {
        userDataMock = createUsers(1)[0];
        signInDto = {
          email: userDataMock.email,
          password: userDataMock.password,
        };
        tokensMock = {
          accessToken: faker.string.alphanumeric({ length: 40 }),
          refreshToken: faker.string.alphanumeric({ length: 40 }),
        };

        mockUserRepository.findOne.mockReturnValueOnce(userDataMock);
        mockTokenService.sign.mockReturnValueOnce(tokensMock);
        mockTokenService.isPasswordCorrect.mockReturnValueOnce(true);
      });

      it('should return tokens', async () => {
        expect(await authService.signIn(signInDto)).toStrictEqual(tokensMock);
      });
    });

    describe('and a dto with not found user provided', () => {
      let signInDto: SignInDto;

      beforeEach(async () => {
        signInDto = {
          email: 'notfounduser@gmail.com',
          password: '123',
        };

        mockUserRepository.findOne.mockReturnValueOnce(null);
      });

      it('should throw not found exception', async () => {
        await expect(authService.signIn(signInDto)).rejects.toThrowError(
          new NotFoundException(NOT_FOUND),
        );
      });
    });

    describe('and a dto with incorrect password provided', () => {
      let userDataMock: User;

      beforeEach(async () => {
        userDataMock = createUsers(1)[0];

        mockUserRepository.findOne.mockReturnValueOnce(userDataMock);
        mockTokenService.isPasswordCorrect.mockReturnValueOnce(false);
      });

      it('should throw unauthorized exception', async () => {
        const invalidSignIn: SignInDto = {
          email: userDataMock.email,
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
      let tokensMock: Auth.AccessRefreshTokens;

      beforeEach(async () => {
        tokensMock = {
          accessToken: faker.string.alphanumeric({ length: 40 }),
          refreshToken: faker.string.alphanumeric({ length: 40 }),
        };
        mockTokenService.refreshTokens.mockReturnValueOnce(tokensMock);
      });

      it('should return new tokens', async () => {
        const token = 'valid_token';
        expect(await authService.refreshTokens(token)).toBe(tokensMock);
      });
    });

    describe('and a invalid refresh token provided', () => {
      beforeEach(async () => {
        mockTokenService.refreshTokens.mockRejectedValueOnce(
          new UnauthorizedException(),
        );
      });

      it('should throw unauthorized exception', async () => {
        const invalidRefreshToken = 'invalid_refresh_token';
        await expect(
          authService.refreshTokens(invalidRefreshToken),
        ).rejects.toThrowError(new UnauthorizedException());
      });
    });
  });

  describe('when calling the logout method', () => {
    describe('and valid arguments are provided', () => {
      beforeEach(async () => {
        mockTokenService.logout.mockReturnValueOnce(null);
      });

      it('should remove tokens from white list', async () => {
        const userId = faker.string.alphanumeric({ length: 12 });
        const accessToken = faker.string.alphanumeric({ length: 40 });
        expect(await authService.logout(userId, accessToken)).toBe(null);
      });
    });
  });
});
