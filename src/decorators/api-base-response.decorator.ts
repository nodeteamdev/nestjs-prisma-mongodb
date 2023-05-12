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
            code: 'number',
            message: 'string',
            details: 'string | array',
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
            code: 'number',
            message: 'string',
            details: 'string | array',
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
            code: 'number',
            message: 'string',
            details: 'string | array',
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
            code: 'number',
            message: 'string',
            details: 'string | array',
          },
        },
      },
      description: `${HttpStatus.NOT_FOUND}. Not found.`,
    }),
  ];

  return applyDecorators(...decorators);
};

export default ApiBaseResponses;
