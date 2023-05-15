import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export function createUserMiddleware(): Prisma.Middleware {
  return async (params: Prisma.MiddlewareParams, next): Promise<any> => {
    if (params.model === 'User' && params.action === 'create') {
      params.args.data.password = await bcrypt.hash(
        params.args.data.password,
        10,
      );

      return next(params);
    }

    return next(params);
  };
}
