import { registerAs } from '@nestjs/config';

export default registerAs('http', () => ({
  port: process.env.PORT,
  host: process.env.HOST,
}));

export type HttpConfigType = {
  port: number;
  host: string;
};
