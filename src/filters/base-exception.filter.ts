import {
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';

export default class BaseExceptionFilter implements ExceptionFilter {
  private readonly defaultMessage: string;

  private readonly defaultStatus: HttpStatus;

  constructor(defaultMessage: string, defaultStatus: HttpStatus) {
    this.defaultMessage = defaultMessage;
    this.defaultStatus = defaultStatus;
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    const status: number = exception.getStatus
      ? exception.getStatus()
      : this.defaultStatus;
    const errorMessage = exception?.response?.message || this.defaultMessage;

    let [code, message] = this.defaultMessage.split(':');
    const splittedError = errorMessage.split(':');

    if (splittedError.length === 2) {
      [code, message] = splittedError;
    }

    if (splittedError.length === 1) {
      [message] = splittedError;
    }

    const exceptionResponse = {
      success: false,
      error: {
        code: parseInt(code, 10),
        message: message?.trim(),
        details: exception?.response?.error,
      },
    };

    Logger.error(exception, this.constructor.name);
    Logger.error(exception.stack, this.constructor.name);

    return res.status(status).json(exceptionResponse);
  }
}
