import { UseGuards, applyDecorators, UseFilters, Get } from '@nestjs/common';
import { SocialRedirectGuard } from '@modules/auth/guards/social-redirect.guard';
import { Oauth2ExceptionFilter } from '@filters/oauth2.exception.filter';

export const SocialRedirect = (path: string) => {
  return applyDecorators(
    Get(`${path}-redirect`),
    UseGuards(SocialRedirectGuard),
    UseFilters(new Oauth2ExceptionFilter()),
  );
};
