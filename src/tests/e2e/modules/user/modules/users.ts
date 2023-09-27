import DefaultContext from '@tests/e2e/context/default-context';
import { User } from '@prisma/client';
import { USERS } from '@tests/e2e/common/routes';

export default (ctx: DefaultContext) => {
  let user: User;
  let tokens: Auth.AccessRefreshTokens;

  beforeAll(async () => {
    user = await ctx.service.createUser();
    tokens = await ctx.service.getTokens(user);
  });

  it('should returns array of users', async () => {
    return ctx.request
      .getAuth(USERS, tokens.accessToken)
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0]).toStrictEqual({
          id: expect.any(String),
          email: expect.any(String),
          phone: null,
          firstName: expect.any(String),
          lastName: expect.any(String),
        });
      });
  });
};
