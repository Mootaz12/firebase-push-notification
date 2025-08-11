import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PushNotificationModule } from './push-notification/push-notification.module';
import HttpConfig from './config/http.config';
import DatabaseConfig from './config/db.config';
import firebaseConfig from './config/firebase.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [HttpConfig, DatabaseConfig, firebaseConfig],
    }),
    PushNotificationModule,
  ],
})
export class AppModule {}
