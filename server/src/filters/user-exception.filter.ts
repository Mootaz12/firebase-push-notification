import { BadRequestException, NotFoundException } from '@nestjs/common';

export class UserNotFoundException extends NotFoundException {
  constructor(message: string = 'User not found') {
    super(message);
  }
}
export class UserAlreadyExistsException extends BadRequestException {
  constructor(message: string = 'User already exists') {
    super(message);
  }
}
export class NameNotValidException extends BadRequestException {
  constructor(message: string = 'Name is not valid') {
    super(message);
  }
}
export class EmailNotValidException extends BadRequestException {
  constructor(message: string = 'Email is not valid') {
    super(message);
  }
}
export class PasswordNotValidException extends BadRequestException {
  constructor(message: string = 'Password is not valid') {
    super(message);
  }
}
