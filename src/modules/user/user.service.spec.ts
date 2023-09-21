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
import { Prisma, User } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@providers/prisma';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import PaginatedResult = PaginatorTypes.PaginatedResult;
import { Roles } from '.prisma/client';

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

async function createUsers(
  length: number,
  userRepository: UserRepository,
  email?: string,
): Promise<User[]> {
  const arr = new Array(...new Array(length).keys());
  return Promise.all(
    arr.map(() => userRepository.create(getSignUpData(email))),
  );
}

function checkIsUserData(user: User) {
  const keys = [
    'id',
    'email',
    'phone',
    'firstName',
    'lastName',
    'password',
    'roles',
    'createdAt',
    'updatedAt',
  ];
  return Object.keys(user).every((key: string) => keys.includes(key));
}

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  beforeEach(async () => {
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

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('UserRepository - should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('UserService - should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('when the findById method is calling', () => {
    describe('and a exists id is provided', () => {
      let user: User;

      beforeEach(async () => {
        user = await userRepository.create(getSignUpData());
      });

      it('should return user data', async () => {
        expect(await userService.findById(user.id)).toStrictEqual(user);
      });
    });

    describe('and a not found id is provided', () => {
      it('should return null', async () => {
        const id = getStringHex();
        expect(await userService.findById(id)).toBe(null);
      });
    });
  });

  describe('when the findById method is calling', () => {
    describe('and a exists id is provided', () => {
      let user: User;

      beforeEach(async () => {
        user = await userRepository.create(getSignUpData());
      });

      it('should return user data', async () => {
        expect(await userService.findOne(user.id)).toStrictEqual(user);
      });
    });

    describe('and a not found id is provided', () => {
      it('should return null', async () => {
        const id = getStringHex();
        expect(await userService.findOne(id)).toBe(null);
      });
    });
  });

  describe('when the findAll method is calling', () => {
    let users: User[];

    beforeEach(async () => {
      users = await createUsers(5, userRepository);
    });

    describe('and a valid input without options is provided', () => {
      it('should returns all users', async () => {
        const result = await userService.findAll({}, {});

        expect(!!result).toBe(true);
        expect(!!result.meta && !!result.data).toBe(true);
        expect(result.data.length > 0).toBe(true);
        expect(result.data.every((user) => checkIsUserData(user))).toBe(true);
      });
    });

    describe('and a valid input with where option is provided', () => {
      describe('where options is find one by id', () => {
        let paginatedData: PaginatedResult<User>;

        beforeEach(async () => {
          paginatedData = getPaginatedData([users[0]]);
        });

        it('should return one user', async () => {
          const whereOptions: Prisma.UserWhereInput = {
            id: users[0].id,
          };
          expect(await userService.findAll(whereOptions, {})).toStrictEqual(
            paginatedData,
          );
        });
      });

      describe('where options is find all users with @gmail.com email', () => {
        it('should return all users with email which ends with @gmail.com', async () => {
          const whereOption: Prisma.UserWhereInput = {
            email: {
              contains: '@gmail.com',
            },
          };
          const users = await userService.findAll(whereOption, {});

          expect(
            users.data.every((user: User) => user.email.endsWith('@gmail.com')),
          ).toBe(true);
        });
      });
    });
  });
});
