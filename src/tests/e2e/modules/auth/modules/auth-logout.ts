import DefaultContext from '@tests/e2e/context/default-context';
import { User } from '@prisma/client';
import { AUTH_LOGOUT, USERS_ME } from '@tests/e2e/common/routes';

export default (ctx: DefaultContext) => {
  let user: User;
  let tokens: Auth.AccessRefreshTokens;

  beforeAll(async () => {
    user = await ctx.service.createUser();
    tokens = await ctx.service.getTokens(user);
  });

  it('should delete tokens from whitelist', async () => {
    await ctx.request.getAuth(USERS_ME, tokens.accessToken).expect(200);
    await ctx.request.postAuth(AUTH_LOGOUT, tokens.accessToken).expect(204);
    return ctx.request.getAuth(USERS_ME, tokens.accessToken).expect(401);
  });
};
