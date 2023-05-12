import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PRISMA_API_ERROR } from '@constants/errors.constants';

export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

/**
 * {@link PrismaClientExceptionFilter}
 * catches {@link Prisma.PrismaClientKnownRequestError}
 * and {@link Prisma.NotFoundError} exceptions.
 */
@Catch(Prisma?.PrismaClientKnownRequestError, Prisma?.NotFoundError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  /**
   * default error codes mapping
   *
   * Error codes definition for Prisma Client (Query Engine)
   * @see https://www.prisma.io/docs/reference/api-reference/error-reference#prisma-client-query-engine
   */
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2003: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  /**
   * @param applicationRef
   * @param errorCodesStatusMapping
   */
  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping?: ErrorCodesStatusMapping,
  ) {
    super(applicationRef);

    // use custom error codes mapping (overwrite)
    //
    // @example:
    //
    //   const { httpAdapter } = app.get(HttpAdapterHost);
    //   app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter, {
    //     P2022: HttpStatus.BAD_REQUEST,
    //   }));
    //
    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(
        this.errorCodesStatusMapping,
        errorCodesStatusMapping,
      );
    }
  }

  /**
   * @param exception
   * @param host
   * @returns
   */
  catch(
    exception:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.NotFoundError
      | any,
    host: ArgumentsHost,
  ) {
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      return this.catchClientKnownRequestError(exception, host);
    }
    if (exception instanceof Prisma.NotFoundError) {
      return this.catchNotFoundError(exception, host);
    }
  }

  private catchClientKnownRequestError(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message = this.exceptionShortMessage(exception.message);

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return super.catch(exception, host);
    }

    const [code] = PRISMA_API_ERROR.split(':');

    super.catch(
      new HttpException(
        {
          success: false,
          error: {
            details: exception.code,
            message,
            code: parseInt(code, 10),
          },
        },
        statusCode,
      ),
      host,
    );
  }

  private catchNotFoundError(
    { message }: Prisma.NotFoundError,
    host: ArgumentsHost,
  ) {
    const statusCode = HttpStatus.NOT_FOUND;

    const [prismaCode, msg] = message.split(':');

    const [code] = PRISMA_API_ERROR.split(':');

    super.catch(
      new HttpException(
        {
          success: false,
          error: {
            details: prismaCode,
            message: msg.trim(),
            code: parseInt(code, 10),
          },
        },
        statusCode,
      ),
      host,
    );
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));

    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
