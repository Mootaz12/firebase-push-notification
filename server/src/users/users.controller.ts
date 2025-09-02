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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserDto],
  })
  async findUsers() {
    return await this.usersService.findUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findUserById(@Param('id') id: string) {
    return await this.usersService.findUserById(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user in the system',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data for creation',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update an existing user by their ID',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UserDto,
    description: 'Updated user data (partial update allowed)',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updateUser(@Param('id') id: string, @Body() userDto: UserDto) {
    return await this.usersService.updateUser(id, userDto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Delete a user by their ID (soft delete)',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('deleted/soft-deleted')
  @ApiOperation({
    summary: 'Get soft deleted users',
    description: 'Retrieve all users that have been soft deleted',
  })
  @ApiResponse({
    status: 200,
    description: 'Soft deleted users retrieved successfully',
    type: [UserDto],
  })
  async getSoftDeletedUsers() {
    return await this.usersService.getSoftDeletedUsers();
  }

  @HttpCode(HttpStatus.OK)
  @Put('deleted/restore/:id')
  @ApiOperation({
    summary: 'Restore soft deleted user',
    description: 'Restore a user that was previously soft deleted',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User restored successfully',
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async restoreUser(@Param('id') id: string) {
    return await this.usersService.restoreUser(id);
  }
}
