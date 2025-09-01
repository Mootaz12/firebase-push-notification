import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { UsersModule } from './users/users.module';
import HttpConfig from './config/http.config';
import DatabaseConfig, { DatabaseConfigType } from './config/db.config';
import firebaseConfig from './config/firebase.config';
import CorsConfig from './config/cors.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [HttpConfig, DatabaseConfig, firebaseConfig, CorsConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig =
          configService.getOrThrow<DatabaseConfigType>('database');
        return {
          type: dbConfig.type,
          host: dbConfig.host,
          port: dbConfig.port,
          username: dbConfig.username,
          password: dbConfig.password,
          database: dbConfig.name,
          synchronize: dbConfig.synchronize,
          autoLoadEntities: true,
        };
      },
      inject: [ConfigService],
    }),
    PushNotificationModule,
    UsersModule,
  ],
})
export class AppModule {}
