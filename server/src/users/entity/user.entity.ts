import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { BaseEntity } from '../../common/base/base.entity';
import { UserDto } from '../dto/user.dto';
import { UseDto } from '../../common/decorators/use-dto.decorator';
import { ProfileEntity } from './profile.entity';

@UseDto(UserDto)
@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @OneToOne(() => ProfileEntity, (profile) => profile.user)
  @JoinColumn({ name: 'profile_id' })
  profile: ProfileEntity;

  @DeleteDateColumn({ type: 'timestamp', default: null })
  deletedAt: Date;
}
