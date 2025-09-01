import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
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
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() userDto: UserDto) {
    return await this.usersService.createUser(userDto);
  }
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    return await this.usersService.updateUser(id, userDto);
  }
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }
}
