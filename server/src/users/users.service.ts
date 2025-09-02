import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ProfileEntity } from './entity/profile.entity';

@Injectable()
export class UsersService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  async findUsers() {
    try {
      return await this.usersRepository.find({
        relations: {
          profile: true,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async findUserById(id: string) {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: {
          profile: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async createUser(createUserDto: CreateUserDto) {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const trimmedName = createUserDto.name.trim();
          const trimmedEmail = createUserDto.email.trim();
          const trimmedPassword = createUserDto.password.trim();
          if (!trimmedName || !trimmedEmail || !trimmedPassword) {
            throw new BadRequestException('Invalid user data');
          }
          const user = transactionalEntityManager.create(UserEntity, {
            name: trimmedName,
            email: trimmedEmail,
            password: String(await bcrypt.hash(createUserDto.password, 10)),
          });
          const profile = transactionalEntityManager.create(ProfileEntity, {
            bio: `Hello I am ${trimmedName}`,
          });
          user.profile = profile;

          await transactionalEntityManager.save(profile);
          return await transactionalEntityManager.save(user);
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async updateUser(id: string, userDto: UserDto) {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const user = await transactionalEntityManager.findOne(UserEntity, {
            where: { id },
          });
          if (!user) {
            throw new NotFoundException('User not found');
          }

          const profile = await transactionalEntityManager.findOne(
            ProfileEntity,
            {
              where: { user: { id } },
            },
          );

          // Update name if provided
          if (userDto.name !== undefined) {
            const trimmedName = userDto.name.trim();
            if (!trimmedName) {
              throw new BadRequestException('Name cannot be empty');
            }
            user.name = trimmedName;

            // Update profile bio if profile exists
            if (profile) {
              profile.bio = `Hello I am ${trimmedName}`;
              await transactionalEntityManager.save(profile);
            }
          }

          // Update email if provided
          if (userDto.email !== undefined) {
            const trimmedEmail = userDto.email.trim();
            if (!trimmedEmail) {
              throw new BadRequestException('Email cannot be empty');
            }
            user.email = trimmedEmail;
          }

          // Update password if provided
          if (userDto.password !== undefined) {
            const trimmedPassword = userDto.password.trim();
            if (!trimmedPassword) {
              throw new BadRequestException('Password cannot be empty');
            }
            user.password = String(await bcrypt.hash(userDto.password, 10));
          }

          return await transactionalEntityManager.save(user);
        },
      );
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async deleteUser(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return await this.usersRepository.softRemove({ id });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async getSoftDeletedUsers() {
    try {
      return await this.usersRepository.find({
        withDeleted: true,
        where: {
          deletedAt: Not(IsNull()),
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async restoreUser(id: string) {
    try {
      return await this.usersRepository.restore(id);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
}
