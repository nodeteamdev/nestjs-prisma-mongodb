import { registerAs } from '@nestjs/config';

export default registerAs('s3', () => ({
  accessKeyId: process.env.S3_ACCESS_KEY_ID || 'ZCowxpgVG9tGauVK',
  secretAccessKey:
    process.env.S3_SECRET_ACCESS_KEY || 'OXe3nP2dSFLCj7PlYVrTRRVRarjZv2SM',
  endpoint: process.env.S3_ENDPOINT || 'https://s3.onix-systems.com',
  region: process.env.S3_REGION || 'us-east-1',
  bucket: {
    avatar: process.env.S3_AVATAR_BUCKET,
  },
}));
