import { registerAs } from '@nestjs/config';
import * as process from 'node:process';

export type SocialConfig = {
  readonly google: {
    readonly clientId: string;
    readonly secret: string;
  };
};

export default registerAs(
  'social',
  (): SocialConfig => ({
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID! || '...',
      secret: process.env.GOOGLE_CLIENT_SECRET! || '...',
    },
  }),
);
