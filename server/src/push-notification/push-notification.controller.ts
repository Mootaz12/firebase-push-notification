import { Body, Controller, Post } from '@nestjs/common';
import { PushNotificationService } from './push-notification.service';
import { SendNotificationDTO } from './dto/send-notification.dto';

@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}
  @Post()
  sendNotification(@Body() pushNotification: SendNotificationDTO) {
    return this.pushNotificationService.sendNotification(pushNotification);
  }
}
