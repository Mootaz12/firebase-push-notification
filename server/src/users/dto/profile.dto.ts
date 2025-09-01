import { IsNotEmpty, IsString } from 'class-validator';
import { AbstractDto } from 'src/common/dto/abstract.dto';

export class ProfileDto extends AbstractDto {
  @IsString({
    message: 'First name must be a string',
  })
  @IsNotEmpty({
    message: 'First name is required',
  })
  bio: string;
}
