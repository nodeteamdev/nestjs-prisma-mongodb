import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { Oauth2Exception } from '@filters/oauth2.exception';

@Catch(Oauth2Exception)
export class Oauth2ExceptionFilter implements ExceptionFilter {
  catch(exception: Oauth2Exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.send(exception.message);
  }
}
