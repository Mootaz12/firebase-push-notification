import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PushNotificationService } from './push-notification.service';
import { SendNotificationDTO } from './dto/send-notification.dto';

@ApiTags('push-notification')
@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Send push notification',
    description:
      'Send a push notification to a specific device using Firebase Cloud Messaging',
  })
  @ApiBody({
    type: SendNotificationDTO,
    description: 'Push notification data',
  })
  @ApiResponse({
    status: 201,
    description: 'Push notification sent successfully',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        messageId: {
          type: 'string',
          example: 'projects/myproject/messages/0:1234567890123456%31bd1c9a',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  sendNotification(@Body() pushNotification: SendNotificationDTO) {
    return this.pushNotificationService.sendNotification(pushNotification);
  }
}
