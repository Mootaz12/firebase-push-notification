import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { UsersModule } from './users/users.module';
import HttpConfig from './config/http.config';
import DatabaseConfig, { DatabaseConfigType } from './config/db.config';
import firebaseConfig from './config/firebase.config';
import CorsConfig from './config/cors.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import KeyvRedis from '@keyv/redis';
import redisConfig, { RedisConfigType } from './config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        HttpConfig,
        DatabaseConfig,
        firebaseConfig,
        CorsConfig,
        redisConfig,
      ],
    }),
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.getOrThrow<RedisConfigType>('redis');
        return {
          stores: [
            new KeyvRedis(`redis://${redisConfig.host}:${redisConfig.port}`),
          ],
        };
      },
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
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
    }),

    PushNotificationModule,
    UsersModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
