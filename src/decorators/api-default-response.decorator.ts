import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiResponseOptions,
} from '@nestjs/swagger';
import ApiBaseResponses from './api-base-response.decorator';
import ApiOkBaseResponse, {
  ApiCreatedBaseResponse,
} from './api-ok-base-response.decorator';

export enum StatusCodes {
  OK = HttpStatus.OK,
  CREATED = HttpStatus.CREATED,
  NO_CONTENT = HttpStatus.NO_CONTENT,
}

interface DefaultResponseOptions {
  status?: StatusCodes;
  type?: string | Function;
  meta?: boolean;
  isArray?: boolean;
  summary?: string;
}

const responses = {
  [StatusCodes.OK]: ApiOkBaseResponse,
  [StatusCodes.CREATED]: ApiCreatedBaseResponse,
  [StatusCodes.NO_CONTENT]: (options: ApiResponseOptions) =>
    ApiNoContentResponse({
      ...options,
      description: `${HttpStatus.NO_CONTENT}. No content.`,
    }),
};

const getResponse =
  (status: StatusCodes = StatusCodes.NO_CONTENT) =>
  ({
    dto,
    isArray,
    meta,
  }: {
    dto?: string | Function;
    isArray?: boolean;
    meta?: boolean;
  }) => {
    return responses[status]({
      dto,
      isArray,
      meta,
    });
  };

export function ApiDefaultResponse({
  status = StatusCodes.OK,
  type,
  meta,
  isArray,
  summary,
}: DefaultResponseOptions) {
  const decorators = [
    getResponse(status)({
      dto: type,
      isArray,
      meta,
    }),
    ApiBaseResponses(),
    HttpCode(status),
  ];

  if (summary) decorators.push(ApiOperation({ summary }));

  return applyDecorators(...decorators);
}
