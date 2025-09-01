import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async findUsers() {
    return await this.usersService.findUsers();
  }
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() userDto: UserDto) {
    return await this.usersService.createUser(userDto);
  }
}
