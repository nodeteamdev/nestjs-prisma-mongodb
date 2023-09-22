import { AuthService } from '@modules/auth/auth.service';
import { AuthController } from '@modules/auth/auth.controller';
import { UserRepository } from '@modules/user/user.repository';
import { TokenService } from '@modules/auth/token.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenRepository } from '@modules/auth/token.repository';
import {
  createUserMiddleware,
  loggingMiddleware,
  PrismaModule,
  PrismaService,
} from '@providers/prisma';
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
  let module: TestingModule;
  let app: INestApplication;
  let prismaService: PrismaService;

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
        TokenService,
        UserRepository,
        TokenRepository,
        JwtService,
        ConfigService,
        PrismaService,
      ],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get<PrismaService>(PrismaService);

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    tokenService = module.get<TokenService>(TokenService);
    tokenRepository = module.get<TokenRepository>(TokenRepository);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
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
          id: '1',
          email: signUpMock.email,
          phone: null,
          firstName: signUpMock.firstName,
          lastName: signUpMock.lastName,
          password: signUpMock.password,
          roles: ['customer'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        userRepository.create = jest.fn().mockReturnValueOnce(userDataMock);
      });

      it('should create a new User', async () => {
        const result = await authService.singUp(signUpMock);

        expect(result).toBe(userDataMock);
      });
    });
    describe('and a dto with busy email is provided', () => {
      let signUpMock: SignUpDto;
      let userDataMock: User;

      beforeEach(async () => {
        signUpMock = getSignUpData();
        userDataMock = {
          id: '1233333',
          email: signUpMock.email,
          phone: null,
          firstName: signUpMock.firstName,
          lastName: signUpMock.lastName,
          password: signUpMock.password,
          roles: ['customer'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        userRepository.findOne = jest.fn().mockReturnValueOnce({});
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
      let signUpMock: SignUpDto;
      let userDataMock: User;
      let signInDto: SignInDto;
      let tokensMock: Auth.AccessRefreshTokens;

      beforeEach(async () => {
        signUpMock = getSignUpData();
        userDataMock = {
          id: '1',
          email: signUpMock.email,
          phone: null,
          firstName: signUpMock.firstName,
          lastName: signUpMock.lastName,
          password: signUpMock.password,
          roles: ['customer'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        signInDto = {
          email: signUpMock.email,
          password: signUpMock.password,
        };
        tokensMock = { accessToken: '123', refreshToken: '321' };

        userRepository.findOne = jest.fn().mockReturnValueOnce(userDataMock);
        tokenService.sign = jest.fn().mockReturnValueOnce(tokensMock);
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

        userRepository.findOne = jest.fn().mockReturnValueOnce(null);
      });

      it('should throw not found exception', async () => {
        await expect(authService.signIn(signInDto)).rejects.toThrowError(
          new NotFoundException(NOT_FOUND),
        );
      });
    });

    describe('and a dto with incorrect password provided', () => {
      let signUpMock: SignUpDto;
      let userDataMock: User;

      beforeEach(async () => {
        signUpMock = getSignUpData();
        userDataMock = {
          id: '1',
          email: signUpMock.email,
          phone: null,
          firstName: signUpMock.firstName,
          lastName: signUpMock.lastName,
          password: signUpMock.password,
          roles: ['customer'],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        userRepository.findOne = jest.fn().mockReturnValueOnce(userDataMock);
      });

      it('should throw unauthorized exception', async () => {
        const invalidSignIn: SignInDto = {
          email: signUpMock.email,
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
        tokensMock = { accessToken: '123', refreshToken: '321' };
        tokenService.refreshTokens = jest.fn().mockReturnValueOnce(tokensMock);
      });

      it('should return new tokens', async () => {
        const token = 'valid_token';
        expect(await authService.refreshTokens(token)).toBe(tokensMock);
      });
    });

    describe('and a invalid refresh token provided', () => {
      beforeEach(async () => {
        tokenService.refreshTokens = jest
          .fn()
          .mockRejectedValueOnce(new UnauthorizedException());
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
        tokenService.logout = jest.fn().mockReturnValueOnce(null);
      });

      it('should remove tokens from white list', async () => {
        const userId = '1',
          accessToken = '123';
        expect(await authService.logout(userId, accessToken)).toBe(null);
      });
    });
  });
});
