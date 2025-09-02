import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractDto } from '../../common/dto/abstract.dto';
import { BaseEntity } from 'src/common/base/base.entity';
import { UserEntity } from '../entity/user.entity';

export class UserDto extends AbstractDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
    type: String,
  })
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
    type: String,
  })
  @IsString({
    message: 'Email must be a string',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'strongPassword123',
    type: String,
  })
  @IsString({
    message: 'Password must be a string',
  })
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;

  constructor(entity: BaseEntity<AbstractDto, never>) {
    super(entity);
    const user = entity as UserEntity;
    if (user) {
      this.name = user.name;
      this.email = user.email;
      this.password = user.password;
    }
  }
}
