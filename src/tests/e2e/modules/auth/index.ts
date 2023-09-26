import BaseContext from '@tests/e2e/context/base-context';
import DefaultContext from '@tests/e2e/context/default-context';
import authSignUp from '@tests/e2e/modules/auth/modules/auth-sign-up';

export default (baseContext: BaseContext) => {
  const ctx = new DefaultContext();

  beforeAll(async () => {
    await ctx.init(baseContext);
  });

  describe('/api/v1/auth/sign-up (POST)', authSignUp.bind(null, ctx));
};
