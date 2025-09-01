import { Column, Entity } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { UserDto } from '../dto/user.dto';
import { UseDto } from 'src/common/decorators/use-dto.decorator';

@UseDto(UserDto)
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;
}
