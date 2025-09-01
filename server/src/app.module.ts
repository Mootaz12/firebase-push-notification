import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { DatabaseModule } from './database/database.module';
import HttpConfig from './config/http.config';
import DatabaseConfig from './config/db.config';
import firebaseConfig from './config/firebase.config';
import CorsConfig from './config/cors.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [HttpConfig, DatabaseConfig, firebaseConfig, CorsConfig],
    }),
    PushNotificationModule,
    DatabaseModule,
  ],
})
export class AppModule {}
