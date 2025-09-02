import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDTO {
  @ApiProperty({
    description: 'Title of the push notification',
    example: 'New Message',
    type: String,
  })
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @ApiProperty({
    description: 'Body content of the push notification',
    example: 'You have received a new message',
    type: String,
  })
  @IsString({ message: 'Body must be a string' })
  @IsNotEmpty({ message: 'Body is required' })
  body: string;

  @ApiProperty({
    description: 'Device token for the target device',
    example: 'dGVzdF9kZXZpY2VfaWRfMTIz',
    type: String,
  })
  @IsString({ message: 'Device ID must be a string' })
  @IsNotEmpty({ message: 'Device ID is required' })
  deviceId: string;
}
