import {
  UseGuards,
  applyDecorators,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { GoogleGuard } from '@modules/auth/guards/google.guard';

export const GoogleOAuth2 = (path?: string, summary?: string) => {
  const decorators = [];

  if (path) {
    decorators.push(Get(path));
  }

  if (summary) {
    decorators.push(ApiOperation({ summary }));
  }
  decorators.push(
    HttpCode(HttpStatus.OK),
    ApiOkResponse({ description: 'Redirect' }),
    UseGuards(GoogleGuard),
  );

  return applyDecorators(...decorators);
};
