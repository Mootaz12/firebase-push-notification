import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  name: process.env.DB_NAME || 'mydb',
  type: (process.env.DB_TYPE as 'mysql' | 'postgres' | 'sqlite') || 'postgres',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  databaseUrl: `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
}));

export type DatabaseConfigType = {
  host: string;
  port: number;
  username: string;
  password: string;
  name: string;
  databaseUrl: string;
  type: 'mysql' | 'postgres' | 'sqlite';
  synchronize: boolean;
};
