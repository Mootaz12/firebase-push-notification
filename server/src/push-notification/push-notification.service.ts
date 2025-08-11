import { Injectable } from '@nestjs/common';
import { SendNotificationDTO } from './dto/send-notification.dto';
import * as firebase from 'firebase-admin';
@Injectable()
export class PushNotificationService {
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
          console.error(error);
        });
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
