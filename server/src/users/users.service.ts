import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {
    this.logger = new Logger(UsersService.name);
  }

  async findUsers() {
    return await this.usersRepository.find();
  }
  async findUserById(id: string) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
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
      const user = this.usersRepository.create(userDto);
      user.password = String(await bcrypt.hash(userDto.password, 10));
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }
  async updateUser(id: string, userDto: UserDto) {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      user.name = userDto.name;
      user.email = userDto.email;
      user.password = String(await bcrypt.hash(userDto.password, 10));
      return await this.usersRepository.save(userDto);
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
