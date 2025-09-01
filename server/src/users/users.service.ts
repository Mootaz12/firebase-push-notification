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
  async createUser(userDto: UserDto) {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const trimmedName = userDto.name.trim();
          const trimmedEmail = userDto.email.trim();
          const trimmedPassword = userDto.password.trim();
          if (!trimmedName || !trimmedEmail || !trimmedPassword) {
            throw new BadRequestException('Invalid user data');
          }
          const user = transactionalEntityManager.create(UserEntity, {
            name: trimmedName,
            email: trimmedEmail,
            password: String(await bcrypt.hash(userDto.password, 10)),
          });
          const profile = transactionalEntityManager.create(ProfileEntity, {
            bio: `Hello I am ${trimmedName}`,
          });
          user.profile = profile;
          user.password = String(await bcrypt.hash(userDto.password, 10));

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
          const trimmedName = userDto.name.trim();
          const trimmedEmail = userDto.email.trim();
          const trimmedPassword = userDto.password.trim();
          const profile = await transactionalEntityManager.findOne(
            ProfileEntity,
            {
              where: { user: { id } },
            },
          );
          if (
            (userDto.name && !trimmedName) ||
            (userDto.email && !trimmedEmail) ||
            (userDto.password && !trimmedPassword)
          ) {
            throw new BadRequestException('Invalid user data');
          }
          if (trimmedName && trimmedName !== user.name) {
            user.name = trimmedName;
          }
          if (trimmedEmail && trimmedEmail !== user.email) {
            user.email = trimmedEmail;
          }
          if (userDto.password.trim() && userDto.password !== user.password) {
            user.password = String(await bcrypt.hash(userDto.password, 10));
          }
          await transactionalEntityManager.save(user);
          if (profile) {
            profile.bio = `Hello I am ${userDto.name.trim()}`;
            await transactionalEntityManager.save(profile);
          }
          return user;
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
