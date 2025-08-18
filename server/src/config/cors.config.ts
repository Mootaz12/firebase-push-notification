import { registerAs } from '@nestjs/config';

export default registerAs('cors', () => ({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: process.env.CORS_ORIGIN === 'true',
}));
export type CorsConfigType = {
  origin: string;
  credentials: boolean;
};
