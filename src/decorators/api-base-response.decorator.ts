import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const ApiBaseResponses = () => {
  const decorators = [
    ApiUnauthorizedResponse({
      schema: {
        type: 'object',
        example: {
          success: false,
          error: {
            code: 401000,
            message: 'Unauthorized resource',
            details: 'The resource you are trying to access is unauthorized.',
          },
        },
      },
      description: `${HttpStatus.UNAUTHORIZED}. Unauthorized.`,
    }),
    ApiBadRequestResponse({
      schema: {
        type: 'object',
        example: {
          success: false,
          error: {
            code: 400000,
            message: 'Bad request',
            details: 'The request you are trying to make is invalid.',
          },
        },
      },
      description: `${HttpStatus.BAD_REQUEST}. Bad Request.`,
    }),
    ApiInternalServerErrorResponse({
      schema: {
        type: 'object',
        example: {
          success: false,
          error: {
            code: 500000,
            message: 'Internal server error',
            details: 'Something went wrong.',
          },
        },
      },
      description: `${HttpStatus.INTERNAL_SERVER_ERROR}. Internal Server Error.`,
    }),
    ApiNotFoundResponse({
      schema: {
        type: 'object',
        example: {
          success: false,
          error: {
            code: 404000,
            message: 'Not found',
            details: 'The resource you are trying to access does not exist.',
          },
        },
      },
      description: `${HttpStatus.NOT_FOUND}. Not found.`,
    }),
  ];

  return applyDecorators(...decorators);
};

export default ApiBaseResponses;
