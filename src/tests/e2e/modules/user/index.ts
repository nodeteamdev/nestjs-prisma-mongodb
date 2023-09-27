import DefaultContext from '@tests/e2e/context/default-context';
import BaseContext from '@tests/e2e/context/base-context';

export default (baseContext: BaseContext) => {
  const ctx = new DefaultContext();

  beforeAll(async () => {
    await ctx.init(baseContext);
  });

  // describe()
};
