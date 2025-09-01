import { Column, Entity, OneToOne } from 'typeorm';
import { BaseEntity } from 'src/common/base/base.entity';
import { UseDto } from 'src/common/decorators/use-dto.decorator';
import { ProfileDto } from '../dto/profile.dto';
import { UserEntity } from './user.entity';

@Entity({ name: 'profiles' })
@UseDto(ProfileDto)
export class ProfileEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  bio: string;

  @OneToOne(() => UserEntity, (user) => user.profile)
  user: UserEntity;
}
