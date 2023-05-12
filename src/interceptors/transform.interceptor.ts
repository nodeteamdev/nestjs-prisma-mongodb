import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((value) => {
        if (!value) {
          return {
            success: true,
            data: null,
          };
        }

        if (value.data) {
          return {
            success: true,
            ...value,
          };
        }

        return {
          success: true,
          data: value,
        };
      }),
    );
  }
}
