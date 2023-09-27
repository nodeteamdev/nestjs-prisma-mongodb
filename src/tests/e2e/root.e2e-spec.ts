import BaseContext from '@tests/e2e/context/base-context';
import AuthModule from './modules/auth';
import UserModule from './modules/user';

describe('AppController (e2e)', () => {
  const ctx = new BaseContext();

  beforeAll(async () => {
    await ctx.init();
  });

  describe('AuthModule', AuthModule.bind(null, ctx));
  describe('UserModule', UserModule.bind(null, ctx));

  afterAll(async () => {
    await ctx.end();
  });
});
