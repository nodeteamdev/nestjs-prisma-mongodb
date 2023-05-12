import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSerializeType } from '@decorators/serialize.decorator';

const getSerializer = (entity: any) => (data: any) =>
  Object.assign(entity, data);

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        const SerializeType = getSerializeType(context.getHandler());
        const serializer = getSerializer(new SerializeType());

        function serialize(data: any) {
          if (data) {
            if (data instanceof Array) {
              return data.map(serializer);
            }
          }

          return serializer(data);
        }

        if (value.meta) {
          return {
            ...value,
            data: serialize(value.data),
          };
        }

        return serializer(value);
      }),
    );
  }
}
