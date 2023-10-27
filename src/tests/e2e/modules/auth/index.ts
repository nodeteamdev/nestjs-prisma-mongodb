import BaseContext from '@tests/e2e/context/base-context';
import DefaultContext from '@tests/e2e/context/default-context';
import authSignUp from '@tests/e2e/modules/auth/modules/auth-sign-up';
import authSignIn from '@tests/e2e/modules/auth/modules/auth-sign-in';
import authRefresh from '@tests/e2e/modules/auth/modules/auth-refresh';
import authLogout from '@tests/e2e/modules/auth/modules/auth-logout';

export default (baseContext: BaseContext) => {
  const ctx = new DefaultContext();

  beforeAll(async () => {
    await ctx.init(baseContext);
  });

  describe('/api/v1/auth/sign-up (POST)', authSignUp.bind(null, ctx));
  describe('/api/v1/auth/sign-in (POST)', authSignIn.bind(null, ctx));
  describe('/api/v1/auth/token/refresh (POST)', authRefresh.bind(null, ctx));
  describe('/api/v1/auth/logout (POST)', authLogout.bind(null, ctx));
};
