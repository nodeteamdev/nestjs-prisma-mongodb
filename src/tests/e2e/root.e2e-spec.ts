import BaseContext from '@tests/e2e/context/base-context';
import AuthModule from './modules/auth';

describe('AppController (e2e)', () => {
  const ctx = new BaseContext();

  beforeAll(async () => {
    await ctx.init();
  });

  describe('AuthModule', AuthModule.bind(null, ctx));
});
