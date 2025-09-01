import { IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from 'src/common/dto/abstract.dto';
import { BaseEntity } from 'src/common/base/base.entity';
import { UserEntity } from '../entity/user.entity';

export class UserDto extends AbstractDto {
  @IsString({
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name is required',
  })
  name: string;

  @IsString({
    message: 'Email must be a string',
  })
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

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
