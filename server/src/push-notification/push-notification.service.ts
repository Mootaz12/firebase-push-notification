import { Injectable, Logger } from '@nestjs/common';
import { SendNotificationDTO } from './dto/send-notification.dto';
import * as firebase from 'firebase-admin';
@Injectable()
export class PushNotificationService {
  constructor() {}
  private readonly logger = new Logger(PushNotificationService.name);
  async sendNotification(sendNotificationDTO: SendNotificationDTO) {
    try {
      await firebase
        .messaging()
        .send({
          notification: {
            title: sendNotificationDTO.title,
            body: sendNotificationDTO.body,
          },
          token: sendNotificationDTO.deviceId,
          data: {},
          android: {
            priority: 'high',
            notification: {
              sound: 'default',
              channelId: 'default',
            },
          },
          apns: {
            headers: {
              'apns-priority': '10',
            },
            payload: {
              aps: {
                contentAvailable: true,
                sound: 'default',
              },
            },
          },
        })
        .catch((error: any) => {
          this.logger.error(error);
        });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
