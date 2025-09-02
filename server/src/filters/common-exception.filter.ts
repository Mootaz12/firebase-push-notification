import { BadRequestException } from '@nestjs/common';

export class DataNotValidException extends BadRequestException {
  constructor(message: string = 'Data is not valid') {
    super(message);
  }
}
