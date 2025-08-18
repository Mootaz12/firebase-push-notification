import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfigType } from 'src/config/db.config';
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configService: ConfigService) => {
      const dbConfig = configService.getOrThrow<DatabaseConfigType>('database');
      const dataSource = new DataSource({
        type: dbConfig.type,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.name,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: dbConfig.synchronize,
      });

      return await dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
