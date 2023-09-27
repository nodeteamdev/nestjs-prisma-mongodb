import DefaultContext from '@tests/e2e/context/default-context';
import BaseContext from '@tests/e2e/context/base-context';
import users from '@tests/e2e/modules/user/modules/users';
import usersMeGet from '@tests/e2e/modules/user/modules/users-me-get';
import usersMePatch from '@tests/e2e/modules/user/modules/users-me-patch';

export default (baseContext: BaseContext) => {
  const ctx = new DefaultContext();

  beforeAll(async () => {
    await ctx.init(baseContext);
  });

  describe('/api/v1/users (GET)', users.bind(null, ctx));
  describe('/api/v1/users/me (GET)', usersMeGet.bind(null, ctx));
  describe('/api/v1/users/me (PATCH)', usersMePatch.bind(null, ctx));
};
