import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '../base/base.entity';

export class AbstractDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-12-01T10:30:00.000Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-12-01T15:45:00.000Z',
    type: Date,
  })
  updatedAt: Date;

  constructor(entity: BaseEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      if (!entity) {
        return;
      }
      this.id = entity.id;
      this.createdAt = entity.createdAt;
      this.updatedAt = entity.updatedAt;
    }
  }
}
