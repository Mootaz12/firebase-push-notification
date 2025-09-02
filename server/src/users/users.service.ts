import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileEntity } from './entity/profile.entity';
import { hashPassword } from 'src/utils/helpers';
import {
  EmailNotValidException,
  NameNotValidException,
  PasswordNotValidException,
  UserNotFoundException,
} from 'src/filters/user-exception.filter';
import { DataNotValidException } from 'src/filters/common-exception.filter';

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
        throw new UserNotFoundException();
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
            throw new DataNotValidException();
          }
          const user = transactionalEntityManager.create(UserEntity, {
            name: trimmedName,
            email: trimmedEmail,
            password: await hashPassword(createUserDto.password),
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
            throw new UserNotFoundException();
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
              throw new NameNotValidException();
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
              throw new EmailNotValidException();
            }
            user.email = trimmedEmail;
          }

          // Update password if provided
          if (userDto.password !== undefined) {
            const trimmedPassword = userDto.password.trim();
            if (!trimmedPassword) {
              throw new PasswordNotValidException();
            }
            user.password = await hashPassword(userDto.password);
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
        throw new UserNotFoundException();
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
