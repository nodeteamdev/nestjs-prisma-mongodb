import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RATE_LIMIT_EXCEEDED } from '@constants/errors.constants';
import { ThrottlerException } from '@nestjs/throttler';

@Catch(ThrottlerException)
export class ThrottlerExceptionsFilter implements ExceptionFilter {
  catch(exception: ThrottlerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const [code, message] = RATE_LIMIT_EXCEEDED.split(':');

    const exceptionResponse = {
      success: false,
      error: {
        code: parseInt(code, 10),
        message: message?.trim(),
        details: exception?.getResponse(),
      },
    };

    Logger.error(exception, 'ThrottlerExceptionsFilter');
    Logger.error(exception.stack, 'ThrottlerExceptionsFilter');

    return res.status(HttpStatus.TOO_MANY_REQUESTS).json(exceptionResponse);
  }
}
