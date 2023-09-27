import { TokenService } from '@modules/auth/token.service';
import { AuthService } from '@modules/auth/auth.service';
import { PrismaClient, User } from '@prisma/client';
import { INestApplication } from '@nestjs/common';
import { AdminUserInterface } from '@tests/e2e/interfaces/admin-user.interface';
import { Roles } from '@modules/app/app.roles';
import { createUsers, getSignUpData } from '@tests/common/user.mock.functions';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { faker } from '@faker-js/faker';

class TestService {
  private _authService!: AuthService;

  private _tokenService!: TokenService;

  private _connection!: PrismaClient;

  constructor(app: INestApplication, connection: PrismaClient) {
    this._authService = app.get<AuthService>(AuthService);

    this._tokenService = app.get<TokenService>(TokenService);

    this._connection = connection;
  }

  async createGlobalAdmin(): Promise<AdminUserInterface> {
    const role: Roles.admin[] = [Roles.admin];

    const signUpData: SignUpDto = getSignUpData();
    const userPassword: string = signUpData.password;

    const newAdmin: User = await this._authService.singUp(signUpData);

    await this._connection.user.update({
      where: {
        id: newAdmin.id,
      },
      data: {
        roles: ['admin', 'customer'],
      },
    });

    const { id, phone, email, password } = newAdmin;

    const { accessToken, refreshToken } = await this._authService.signIn({
      email,
      password: userPassword,
    });

    return {
      id,
      phone,
      email,
      password: userPassword,
      accessToken,
      refreshToken,
    };
  }

  async createUser(): Promise<User> {
    const signUpDto: SignUpDto = this.getSignUpData();
    const { password } = signUpDto;
    const user = await this._authService.singUp(signUpDto);

    return {
      ...user,
      password,
    };
  }

  getSignUpData(): SignUpDto {
    return {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password({ length: 12 }),
    };
  }

  async getTokens(user: User): Promise<Auth.AccessRefreshTokens> {
    return this._tokenService.sign({
      id: user.id,
      email: user.email,
      roles: user.roles,
    });
  }
}

export default TestService;
