import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSerializeType } from '@decorators/serialize.decorator';

const getSerializer = (Entity: any) => (data: any) =>
  Object.assign(new Entity(), data);

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) => {
        if (typeof value !== 'object' || value === null) {
          return value;
        }

        const SerializeType = getSerializeType(context.getHandler());
        const serializer = getSerializer(SerializeType);

        function serialize(data: any) {
          return data instanceof Array
            ? data.map(serializer)
            : serializer(data);
        }

        if (value.meta) {
          return {
            ...value,
            data: serialize(value.data),
          };
        }

        return serialize(value);
      }),
    );
  }
}
