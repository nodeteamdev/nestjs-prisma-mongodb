import { registerAs } from '@nestjs/config';

export default registerAs('swagger', () => ({
  password: process.env.SWAGGER_PASSWORD || 'admin',
}));
