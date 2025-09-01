import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}
  async findUsers() {
    return await this.usersRepository.find();
  }
  async createUser(userDto: UserDto) {
    try {
      const user = this.usersRepository.create(userDto);
      return await this.usersRepository.save(user);
    } catch (error) {
      console.error(error);
    }
  }
}
