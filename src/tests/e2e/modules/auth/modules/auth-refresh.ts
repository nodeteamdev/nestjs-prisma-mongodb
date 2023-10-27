import DefaultContext from '@tests/e2e/context/default-context';
import { User } from '@prisma/client';
import { SignUpDto } from '@modules/auth/dto/sign-up.dto';
import { AUTH_TOKEN_REFRESH } from '@tests/e2e/common/routes';
import { faker } from '@faker-js/faker';

export default (ctx: DefaultContext) => {
  let user: User;
  let tokens: Auth.AccessRefreshTokens;

  beforeAll(async () => {
    user = await ctx.service.createUser();
    tokens = await ctx.service.getTokens(user);
  });

  it('should throw UnauthorizedException', async () => {
    return ctx.request
      .post(AUTH_TOKEN_REFRESH)
      .send({
        refreshToken: faker.string.alphanumeric({ length: 40 }),
      })
      .expect(401);
  });

  it('should return tokens', async () => {
    return ctx.request
      .post(AUTH_TOKEN_REFRESH)
      .send({
        refreshToken: tokens.refreshToken,
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
