import { Observable } from 'rxjs';
import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class SocialRedirectInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (auth: any) => {
        const response = context.switchToHttp().getResponse();
        response.send(auth);
      }),
    );
  }
}
