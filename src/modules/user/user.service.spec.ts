import { Test, TestingModule } from '@nestjs/testing';
import { CaslModule } from '@modules/casl';
import { permissions } from '@modules/user/user.permissions';
import { UserController } from '@modules/user/user.controller';
import { UserService } from '@modules/user/user.service';
import { UserRepository } from '@modules/user/user.repository';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';
import swaggerConfig from '@config/swagger.config';
import jwtConfig from '@config/jwt.config';
import s3Config from '@config/s3.config';
import sqsConfig from '@config/sqs.config';
import { User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import {
  createUserMiddleware,
  loggingMiddleware,
  PrismaModule,
  PrismaService,
} from '@providers/prisma';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import PaginatedResult = PaginatorTypes.PaginatedResult;
import { INestApplication } from '@nestjs/common';
function getSignUpData(email?: string): SignUpDto {
  return {
    email: faker.internet.email({ provider: email }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    password: faker.internet.password({ length: 12 }),
  };
}

function getStringHex() {
  return Buffer.from(faker.string.alphanumeric(12), 'utf-8').toString('hex');
}

function getPaginatedData<T>(input: T[]): PaginatedResult<T> {
  return {
    data: input,
    meta: {
      total: input.length,
      lastPage: Math.ceil(input.length / 10),
      currentPage: 1,
      perPage: 10,
      prev: null,
      next: null,
    },
  };
}

function createUsers(length: number): User[] {
  const result: User[] = [];
  for (let i = 0; i < length; i++) {
    const user: User = {
      id: getStringHex(),
      ...getSignUpData(),
      phone: null,
      roles: ['customer'],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    result.push(user);
  }
  return result;
}

describe('UserService', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  let userService: UserService;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CaslModule.forFeature({ permissions }),
        ConfigModule.forRoot({
          load: [appConfig, swaggerConfig, jwtConfig, s3Config, sqsConfig],
        }),
      ],
      controllers: [UserController],
      providers: [UserService, UserRepository, PrismaService],
    }).compile();

    app = module.createNestApplication();
    prismaService = module.get<PrismaService>(PrismaService);

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);

    await app.init();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('UserRepository - should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('UserService - should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('when the findById method is calling', () => {
    describe('and a exists id is provided', () => {
      let userDataMock: User;

      beforeEach(async () => {
        userDataMock = createUsers(1)[0];
        userRepository.findById = jest.fn().mockReturnValueOnce(userDataMock);
      });

      it('should return user data', async () => {
        expect(await userService.findById(userDataMock.id)).toStrictEqual(
          userDataMock,
        );
      });
    });

    describe('and a not found id is provided', () => {
      beforeEach(async () => {
        userRepository.findById = jest.fn().mockReturnValueOnce(null);
      });

      it('should return null', async () => {
        const id = getStringHex();
        expect(await userService.findById(id)).toBe(null);
      });
    });
  });

  describe('when the findById method is calling', () => {
    describe('and a exists id is provided', () => {
      let userDataMock: User;

      beforeEach(async () => {
        userDataMock = createUsers(1)[0];
        userRepository.findOne = jest.fn().mockReturnValueOnce(userDataMock);
      });

      it('should return user data', async () => {
        expect(await userService.findOne(userDataMock.id)).toStrictEqual(
          userDataMock,
        );
      });
    });

    describe('and a not found id is provided', () => {
      beforeEach(async () => {
        userRepository.findOne = jest.fn().mockReturnValueOnce(null);
      });

      it('should return null', async () => {
        const id = getStringHex();
        expect(await userService.findOne(id)).toBe(null);
      });
    });
  });

  describe('when the findAll method is calling', () => {
    let usersMock: User[];
    let paginatedData: PaginatedResult<User>;

    beforeEach(async () => {
      usersMock = createUsers(5);
      paginatedData = getPaginatedData(usersMock);
    });

    describe('and a valid input without options is provided', () => {
      beforeEach(() => {
        userRepository.findAll = jest.fn().mockReturnValueOnce(paginatedData);
      });

      it('should returns all users', async () => {
        expect(await userService.findAll({}, {})).toStrictEqual(paginatedData);
      });
    });
  });
});
