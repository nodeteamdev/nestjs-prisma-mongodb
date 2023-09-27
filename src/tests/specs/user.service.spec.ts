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
import { PrismaService } from '@providers/prisma';
import { PaginatorTypes } from '@nodeteam/nestjs-prisma-pagination';
import PaginatedResult = PaginatorTypes.PaginatedResult;
import { INestApplication } from '@nestjs/common';
import {
  createUsers,
  getPaginatedData,
} from '@tests/common/user.mock.functions';
import mockUserRepository from '@tests/mocks/user.repository.mock';

describe('UserService', () => {
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
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository },
        PrismaService,
      ],
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
      let userDataMock: User;

      beforeEach(async () => {
        userDataMock = createUsers(1)[0];
        mockUserRepository.findById.mockReturnValueOnce(userDataMock);
      });

      it('should return user data', async () => {
        expect(await userService.findById(userDataMock.id)).toStrictEqual(
          userDataMock,
        );
      });
    });

    describe('and a not found id is provided', () => {
      beforeEach(async () => {
        mockUserRepository.findById.mockReturnValueOnce(null);
      });

      it('should return null', async () => {
        const id = faker.string.alphanumeric();
        expect(await userService.findById(id)).toBe(null);
      });
    });
  });

  describe('when the findById method is calling', () => {
    describe('and a exists id is provided', () => {
      let userDataMock: User;

      beforeEach(async () => {
        userDataMock = createUsers(1)[0];
        mockUserRepository.findOne.mockReturnValueOnce(userDataMock);
      });

      it('should return user data', async () => {
        expect(await userService.findOne(userDataMock.id)).toStrictEqual(
          userDataMock,
        );
      });
    });

    describe('and a not found id is provided', () => {
      beforeEach(async () => {
        mockUserRepository.findOne.mockReturnValueOnce(null);
      });

      it('should return null', async () => {
        const id = faker.string.alphanumeric();
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
        mockUserRepository.findAll.mockReturnValueOnce(paginatedData);
      });

      it('should returns all users', async () => {
        expect(await userService.findAll({}, {})).toStrictEqual(paginatedData);
      });
    });
  });
});
