import DefaultContext from '@tests/e2e/context/default-context';
import { User } from '@prisma/client';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { AUTH_SIGN_IN } from '@tests/e2e/common/routes';
import { faker } from '@faker-js/faker';

export default (ctx: DefaultContext) => {
  let user: User;
  let signUpDto: SignUpDto;

  beforeAll(async () => {
    user = await ctx.service.createUser();
  });

  beforeEach(async () => {
    signUpDto = ctx.service.getSignUpData();
  });

  it('should throw NotFoundException', async () => {
    return ctx.request
      .post(AUTH_SIGN_IN)
      .send({
        email: faker.internet.email(),
        password: signUpDto.password,
      })
      .expect(404);
  });

  it('should throw UnauthorizedException', async () => {
    return ctx.request
      .post(AUTH_SIGN_IN)
      .send({
        email: user.email,
        password: faker.string.alphanumeric({ length: 12 }),
      })
      .expect(401);
  });

  it('should return tokens', async () => {
    return ctx.request
      .post(AUTH_SIGN_IN)
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        });
      });
  });
};
