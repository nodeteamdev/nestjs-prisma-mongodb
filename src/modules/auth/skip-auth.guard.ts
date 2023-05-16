import { SetMetadata } from '@nestjs/common';

export const IS_SKIP_AUTH_KEY = 'skip-auth';
export const SkipAuth = () => SetMetadata(IS_SKIP_AUTH_KEY, true);
